
import { db } from './db';
import { Matter, Client, Hearing } from '../types';

class MatterService {
  getClients() { return db.getClients(); }
  getMatters() { return db.getMatters(); }
  
  createClient(data: Partial<Client>): Client {
    // Fixed: Removed createdAt and updatedAt from the literal because they aren't in the Client interface.
    const client: Client = {
      id: `cl_${Math.random().toString(36).substr(2, 9)}`,
      firmId: db.getFirmId(),
      name: data.name || 'Unnamed Client',
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      gstin: data.gstin,
      type: data.type || 'Individual'
    };
    db.saveClient(client);
    return client;
  }

  createMatter(data: Partial<Matter>): Matter {
    const matter: Matter = {
      id: `mt_${Math.random().toString(36).substr(2, 9)}`,
      firmId: db.getFirmId(),
      clientId: data.clientId || 'default',
      title: data.title || 'Untitled Matter',
      court: data.court || 'High Court of Delhi',
      caseNumber: data.caseNumber,
      status: 'Pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastAccessedAt: Date.now(),
      tags: data.tags || ['Active']
    };
    db.saveMatter(matter);
    return matter;
  }

  addHearing(data: Partial<Hearing>): Hearing {
    const hearing: Hearing = {
      id: `hr_${Math.random().toString(36).substr(2, 9)}`,
      firmId: db.getFirmId(),
      matterId: data.matterId || 'default',
      date: data.date || Date.now(),
      purpose: data.purpose || 'Mentioning',
      bench: data.bench,
      itemNumber: data.itemNumber,
      courtRoom: data.courtRoom
    };
    db.saveHearing(hearing);
    
    // Update matter index
    const matter = db.matters.get(hearing.matterId);
    if (matter && (!matter.nextHearingDate || hearing.date < matter.nextHearingDate)) {
      matter.nextHearingDate = hearing.date;
      db.saveMatter(matter);
    }
    
    return hearing;
  }

  seedFirmData() {
    const clients = db.getClients();
    if (clients.length === 0) {
      const c1 = this.createClient({ name: 'Rahul Malhotra', contactEmail: 'rahul@malhotra.in', type: 'Individual' });
      const c2 = this.createClient({ name: 'Sterling Tech Pvt Ltd', contactEmail: 'legal@sterling.com', type: 'Corporate' });
      
      const m1 = this.createMatter({ clientId: c1.id, title: 'Malhotra vs. Union of India', court: 'High Court of Delhi', caseNumber: 'W.P. (C) 1024/2024' });
      const m2 = this.createMatter({ clientId: c2.id, title: 'Sterling vs. Vendor X - Recovery', court: 'High Court of Bombay', caseNumber: 'COM.L. 505/2023' });
      
      this.addHearing({ matterId: m1.id, date: Date.now() + 86400000 * 3, purpose: 'Admission Arguments', bench: 'Division Bench - III' });
      this.addHearing({ matterId: m2.id, date: Date.now() + 86400000 * 7, purpose: 'Final Disposal', bench: 'Single Bench - I' });
    }
  }

  updateLastAccessed(id: string) {
    const matter = db.matters.get(id);
    if (matter) {
      matter.lastAccessedAt = Date.now();
      db.saveMatter(matter);
    }
  }
}

export const matterService = new MatterService();
