
export enum AppView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  PERSONA_SELECTOR = 'PERSONA_SELECTOR',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  BILLING = 'BILLING',
  LEGAL_TERMS = 'LEGAL_TERMS',
  PRIVACY = 'PRIVACY',
  ADMIN = 'ADMIN',

  // Core Intelligence Modules
  DOC_INTELLIGENCE = 'DOC_INTELLIGENCE',
  DRAFTING_STUDIO = 'DRAFTING_STUDIO',
  RESEARCH_HUB = 'RESEARCH_HUB',
  STRATEGY_LAB = 'STRATEGY_LAB',
  COMPLIANCE_HUB = 'COMPLIANCE_HUB',
  MATTER_REGISTRY = 'MATTER_REGISTRY',
  CONTRACT_AUDIT = 'CONTRACT_AUDIT',
  STUDENT_HUB = 'STUDENT_HUB',

  // Workspace Specifics
  PUBLIC_HOME = 'PUBLIC_HOME',
  STUDENT_HOME = 'STUDENT_HOME',
  JUNIOR_HOME = 'JUNIOR_HOME',
  SENIOR_HOME = 'SENIOR_HOME',
  STARTUP_HOME = 'STARTUP_HOME',
  INHOUSE_HOME = 'INHOUSE_HOME',

  // Role-specific navigation views
  STUDENT_BARE_ACTS = 'STUDENT_BARE_ACTS',
  STUDENT_MOOT = 'STUDENT_MOOT',
  STUDENT_BRIEFS = 'STUDENT_BRIEFS',
  INHOUSE_MATTERS = 'INHOUSE_MATTERS',
  INHOUSE_EXPOSURE = 'INHOUSE_EXPOSURE',
  JUNIOR_PROCEDURES = 'JUNIOR_PROCEDURES',
  JUNIOR_FILING = 'JUNIOR_FILING',
  JUNIOR_HEARING_PREP = 'JUNIOR_HEARING_PREP',
  PUBLIC_CASE_TRACKER = 'PUBLIC_CASE_TRACKER',
  PUBLIC_DOCS = 'PUBLIC_DOCS',
  SENIOR_TEAM = 'SENIOR_TEAM',
  SENIOR_INSIGHTS = 'SENIOR_INSIGHTS',
  SENIOR_STRATEGY = 'SENIOR_STRATEGY',
  STARTUP_CONTRACT_AI = 'STARTUP_CONTRACT_AI',
  STARTUP_COMPLIANCE = 'STARTUP_COMPLIANCE'
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
  lastLogin?: number;
  collegeName?: string;
  phone?: string;
  usage: {
    researchCredits: number;
    draftsCreated: number;
    maxResearchCredits: number;
  };
}

export interface Client {
  id: string;
  firmId: string;
  name: string;
  type: 'Individual' | 'Corporate';
  email?: string;
  contactEmail?: string;
  contactPhone?: string;
  gstin?: string;
}

export interface Matter {
  id: string;
  firmId: string;
  clientId: string;
  title: string;
  caseNumber?: string;
  court: string;
  status: 'Active' | 'Pending' | 'Disposed';
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
  type: 'Judgment' | 'Pleading' | 'Evidence' | 'Research' | 'Statute';
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
  version: number;
  updatedAt: number;
  createdAt: number;
  type: string;
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

export interface Firm {
  id: string;
  name: string;
  plan: SubscriptionTier;
  ownerId: string;
  createdAt: number;
  credits: number;
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

export interface LearningPath {
  id: string;
  subject: string;
  progress: number;
  totalModules: number;
  lastTopic: string;
}

export type PracticeArea = 'Criminal' | 'Civil' | 'Corporate' | 'Family' | 'Taxation' | 'GST' | 'Labour' | 'Intellectual Property';
export type CourtLevel = 'District' | 'High_Court' | 'Supreme_Court' | 'Tribunal';
