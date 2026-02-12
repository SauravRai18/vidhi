
export enum AppView {
  // General & Auth
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

  // Core Intelligence Modules (Shared but behavior varies)
  DOC_INTELLIGENCE = 'DOC_INTELLIGENCE',
  DRAFTING_STUDIO = 'DRAFTING_STUDIO',
  RESEARCH_HUB = 'RESEARCH_HUB',

  // PUBLIC / INDIVIDUAL Workspace
  PUBLIC_HOME = 'PUBLIC_HOME',
  PUBLIC_CASE_TRACKER = 'PUBLIC_CASE_TRACKER',
  PUBLIC_DOCS = 'PUBLIC_DOCS',

  // LAW STUDENT Workspace
  STUDENT_HOME = 'STUDENT_HOME',
  STUDENT_BARE_ACTS = 'STUDENT_BARE_ACTS',
  STUDENT_MOOT = 'STUDENT_MOOT',
  STUDENT_BRIEFS = 'STUDENT_BRIEFS',

  // JUNIOR ADVOCATE Workspace
  JUNIOR_HOME = 'JUNIOR_HOME',
  JUNIOR_PROCEDURES = 'JUNIOR_PROCEDURES',
  JUNIOR_FILING = 'JUNIOR_FILING',
  JUNIOR_HEARING_PREP = 'JUNIOR_HEARING_PREP',

  // SENIOR ADVOCATE / LAW FIRM Workspace
  SENIOR_HOME = 'SENIOR_HOME',
  SENIOR_STRATEGY = 'SENIOR_STRATEGY',
  SENIOR_TEAM = 'SENIOR_TEAM',
  SENIOR_INSIGHTS = 'SENIOR_INSIGHTS',

  // MSME / STARTUP Workspace
  STARTUP_HOME = 'STARTUP_HOME',
  STARTUP_COMPLIANCE = 'STARTUP_COMPLIANCE',
  STARTUP_CONTRACT_AI = 'STARTUP_CONTRACT_AI',

  // IN-HOUSE LEGAL Workspace
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

export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'FOUNDER';

export type PracticeArea = 'Criminal' | 'Civil' | 'Corporate' | 'Family' | 'Taxation' | 'GST' | 'Labour' | 'Intellectual Property';
export type CourtLevel = 'District' | 'High_Court' | 'Supreme_Court' | 'Tribunal';

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
  avatar?: string;
  phone?: string;
  collegeName?: string;
  lastLogin?: number;
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
  clientId?: string;
  title: string;
  caseNumber?: string;
  court: string;
  status: 'Pending' | 'Active' | 'Disposed';
  updatedAt: number;
  createdAt: number;
  lastAccessedAt: number;
  nextHearingDate?: number;
  tags: string[];
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
  content: string;
  type?: string;
  version: number;
  updatedAt: number;
  createdAt?: number;
  versions?: { version: number; content: string; createdAt: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  firmId: string;
  matterId: string;
  confidenceScore?: number;
  legalBasisSummary?: string;
}

export interface AuditLog {
  id: string;
  firmId: string;
  userId: string;
  action: string;
  timestamp: number;
  metadata?: any;
  ipAddress?: string;
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

export interface LearningPath {
  id: string;
  subject: string;
  progress: number;
  totalModules: number;
  lastTopic: string;
}
