
import { db } from './db';
import { User, AppView, Matter, Hearing, ComplianceItem, LegalDocument, Draft } from '../types';

class ProductionAPI {
  private getSession(): User | null {
    const s = localStorage.getItem('v_os_session');
    return s ? JSON.parse(s) : null;
  }

  private authorize() {
    const session = this.getSession();
    if (!session) throw new Error("401 Unauthorized");
    return session;
  }

  async getDashboardStats() {
    const { firmId, usage } = this.authorize();
    
    const matters = db.scoped<Matter>('matters', firmId).all();
    const drafts = db.scoped<any>('drafts', firmId).all();
    const hearings = db.scoped<Hearing>('hearings', firmId).all();
    const compliance = db.scoped<ComplianceItem>('compliance_items', firmId).all();
    const auditLogs = db.platform.getAuditLogs(firmId);
    const firm = db.firms.get(firmId);

    return {
      activeMattersCount: matters.length,
      totalFirms: db.platform.getAllFirms().length,
      draftsCount: drafts.length,
      remainingCredits: firm?.credits || 0,
      maxCredits: usage.maxResearchCredits,
      allMatters: matters,
      upcomingHearings: hearings.filter(h => h.date >= Date.now()),
      criticalCompliance: compliance.filter(c => c.status === 'Critical'),
      recentActivity: auditLogs.slice(0, 10),
    };
  }

  // Fix: Add matters property for linking logic
  matters = {
    linkDocument: async (matterId: string, documentId: string) => {
      const { firmId } = this.authorize();
      const docs = db.scoped<LegalDocument>('documents', firmId);
      const doc = docs.get(documentId);
      if (doc) {
        doc.matterId = matterId;
        docs.save(doc);
      }
    },
    linkDraft: async (matterId: string, draftId: string) => {
       const { firmId } = this.authorize();
       const drafts = db.scoped<Draft>('drafts', firmId);
       const draft = drafts.get(draftId);
       if (draft) {
         draft.matterId = matterId;
         db.saveDraft(draft);
       }
    }
  };

  // Fix: Add founder property for platform monitoring
  founder = {
    getPlatformStats: async () => {
      this.authorize();
      return {
        totalFirms: db.platform.getAllFirms().length,
        totalUsers: db.platform.getAllUsers().length,
        activeSessions: 42,
        recentLogs: db.platform.getAuditLogs().slice(0, 50)
      };
    }
  };
}

export const api = new ProductionAPI();
