
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { JudgmentSummary, UserRole } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPersonaPrompt = (role: UserRole) => {
  const base = `ROLE: Principal Legal Architect & Senior Advocate (India). JURISDICTION: India. 
  STRICTLY MAPPING: Use BNS/BNSS/BSA for criminal advice. 
  CITATION STYLE: Cite Case Name, Citation (SCC/AIR), Court.`;

  switch(role) {
    case 'Citizen':
      return `${base} TONE: Extremely simple, empathetic, plain English. Avoid complex Latin terms. Focus on immediate steps like FIR, Consumer Complaint, or Rent issues.`;
    case 'Student':
      return `${base} TONE: Academic, detailed, pedagogical. Explain the 'Why' behind ratios. Reference landmark precedents clearly.`;
    case 'Startup_Founder':
      return `${base} TONE: Business-centric, risk-focused. Analyze contracts for indemnity, liability, and GST compliance. Focus on ROC and Labour law obligations.`;
    case 'Junior_Advocate':
      return `${base} TONE: Procedural, instructional. Explain HOW to file, which registry to approach, and standard drafting objections.`;
    default:
      return `${base} TONE: Professional, court-grade, conservative. Every response MUST include the footer:
      [CONFIDENCE_SCORE]: {number}%
      [LEGAL_BASIS]: {statutory grounding}`;
  }
};

export const getAdvancedResearchStream = async (
  history: { role: string; text: string }[],
  query: string,
  role: UserRole = 'Senior_Advocate',
  contexts?: string[]
) => {
  const contextText = contexts?.join('\n\n') || 'No specific case file context.';

  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: `[QUERY]: ${query}\n[CONTEXT]: ${contextText}` }] }
    ],
    config: {
      systemInstruction: getPersonaPrompt(role),
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
      thinkingConfig: { thinkingBudget: 32000 }
    },
  });
};

export const reviewContractAI = async (text: string) => {
  const prompt = `Perform a high-fidelity risk audit on this Indian contract. 
  IDENTIFY: (1) Ambiguous Clauses (2) Missing GST/Tax components (3) One-sided Indemnity (4) Jurisdiction conflicts. 
  FORMAT: JSON for structured risk mapping.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ role: 'user', parts: [{ text: prompt + "\n\n" + text }] }],
    config: {
      systemInstruction: getPersonaPrompt('Startup_Founder'),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          isGSTCompliant: { type: Type.BOOLEAN }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeJudgmentEnterprise = async (text: string): Promise<JudgmentSummary | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: 'user', parts: [{ text: `Analyze Judgment:\n${text}` }] }],
      config: {
        systemInstruction: getPersonaPrompt('Senior_Advocate'),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caseTitle: { type: Type.STRING },
            facts: { type: Type.STRING },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } },
            argumentsPetitioner: { type: Type.STRING },
            argumentsRespondent: { type: Type.STRING },
            judgment: { type: Type.STRING },
            ratioDecidendi: { type: Type.STRING },
            sectionsCited: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

// Fix: Implement missing generateEnterpriseDraft
export const generateEnterpriseDraft = async (data: { type: string; parties: string; subject: string; details: string; court: string }) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Generate a formal court draft for ${data.type} in ${data.court}. Parties: ${data.parties}. Subject: ${data.subject}. Details: ${data.details}. Use BNS/BNSS/BSA if applicable.` }] }],
    config: {
      systemInstruction: getPersonaPrompt('Senior_Advocate'),
      temperature: 0.2,
    },
  });
  return response.text;
};

// Fix: Implement missing getReliefIntelligence
export const getReliefIntelligence = async (details: string, court: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Provide statutory strategy and relief intelligence for: ${details} in ${court}. Cite relevant sections of BNS/BNSS/CPC.` }] }],
    config: {
      systemInstruction: getPersonaPrompt('Senior_Advocate'),
    },
  });
  return response.text;
};

// Fix: Implement missing studentExplainConcept
export const studentExplainConcept = async (concept: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Explain the legal concept: ${concept}. Provide landmark cases and explain the 'Why' behind the ratios.` }] }],
    config: {
      systemInstruction: getPersonaPrompt('Student'),
    },
  });
  return response.text;
};

// Fix: Implement missing suggestLitigationStrategy
export const suggestLitigationStrategy = async (facts: string, contexts?: string[]) => {
  const contextText = contexts?.join('\n\n') || 'No specific case context.';
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Suggest a litigation strategy for the following facts:\n${facts}\n\nContext:\n${contextText}` }] }],
    config: {
      systemInstruction: getPersonaPrompt('Senior_Advocate'),
      thinkingConfig: { thinkingBudget: 16000 }
    },
  });
  return response.text;
};

// Fix: Implement missing generateHearingBrief
export const generateHearingBrief = async (title: string, facts: string, purpose: string, contexts?: string[]) => {
  const contextText = contexts?.join('\n\n') || 'No specific case context.';
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `Generate a hearing brief for ${title}. Purpose: ${purpose}. Facts: ${facts}. Context: ${contextText}` }] }],
    config: {
      systemInstruction: getPersonaPrompt('Senior_Advocate'),
    },
  });
  return response.text;
};
