
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  SUMMARIZE = 'SUMMARIZE',
  DRAFT = 'DRAFT',
  ADMIN = 'ADMIN',
  FOUNDER_ADMIN = 'FOUNDER_ADMIN',
  SETTINGS = 'SETTINGS',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  MATTERS = 'MATTERS',
  HEARINGS = 'HEARINGS',
  STRATEGY = 'STRATEGY',
  COMPLIANCE = 'COMPLIANCE',
  PROFILE = 'PROFILE',
  PRIVACY = 'PRIVACY',
  LEGAL_TERMS = 'LEGAL_TERMS',
  HELP = 'HELP',
  BILLING = 'BILLING',
  STUDENT_DASHBOARD = 'STUDENT_DASHBOARD',
  LEARNING_HUB = 'LEARNING_HUB',
  MOOT_TOOLKIT = 'MOOT_TOOLKIT',
  RESEARCH = 'RESEARCH',
  // New Ecosystem Views
  CITIZEN_HUB = 'CITIZEN_HUB',
  STARTUP_LAB = 'STARTUP_LAB',
  JUNIOR_WORKSPACE = 'JUNIOR_WORKSPACE',
  PERSONA_SELECTOR = 'PERSONA_SELECTOR',
  CONTRACT_REVIEW = 'CONTRACT_REVIEW'
}

export type SubscriptionTier = 'FREE' | 'STUDENT' | 'SOLO' | 'PRO' | 'ENTERPRISE' | 'FOUNDER' | 'BASIC';
export type UserRole = 
  | 'Citizen' 
  | 'Student' 
  | 'Junior_Advocate' 
  | 'Senior_Advocate' 
  | 'Startup_Founder' 
  | 'In_House_Counsel' 
  | 'Admin' 
  | 'Founder'
  | 'Advocate';

export interface User {
  id: string;
  name: string;
  email: string;
  firmId: string;
  firmName?: string;
  role: UserRole;
  tier: SubscriptionTier;
  avatar?: string;
  lastLogin?: number;
  phone?: string;
  practiceArea?: string;
  collegeName?: string;
  usage: {
    researchCredits: number;
    draftsCreated: number;
    maxResearchCredits: number;
  };
}

export interface Firm {
  id: string;
  name: string;
  plan: SubscriptionTier;
  ownerId: string;
  createdAt: number;
  credits: number;
}

export interface Client {
  id: string;
  firmId: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  gstin?: string;
  type: string;
  createdAt: number;
  updatedAt: number;
}

export interface Matter {
  id: string;
  firmId: string;
  clientId: string;
  title: string;
  caseNumber?: string;
  court: string;
  status: 'Pending' | 'Disposed' | 'Stayed' | 'Appeal' | 'Registry_Objection';
  createdAt: number;
  updatedAt: number;
  lastAccessedAt: number;
  tags: string[];
  nextHearingDate?: number;
}

export interface LegalDocument {
  id: string;
  firmId: string;
  matterId?: string;
  title: string;
  content: string;
  type: 'Pleading' | 'Judgment' | 'Research' | 'Statute' | 'Evidence';
  status: 'Processing' | 'Indexed' | 'Error';
  createdAt: number;
  metadata: {
    tags: string[];
    author?: string;
    court?: string;
    sectionsCited?: string[];
  };
}

export interface Draft {
  id: string;
  firmId: string;
  matterId: string;
  title: string;
  type: string;
  content: string;
  version: number;
  createdAt: number;
  updatedAt: number;
  versions?: { version: number; content: string; createdAt: number }[];
}

export interface JudgmentSummary {
  caseTitle: string;
  facts: string;
  issues: string[];
  argumentsPetitioner: string;
  argumentsRespondent: string;
  judgment: string;
  ratioDecidendi: string;
  sectionsCited: string[];
  landmarkStatus?: boolean;
}

export interface ChatMessage {
  id: string;
  firmId: string;
  matterId: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  confidenceScore?: number;
  legalBasisSummary?: string;
}

export interface Hearing {
  id: string;
  firmId: string;
  matterId: string;
  date: number;
  purpose: string;
  bench?: string;
  itemNumber?: string;
  courtRoom?: string;
}

export interface ComplianceItem {
  id: string;
  firmId: string;
  title: string;
  type: 'Limitation' | 'Statutory' | 'Registry' | 'Professional';
  dueDate: number;
  status: 'Critical' | 'Pending' | 'Completed';
  description: string;
}

export interface AuditLog {
  id: string;
  firmId: string;
  userId: string;
  action: string;
  timestamp: number;
  metadata?: any;
  ipAddress: string;
}

export interface LearningPath {
  id: string;
  subject: string;
  progress: number;
  totalModules: number;
  lastTopic: string;
}
