
import { User, Firm } from '../types';
import { db } from './db';

class AuthService {
  async signup(email: string, name: string, firmName: string, role: string): Promise<User> {
    const firmId = `firm_${Math.random().toString(36).substr(2, 9)}`;
    const userId = `usr_${Math.random().toString(36).substr(2, 9)}`;

    const newFirm: Firm = {
      id: firmId,
      name: firmName,
      plan: role === 'Student' ? 'BASIC' : 'PRO',
      ownerId: userId,
      createdAt: Date.now(),
      credits: role === 'Student' ? 50 : 500
    };

    const newUser: User = {
      id: userId,
      name,
      email,
      firmId,
      firmName,
      role: role as any,
      tier: newFirm.plan,
      isSetupComplete: false,
      lastLogin: Date.now(),
      usage: {
        researchCredits: role === 'Student' ? 50 : 500,
        draftsCreated: 0,
        maxResearchCredits: role === 'Student' ? 50 : 500
      }
    };

    // Commit to persistent store
    const users = db.platform.getAllUsers();
    users.push(newUser);
    localStorage.setItem('v_os_prod_users', JSON.stringify(users));
    
    db.firms.save(newFirm);
    db.log(firmId, userId, "USER_SIGNUP", { email, role });

    this.setSession(newUser);
    return newUser;
  }

  async login(email: string): Promise<User | null> {
    const user = db.platform.getAllUsers().find(u => u.email === email);
    if (!user) return null;

    user.lastLogin = Date.now();
    this.setSession(user);
    db.log(user.firmId, user.id, "USER_LOGIN");
    return user;
  }

  // Update user profile in storage and active session
  async updateProfile(data: Partial<User>): Promise<User> {
    const session = this.getSession();
    if (!session) throw new Error("No active session");
    
    const updatedUser = { ...session, ...data };
    
    // Update in users table
    const users = db.platform.getAllUsers();
    const idx = users.findIndex(u => u.id === session.id);
    if (idx >= 0) {
      users[idx] = updatedUser;
      localStorage.setItem('v_os_prod_users', JSON.stringify(users));
    }
    
    this.setSession(updatedUser);
    return updatedUser;
  }

  private setSession(user: User) {
    localStorage.setItem('v_os_session', JSON.stringify(user));
  }

  getSession(): User | null {
    const s = localStorage.getItem('v_os_session');
    return s ? JSON.parse(s) : null;
  }

  logout() {
    localStorage.removeItem('v_os_session');
  }
}

export const authService = new AuthService();
