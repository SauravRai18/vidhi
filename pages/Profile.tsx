
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';
import { ICONS } from '../constants';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser(session);
      setFormData(session);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const updated = await authService.updateProfile(formData);
      setUser(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <h2 className="text-4xl font-bold text-slate-900 legal-serif">Identity & Practice</h2>
        <p className="text-slate-500 font-medium">Manage your professional identity and organizational affiliation.</p>
      </header>

      {message && (
        <div className={`p-5 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="h-48 w-48 rounded-[3rem] bg-slate-100 overflow-hidden shadow-inner border-4 border-white">
               {formData.avatar ? (
                 <img src={formData.avatar} className="h-full w-full object-cover" alt="Profile" />
               ) : (
                 <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold">
                    {user.name.charAt(0)}
                 </div>
               )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
               <span className="text-xs font-bold uppercase tracking-widest">Update Photo</span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{user.role} • {user.tier}</p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                 <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-bold"
                 />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Email</label>
                 <input 
                    type="email" 
                    disabled
                    value={formData.email || ''} 
                    className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl outline-none text-slate-400 font-bold cursor-not-allowed"
                 />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Phone</label>
                 <input 
                    type="tel" 
                    value={formData.phone || ''} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91-0000000000"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
                 />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Practice Area</label>
                 <select 
                    value={formData.practiceArea || ''} 
                    onChange={e => setFormData({ ...formData, practiceArea: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
                 >
                    <option value="">Select Primary Practice</option>
                    <option value="Litigation">Litigation</option>
                    <option value="Corporate">Corporate / M&A</option>
                    <option value="Criminal">Criminal Law</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                    <option value="Taxation">Taxation</option>
                 </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role === 'Student' ? 'College / University' : 'Firm / Chamber Name'}</label>
                 <input 
                    type="text" 
                    value={user.role === 'Student' ? formData.collegeName : formData.firmName || ''} 
                    onChange={e => user.role === 'Student' ? setFormData({ ...formData, collegeName: e.target.value }) : setFormData({ ...formData, firmName: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
                 />
              </div>
           </div>

           <div className="pt-6 border-t border-slate-100">
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50"
              >
                 {isSaving ? "Synchronizing..." : "Save Identity Updates"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
