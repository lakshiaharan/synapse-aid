import { RAGDocument, RAGChunk, RAGSourceRef } from '../types';
import { DEFAULT_KNOWLEDGE_DOCS } from '../data/defaultKnowledge';

// Vector dimension for in-browser dense embedding projection
const EMBEDDING_DIM = 24;

// Semantic vocabulary anchor terms for dense projection
const SEMANTIC_ANCHORS = [
  'flood', 'water', 'submerged', 'evacuate', 'boat',
  'earthquake', 'collapse', 'trauma', 'hemorrhage', 'tourniquet',
  'medical', 'triage', 'resuscitation', 'oxygen', 'pediatric',
  'ration', 'food', 'potable', 'chlorine', 'purification',
  'shelter', 'blanket', 'hypothermia', 'logistics', 'airdrop'
];

/**
 * Computes a normalized high-dimensional semantic embedding vector for a given text.
 * Combines character n-gram hashing and semantic keyword anchors with L2 normalization.
 */
export function generateEmbedding(text: string): number[] {
  const clean = text.toLowerCase();
  const vector = new Array(EMBEDDING_DIM).fill(0);

  // 1. Semantic anchor affinity
  SEMANTIC_ANCHORS.forEach((anchor, idx) => {
    const dim = idx % EMBEDDING_DIM;
    if (clean.includes(anchor)) {
      vector[dim] += 2.5;
    }
  });

  // 2. Token hash projections
  const words = clean.match(/\b\w{3,}\b/g) || [];
  words.forEach(word => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const targetDim = Math.abs(hash) % EMBEDDING_DIM;
    vector[targetDim] += 0.8;
  });

  // 3. L2 Normalization
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vector;
  return vector.map(val => val / magnitude);
}

/**
 * Computes Cosine Similarity between two normalized vectors: [-1.0, 1.0] -> scaled to [0, 1]
 */
export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, (similarity + 1) / 2));
}

/**
 * Computes BM25-style lexical keyword overlap score
 */
export function computeBM25Score(queryTokens: string[], chunkKeywords: string[]): number {
  if (!queryTokens.length || !chunkKeywords.length) return 0;
  let matches = 0;
  queryTokens.forEach(token => {
    if (chunkKeywords.some(k => k.includes(token) || token.includes(k))) {
      matches += 1.5;
    }
  });
  return Math.min(1, matches / (queryTokens.length + 1));
}

/**
 * Chunks a long document text into overlapping segment windows with metadata
 */
export function chunkDocument(
  docId: string,
  docTitle: string,
  sourceAuthority: string,
  content: string,
  chunkSize = 300,
  overlap = 50
): RAGChunk[] {
  const chunks: RAGChunk[] = [];
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  let currentChunk = '';
  let chunkIndex = 0;

  // Extract section title heuristic from paragraph header (e.g. "1. Immediate Triage & Evacuation:")
  const getSectionHint = (p: string) => {
    const firstLine = p.trim().split('\n')[0];
    if (firstLine.length < 50 && (firstLine.includes(':') || /^\d\./.test(firstLine))) {
      return firstLine.replace(/[:.]/g, '').trim();
    }
    return 'General Guidelines';
  };

  paragraphs.forEach(para => {
    if ((currentChunk + ' ' + para).length > chunkSize && currentChunk.length > 0) {
      const text = currentChunk.trim();
      const keywords = (text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []).slice(0, 14);
      chunks.push({
        id: `${docId}-chunk-${chunkIndex++}`,
        docId,
        docTitle,
        sourceAuthority,
        sectionName: getSectionHint(currentChunk),
        text,
        embedding: generateEmbedding(text),
        keywords: Array.from(new Set(keywords)),
      });
      currentChunk = currentChunk.slice(-overlap) + ' ' + para;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n' + para : para;
    }
  });

  if (currentChunk.trim().length > 0) {
    const text = currentChunk.trim();
    const keywords = (text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []).slice(0, 14);
    chunks.push({
      id: `${docId}-chunk-${chunkIndex++}`,
      docId,
      docTitle,
      sourceAuthority,
      sectionName: getSectionHint(currentChunk),
      text,
      embedding: generateEmbedding(text),
      keywords: Array.from(new Set(keywords)),
    });
  }

  // Annotate totalChunks
  const total = chunks.length;
  chunks.forEach((c, idx) => {
    c.chunkIndex = idx + 1;
    c.totalChunks = total;
  });

  return chunks;
}

