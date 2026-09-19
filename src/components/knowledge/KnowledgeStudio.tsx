import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  CheckCircle2, 
  Trash2, 
  FileText, 
  Database, 
  ExternalLink, 
  X,
  Cpu,
  Hash
} from 'lucide-react';
import { ragEngine, generateEmbedding, computeCosineSimilarity, computeBM25Score } from '../../core/ragEngine';
import { VectorVisualizer } from './VectorVisualizer';
import { RAGDocument } from '../../types';

export const KnowledgeStudio: React.FC = () => {
  const [documents, setDocuments] = useState<RAGDocument[]>(ragEngine.getDocuments());
  const [testQuery, setTestQuery] = useState('flash flood chlorine water purification');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<RAGDocument | null>(null);
  
  // New Doc Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<RAGDocument['category']>('DISASTER_SOP');
  const [newSource, setNewSource] = useState('');
  const [newContent, setNewContent] = useState('');

  const testQueryEmbedding = generateEmbedding(testQuery);
  const queryTokens = testQuery.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const allChunks = ragEngine.getAllChunks();

  // Compute live vector similarity & BM25 breakdown for test query
  const scoredChunks = allChunks.map(chunk => {
    const denseSim = computeCosineSimilarity(testQueryEmbedding, chunk.embedding);
    const sparseScore = computeBM25Score(queryTokens, chunk.keywords);
    const hybridScore = (denseSim * 0.6) + (sparseScore * 0.4);

    const matchedKeywords = queryTokens.filter(t => 
      chunk.keywords.some(k => k.includes(t) || t.includes(k)) ||
      chunk.text.toLowerCase().includes(t)
    );

    return {
      ...chunk,
      similarityScore: Math.round(hybridScore * 100),
      semanticScore: Math.round(denseSim * 100),
      keywordScore: Math.round(sparseScore * 100),
      whyMatched: Array.from(new Set(matchedKeywords)),
    };
  }).sort((a, b) => b.similarityScore - a.similarityScore);

  const exampleQueries = [
    { label: '🌊 Flood Water Safety', query: 'flash flood chlorine water purification tablets dosage' },
    { label: '🩹 Trauma & Bleeding', query: 'mass casualty hemorrhage combat application tourniquet CAT' },
    { label: '⛺ Emergency Shelter', query: 'temporary camp hygiene latrine ratio 3.5m living space' },
    { label: '🍞 Food Distribution', query: 'high calorie emergency biscuit rations 2100 kcal hypothermia' },
  ];

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    ragEngine.addDocument(newTitle, newCategory, newSource || 'Field Manual', newContent, true);
    setDocuments(ragEngine.getDocuments());
    setNewTitle('');
    setNewContent('');
    setNewSource('');
    setShowAddModal(false);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Delete this crisis document from the vector index?')) {
      ragEngine.removeDocument(id);
      setDocuments(ragEngine.getDocuments());
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-5 max-w-7xl mx-auto space-y-4">
      
      {/* 1. Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 aid-card">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Humanitarian Protocol Studio & Hybrid Vector RAG
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dual-channel search combining <strong>24-D Dense Cosine Embeddings</strong> and <strong>BM25 Sparse Lexical Ranking</strong> over WHO, FEMA, and NDRF relief SOPs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Ingest Aid Protocol
        </button>
      </div>

      {/* 2. Live Vector Similarity Query Tester */}
      <div className="p-4 sm:p-5 aid-card border border-indigo-500/20 space-y-3.5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Search className="w-4 h-4 text-indigo-400" />
            <span>LIVE VECTOR SIMILARITY QUERY TESTER</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Total Indexed SOP Chunks: <strong className="text-slate-200">{allChunks.length}</strong>
          </span>
        </div>

        {/* Query Input */}
        <input
          type="text"
          value={testQuery}
          onChange={e => setTestQuery(e.target.value)}
          placeholder="Type any disaster symptom or aid query to inspect semantic cosine alignment in real time..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm outline-none focus:border-indigo-500"
        />

        {/* Quick Example Query Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Try Examples:</span>
          {exampleQueries.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => setTestQuery(ex.query)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-all"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Dense Vector Visualizer */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <VectorVisualizer embedding={testQueryEmbedding} label={`Query Semantic Vector (${testQuery.slice(0, 35)}...)`} />
        </div>

        {/* Top 3 Matched Chunks with Full Technical & Explainability Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {scoredChunks.slice(0, 3).map((chunk, i) => {
            const parentDoc = documents.find(d => d.id === chunk.docId || d.title === chunk.docTitle);

            return (
              <div key={chunk.id} className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/25 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  
                  {/* Card Header: Match Rank & Final Score */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-400 font-bold flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      MATCH #{i + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold text-xs">
                      {chunk.similarityScore}% Match
                    </span>
                  </div>

                  {/* Document & Section Metadata */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      SOURCE: {chunk.sourceAuthority || 'Verified Protocol'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mt-0.5">
                      {chunk.docTitle}
                    </h4>
                    <p className="text-[11px] text-indigo-300 font-medium">
                      Section: {chunk.sectionName || 'Emergency Protocol'} • Chunk {chunk.chunkIndex || (i + 1)} of {chunk.totalChunks || 4}
                    </p>
                  </div>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-300 line-clamp-3 italic leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    "{chunk.text}"
                  </p>

                  {/* Why this match? Explainability Badges */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Why matched?
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {chunk.whyMatched && chunk.whyMatched.length > 0 ? (
                        chunk.whyMatched.slice(0, 3).map((w, wIdx) => (
                          <span key={wIdx} className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            {w}
                          </span>
                        ))
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                          ✓ Dense Semantic Proximity
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Semantic vs Keyword Technical Indicator */}
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Retrieval Analysis
                    </span>
                    <div className="flex justify-between text-slate-300">
                      <span className="flex items-center gap-1">🧠 Semantic (Cosine):</span>
                      <span className="font-bold text-indigo-400">{chunk.semanticScore}%</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="flex items-center gap-1">🔤 Keyword (BM25):</span>
                      <span className="font-bold text-teal-400">{chunk.keywordScore}%</span>
                    </div>
                  </div>

                </div>

                {/* Footer Action: View Full Source Document */}
                {parentDoc && (
                  <button
                    onClick={() => setViewingDoc(parentDoc)}
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1 border border-slate-700"
                  >
                    <span>View Full Source</span>
                    <ExternalLink className="w-3 h-3 text-indigo-400" />
                  </button>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Indexed SOP Documents Table */}
      <div className="p-4 sm:p-5 aid-card space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Active Humanitarian Crisis Protocols ({documents.length})</span>
        </h3>

        <div className="divide-y divide-slate-800 space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                    {doc.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-200">{doc.title}</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Authority: <strong className="text-slate-300">{doc.source}</strong> • {doc.chunks.length} Overlapping Chunks Indexed
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  View Protocol
                </button>

                {!doc.id.startsWith('default-') && (
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    title="Delete Protocol"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Full Source Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl aid-card p-5 border border-slate-800 max-h-[85vh] flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {viewingDoc.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{viewingDoc.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Authorizing Body: {viewingDoc.source}</p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
              {viewingDoc.content}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                {viewingDoc.chunks.length} Dense Embedding Chunks
              </span>
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
              >
                Close Protocol Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Ingest Protocol Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg aid-card p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Ingest Crisis Relief Manual
            </h3>

            <form onSubmit={handleAddDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyclone Coastal Evacuation Protocol"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as RAGDocument['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500 text-xs cursor-pointer"
                  >
                    <option value="DISASTER_SOP">Disaster SOP</option>
                    <option value="FIRST_AID">First Aid & Trauma</option>
                    <option value="LOGISTICS_RULE">Logistics Rule</option>
                    <option value="FIELD_MANUAL">Field Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Authorizing Body</label>
                  <input
                    type="text"
                    placeholder="e.g. Red Cross / State Authority"
                    value={newSource}
                    onChange={e => setNewSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Text (Auto-Chunked)</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste complete procedural guidelines, dosage rules, or triage steps here..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500 text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
                >
                  Index Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
