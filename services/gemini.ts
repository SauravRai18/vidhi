
import { GoogleGenAI, Type } from "@google/genai";
import { UserRole, JudgmentSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPTS: Record<UserRole, string> = {
  Citizen: `ROLE: Empathetic Legal Guide for Indian Citizens. 
    LANGUAGE: Simple, non-technical English/Hindi. No jargon. 
    GOAL: Explain rights, procedures (FIR, Consumer Court), and next steps. 
    LIMITS: Do not give advice, only process and procedural guidance.`,
  
  Student: `ROLE: Academic AI Tutor for Indian Law Students. 
    STYLE: Educational, concept-heavy, cites Bare Acts and Landmark Cases (SCC/AIR). 
    FOCUS: Ratio Decidendi, legal maxims, exam-oriented explanations.`,
  
  Junior_Advocate: `ROLE: AI Junior Associate for Indian Advocates. 
    STYLE: Procedural, practical. 
    FOCUS: Court rules, drafting formats, registry objections, filing steps. Use BNS/BNSS/BSA for criminal matters.`,
  
  Senior_Advocate: `ROLE: Strategic Legal Research Architect. 
    STYLE: High-precision, strategic, heavy on citations. 
    FOCUS: Tactical pivot points, finding distinguishing precedents, high-level constitutional mapping.`,
  
  Startup_Founder: `ROLE: Business Legal Risk Analyst. 
    STYLE: Concise, risk-focused, commercial. 
    FOCUS: GST compliance, ROC filings, one-sided indemnity clauses, IP protection.`,
  
  In_House_Counsel: `ROLE: Corporate Legal Operations Intelligence. 
    STYLE: Governance and risk-aware. 
    FOCUS: Matter tracking, external counsel audit, policy alignment, cost exposure.`,

  Admin: "ROLE: Platform Quality Control.",
  Founder: "ROLE: System Architect."
};

export const runRoleSpecificChat = async (role: UserRole, history: any[], query: string, context?: string) => {
  const model = 'gemini-3-flash-preview';
  const instruction = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.Citizen;

  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: context ? `CONTEXT:\n${context}\n\nQUERY: ${query}` : query }] }
  ];

  return await ai.models.generateContent({
    model,
    contents,
    config: { systemInstruction: instruction, temperature: 0.1 }
  });
};

export const analyzeDocumentAI = async (role: UserRole, text: string, type: string) => {
  const model = 'gemini-3-pro-preview';
  const prompt = `Analyze this ${type} for a ${role}. 
    Identify: 
    1. Key Legal Issues
    2. Crucial Dates/Deadlines
    3. Statutory References
    4. Suggested Actions.
    Return output in structured Markdown.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt + "\n\nTEXT:\n" + text }] }],
    config: { systemInstruction: SYSTEM_PROMPTS[role] }
  });
  return response.text;
};

export const generateDraftAI = async (role: UserRole, data: any) => {
  const model = 'gemini-3-pro-preview';
  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: `Generate a formal draft for: ${JSON.stringify(data)}. Use professional Indian legal formatting.` }] }],
    config: { systemInstruction: SYSTEM_PROMPTS[role] }
  });
  return response.text;
};

// Added missing functions as requested by file errors

export const getAdvancedResearchStream = async (history: any[], query: string, role: UserRole, contexts?: string[]) => {
  const instruction = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.Senior_Advocate;
  const contextText = contexts ? `CONTEXT:\n${contexts.join('\n\n')}\n\n` : '';
  
  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: `${contextText}QUERY: ${query}\n\nProvide response and conclude with [CONFIDENCE_SCORE]: X% and [LEGAL_BASIS]: summary.` }] }
    ],
    config: { 
      systemInstruction: instruction,
      tools: [{ googleSearch: {} }] 
    }
  });
};

export const analyzeJudgmentEnterprise = async (text: string): Promise<JudgmentSummary> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Analyze this judgment and return JSON format:\n${text}` }] }],
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

export const generateEnterpriseDraft = async (data: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Generate a formal legal draft based on: ${JSON.stringify(data)}` }] }],
    config: { systemInstruction: SYSTEM_PROMPTS.Senior_Advocate }
  });
  return response.text;
};

export const getReliefIntelligence = async (details: string, court: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Analyze relief for: ${details} in ${court}` }] }],
  });
  return response.text;
};

export const studentExplainConcept = async (concept: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: `Explain the legal concept: ${concept}` }] }],
    config: { systemInstruction: SYSTEM_PROMPTS.Student }
  });
  return response.text;
};

export const suggestLitigationStrategy = async (query: string, contexts?: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Suggest strategy for: ${query}${contexts ? ` using context: ${contexts.join('\n')}` : ''}\n\nProvide response and conclude with [CONFIDENCE_SCORE]: X% and [LEGAL_BASIS]: summary.` }] }],
    config: { systemInstruction: SYSTEM_PROMPTS.Senior_Advocate }
  });
  return response.text;
};

export const generateHearingBrief = async (caseTitle: string, facts: string, purpose: string, contexts?: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Generate hearing brief for ${caseTitle}. Purpose: ${purpose}. Facts: ${facts}${contexts ? ` using context: ${contexts.join('\n')}` : ''}\n\nProvide response and conclude with [CONFIDENCE_SCORE]: X% and [LEGAL_BASIS]: summary.` }] }],
    config: { systemInstruction: SYSTEM_PROMPTS.Senior_Advocate }
  });
  return response.text;
};

export const reviewContractAI = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Review this contract and return JSON:\n${text}` }] }],
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