/**
 * Singleton Hybrid RAG Knowledge Engine
 */
class SynapseRAGEngine {
  private documents: Map<string, RAGDocument> = new Map();
  private allChunks: RAGChunk[] = [];

  constructor() {
    this.initDefaultKnowledge();
  }

  private initDefaultKnowledge() {
    DEFAULT_KNOWLEDGE_DOCS.forEach(doc => {
      this.addDocument(doc.title, doc.category, doc.source, doc.content, false);
    });
  }

  public addDocument(
    title: string,
    category: RAGDocument['category'],
    source: string,
    content: string,
    saveToStorage = true
  ): RAGDocument {
    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const chunks = chunkDocument(docId, title, source, content);

    const newDoc: RAGDocument = {
      id: docId,
      title,
      category,
      source,
      content,
      chunks,
      updatedAt: new Date().toISOString(),
    };

    this.documents.set(docId, newDoc);
    this.rebuildIndex();

    if (saveToStorage) {
      this.persistCustomDocs();
    }

    return newDoc;
  }

  public removeDocument(docId: string) {
    this.documents.delete(docId);
    this.rebuildIndex();
    this.persistCustomDocs();
  }

  private rebuildIndex() {
    this.allChunks = [];
    this.documents.forEach(doc => {
      this.allChunks.push(...doc.chunks);
    });
  }

  private persistCustomDocs() {
    try {
      const customDocs = Array.from(this.documents.values()).filter(d => !d.id.startsWith('default-'));
      localStorage.setItem('synapse_custom_rag_docs', JSON.stringify(customDocs));
    } catch (e) {
      console.warn('Failed to persist custom RAG docs to localStorage', e);
    }
  }

  /**
   * Hybrid RAG Retrieval: Cosine Vector Similarity + BM25 Lexical Keyword Rank Fusion
   */
  public query(queryString: string, topK = 3, minScore = 0.30): RAGSourceRef[] {
    if (!queryString.trim() || !this.allChunks.length) return [];

    const queryEmbedding = generateEmbedding(queryString);
    const queryTokens = queryString.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

    const scored = this.allChunks.map(chunk => {
      const denseSim = computeCosineSimilarity(queryEmbedding, chunk.embedding);
      const sparseScore = computeBM25Score(queryTokens, chunk.keywords);
      
      // Hybrid Weighted Score: 60% Dense Vector + 40% Sparse Lexical
      const hybridScore = (denseSim * 0.6) + (sparseScore * 0.4);

      // Find overlapping keywords for explainability
      const matchedKeywords = queryTokens.filter(t => 
        chunk.keywords.some(k => k.includes(t) || t.includes(k)) ||
        chunk.text.toLowerCase().includes(t)
      );

      return {
        chunkId: chunk.id,
        docTitle: chunk.docTitle,
        sectionName: chunk.sectionName || 'Emergency Procedure',
        sourceAuthority: chunk.sourceAuthority || 'Verified Protocol',
        similarityScore: Math.round(hybridScore * 100) / 100,
        semanticScore: Math.round(denseSim * 100),
        keywordScore: Math.round(sparseScore * 100),
        whyMatched: Array.from(new Set(matchedKeywords)).slice(0, 4),
        excerpt: chunk.text,
        chunkIndex: chunk.chunkIndex,
        totalChunks: chunk.totalChunks,
      };
    });

    return scored
      .filter(item => item.similarityScore >= minScore)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK);
  }

  public getDocuments(): RAGDocument[] {
    return Array.from(this.documents.values());
  }

  public getAllChunks(): RAGChunk[] {
    return this.allChunks;
  }
}

export const ragEngine = new SynapseRAGEngine();
