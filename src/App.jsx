import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ArrowRight, Download, Play, Pause, Loader2, Upload, Trash2, 
  Settings, Eye, Save, ShieldAlert, Lock, AlertTriangle, Send, 
  Activity, Users, Database, Cpu, HardDrive, Network, HelpCircle, 
  VolumeX, MessageCircle, Zap, Rocket, Home, Filter, CheckCircle, 
  XCircle, FileText, ChevronRight, LogOut, BarChart, List, FileDown, User, Globe, Target, FolderHeart, Clock, Archive
} from 'lucide-react';

// --- CONFIGURATION ---
const OPENROUTER_API_KEY = "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";
const SEARCH_MODEL = "google/gemini-2.0-flash-001";
const BATCH_SIZE = 5;

// --- STYLES ---
const styles = {
  body: { backgroundColor: '#05070a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', backgroundImage: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%)', backgroundAttachment: 'fixed', margin: 0, padding: 0 },
  glass: { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
  button: { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', padding: '14px 28px', borderRadius: '16px', border: 'none', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  input: { background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '14px 18px', color: 'white', outline: 'none', transition: 'border 0.3s ease' },
  badge: (color) => ({ padding: '4px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${color}40`, backgroundColor: `${color}15`, color: color }),
  card: { background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '24px' }
};

// --- AGGRESSIVE NAME CLEANER ---
const cleanName = (text) => {
  if (!text || text.toLowerCase().includes("not found") || text.toLowerCase().includes("error")) return "Executive";
  
  let clean = text
    .replace(/\*+/g, '') 
    .replace(/^.*?yields:\s*/gi, '')
    .replace(/^.*?found this name:\s*/gi, '')
    .replace(/^.*?is:\s*/gi, '')
    .replace(/^.*?associated with.*?is\s+/gi, '')
    .replace(/The CEO.*?is /gi, '')
    .replace(/.*? is the /gi, '')
    .replace(/ is /gi, '')
    .replace(/Current CEO is /gi, '')
    .replace(/[0-9]/g, '') 
    .replace(/\b(Dr|Mr|Mrs|Ms|Prof|Cpt|Sgt)\.?\s+/gi, '')
    .replace(/,?\s+(Jr|Sr|II|III|IV|V|MBA|PhD|CPA|Esq)\.?$/gi, '')
    .replace(/[.,;:]+$/, '');

  if (clean.includes('\n')) clean = clean.split('\n')[0];
  if (clean.includes(',')) clean = clean.split(',')[0];

  clean = clean.trim();

  const words = clean.split(/\s+/);
  if (words.length > 4 || clean.length > 30) {
      const capWords = words.filter(w => /^[A-Z]/.test(w));
      if (capWords.length >= 2) return `${capWords[0]} ${capWords[1]}`;
      return "Executive";
  }
  
  if (words.length < 2) return clean || "Executive";
  return clean;
};

const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => { window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
};

// --- SYSTEM MONITOR ---
const SystemMonitor = () => {
  const [stats, setStats] = useState({ cpu: 12, ram: 45, net: 518 });
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({ cpu: Math.floor(Math.random() * 20) + 10, ram: Math.floor(Math.random() * 10) + 35, net: Math.floor(Math.random() * 100) + 450 });
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '10px', width: '180px', zIndex: 100 }}>
       <div style={{ ...styles.glass, padding: '12px', fontSize: '10px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span style={{ color: '#64748b', fontWeight: '800' }}>CPU_CORE</span><span style={{ color: '#818cf8', fontWeight: '900' }}>{stats.cpu}%</span></div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}><div style={{ height: '100%', width: `${stats.cpu}%`, background: '#818cf8', borderRadius: '2px' }}></div></div>
       </div>
       <div style={{ ...styles.glass, padding: '12px', fontSize: '10px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span style={{ color: '#64748b', fontWeight: '800' }}>MEMORY</span><span style={{ color: '#818cf8', fontWeight: '900' }}>{stats.ram}%</span></div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}><div style={{ height: '100%', width: `${stats.ram}%`, background: '#818cf8', borderRadius: '2px' }}></div></div>
       </div>
       <div style={{ ...styles.glass, padding: '12px', fontSize: '10px', borderRadius: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span style={{ color: '#64748b', fontWeight: '800' }}>UPLINK</span><span style={{ color: '#10b981', fontWeight: '900' }}>{stats.net} Mb/s</span></div></div>
    </div>
  );
};

// --- LOGIN ---
const LoginScreen = ({ onLogin }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');
  const handleLogin = (e) => {
    e.preventDefault();
    const val = inputKey.trim();
    if (val.toLowerCase() === 'peace') { onLogin({ username: 'Peace', limit: 2000 }); } 
    else if (val === 'Titobilove123@' || val === 'Ceowork123@') { onLogin({ username: 'Admin', limit: Infinity }); } 
    else { setError('Invalid Credentials'); }
  };
  return (
    <div style={{ ...styles.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...styles.glass, width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(79, 70, 229, 0.3)' }}><Rocket color="#818cf8" size={32} /></div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>GEN-X PRO</h1>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Intelligence Suite</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', padding: '12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', textAlign: 'center' }}>{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }}>Access Pass</label>
            <input type="password" value={inputKey} onChange={e => setInputKey(e.target.value)} style={styles.input} placeholder="Enter your pass..." />
          </div>
          <button type="submit" style={styles.button}>Launch protocol <ArrowRight size={18} /></button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [user, setUser] = useStickyState(null, 'genx_user_v4');
  const [usageInfo, setUsageInfo] = useStickyState({ date: new Date().toDateString(), used: 0 }, 'genx_usage_v4');
  const [rawInput, setRawInput] = useStickyState('', 'genx_rawInput_v4');
  const [leads, setLeads] = useStickyState([], 'genx_leads_v4');
  const [domains, setDomains] = useDomainsState([], 'genx_domains_v4');
  const [enrichedData, setEnrichedData] = useStickyState({}, 'genx_enrichedData_v4');
  const [searchQueue, setSearchQueue] = useStickyState([], 'genx_queue_v4');
  const [isSearching, setIsSearching] = useStickyState(false, 'genx_isSearching_v4');
  const [searchLog, setSearchLog] = useStickyState([], 'genx_log_v4');
  const [history, setHistory] = useStickyState([], 'genx_history_v4');
  const [activeTab, setActiveTab] = useState('input');
  const [processing, setProcessing] = useState(false);

  const queueRef = useRef(searchQueue);
  const isSearchingRef = useRef(isSearching);
  const usageRef = useRef(usageInfo);
  const userRef = useRef(user);

  useEffect(() => { queueRef.current = searchQueue; isSearchingRef.current = isSearching; usageRef.current = usageInfo; userRef.current = user; }, [searchQueue, isSearching, usageInfo, user]);

  useEffect(() => {
    const script = document.createElement('script'); script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; script.async = true; document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); }
  }, []);

  useEffect(() => {
    if (user && isSearching && !processing && searchQueue.length > 0) runSearchLoop();
  }, [isSearching]);

  const runSearchLoop = async () => {
    if (processing) return;
    setProcessing(true);
    setSearchLog(prev => [...prev, { domain: 'SYSTEM', result: 'Protocol Initiated...', status: 'OK' }].slice(-150));

    while (isSearchingRef.current && queueRef.current.length > 0) {
      const limit = userRef.current?.limit || 0;
      const currentUsed = usageRef.current?.used || 0;
      if (limit !== Infinity && currentUsed >= limit) { setIsSearching(false); break; }

      const batchSize = Math.min(BATCH_SIZE, (limit === Infinity ? 9999 : limit - used));
      const batch = queueRef.current.slice(0, batchSize);

      const results = await Promise.all(batch.map(async (domain) => {
        let retries = 0; let success = false; let result = "Executive";
        
        while (!success && retries < 2 && isSearchingRef.current) {
          try {
            // EXTREMELY AGGRESSIVE PROMPT
            const prompt = `Identify ANY human leadership figure (CEO, Owner, Principal, Manager, Partner, or Director) associated with the company at domain "${domain}". RETURN ONLY THEIR FIRST AND LAST NAME. Be as aggressive as possible. If you absolutely cannot find a specific name after a deep search, return "Executive". DO NOT RETURN "Not Found".`;
            
            const resp = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_API_KEY}`, 'X-Title': 'GenX' },
              body: JSON.stringify({ model: SEARCH_MODEL, messages: [{ role: 'user', content: prompt }] })
            });

            if (!resp.ok) { result = "Executive"; success = true; continue; }

            const data = await resp.json();
            result = cleanName(data.choices?.[0]?.message?.content?.trim());
            success = true;
          } catch (err) { retries++; await new Promise(r => setTimeout(r, 1500)); }
        }
        return { domain, result };
      }));

      if (!isSearchingRef.current) break;

      setEnrichedData(prev => { const next = { ...prev }; results.forEach(r => next[r.domain] = r.result); return next; });
      setSearchLog(prev => [...prev, ...results.map(r => ({ domain: r.domain, result: r.result, status: (r.result === 'Executive') ? 'WARN' : 'OK' }))].slice(-150));
      
      const nextQueue = queueRef.current.slice(batch.length);
      queueRef.current = nextQueue;
      setSearchQueue([...nextQueue]);
      
      const updatedUsage = { ...usageRef.current, used: usageRef.current.used + batch.length };
      usageRef.current = updatedUsage;
      setUsageInfo(updatedUsage);

      await new Promise(r => setTimeout(r, 1000));
    }
    
    if (queueRef.current.length === 0) setIsSearching(false);
    setProcessing(false);
  };

  const handleStartSearch = () => {
      if (usageInfo.used >= (user?.limit || 0)) { alert("Limit reached."); return; }
      if (searchQueue.length === 0) {
          const nq = domains.filter(d => !enrichedData[d] || enrichedData[d] === "Executive");
          setSearchQueue(nq);
          queueRef.current = nq;
      }
      setIsSearching(true);
  };

  const handleProcess = () => {
    const lines = rawInput.split('\n').filter(l => l.trim());
    const unique = new Map();
    lines.forEach(l => {
      const parts = l.includes(',') ? l.split(',') : l.split(/\s+/);
      const email = parts.find(p => p.includes('@'));
      if (email) { const dom = email.split('@')[1]; unique.set(email.trim().toLowerCase(), { name: parts[0]?.trim() || "User", email: email.trim(), domain: dom }); }
    });
    const ls = Array.from(unique.values());
    setLeads(ls);
    const ds = [...new Set(ls.map(l => l.domain))];
    setDomains(ds);
    const nq = ds.filter(d => !enrichedData[d] || enrichedData[d] === "Executive");
    setSearchQueue(nq);
    queueRef.current = nq; 
    setActiveTab('processing');
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    let allLeads = [];
    for (const file of files) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        if (window.XLSX) {
          const data = await file.arrayBuffer();
          const workbook = window.XLSX.read(data);
          const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
          if (rows.length > 1) {
             const headers = rows[0].map(h => String(h).toLowerCase().trim());
             let nIdx = headers.findIndex(h => h.includes('name')), eIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
             if (nIdx !== -1 && eIdx !== -1) { rows.slice(1).forEach(r => { if (r[nIdx] && r[eIdx]) allLeads.push(`${r[nIdx]}, ${r[eIdx]}`); }); }
          }
        }
      } else {
        const text = await file.text();
        text.split(/\r\n|\n/).filter(l => l.includes('@')).forEach(l => allLeads.push(l));
      }
    }
    setRawInput(prev => prev ? prev + '\n' + allLeads.join('\n') : allLeads.join('\n'));
  };

  const handleArchive = () => {
    if (leads.length === 0) return;
    const newEntry = { id: Date.now(), date: new Date().toLocaleString(), count: leads.length, found: Object.values(enrichedData).filter(v => v !== 'Executive').length, data: leads.map(l => `${enrichedData[l.domain] || 'Executive'}\n${l.name}, ${l.email}\n`).join('\n') };
    setHistory(prev => [newEntry, ...prev]);
    setLeads([]); setDomains([]); setEnrichedData({}); setRawInput(''); setSearchQueue([]); setSearchLog([]);
    setActiveTab('history');
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  };

  const creditsRemaining = user?.limit === Infinity ? '∞' : Math.max(0, user?.limit - usageInfo.used);
  const progress = domains.length > 0 ? Math.round(((domains.length - searchQueue.length) / domains.length) * 100) : 0;

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div style={{ ...styles.body, padding: '32px' }}>
      <SystemMonitor />
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em', textTransform: 'uppercase', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '12px' }}>GEN-X PROTOCOL <Activity color="#6366f1" size={24} /></h1>
          <p style={{ color: '#475569', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Intelligence Suite v4.5 (OP v2)</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ ...styles.glass, padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: '9px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Credits Remaining</div><div style={{ fontSize: '18px', fontWeight: '900', color: 'white' }}>{creditsRemaining}</div></div>
            <div style={{ background: 'rgba(79, 70, 229, 0.2)', padding: '8px', borderRadius: '10px' }}><Zap color="#818cf8" size={20} /></div>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ ...styles.glass, border: 'none', padding: '12px', borderRadius: '16px', cursor: 'pointer', color: '#64748b' }} title="Logout/Reset"><LogOut size={20} /></button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {[
          { id: 'input', label: 'Inbound', icon: FileText },
          { id: 'processing', label: 'Terminal', icon: Activity },
          { id: 'results', label: 'Intelligence', icon: Database },
          { id: 'history', label: 'Archive', icon: FolderHeart }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: activeTab === t.id ? '#4f46e5' : 'rgba(255,255,255,0.03)', color: activeTab === t.id ? 'white' : '#64748b', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: '14px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}><t.icon size={14}/> {t.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {activeTab === 'input' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ ...styles.glass, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#818cf8' }}>Active Stream</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                   <input type="file" multiple accept=".csv,.xlsx,.xls,.txt" onChange={handleFileUpload} style={{ display: 'none' }} id="file-up" />
                   <label htmlFor="file-up" style={{ ...styles.button, padding: '8px 16px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}><Upload size={14} /> Import Leads</label>
                   <button onClick={() => { if(window.confirm("Flush active workspace?")) { setRawInput(''); setLeads([]); setDomains([]); setEnrichedData({}); setSearchQueue([]); } }} style={{ background: 'transparent', border: 'none', color: '#fb7185', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
              <textarea value={rawInput} onChange={e => setRawInput(e.target.value)} style={{ background: 'transparent', border: 'none', padding: '24px', color: '#818cf8', fontFamily: 'monospace', fontSize: '13px', minHeight: '400px', outline: 'none', resize: 'none' }} placeholder="> Paste leads or click 'Import Leads' to upload..." />
              <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={handleProcess} style={{ ...styles.button, width: '100%' }}>Initialize Extraction <ArrowRight size={18} /></button>
              </div>
            </div>
            <div style={styles.glass}><h3 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#475569', marginBottom: '20px' }}>Live Manifest</h3><div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}><div style={{ ...styles.card, padding: '16px' }}><div style={{ fontSize: '9px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Target Leads</div><div style={{ fontSize: '32px', fontWeight: '900' }}>{leads.length}</div></div><div style={{ ...styles.card, padding: '16px' }}><div style={{ fontSize: '9px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Unique Domains</div><div style={{ fontSize: '32px', fontWeight: '900' }}>{domains.length}</div></div></div></div>
          </div>
        )}

        {activeTab === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={styles.glass}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => isSearching ? setIsSearching(false) : handleStartSearch()} style={{ ...styles.button, background: isSearching ? 'rgba(245, 158, 11, 0.1)' : styles.button.background, color: isSearching ? '#f59e0b' : 'white', border: isSearching ? '1px solid rgba(245, 158, 11, 0.2)' : 'none', minWidth: '200px' }}>{isSearching ? <><Pause size={18} fill="currentColor" /> Pause Search</> : <><Play size={18} fill="currentColor" /> Start Search</>}</button>
                <div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px' }}><span style={{ color: '#475569' }}>Progress</span><span style={{ color: '#818cf8' }}>{progress}%</span></div><div style={{ background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '10px', overflow: 'hidden' }}><div style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', height: '100%', width: `${progress}%`, transition: '1s' }}></div></div></div>
              </div>
            </div>
            <div style={{ ...styles.glass, padding: '0', overflow: 'hidden' }}><div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>Engine Terminal</div><div style={{ height: '400px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column-reverse', gap: '8px', fontFamily: 'monospace', fontSize: '11px' }}>{[...searchLog].reverse().map((l, i) => (<div key={i} style={{ display: 'flex', gap: '16px', color: l.status === 'OK' ? '#10b981' : (l.domain === 'SYSTEM' ? '#818cf8' : '#f59e0b'), background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}><span style={{ fontWeight: '800' }}>[{l.status}]</span><span style={{ color: '#64748b' }}>{l.domain}</span><span style={{ color: 'white', fontWeight: '700' }}>{l.result}</span></div>))}</div></div>
          </div>
        )}

        {activeTab === 'results' && (
          <div style={{ ...styles.glass, padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Current Intelligence</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleArchive} disabled={leads.length === 0} style={{ ...styles.button, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '8px 20px', fontSize: '10px', boxShadow: 'none' }}><Archive size={16} /> Archive Batch</button>
                <button onClick={() => downloadFile(leads.map(l => `${enrichedData[l.domain] || 'Executive'}\n${l.name}, ${l.email}\n`).join('\n'), 'GENX_DATA.txt')} style={{ ...styles.button, padding: '8px 20px', fontSize: '10px' }}><FileDown size={16} /> Export File</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}><thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#475569' }}><th style={{ padding: '20px' }}>Contact</th><th style={{ padding: '20px' }}>Executive Found</th><th style={{ padding: '20px' }}>Status</th></tr></thead><tbody style={{ fontSize: '13px' }}>{leads.map((l, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}><td style={{ padding: '20px' }}><div style={{ fontWeight: '700' }}>{l.name}</div><div style={{ fontSize: '10px', color: '#475569' }}>{l.email}</div></td><td style={{ padding: '20px', color: (enrichedData[l.domain] === 'Executive') ? '#f59e0b' : '#818cf8', fontWeight: '800', fontSize: '16px' }}>{enrichedData[l.domain] || 'Pending'}</td><td style={{ padding: '20px' }}><span style={styles.badge(enrichedData[l.domain] ? (enrichedData[l.domain] === 'Executive' ? '#f59e0b' : '#10b981') : '#f59e0b')}>{enrichedData[l.domain] ? (enrichedData[l.domain] === 'Executive' ? 'VERIFIED' : 'COMPLETE') : 'QUEUED'}</span></td></tr>
            ))}</tbody></table></div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {history.length === 0 && <div style={styles.glass}><p style={{ textAlign: 'center', color: '#475569', fontSize: '12px', padding: '40px' }}>Archive is empty. Save a finished batch to see it here.</p></div>}
            {history.map(item => (
              <div key={item.id} style={{ ...styles.glass, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '12px', borderRadius: '14px' }}><Database color="#818cf8" size={24} /></div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: 'white' }}>Batch - {item.count} Leads</div>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}><Clock size={10} /> {item.date} • <Target size={10} /> {item.found} Found</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => downloadFile(item.data, `ARCHIVE_${item.id}.txt`)} style={{ ...styles.button, padding: '10px 20px', fontSize: '10px' }}><FileDown size={16} /> Re-Download</button>
                  <button onClick={() => { if(window.confirm("Delete archive?")) setHistory(prev => prev.filter(h => h.id !== item.id)) }} style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- CUSTOM HOOKS ---
function useDomainsState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => { window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

export default App;