
import { Firm, User, Matter, Client, Draft, LegalDocument, AuditLog, ChatMessage, ComplianceItem, Hearing } from '../types';

class RelationalDB {
  private prefix = 'v_os_prod_';

  private read<T>(table: string): T[] {
    const data = localStorage.getItem(this.prefix + table);
    return data ? JSON.parse(data) : [];
  }

  private write<T>(table: string, data: T[]) {
    localStorage.setItem(this.prefix + table, JSON.stringify(data));
  }

  getFirmId(): string {
    const s = localStorage.getItem('v_os_session');
    if (s) {
      try { 
        return JSON.parse(s).firmId || 'firm_0'; 
      } catch (e) { 
        return 'firm_0'; 
      }
    }
    return 'firm_0';
  }

  getUserId(): string {
    const s = localStorage.getItem('v_os_session');
    if (s) {
      try { 
        return JSON.parse(s).id || 'unknown'; 
      } catch (e) { 
        return 'unknown'; 
      }
    }
    return 'unknown';
  }

  // Scoped Data Access
  get matters() { return this.scoped<Matter>('matters', this.getFirmId()); }
  get clients() { return this.scoped<Client>('clients', this.getFirmId()); }
  get documents() { return this.scoped<LegalDocument>('documents', this.getFirmId()); }
  get drafts() { return this.scoped<Draft>('drafts', this.getFirmId()); }
  get hearings() { return this.scoped<Hearing>('hearings', this.getFirmId()); }
  get compliance_items() { return this.scoped<ComplianceItem>('compliance_items', this.getFirmId()); }

  getMatters() { return this.matters.all(); }
  saveMatter(m: Matter) { 
    this.matters.save(m); 
    this.log(m.firmId, this.getUserId(), "SAVE_MATTER", { id: m.id, title: m.title });
  }
  
  getClients() { return this.clients.all(); }
  saveClient(c: Client) { this.clients.save(c); }

  getHearings(matterId?: string) { 
    const hs = this.hearings.all();
    return matterId ? hs.filter(h => h.matterId === matterId) : hs;
  }
  saveHearing(h: Hearing) { this.hearings.save(h); }

  getDrafts(matterId?: string) { 
    const ds = this.drafts.all();
    return matterId ? ds.filter(d => d.matterId === matterId) : ds;
  }

  getUnlinkedDrafts(): Draft[] {
    return this.drafts.all().filter(d => !d.matterId || d.matterId === 'default');
  }

  getUnlinkedDocuments(): LegalDocument[] {
    return this.documents.all().filter(d => !d.matterId);
  }

  saveDraft(d: Draft) { 
    this.drafts.save(d); 
    this.log(d.firmId, this.getUserId(), "SAVE_DRAFT", { id: d.id, version: d.version });
  }

  getComplianceItems() { return this.compliance_items.all(); }
  saveComplianceItem(i: ComplianceItem) { this.compliance_items.save(i); }

  // CHAT PERSISTENCE
  getChatHistory(matterId: string): ChatMessage[] {
    const all = this.read<ChatMessage>('chat_history');
    return all.filter(m => m.matterId === matterId && m.firmId === this.getFirmId());
  }

  saveChatHistory(matterId: string, messages: ChatMessage[]) {
    const firmId = this.getFirmId();
    const currentAll = this.read<ChatMessage>('chat_history');
    const filtered = currentAll.filter(m => !(m.matterId === matterId && m.firmId === firmId));
    this.write('chat_history', [...filtered, ...messages]);
  }

  // PLATFORM ADMINISTRATION
  platform = {
    getAllFirms: () => this.read<Firm>('firms'),
    getAllUsers: () => this.read<User>('users'),
    getAuditLogs: (firmId?: string) => {
      const logs = this.read<AuditLog>('audit_logs');
      return firmId ? logs.filter(l => l.firmId === firmId) : logs;
    }
  };

  firms = {
    get: (id: string) => this.read<Firm>('firms').find(f => f.id === id),
    save: (firm: Firm) => {
      const all = this.read<Firm>('firms');
      const idx = all.findIndex(f => f.id === firm.id);
      if (idx >= 0) all[idx] = firm; else all.push(firm);
      this.write('firms', all);
    }
  };

  // GENERIC SCOPED ENGINE
  scoped<T extends { firmId: string; id: string }>(table: string, firmId: string) {
    return {
      all: () => this.read<T>(table).filter(i => i.firmId === firmId),
      get: (id: string) => this.read<T>(table).find(i => i.id === id && i.firmId === firmId),
      save: (item: T) => {
        const all = this.read<T>(table);
        const idx = all.findIndex(i => i.id === item.id);
        item.firmId = firmId;
        if (idx >= 0) all[idx] = { ...all[idx], ...item }; else all.push(item);
        this.write(table, all);
      },
      delete: (id: string) => {
        const all = this.read<T>(table);
        const filtered = all.filter(i => !(i.id === id && i.firmId === firmId));
        this.write(table, filtered);
      }
    };
  }

  log(firmId: string, userId: string, action: string, metadata?: any) {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      firmId,
      userId,
      action,
      timestamp: Date.now(),
      metadata,
      ipAddress: '127.0.0.1'
    };
    const all = this.read<AuditLog>('audit_logs');
    all.unshift(log);
    this.write('audit_logs', all.slice(0, 5000));
  }
}

export const db = new RelationalDB();
