
export enum AppView {
  // General
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  PERSONA_SELECTOR = 'PERSONA_SELECTOR',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  BILLING = 'BILLING',
  LEGAL_TERMS = 'LEGAL_TERMS',
  PRIVACY = 'PRIVACY',
  ADMIN = 'ADMIN',
  FOUNDER_ADMIN = 'FOUNDER_ADMIN',

  // Shared Core Tools
  DOC_INTELLIGENCE = 'DOC_INTELLIGENCE',
  RESEARCH_HUB = 'RESEARCH_HUB',
  DRAFTING_STUDIO = 'DRAFTING_STUDIO',
  LEARNING_HUB = 'LEARNING_HUB',
  SUMMARIZE = 'SUMMARIZE',
  MOOT_TOOLKIT = 'MOOT_TOOLKIT',
  CHAT = 'CHAT',

  // Role-Specific Views (Surfaced via Sidebar)
  PUBLIC_HOME = 'PUBLIC_HOME',
  PUBLIC_HELP = 'PUBLIC_HELP',
  PUBLIC_DOCS = 'PUBLIC_DOCS',
  
  STUDENT_HOME = 'STUDENT_HOME',
  STUDENT_BRIEFS = 'STUDENT_BRIEFS',
  STUDENT_BARE_ACTS = 'STUDENT_BARE_ACTS',
  STUDENT_MOOT = 'STUDENT_MOOT',

  JUNIOR_HOME = 'JUNIOR_HOME',
  JUNIOR_PROCEDURES = 'JUNIOR_PROCEDURES',
  JUNIOR_FILING = 'JUNIOR_FILING',

  SENIOR_HOME = 'SENIOR_HOME',
  SENIOR_STRATEGY = 'SENIOR_STRATEGY',
  SENIOR_INSIGHTS = 'SENIOR_INSIGHTS',

  STARTUP_HOME = 'STARTUP_HOME',
  STARTUP_COMPLIANCE = 'STARTUP_COMPLIANCE',
  STARTUP_CONTRACTS = 'STARTUP_CONTRACTS',

  INHOUSE_HOME = 'INHOUSE_HOME',
  INHOUSE_MATTERS = 'INHOUSE_MATTERS',
  INHOUSE_EXPOSURE = 'INHOUSE_EXPOSURE'
}

export type UserRole = 
  | 'Citizen' 
  | 'Student' 
  | 'Junior_Advocate' 
  | 'Senior_Advocate' 
  | 'Startup_Founder' 
  | 'In_House_Counsel' 
  | 'Admin' 
  | 'Founder';

export type PracticeArea = 'Criminal' | 'Civil' | 'Corporate' | 'Family' | 'Taxation' | 'GST' | 'Labour' | 'Intellectual Property';
export type CourtLevel = 'District' | 'High_Court' | 'Supreme_Court' | 'Tribunal';

export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'FOUNDER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: SubscriptionTier;
  firmId: string;
  firmName?: string;
  city?: string;
  practiceArea?: string;
  courtLevel?: string;
  isSetupComplete: boolean;
  usage: {
    researchCredits: number;
    draftsCreated: number;
    maxResearchCredits: number;
  };
  lastLogin?: number;
  collegeName?: string;
  avatar?: string;
  phone?: string;
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
  clientId?: string;
  title: string;
  caseNumber?: string;
  court: string;
  status: 'Pending' | 'Active' | 'Disposed';
  updatedAt: number;
  createdAt: number;
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
  type: string;
  status: 'Indexed' | 'Processing' | 'Error';
  createdAt: number;
  metadata: any;
}

export interface Draft {
  id: string;
  firmId: string;
  matterId?: string;
  title: string;
  type?: string;
  content: string;
  version: number;
  versions?: { version: number; content: string; createdAt: number }[];
  createdAt: number;
  updatedAt: number;
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

export interface AuditLog {
  id: string;
  firmId: string;
  userId: string;
  action: string;
  timestamp: number;
  metadata?: any;
  ipAddress: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  firmId: string;
  matterId: string;
  content: string;
  timestamp: number;
  confidenceScore?: number;
  legalBasisSummary?: string;
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

export interface LearningPath {
  id: string;
  subject: string;
  progress: number;
  totalModules: number;
  lastTopic: string;
}

export interface Firm {
  id: string;
  name: string;
  plan: SubscriptionTier;
  ownerId: string;
  createdAt: number;
  credits: number;
}

export interface JudgmentSummary {
  caseTitle: string;
  facts: string;
  issues: string[];
  ratioDecidendi: string;
  judgment: string;
  argumentsPetitioner: string;
  argumentsRespondent: string;
  sectionsCited: string[];
}
