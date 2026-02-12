
import { LegalDocument } from '../types';
import { db } from './db';

/**
 * KNOWLEDGE BASE SERVICE (RAG FOUNDATION)
 * Mimics an enterprise-grade Vector DB with Metadata Filtering.
 */
class KnowledgeBaseService {
  private documents: LegalDocument[] = [
    { 
      id: 'doc_1', 
      firmId: 'global',
      title: 'Constitution of India (Article 32 & 226)', 
      content: 'Constitution content...',
      type: 'Statute', 
      status: 'Indexed', 
      createdAt: Date.now(),
      metadata: { tags: ['Constitutional', 'Writ'], author: 'Govt of India', sectionsCited: ['1-395'] }
    },
    { 
      id: 'doc_2', 
      firmId: 'global',
      title: 'BNS 2023 - Procedural Map', 
      content: 'BNS content...',
      type: 'Statute', 
      status: 'Indexed', 
      createdAt: Date.now(),
      metadata: { tags: ['Criminal', 'BNS'], author: 'Ministry of Home Affairs' }
    }
  ];

  constructor() {
    // Load existing firm-specific documents from local storage if any
    const saved = localStorage.getItem('v_os_knowledge_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.documents = [...this.documents, ...parsed];
      } catch (e) {
        console.error("Failed to load knowledge store", e);
      }
    }
  }

  private persist() {
    const firmDocs = this.documents.filter(d => d.firmId !== 'global');
    localStorage.setItem('v_os_knowledge_store', JSON.stringify(firmDocs));
  }

  async semanticSearch(query: string): Promise<string> {
    const queryLower = query.toLowerCase();
    const firmId = db.getFirmId();
    
    // In a real RAG, this would filter by (firmId OR global) in the vector DB
    const relevantDocs = this.documents.filter(d => d.firmId === 'global' || d.firmId === firmId);
    
    // Simulating Hybrid Search (Vector Similarity + Keyword Boosting)
    let results = [
      "SC Ruling: In pending criminal proceedings, the procedural transition from CrPC to BNSS must strictly ensure no retrospective prejudice to the accused.",
      "Art 226 Analysis: High Courts possess plenary power to issue writs for Fundamental Rights and 'any other purpose', wider than Art 32 SC jurisdiction.",
      "BNS Section 103: Redefines murder punishment. Proviso for mob lynching added to address specific socio-legal challenges."
    ];

    if (queryLower.includes('constitution') || queryLower.includes('writ')) {
      results = [
        "Art 32 provides a self-executing fundamental right to move the SC for enforcement of Part III rights.",
        "Art 226 remains the bedrock of High Court judicial review against administrative overreach."
      ];
    } else if (queryLower.includes('bns') || queryLower.includes('criminal')) {
      results = [
        "BNS Sec 439 (Legacy BNSS): Bail provisions mapped to ensure continuity of trial standards.",
        "BSA 2023: Electronic evidence standards now explicitly integrated into primary testimony protocols."
      ];
    }

    // Boost with internal firm knowledge if matches found
    const firmContext = relevantDocs
      .filter(d => d.firmId === firmId && d.title.toLowerCase().includes(queryLower))
      .map(d => `[FIRM_PRECEDENT]: ${d.title} - ${d.content}`);
    
    return [...firmContext, ...results].join("\n\n");
  }

  async ingest(file: File, category: LegalDocument['type'], tags: string[]): Promise<LegalDocument> {
    const newDoc: LegalDocument = {
      id: `doc_${Math.random().toString(36).substr(2, 9)}`,
      firmId: db.getFirmId(),
      title: file.name,
      content: `Extracted text from ${file.name}. This document is tagged as ${tags.join(', ')} and categorized as ${category}.`,
      type: category,
      status: 'Processing',
      createdAt: Date.now(),
      metadata: { 
        tags: tags, 
        author: db.getUserId(),
        court: category === 'Judgment' ? 'High Court of Delhi' : undefined
      }
    };
    
    this.documents.push(newDoc);
    this.persist();
    
    // Simulate async indexing
    setTimeout(() => {
      const doc = this.documents.find(d => d.id === newDoc.id);
      if (doc) {
        doc.status = 'Indexed';
        this.persist();
      }
    }, 3000);

    return newDoc;
  }

  getAll() { 
    const firmId = db.getFirmId();
    // Return global + current firm documents
    return this.documents.filter(d => d.firmId === 'global' || d.firmId === firmId);
  }

  delete(id: string) {
    const firmId = db.getFirmId();
    this.documents = this.documents.filter(d => !(d.id === id && d.firmId === firmId));
    this.persist();
  }
}

export const knowledgeBase = new KnowledgeBaseService();
