import { useState, useEffect } from 'react';
import './styles/app.css';
import './styles/dashboard.css';
import './styles/references.css';
import './styles/workspace.css';
import { generateCitations } from './utils/citation.js';

// SVG Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);
const LabIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="3"></circle></svg>
);
const DraftIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);
const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"></path></svg>
);
const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

const API_BASE = '/api';

function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState('search');

  // IBM Credentials state
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ibm_apikey') || '');
  const [projectId, setProjectId] = useState(() => localStorage.getItem('ibm_projectid') || '');
  const [region, setRegion] = useState(() => localStorage.getItem('ibm_region') || 'us-south');
  const [modelId, setModelId] = useState(() => localStorage.getItem('ibm_modelid') || 'ibm/granite-3-8b-instruct');
  const [isSaved, setIsSaved] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('agentic reasoning AI');
  const [searchSort, setSearchSort] = useState('relevance');
  const [papers, setPapers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Reference Library State
  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem('ref_collections');
    return saved ? JSON.parse(saved) : [{ name: 'General Library', papers: [] }];
  });
  const [activeCollectionName, setActiveCollectionName] = useState('General Library');
  const [newCollName, setNewCollName] = useState('');
  const [citationStyles, setCitationStyles] = useState({}); // { [paperId]: 'apa' }

  // Save collections helper
  useEffect(() => {
    localStorage.setItem('ref_collections', JSON.stringify(collections));
  }, [collections]);

  // Hypothesis Lab State
  const [hypTopic, setHypTopic] = useState('Edge-Computing Autonomous Agents');
  const [hypObs, setHypObs] = useState('Standard LLM agents require synchronous APIs which fail under poor networks.');
  const [hypGaps, setHypGaps] = useState('Asynchronous feedback loops and micro-cognitive reflection architectures.');
  const [hypLoading, setHypLoading] = useState(false);
  const [hypResult, setHypResult] = useState('');

  // Drafts State
  const [draftSection, setDraftSection] = useState('Introduction');
  const [draftGoal, setDraftGoal] = useState('Draft an engaging introduction demonstrating the latency issue in synchronous agents.');
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftResult, setDraftResult] = useState('');

  // Save credentials helper
  const handleSaveCredentials = (e) => {
    e.preventDefault();
    localStorage.setItem('ibm_apikey', apiKey);
    localStorage.setItem('ibm_projectid', projectId);
    localStorage.setItem('ibm_region', region);
    localStorage.setItem('ibm_modelid', modelId);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Clear credentials
  const handleClearCredentials = () => {
    localStorage.removeItem('ibm_apikey');
    localStorage.removeItem('ibm_projectid');
    setApiKey('');
    setProjectId('');
  };

  // Perform ArXiv Search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(searchQuery)}&sortBy=${searchSort}`);
      const data = await res.json();
      if (data.success) {
        setPapers(data.papers);
      } else {
        setSearchError(data.error || 'Failed to search ArXiv.');
      }
    } catch (err) {
      setSearchError('Could not communicate with research server. Check if backend is running.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Auto-search on mount if empty
  useEffect(() => {
    handleSearch();
  }, []);

  // Request Granite AI summary for paper
  const handleGetSummary = async (paper) => {
    setSummaryLoading(true);
    setAiSummary('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-ibm-apikey'] = apiKey;
      if (projectId) headers['x-ibm-projectid'] = projectId;
      headers['x-ibm-region'] = region;
      headers['x-ibm-modelid'] = modelId;

      const res = await fetch(`${API_BASE}/llm/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          promptType: 'summarize',
          customPrompt: `Summarize this scientific paper abstract.
Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Abstract: ${paper.summary}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiSummary(data.choices[0].message.content);
      } else {
        setAiSummary(`Error: ${data.error || 'Failed to generate summary'}`);
      }
    } catch (err) {
      setAiSummary('Error: Server connection timed out.');
    } finally {
      setSummaryLoading(false);
    }
  };

  // Add paper to collection
  const addToCollection = (paper, collectionName) => {
    setCollections(prev => prev.map(coll => {
      if (coll.name === collectionName) {
        // Check if already in collection
        if (coll.papers.some(p => p.id === paper.id)) return coll;
        return {
          ...coll,
          papers: [...coll.papers, { ...paper, notes: '', savedAt: new Date().toISOString() }]
        };
      }
      return coll;
    }));
  };

  // Remove paper from collection
  const removeFromCollection = (paperId, collectionName) => {
    setCollections(prev => prev.map(coll => {
      if (coll.name === collectionName) {
        return {
          ...coll,
          papers: coll.papers.filter(p => p.id !== paperId)
        };
      }
      return coll;
    }));
  };

  // Update paper notes
  const updatePaperNotes = (paperId, collectionName, notes) => {
    setCollections(prev => prev.map(coll => {
      if (coll.name === collectionName) {
        return {
          ...coll,
          papers: coll.papers.map(p => p.id === paperId ? { ...p, notes } : p)
        };
      }
      return coll;
    }));
  };

  // Create Collection
  const createCollection = (e) => {
    e.preventDefault();
    if (!newCollName.trim()) return;
    if (collections.some(c => c.name.toLowerCase() === newCollName.trim().toLowerCase())) return;
    setCollections(prev => [...prev, { name: newCollName.trim(), papers: [] }]);
    setActiveCollectionName(newCollName.trim());
    setNewCollName('');
  };

  // Run Granite Hypothesis Lab
  const handleGenerateHypothesis = async (e) => {
    e.preventDefault();
    setHypLoading(true);
    setHypResult('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-ibm-apikey'] = apiKey;
      if (projectId) headers['x-ibm-projectid'] = projectId;
      headers['x-ibm-region'] = region;
      headers['x-ibm-modelid'] = modelId;

      const res = await fetch(`${API_BASE}/llm/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          promptType: 'hypothesis',
          customPrompt: `Generate a novel scientific hypothesis based on the following:
Research Domain: ${hypTopic}
Key Observations: ${hypObs}
Targeted Research Gaps: ${hypGaps}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setHypResult(data.choices[0].message.content);
      } else {
        setHypResult(`Error generating hypothesis: ${data.error || 'Failed'}`);
      }
    } catch (err) {
      setHypResult('Error: Failed to reach LLM generator.');
    } finally {
      setHypLoading(false);
    }
  };

  // Run Paper Drafting
  const handleGenerateDraft = async (e) => {
    e.preventDefault();
    setDraftLoading(true);
    setDraftResult('');

    // Fetch details of selected references
    const activeCollection = collections.find(c => c.name === activeCollectionName);
    const selectedPapers = activeCollection 
      ? activeCollection.papers.filter(p => selectedPaperIds.includes(p.id))
      : [];

    const referencesContext = selectedPapers.map((p, i) => 
      `Reference [${i+1}]:
Title: ${p.title}
Key Notes: ${p.notes || 'None'}
Abstract: ${p.summary}`
    ).join('\n\n');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-ibm-apikey'] = apiKey;
      if (projectId) headers['x-ibm-projectid'] = projectId;
      headers['x-ibm-region'] = region;
      headers['x-ibm-modelid'] = modelId;

      const res = await fetch(`${API_BASE}/llm/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          promptType: 'draft',
          customPrompt: `Draft a research paper section: "${draftSection}" using IBM Granite.
Section drafting instructions/goal: ${draftGoal}

Synthesize these references if relevant to the section goal:
${referencesContext || 'No references selected. Write a general draft.'}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setDraftResult(data.choices[0].message.content);
      } else {
        setDraftResult(`Error generating draft: ${data.error || 'Failed'}`);
      }
    } catch (err) {
      setDraftResult('Error: Failed to reach server.');
    } finally {
      setDraftLoading(false);
    }
  };

  // Helper: Copy Text to clipboard
  const copyToClipboard = (text, elementId) => {
    navigator.clipboard.writeText(text);
    const el = document.getElementById(elementId);
    if (el) {
      const orig = el.innerText;
      el.innerText = 'Copied!';
      setTimeout(() => el.innerText = orig, 1500);
    }
  };

  // Helper: Download Markdown File
  const downloadMarkdown = (content, filename) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Active Collection References
  const activeCollection = collections.find(c => c.name === activeCollectionName) || collections[0];

  return (
    <div className="app-container" id="app_root">
      
      {/* Sidebar Navigation */}
      <nav className="sidebar" id="sidebar_nav">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
          <span className="logo-text">GraniteAgent</span>
        </div>

        <div className="nav-links">
          <button 
            id="nav_btn_search"
            className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <SearchIcon />
            Search & Explore
          </button>
          
          <button 
            id="nav_btn_library"
            className={`nav-item ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            <LibraryIcon />
            Reference Library
          </button>

          <button 
            id="nav_btn_lab"
            className={`nav-item ${activeTab === 'hypothesis' ? 'active' : ''}`}
            onClick={() => setActiveTab('hypothesis')}
          >
            <LabIcon />
            Hypothesis Lab
          </button>

          <button 
            id="nav_btn_drafts"
            className={`nav-item ${activeTab === 'drafts' ? 'active' : ''}`}
            onClick={() => setActiveTab('drafts')}
          >
            <DraftIcon />
            Report Workspace
          </button>

          <button 
            id="nav_btn_settings"
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon />
            Settings & API
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="mode-badge">
            <span>LLM Mode</span>
            <span className={`badge ${apiKey && projectId ? 'badge-cyan' : 'badge-purple'}`}>
              {apiKey && projectId ? 'Live Granite' : 'Simulator'}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Container Area */}
      <main className="main-content" id="main_layout">
        
        {/* Header Bar */}
        <header className="header-bar" id="header_bar">
          <div className="header-title-container">
            <h1>
              {activeTab === 'search' && 'Literature Search Engine'}
              {activeTab === 'library' && 'Reference Library Manager'}
              {activeTab === 'hypothesis' && 'IBM Granite Hypothesis Lab'}
              {activeTab === 'drafts' && 'Research Section Builder'}
              {activeTab === 'settings' && 'Workspace Configuration'}
            </h1>
          </div>

          <div className="header-meta">
            <div className="conn-status" id="indicator_status">
              <span className={`conn-dot ${apiKey && projectId ? 'live' : 'demo'}`}></span>
              <span>{apiKey && projectId ? 'Live watsonx.ai (Granite-3)' : 'Granite Simulation Mode'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic View Panel */}
        <div className="view-area" id="view_area">
          
          {/* TAB 1: SEARCH & EXPLORE */}
          {activeTab === 'search' && (
            <div id="tab_search">
              <div className="search-header">
                <h2>Autonomous Literature Retrieval</h2>
                <p className="search-description">
                  Query the public ArXiv academic catalog for scientific literature. Retrieve, summarize and index reference materials directly.
                </p>
              </div>

              <form onSubmit={handleSearch} className="search-controls" id="search_form">
                <div className="search-input-wrapper">
                  <SearchIcon />
                  <input 
                    type="text" 
                    id="search_query_input"
                    className="glass-input" 
                    placeholder="Enter keywords (e.g. quantum machine learning, transformers, deep reinforcement)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="search-filters">
                  <select 
                    id="search_sort_select"
                    className="glass-select"
                    value={searchSort}
                    onChange={(e) => setSearchSort(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="lastUpdatedDate">Latest Papers</option>
                    <option value="submittedDate">Submitted Date</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-search" id="search_submit_btn">
                  Search
                </button>
              </form>

              {searchLoading ? (
                <div className="loader-container" id="search_loader">
                  <div className="glass-spinner"></div>
                  <span className="loader-text">Retreiving scholarly articles...</span>
                </div>
              ) : searchError ? (
                <div className="glass-panel" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} id="search_error_box">
                  {searchError}
                </div>
              ) : papers.length === 0 ? (
                <div className="empty-state" id="search_empty_state">
                  <SearchIcon />
                  <h3>No research papers found</h3>
                  <p>Try refining your search queries or keywords</p>
                </div>
              ) : (
                <div className="results-grid" id="search_results_grid">
                  {papers.map((paper) => (
                    <div key={paper.id} className="glass-panel paper-card">
                      <div className="paper-card-header">
                        <span className="badge badge-purple">{paper.arxivId.split('v')[0]}</span>
                        <span className="paper-date">{new Date(paper.published).toLocaleDateString()}</span>
                      </div>
                      
                      <h3 
                        className="paper-title"
                        onClick={() => {
                          setSelectedPaper(paper);
                          handleGetSummary(paper);
                        }}
                      >
                        {paper.title}
                      </h3>
                      
                      <div className="paper-authors">
                        {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}
                      </div>
                      
                      <p className="paper-abstract">{paper.summary}</p>
                      
                      <div className="paper-card-footer">
                        <a 
                          href={paper.pdfLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          View PDF
                        </a>

                        <div className="paper-actions">
                          <button 
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => {
                              addToCollection(paper, activeCollectionName);
                              // Trigger custom alert style
                              const notify = document.getElementById(`notify_${paper.arxivId}`);
                              if (notify) {
                                notify.innerText = 'Added!';
                                notify.style.opacity = 1;
                                setTimeout(() => notify.style.opacity = 0, 1500);
                              }
                            }}
                          >
                            Save
                          </button>
                          <span 
                            id={`notify_${paper.arxivId}`}
                            style={{ 
                              fontSize: '0.75rem', 
                              color: 'var(--accent)', 
                              alignSelf: 'center', 
                              opacity: 0, 
                              transition: 'opacity 0.2s' 
                            }}
                          >
                            Added!
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REFERENCE LIBRARY */}
          {activeTab === 'library' && (
            <div id="tab_library" className="references-layout">
              
              {/* Left sidebar: collections list */}
              <div className="collections-sidebar">
                <div className="glass-panel">
                  <h3>Collections</h3>
                  <div className="collections-list" id="collections_list">
                    {collections.map(c => (
                      <button
                        key={c.name}
                        className={`collection-item ${activeCollectionName === c.name ? 'active' : ''}`}
                        onClick={() => setActiveCollectionName(c.name)}
                      >
                        <span>{c.name}</span>
                        <span className="collection-count">{c.papers.length}</span>
                      </button>
                    ))}
                  </div>
                  
                  <form onSubmit={createCollection} className="new-collection-form">
                    <input 
                      type="text" 
                      className="glass-input" 
                      placeholder="New folder..."
                      value={newCollName}
                      onChange={(e) => setNewCollName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>+</button>
                  </form>
                </div>
              </div>

              {/* Right area: references list */}
              <div className="references-container">
                <div className="glass-panel references-header">
                  <div className="collection-title-area">
                    <h2>{activeCollectionName}</h2>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>
                      Manage saved articles, generate formatted citations, and save notes.
                    </p>
                  </div>
                  <div className="collection-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        const bib = activeCollection.papers.map(p => generateCitations(p).bibtex).join('\n\n');
                        downloadMarkdown(bib, `${activeCollectionName.replace(/\s+/g, '_')}_references.bib`);
                      }}
                      disabled={activeCollection.papers.length === 0}
                    >
                      <DownloadIcon /> Export BibTeX
                    </button>
                  </div>
                </div>

                {activeCollection.papers.length === 0 ? (
                  <div className="glass-panel empty-state">
                    <LibraryIcon />
                    <h3>No saved references in this collection</h3>
                    <p>Go to "Search & Explore" tab, query topics, and click "Save" to build your library.</p>
                  </div>
                ) : (
                  activeCollection.papers.map((paper) => {
                    const citations = generateCitations(paper);
                    const selectedStyle = citationStyles[paper.id] || 'apa';

                    return (
                      <div key={paper.id} className="glass-panel reference-card">
                        <div className="reference-meta-row">
                          <div className="reference-details">
                            <h3 className="reference-title">{paper.title}</h3>
                            <div className="reference-authors">{paper.authors.join(', ')}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                              Published: {new Date(paper.published).toLocaleDateString()} | ID: arXiv:{paper.arxivId}
                            </div>
                          </div>
                          
                          <button 
                            className="btn-icon" 
                            style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            onClick={() => removeFromCollection(paper.id, activeCollectionName)}
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        {/* Citation generator */}
                        <div className="citation-section">
                          <div className="citation-tabs">
                            {['apa', 'mla', 'chicago', 'bibtex'].map(style => (
                              <button
                                key={style}
                                className={`citation-tab ${selectedStyle === style ? 'active' : ''}`}
                                onClick={() => setCitationStyles(prev => ({ ...prev, [paper.id]: style }))}
                              >
                                {style.toUpperCase()}
                              </button>
                            ))}
                          </div>

                          <div className="citation-display-wrapper">
                            <div className={`citation-text ${selectedStyle === 'bibtex' ? 'bibtex' : ''}`}>
                              {citations[selectedStyle]}
                            </div>
                            <button 
                              id={`copy_btn_${paper.id}`}
                              className="btn btn-secondary" 
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                              onClick={() => copyToClipboard(citations[selectedStyle], `copy_btn_${paper.id}`)}
                            >
                              <CopyIcon /> Copy
                            </button>
                          </div>
                        </div>

                        {/* User Annotations */}
                        <div className="notes-section">
                          <div className="notes-header">
                            <span className="notes-title">
                              <SparklesIcon /> AI Research Notes & Key Takeaways
                            </span>
                            <span className="save-indicator">Auto-saved to storage</span>
                          </div>
                          <textarea 
                            className="glass-input notes-textarea"
                            placeholder="Add summaries, limitations, methodology details, or notes on how this paper relates to your project..."
                            value={paper.notes || ''}
                            onChange={(e) => updatePaperNotes(paper.id, activeCollectionName, e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HYPOTHESIS LAB */}
          {activeTab === 'hypothesis' && (
            <div id="tab_hypothesis">
              <div className="glass-panel workspace-layout">
                <div className="search-header">
                  <h2>IBM Granite Hypothesis Lab</h2>
                  <p className="search-description">
                    Feed observations and domain parameters to IBM Granite to automatically brainstorm novel, testable hypotheses and experimental criteria.
                  </p>
                </div>

                <div className="workspace-layout">
                  <form onSubmit={handleGenerateHypothesis} className="workspace-form" id="hypothesis_form">
                    <div className="form-group">
                      <label htmlFor="hyp_topic_input">Research Field / Domain Topic</label>
                      <input 
                        type="text" 
                        id="hyp_topic_input"
                        className="glass-input" 
                        value={hypTopic}
                        onChange={(e) => setHypTopic(e.target.value)}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="hyp_obs_input">Empirical Observations / Anomalies</label>
                        <textarea 
                          id="hyp_obs_input"
                          className="glass-input" 
                          style={{ minHeight: '80px' }}
                          value={hypObs}
                          onChange={(e) => setHypObs(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hyp_gaps_input">Core Gaps in Existing Literature</label>
                        <textarea 
                          id="hyp_gaps_input"
                          className="glass-input" 
                          style={{ minHeight: '80px' }}
                          value={hypGaps}
                          onChange={(e) => setHypGaps(e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ padding: '0.8rem 1.5rem', width: '240px' }}
                      disabled={hypLoading}
                      id="hyp_submit_btn"
                    >
                      <SparklesIcon /> {hypLoading ? 'Generating Hypothesis...' : 'Generate AI Hypothesis'}
                    </button>
                  </form>

                  {hypLoading && (
                    <div className="loader-container">
                      <div className="glass-spinner"></div>
                      <span className="loader-text">Analyzing parameters and generating hypothesis framework...</span>
                    </div>
                  )}

                  {hypResult && !hypLoading && (
                    <div className="glass-panel hypothesis-result-panel" id="hypothesis_result_box">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <SparklesIcon /> Formulated Hypothesis Framework
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            id="copy_hyp_btn"
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => copyToClipboard(hypResult, 'copy_hyp_btn')}
                          >
                            <CopyIcon /> Copy
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => downloadMarkdown(hypResult, 'hypothesis_report.md')}
                          >
                            <DownloadIcon /> Download MD
                          </button>
                        </div>
                      </div>

                      {/* Display Markdown formatted details */}
                      <div className="ai-summary-content">
                        {hypResult.split('\n\n').map((paragraph, index) => {
                          if (paragraph.startsWith('### ')) {
                            return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
                          }
                          if (paragraph.startsWith('**') && paragraph.includes('**')) {
                            // Extract key blocks
                            const parts = paragraph.split(':');
                            if (parts.length > 1) {
                              return (
                                <p key={index}>
                                  <strong>{parts[0].replace(/\*\*/g, '')}:</strong> {parts.slice(1).join(':')}
                                </p>
                              );
                            }
                          }
                          if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                            return (
                              <ul key={index}>
                                <li>{paragraph.substring(2)}</li>
                              </ul>
                            );
                          }
                          return <p key={index}>{paragraph}</p>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REPORT WORKSPACE */}
          {activeTab === 'drafts' && (
            <div id="tab_drafts">
              <div className="glass-panel workspace-layout">
                <div className="search-header">
                  <h2>Paper Section Builder</h2>
                  <p className="search-description">
                    Select relevant sources from your library collections and instruct IBM Granite to synthesis literature reviews, introductions, methodologies, or conclusions.
                  </p>
                </div>

                <div className="drafter-layout">
                  {/* Left Controls */}
                  <div className="references-select-panel">
                    <form onSubmit={handleGenerateDraft} className="workspace-form" id="drafts_form">
                      <div className="form-group">
                        <label htmlFor="draft_section_select">Target Manuscript Section</label>
                        <select 
                          id="draft_section_select"
                          className="glass-select"
                          value={draftSection}
                          onChange={(e) => setDraftSection(e.target.value)}
                        >
                          <option value="Introduction">Introduction & Context</option>
                          <option value="Literature Review">Literature Review & Synthesis</option>
                          <option value="Methodology">Proposed Methodology</option>
                          <option value="Discussion">Discussion & Limitations</option>
                          <option value="Conclusion">Conclusion & Future Work</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="draft_goal_input">Drafting Prompt / Specific Goals</label>
                        <textarea 
                          id="draft_goal_input"
                          className="glass-input" 
                          placeholder="e.g. Focus on comparing baseline transformer latency with state-of-the-art edge execution times..."
                          value={draftGoal}
                          onChange={(e) => setDraftGoal(e.target.value)}
                        />
                      </div>

                      {/* Reference Selector checklist */}
                      <div className="form-group">
                        <label>Synthesize Selected References ({selectedPaperIds.length} checked)</label>
                        <p style={{ color: 'var(--text-sub)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          Source Collection: {activeCollectionName}
                        </p>
                        <div className="references-checklist-box">
                          {activeCollection.papers.length === 0 ? (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', padding: '0.5rem' }}>
                              No saved papers in collection.
                            </span>
                          ) : (
                            activeCollection.papers.map(p => (
                              <label key={p.id} className="ref-check-item">
                                <input 
                                  type="checkbox"
                                  checked={selectedPaperIds.includes(p.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPaperIds(prev => [...prev, p.id]);
                                    } else {
                                      setSelectedPaperIds(prev => prev.filter(id => id !== p.id));
                                    }
                                  }}
                                />
                                <span className="ref-check-label">
                                  {p.title.substring(0, 50)}... ({p.authors[0].split(/\s+/).pop() || 'Author'})
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ padding: '0.8rem 1.5rem' }}
                        disabled={draftLoading}
                        id="draft_submit_btn"
                      >
                        <DocumentIcon /> {draftLoading ? 'Generating Draft...' : 'Generate Section Draft'}
                      </button>
                    </form>
                  </div>

                  {/* Right Draft Result */}
                  <div className="draft-output-panel">
                    <div className="glass-panel" style={{ minHeight: '400px' }}>
                      <div className="draft-output-header">
                        <h3 style={{ color: 'var(--primary)' }}>Manuscript Draft Editor</h3>
                        {draftResult && (
                          <div className="draft-output-actions">
                            <button 
                              id="copy_draft_btn"
                              className="btn btn-secondary" 
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              onClick={() => copyToClipboard(draftResult, 'copy_draft_btn')}
                            >
                              <CopyIcon /> Copy Draft
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              onClick={() => downloadMarkdown(draftResult, `draft_${draftSection.toLowerCase().replace(/\s+/g, '_')}.md`)}
                            >
                              <DownloadIcon /> Save .md
                            </button>
                          </div>
                        )}
                      </div>

                      {draftLoading ? (
                        <div className="loader-container">
                          <div className="glass-spinner"></div>
                          <span className="loader-text">Compiling context and synthesizing draft text...</span>
                        </div>
                      ) : draftResult ? (
                        <div className="draft-rendered-content" id="draft_result_content">
                          {draftResult.split('\n\n').map((paragraph, index) => {
                            if (paragraph.startsWith('### ')) {
                              return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
                            }
                            if (paragraph.startsWith('## ')) {
                              return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
                            }
                            return <p key={index}>{paragraph}</p>;
                          })}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <DocumentIcon />
                          <h3>Manuscript Editor empty</h3>
                          <p>Fill out the target section options on the left and click generate to invoke IBM Granite's synthesis engine.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & CREDENTIALS */}
          {activeTab === 'settings' && (
            <div id="tab_settings">
              <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto' }}>
                <div className="search-header">
                  <h2>IBM watsonx.ai Credentials</h2>
                  <p className="search-description">
                    Provide credentials for your IBM Cloud account. When credentials are set, the app will make direct REST queries to Watsonx using Granite-3 models. If empty, the app falls back to Simulated Granite Mode.
                  </p>
                </div>

                <form onSubmit={handleSaveCredentials} className="workspace-form" id="settings_form">
                  <div className="form-group">
                    <label htmlFor="apiKey_input">IBM Cloud API Key</label>
                    <input 
                      type="password" 
                      id="apiKey_input"
                      className="glass-input" 
                      placeholder="e.g. XyZ123... (stored locally in browser storage)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="projectId_input">IBM watsonx.ai Project ID</label>
                    <input 
                      type="text" 
                      id="projectId_input"
                      className="glass-input" 
                      placeholder="e.g. 5ca4d1bc-5690-48ef-b12a-89abcde12345"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="region_select">IBM Watsonx Region</label>
                      <select 
                        id="region_select"
                        className="glass-select"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      >
                        <option value="us-south">Dallas (us-south)</option>
                        <option value="eu-de">Frankfurt (eu-de)</option>
                        <option value="eu-gb">London (eu-gb)</option>
                        <option value="jp-tok">Tokyo (jp-tok)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="model_select">IBM Granite Model ID</label>
                      <select 
                        id="model_select"
                        className="glass-select"
                        value={modelId}
                        onChange={(e) => setModelId(e.target.value)}
                      >
                        <option value="ibm/granite-3-8b-instruct">Granite 3.0 8B Instruct</option>
                        <option value="ibm/granite-3-2b-instruct">Granite 3.0 2B Instruct</option>
                        <option value="ibm/granite-13b-chat-v2">Granite 13B Chat V2</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" id="settings_save_btn">
                      Save Credentials
                    </button>
                    {(apiKey || projectId) && (
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleClearCredentials}
                        id="settings_clear_btn"
                      >
                        Disconnect Credentials
                      </button>
                    )}
                  </div>

                  {isSaved && (
                    <div className="badge badge-cyan" style={{ marginTop: '1rem', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
                      âœ“ Credentials stored securely in local browser memory!
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* PAPER DETAILS & AI SUMMARY OVERLAY DIALOG */}
      {selectedPaper && (
        <div className="paper-detail-overlay" id="paper_detail_overlay">
          <div className="glass-panel paper-detail-content" id="paper_detail_modal">
            <button 
              className="btn btn-icon close-overlay-btn"
              onClick={() => {
                setSelectedPaper(null);
                setAiSummary('');
              }}
              id="close_modal_btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <span className="badge badge-purple" style={{ alignSelf: 'flex-start' }}>arXiv:{selectedPaper.arxivId}</span>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', paddingRight: '2rem' }}>{selectedPaper.title}</h2>
            
            <div className="detail-authors-list">
              <strong>Authors:</strong> {selectedPaper.authors.join(', ')}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
              <strong>Published:</strong> {new Date(selectedPaper.published).toLocaleDateString()}
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Paper Abstract</h3>
              <p className="detail-abstract">{selectedPaper.summary}</p>
            </div>

            {/* AI Summary Section */}
            <div className="ai-summary-box" id="ai_summary_box">
              <h3 className="ai-summary-title">
                <SparklesIcon /> IBM Granite Analysis Summary
              </h3>
              
              {summaryLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <div className="glass-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  <span>Running cognitive paper analysis...</span>
                </div>
              ) : aiSummary ? (
                <div 
                  className="ai-summary-content" 
                  id="ai_summary_content"
                  dangerouslySetInnerHTML={{ 
                    // Make headers look correct and linebreaks work
                    __html: aiSummary
                      .replace(/### (.*)/g, '<h4>$1</h4>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleGetSummary(selectedPaper)}
                  id="modal_generate_summary_btn"
                >
                  Analyze with IBM Granite
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <a 
                href={selectedPaper.pdfLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
              >
                Open Full Paper PDF
              </a>
              <button 
                className="btn btn-secondary"
                onClick={() => addToCollection(selectedPaper, activeCollectionName)}
              >
                Add to Current Collection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

