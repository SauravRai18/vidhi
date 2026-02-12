
import { GoogleGenAI, Type } from "@google/genai";
import { UserRole, JudgmentSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ROLE_SYSTEM_INSTRUCTIONS: Record<UserRole, string> = {
  Citizen: `You are 'Vidhi Citizen AI', a simplified legal guide for the Indian public. 
    Language: Extremely simple, avoid jargon, explain concepts like 'FIR' or 'Stay Order' in plain English.
    Style: Step-by-step guidance. Be empathetic but professional. 
    Disclaimer: Always mention you are not a lawyer.`,
  
  Student: `You are 'Vidhi Academic AI', a tutor for law students in India. 
    Language: Academic, precise, reference Bare Acts (IPC/BNS, CrPC/BNSS, etc.).
    Focus: Ratio Decidendi, legal maxims, constitutional interpretations.
    Behavior: Help with case briefs, moot court research, and concept explanation.`,
  
  Junior_Advocate: `You are 'Vidhi Junior Associate AI'. 
    Language: Professional, focus on court procedures and filing rules (High Court/District Rules).
    Focus: Procedural compliance, drafting standard applications (Bail, Exemption, Adjournment).
    Behavior: Be practical. Suggest strategy for the next hearing based on standard Indian practice.`,
  
  Senior_Advocate: `You are 'Vidhi Strategic Lead AI'. 
    Language: Senior-level, high-precision, dense with citations (SCC, AIR).
    Focus: High-stakes strategy, finding distinguishing factors in precedents, strategic constitutional arguments.
    Behavior: Minimal fluff. High reasoning budget. Strategic and cynical analysis of counter-arguments.`,
  
  Startup_Founder: `You are 'Vidhi Business Legal AI'. 
    Language: Business-friendly, actionable, focus on ROI and risk mitigation.
    Focus: Contract risks (indemnity, liability), GST/ROC compliance, labor laws.
    Behavior: Summarize documents in 'Founder English'. Highlight clauses that need negotiation.`,
  
  In_House_Counsel: `You are 'Vidhi Corporate Legal Ops AI'. 
    Language: Enterprise, focus on governance, auditability, and exposure.
    Focus: External counsel management, litigation tracking, policy alignment.
    Behavior: Efficient, summary-oriented, audit-ready outputs.`,

  Admin: "You are the system administrator bot.",
  Founder: "You are the platform architect bot."
};

export const getAdvancedResearchStream = async (history: any[], query: string, role: UserRole, contexts?: string[]) => {
  const instruction = ROLE_SYSTEM_INSTRUCTIONS[role] || ROLE_SYSTEM_INSTRUCTIONS.Senior_Advocate;
  const contextText = contexts ? `CONTEXT DOCUMENTS:\n${contexts.join('\n\n')}\n\n` : '';
  
  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: `${contextText}QUERY: ${query}\n\nConclude response with [CONFIDENCE_SCORE]: X% and [LEGAL_BASIS]: summary.` }] }
    ],
    config: { 
      systemInstruction: instruction,
      tools: [{ googleSearch: {} }] 
    }
  });
};

export const analyzeDocumentAI = async (text: string, type: string, role: UserRole) => {
  const prompt = `Analyze this ${type} for a ${role}. 
    Identify: 1. Core Risks 2. Statutory Deadlines 3. Action Items 4. Plain English Summary. 
    Format as structured Markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt + "\n\nDOCUMENT TEXT:\n" + text,
    config: { systemInstruction: ROLE_SYSTEM_INSTRUCTIONS[role] }
  });
  return response.text;
};

export const generateStandardDraft = async (data: any, role: UserRole) => {
  const prompt = `Generate a formal legal draft based on: ${JSON.stringify(data)}. Follow professional Indian court formatting.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { systemInstruction: ROLE_SYSTEM_INSTRUCTIONS[role] }
  });
  return response.text;
};

// Fix for analyzeJudgmentEnterprise
export const analyzeJudgmentEnterprise = async (text: string): Promise<JudgmentSummary> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following Indian court judgment and extract structured details. 
      Judgment text: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caseTitle: { type: Type.STRING },
          facts: { type: Type.STRING },
          issues: { type: Type.ARRAY, items: { type: Type.STRING } },
          ratioDecidendi: { type: Type.STRING },
          judgment: { type: Type.STRING },
          argumentsPetitioner: { type: Type.STRING },
          argumentsRespondent: { type: Type.STRING },
          sectionsCited: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["caseTitle", "facts", "issues", "ratioDecidendi", "judgment", "argumentsPetitioner", "argumentsRespondent", "sectionsCited"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

// Fix for generateEnterpriseDraft
export const generateEnterpriseDraft = async (data: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a detailed legal draft based on: ${JSON.stringify(data)}. Follow strict Indian court norms and formatting.`,
  });
  return response.text;
};

// Fix for getReliefIntelligence
export const getReliefIntelligence = async (details: string, court: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following case details and suggest statutory relief and strategy for ${court}. 
      Details: ${details}`,
  });
  return response.text;
};

// Fix for studentExplainConcept
export const studentExplainConcept = async (concept: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Explain the legal concept '${concept}' in the context of Indian Law for a law student. Include landmark cases and relevant bare act sections.`,
  });
  return response.text;
};

// Fix for suggestLitigationStrategy
export const suggestLitigationStrategy = async (facts: string, contexts: string[]) => {
  const contextText = contexts.length > 0 ? `CONTEXT DOCUMENTS:\n${contexts.join('\n\n')}\n\n` : '';
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${contextText}Suggest a detailed litigation strategy based on these facts: ${facts}\n\nConclude response with [CONFIDENCE_SCORE]: X% and [LEGAL_BASIS]: summary.`,
  });
  return response.text;
};

// Fix for generateHearingBrief
export const generateHearingBrief = async (title: string, facts: string, purpose: string, contexts: string[]) => {
  const contextText = contexts.length > 0 ? `CONTEXT DOCUMENTS:\n${contexts.join('\n\n')}\n\n` : '';
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${contextText}Generate a hearing brief for '${title}'. Purpose: ${purpose}. Factual Summary: ${facts}\n\nConclude response with [CONFIDENCE_SCORE]: X% and [LEGAL_BASIS]: summary.`,
  });
  return response.text;
};

// Fix for reviewContractAI
export const reviewContractAI = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Review the following contract for potential risks and GST compliance in India: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          isGSTCompliant: { type: Type.BOOLEAN },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["riskScore", "isGSTCompliant", "risks", "suggestions"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
