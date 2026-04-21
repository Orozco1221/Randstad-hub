import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, MessageSquare, Trophy, BarChart3, Search, Plus, Award, 
  Clock, CheckCircle2, ThumbsUp, User, ChevronRight, TrendingUp, 
  BrainCircuit, Coffee, PlayCircle, Library, ExternalLink, ShieldCheck,
  X, Info, Send, Video, FileText, Download, Eye, Sparkles, Loader2,
  MessageCircle, Users, Bell, Filter, CornerDownRight, Star, History,
  ClipboardList, UploadCloud, Lock, AlertTriangle, Share2, Link as LinkIcon,
  Bot, MessageSquareText, Trash2, Edit3, Medal, Crown, Target, ArrowUp,
  Lightbulb, Brain, Paperclip, Mail, LogOut, IdCard, Compass, Zap, CheckCircle
} from 'lucide-react';

// ============================================================================
// CONFIGURACIÓN DE LA API DE IA (GEMINI)
// ============================================================================
const apiKey = ""; 
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const CURRENT_USER_ID = "JP"; 

// ============================================================================
// DATOS DE DEMO DEL PASAPORTE (HARDCODEADOS)
// ============================================================================
const passportData = {
  name: "Juan Pérez",
  role: "Master Prompter",
  xp: 1850,
  nextLevelXp: 2500,
  level: "Explorador",
  levelIcon: Compass,
  nextLevel: "Embajador AI",
  badges: [
    { id: 1, title: "Primer Prompt", icon: Sparkles, achieved: true, date: "10 Mar 2026", desc: "Interactuaste por primera vez con el Asistente IA de la plataforma." },
    { id: 2, title: "Reto Completado", icon: Trophy, achieved: true, date: "15 Mar 2026", desc: "Superaste tu primer desafío técnico con una puntuación perfecta." },
    { id: 3, title: "Cafetería Asistente", icon: Coffee, achieved: true, date: "20 Mar 2026", desc: "Completaste más de 3 módulos de micro-learning inspiracional." },
    { id: 4, title: "Comunidad Activa", icon: MessageCircle, achieved: true, date: "25 Mar 2026", desc: "Recibiste 10 likes de tus compañeros en el foro de debate." },
    { id: 5, title: "Streak 7 días", icon: Zap, achieved: false },
    { id: 6, title: "Master Prompter", icon: Brain, achieved: false },
    { id: 7, title: "AI Visionary", icon: Star, achieved: false },
  ],
  timeline: [
    { id: 1, type: 'comunidad', title: "Aportación top en Comunidad", date: "Hoy, 12:00", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-100 border-white" },
    { id: 2, type: 'reto', title: "Reto 'Optimización IT' entregado", date: "Ayer, 18:30", icon: Zap, color: "text-[#f59e0b]", bg: "bg-amber-100 border-white" },
    { id: 3, type: 'formacion', title: "Módulo 'Master en GenAI'", date: "Hace 3 días", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-100 border-white" },
    { id: 4, type: 'comunidad', title: "Primer comentario en Foro", date: "Hace 5 días", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-100 border-white" },
    { id: 5, type: 'formacion', title: "Guía de Copilot completada", date: "Hace 1 semana", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-100 border-white" },
    { id: 6, type: 'formacion', title: "IA y Reclutamiento Ético", date: "Hace 1 semana", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-100 border-white" },
  ]
};

// ============================================================================
// COMPONENTE AUXILIAR: ANIMACIÓN DE SCROLL
// ============================================================================
const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setIsVisible(entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  const getDirectionClass = () => {
    if (direction === 'up') return isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95';
    if (direction === 'left') return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0';
    if (direction === 'right') return isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0';
    return isVisible ? 'opacity-100' : 'opacity-0';
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out transform ${getDirectionClass()}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// PANTALLA DE INICIO DE SESIÓN
// ============================================================================
const LoginScreen = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 -left-64 w-[600px] h-[600px] bg-blue-200 rounded-full blur-[120px] opacity-30 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 -right-64 w-[600px] h-[600px] bg-purple-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 120 100" className="w-20 h-20 text-[#2761e7]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,35 h30 l15,15 v40 h-15 v-33 l-10,-10 h-20 z" />
            <path d="M110,35 h-30 l-15,15 v40 h15 v-33 l10,-10 h20 z" />
          </svg>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#1e2b7a] uppercase italic tracking-tighter mb-2">Randstad AI Hub</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Acceso Seguro Corporativo</p>
        </div>

        <button onClick={() => handleLogin()} disabled={isLoading} className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-3 font-black text-slate-700 text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>

        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">O con credenciales</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@randstad.es" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none border-2 border-transparent focus:border-[#3b82f6] focus:bg-white transition-all text-sm font-medium text-slate-800" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none border-2 border-transparent focus:border-[#3b82f6] focus:bg-white transition-all text-sm font-medium text-slate-800" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-[#1e2b7a] text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:scale-[1.02] transition-all flex items-center justify-center mt-4">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [selectedPastChallenge, setSelectedPastChallenge] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null); // Nuevo estado para modal de sellos
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddThreadModal, setShowAddThreadModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);
  
  const [forumCategory, setForumCategory] = useState('trending');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiChat, setAiChat] = useState([]);
  
  const [submissionText, setSubmissionText] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [showAllRanking, setShowAllRanking] = useState(false);
  const [aiQuiz, setAiQuiz] = useState(null);
  const [mentorResponse, setMentorResponse] = useState("");

  const [content, setContent] = useState({
    cafeteria: [
      { id: 101, title: 'IA y Reclutamiento Ético', duration: '30 min', instructor: 'Marta Pérez', description: 'Explora cómo evitar sesgos algorítmicos en la selección de talento IT.', shortDesc: 'Identificación de sesgos en algoritmos de selección.', mediaType: 'video', mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 102, title: 'Guía de Copilot para Teams', duration: '15 min', instructor: 'Juan García', description: 'Manual práctico con los mejores atajos de productividad para dominar la IA.', shortDesc: 'Trucos rápidos para maximizar el uso de Copilot en Teams.', mediaType: 'pdf', mediaUrl: '#' },
    ],
    pills: [
      { id: 201, title: '3 trucos de Prompting', duration: '2 min', views: '1.2k', description: 'Mejora tus mensajes en LinkedIn para atraer perfiles técnicos.', shortDesc: 'LinkedIn + IA: Triplica tu tasa de respuesta.', mediaType: 'video', mediaUrl: '#' },
      { id: 202, title: 'Generación de JD con IA', duration: '3 min', views: '850', description: 'Cómo estructurar ofertas de empleo en segundos con ayuda de GPT-4.', shortDesc: 'Crea ofertas de empleo atractivas en segundos.', mediaType: 'video', mediaUrl: '#' },
    ],
    structural: [
      { id: 301, title: 'Master en IA Generativa', duration: '12h', level: 'Experto', description: 'Curso troncal de Randstad Digital enfocado a la transformación estratégica.', shortDesc: 'La base estratégica obligatoria para la consultoría.', mediaType: 'video', mediaUrl: '#' },
    ],
    externalCerts: [
      { id: 401, title: 'AWS Certified AI Practitioner', provider: 'Amazon', link: 'https://aws.amazon.com', description: 'Certificación oficial AWS para profesionales de IA.', shortDesc: 'Ruta oficial de Amazon para IA.' },
      { id: 402, title: 'Google Cloud GenAI Path', provider: 'Google', link: 'https://cloud.google.com', description: 'Ruta oficial de aprendizaje sobre el ecosistema de IA generativa.', shortDesc: 'Cursos gratuitos de Google sobre GenAI.' },
    ],
    forumThreads: [
      { id: 1, title: '¿CÓMO REDACTAR OFERTAS CON CHATGPT?', body: 'He probado varios prompts y el tono "técnico pero cercano" funciona genial para atraer talento.', user: 'ANA M.', avatar: 'AM', category: 'PRODUCTIVIDAD', likes: 15, comments: 2, date: 'HOY, 10:30', likedBy: [], replies: [{ id: 901, userId: 'CP', user: 'Carlos P.', text: 'Yo añado siempre el Stack tecnológico al inicio del prompt.', date: 'Hoy, 11:00' }] },
    ],
    activeChallenge: {
      id: 501, title: "OPTIMIZACIÓN DE SCREENING IT CON LLMS", objective: "Reducir el tiempo de primer filtrado de candidatos en un 40% usando prompts estructurados.", description: "Crea un prompt que tome un CV en formato texto y una Job Description, y devuelva un JSON con el % de compatibilidad.", deadline: "VENCE EN 12 DÍAS", rewardPoints: 200
    },
    pastChallenges: [
      { id: 500, title: "EMAILS DE CAPTACIÓN MAGNÉTICOS", objective: "Mejorar apertura", description: "Secuencia de correos IA.", winner: "MARCOS SOTO", score: 5, date: "15 MAR", bestResponse: "Actúa como un reclutador senior de 10 años. Analiza el perfil LinkedIn y redacta un mensaje corto, sin jerga corporativa..." }
    ],
    ranking: [
      { id: '1', name: 'ANA MARTÍNEZ', points: 2850, tier: 'AI Visionary', avatar: 'AM' },
      { id: '2', name: 'CARLOS PÉREZ', points: 2420, tier: 'AI Strategist', avatar: 'CP' },
      { id: '3', name: 'MARTA SOTO', points: 2100, tier: 'AI Explorer', avatar: 'MS' },
      { id: 'JP', name: 'JUAN PÉREZ (TÚ)', points: 1850, tier: 'AI Explorer', avatar: 'JP' },
      { id: '5', name: 'ELENA BELMONTE', points: 1950, tier: 'AI Explorer', avatar: 'EB' },
      { id: '6', name: 'DAVID RUIZ', points: 1900, tier: 'AI Explorer', avatar: 'DR' },
    ]
  });

  const sortedRanking = [...content.ranking].sort((a, b) => b.points - a.points).map((u, i) => ({...u, position: i+1}));
  const myIndex = sortedRanking.findIndex(u => u.id === CURRENT_USER_ID);
  const podiumUsers = sortedRanking.slice(0, 3);
  const getDisplayRanking = () => showAllRanking ? sortedRanking : sortedRanking.slice(Math.max(0, myIndex - 2), Math.min(sortedRanking.length, myIndex + 3));
  
  const selectedThread = content.forumThreads.find(t => t.id === selectedThreadId);

  // --- LÓGICA GEMINI API ---
  const callGemini = async (prompt, systemInstruction = "", retries = 0) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
        })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (err) {
      if (retries < 5) {
        await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
        return callGemini(prompt, systemInstruction, retries + 1);
      }
      return "Error de conexión con la IA.";
    }
  };

  const evaluateChallenge = async () => {
    if (!submissionText.trim()) return;
    setIsEvaluating(true);
    const res = await callGemini(`Evalúa: ${submissionText}`, `Juez Senior. JSON: {"score": number, "feedback": string}`);
    try { 
      const cleaned = res.replace(/```json|```/g, "").trim();
      setEvaluation(JSON.parse(cleaned)); 
    } catch (e) { setEvaluation({ score: 3, feedback: "Análisis completado satisfactoriamente." }); }
    setIsEvaluating(false);
  };

  const askTutor = async (q) => {
    if (!q.trim() || !selectedItem) return;
    setAiChat(prev => [...prev, { role: 'user', text: q }]);
    setIsAiLoading(true);
    const res = await callGemini(`Duda ${selectedItem.data.title}: ${q}`, "Tutor Randstad IA.");
    setAiChat(prev => [...prev, { role: 'ai', text: res }]);
    setIsAiLoading(false);
  };

  const generateSummary = async (item) => {
    setAiSummary(""); setIsAiLoading(true);
    const res = await callGemini(`Resume en 3 puntos clave: ${item.description}`, "Experto Randstad.");
    setAiSummary(res); setIsAiLoading(false);
  };

  const askMentor = async () => {
    setIsAiLoading(true);
    const res = await callGemini(`Puesto #${sortedRanking[myIndex].position}. Consejos para subir.`, "Mentor IA.");
    setMentorResponse(res); setIsAiLoading(false);
  };

  const generateQuiz = async (item) => {
    setIsAiLoading(true);
    const res = await callGemini(`Crea un quiz JSON de 3 preguntas sobre: ${item.title}. Formato: [{"q": "...", "a": ["...", "..."], "correct": 0}]`, "Tutor IA.");
    try { setAiQuiz(JSON.parse(res.replace(/```json|```/g, "").trim())); } catch (e) { }
    setIsAiLoading(false);
  };

  const suggestDescription = async (title, setDesc) => {
    if (!title.trim()) return;
    setIsAiLoading(true);
    const res = await callGemini(`Descripción profesional breve para: "${title}"`, "Directo.");
    setDesc(res); setIsAiLoading(false);
  };

  // --- GESTIÓN CRUD ---
  const addItem = (category, newItem) => {
    setContent(prev => ({ 
      ...prev, 
      [category]: [...prev[category], { 
        ...newItem, id: Date.now(), instructor: 'Admin', points: 50, duration: 'Variable', views: '0', shortDesc: newItem.description.substring(0, 50) + '...'
      }] 
    }));
    setShowAddModal(false);
  };

  const likeThread = (id) => {
    setContent(prev => ({
      ...prev,
      forumThreads: prev.forumThreads.map(t => {
        if (t.id === id) {
          const hasLiked = t.likedBy.includes(CURRENT_USER_ID);
          return { ...t, likes: hasLiked ? t.likes - 1 : t.likes + 1, likedBy: hasLiked ? t.likedBy.filter(u => u !== CURRENT_USER_ID) : [...t.likedBy, CURRENT_USER_ID] };
        }
        return t;
      })
    }));
  };

  const saveEditReply = (threadId, replyId) => {
    setContent(prev => ({
      ...prev,
      forumThreads: prev.forumThreads.map(t => t.id === threadId ? { ...t, replies: t.replies.map(r => r.id === replyId ? { ...r, text: editValue } : r) } : t)
    }));
    setEditingReplyId(null);
  };

  const deleteReply = (threadId, replyId) => {
    setContent(prev => ({
      ...prev,
      forumThreads: prev.forumThreads.map(t => t.id === threadId ? { ...t, comments: t.comments - 1, replies: t.replies.filter(r => r.id !== replyId) } : t)
    }));
  };

  const addReply = (threadId, text) => {
    const newReply = { id: Date.now(), userId: CURRENT_USER_ID, user: 'Juan Pérez', text, date: 'Ahora' };
    setContent(prev => ({ ...prev, forumThreads: prev.forumThreads.map(t => t.id === threadId ? { ...t, comments: t.comments + 1, replies: [...t.replies, newReply] } : t) }));
  };

  const addThread = (newT) => {
    setContent(prev => ({ ...prev, forumThreads: [{ ...newT, id: Date.now(), avatar: 'JP', user: 'Juan Pérez', comments: 0, likes: 0, likedBy: [], replies: [] }, ...prev.forumThreads] }));
    setShowAddThreadModal(false);
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center p-3 transition-all flex-1 ${activeTab === id ? 'text-[#3b82f6] border-b-2 border-[#3b82f6] font-black' : 'text-[#94a3b8] hover:text-[#3b82f6]'}`}>
      <Icon size={24} />
      <span className="text-[9px] sm:text-[10px] font-bold mt-1 uppercase tracking-widest">{label}</span>
    </button>
  );

  const AddContentForm = ({ category }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('video');
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
        <form className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in duration-300 text-[#1e2b7a]" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); addItem(category, { title, description: desc, mediaUrl: url, mediaType: type }); }}>
          <h3 className="text-xl font-black uppercase italic text-center mb-8 leading-none">AÑADIR MATERIAL</h3>
          <div className="space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button type="button" onClick={() => setType('video')} className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${type === 'video' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>VIDEO</button>
              <button type="button" onClick={() => setType('pdf')} className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${type === 'pdf' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>PDF</button>
            </div>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none font-medium text-sm text-[#1A202C]" placeholder="Título..." required />
            <div className="relative">
              <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none h-24 font-medium text-sm text-[#1A202C] pr-10" placeholder="Descripción..." required />
              <button type="button" onClick={() => suggestDescription(title, setDesc)} disabled={isAiLoading} className="absolute bottom-2 right-2 p-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-30"><Sparkles size={12} /></button>
            </div>
            <input value={url} onChange={e => setUrl(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none font-medium text-sm text-[#1A202C]" placeholder="URL recurso (YouTube, PDF...)" required />
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase italic shadow-lg mt-4">PUBLICAR</button>
          </div>
        </form>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 overflow-x-hidden relative">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="transition-transform hover:scale-105 flex items-center justify-center mr-2">
            <svg viewBox="0 0 120 100" className="w-12 h-12 text-[#2761e7]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,35 h30 l15,15 v40 h-15 v-33 l-10,-10 h-20 z" />
              <path d="M110,35 h-30 l-15,15 v40 h15 v-33 l10,-10 h20 z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">RANDSTAD DIGITAL</h1>
            <p className="text-[10px] text-[#3b82f6] font-black uppercase mt-1 tracking-widest leading-none">AI HUB ADOPCIÓN</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black uppercase text-slate-900 tracking-tighter leading-none">JUAN PÉREZ</p>
            <p className="text-[8px] text-[#3b82f6] font-black uppercase tracking-widest leading-none mt-1">MASTER PROMPTER</p>
            <button onClick={() => setIsAuthenticated(false)} className="text-[8px] text-red-500 font-bold uppercase tracking-widest mt-1 hover:underline flex items-center gap-1 justify-end ml-auto transition-all">
              <LogOut size={10} /> Cerrar Sesión
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-white flex items-center justify-center text-[#3b82f6] font-black shadow-xl ring-1 ring-slate-100 uppercase leading-none">JP</div>
        </div>
      </header>

      {/* --- MODALES --- */}
      {/* Modal 1: Detalle de Curso/Material de la Academy */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => {setSelectedItem(null); setAiQuiz(null);}}>
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center relative min-h-[400px]">
              {selectedItem.cat === 'externalCerts' ? ( <ShieldCheck size={80} className="text-blue-400 opacity-50 animate-pulse" /> ) : selectedItem.data.mediaType === 'video' ? ( <div className="w-full h-full">{selectedItem.data.mediaUrl && selectedItem.data.mediaUrl.includes('embed') ? ( <iframe src={selectedItem.data.mediaUrl} className="w-full h-full" frameBorder="0" allowFullScreen title="video"></iframe> ) : ( <div className="flex flex-col items-center justify-center h-full text-white"><PlayCircle size={84} className="text-blue-500 opacity-90 mb-4" /><p className="text-[10px] font-black uppercase tracking-widest italic">Contenido Multimedia</p></div> )}</div> ) : ( <div className="flex flex-col items-center"><FileText size={100} className="text-red-500 mb-6" /><a href={selectedItem.data.mediaUrl} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-xl leading-none">Descargar PDF</a></div> )}
              <button onClick={() => setSelectedItem(null)} className="absolute top-6 left-6 bg-white/10 p-2 rounded-full text-white md:hidden"><X size={20}/></button>
            </div>
            <div className="w-full md:w-1/2 p-10 flex flex-col bg-white overflow-y-auto relative border-l border-slate-100 text-[#1e2b7a]">
              <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 hidden md:block"><X size={28}/></button>
              <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4 italic leading-none">{selectedItem.cat}</span>
              <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter leading-tight leading-none text-balance">{selectedItem.data.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium italic">"{selectedItem.data.description}"</p>
              
              {selectedItem.cat !== 'externalCerts' && (
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 relative group"><div className="flex justify-between items-center mb-4"><span className="text-[11px] font-black text-blue-600 uppercase flex items-center gap-2 italic tracking-widest leading-none"><Sparkles size={16}/> Resumen IA</span>{!aiSummary && !isAiLoading && <button onClick={() => generateSummary(selectedItem.data)} className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-full font-black uppercase leading-none">Generar ✨</button>}</div>{isAiLoading && !aiChat.length ? <Loader2 className="animate-spin text-blue-400" size={16}/> : <p className="text-[13px] text-blue-900 font-medium italic leading-relaxed">{aiSummary || "Analiza los puntos clave del bloque formativo."}</p>}</div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 leading-none"><Bot size={16} className="text-blue-500" /> Tutor Randstad IA ✨</p><div className="max-h-32 overflow-y-auto space-y-3 mb-4 scrollbar-hide">{aiChat.map((msg, i) => ( <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[90%] p-2.5 rounded-2xl text-[11px] font-medium leading-snug ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-700 shadow-sm'}`}>{msg.text}</div></div> ))}</div><div className="flex gap-2"><input onKeyDown={e => e.key === 'Enter' && askTutor(e.target.value)} className="flex-grow p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600" placeholder="¿Dudas?" /><button className="p-3 bg-slate-950 text-white rounded-xl hover:bg-black transition-all leading-none"><Send size={16}/></button></div></div>
                  {!aiQuiz && <button onClick={() => generateQuiz(selectedItem.data)} className="w-full py-4 border-2 border-dashed border-[#3b82f6] text-[#3b82f6] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 leading-none">✨ Ponerme a prueba (Smart Quiz) ✨</button>}
                  {aiQuiz && <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 animate-in slide-in-from-bottom-2 text-[#1e2b7a]"><p className="text-[10px] font-black uppercase text-amber-600 mb-3 tracking-widest leading-none">Quiz IA</p><p className="text-xs font-bold text-slate-800 mb-4 leading-relaxed">{aiQuiz[0].q}</p><div className="flex flex-wrap gap-2">{aiQuiz[0].a.map((ans, idx) => (<button key={idx} className="px-3 py-2 bg-white border rounded-xl text-[10px] hover:bg-amber-100 transition-all font-medium leading-none">{ans}</button>))}</div></div>}
                </div>
              )}
              <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col gap-3">
                 {selectedItem.cat === 'externalCerts' ? ( <a href={selectedItem.data.link} target="_blank" rel="noreferrer" className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-center flex items-center justify-center gap-3 uppercase shadow-lg hover:bg-blue-700 transition-all leading-none uppercase tracking-widest leading-none">ACCEDER <ExternalLink size={20}/></a> ) : ( <div className="grid grid-cols-2 gap-3"><a href={selectedItem.data.mediaUrl} target="_blank" rel="noreferrer" className="py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg leading-none uppercase tracking-widest leading-none"><Eye size={18}/> Ver Ahora</a><button className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all leading-none uppercase tracking-widest leading-none"><Share2 size={18}/> Compartir</button></div> )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Detalle de un Hilo del Foro (Comunidad) */}
      {selectedThread && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedThreadId(null)}>
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-gray-50 border-b flex justify-between items-center"><span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase leading-none tracking-widest">{selectedThread.category}</span><button onClick={() => setSelectedThreadId(null)}><X size={24}/></button></div>
            <div className="p-8 overflow-y-auto space-y-6 flex-grow text-[#1e2b7a]"><h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight leading-none">{selectedThread.title}</h3><p className="text-slate-700 bg-blue-50/30 p-6 rounded-2xl italic border border-blue-100 leading-relaxed text-pretty">"{selectedThread.body}"</p><div className="flex gap-6 border-y py-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none"><button onClick={() => likeThread(selectedThread.id)} className={`flex items-center gap-2 transition-all ${selectedThread.likedBy.includes(CURRENT_USER_ID) ? 'text-blue-600 font-black' : ''}`}><ThumbsUp size={16} fill={selectedThread.likedBy.includes(CURRENT_USER_ID) ? "currentColor" : "none"}/> {selectedThread.likes} Likes</button><div className="flex items-center gap-2 leading-none"><MessageCircle size={16}/> {selectedThread.comments} Comentarios</div></div><div className="space-y-4 pt-4">{selectedThread.replies.map((r) => (<div key={r.id} className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 relative group animate-in slide-in-from-left-2"><div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><CornerDownRight size={16}/></div><div className="flex-grow"><p className="font-black text-[9px] text-blue-600 uppercase mb-1 leading-none">{r.user}</p>{editingReplyId === r.id ? (<div className="mt-2 space-y-2"><textarea value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full p-3 border rounded-xl text-sm outline-none text-slate-700" /><div className="flex gap-2"><button onClick={() => saveEditReply(selectedThread.id, r.id)} className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg shadow-sm">GUARDAR</button><button onClick={() => setEditingReplyId(null)} className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg shadow-sm">CANCELAR</button></div></div>) : ( <p className="text-sm text-slate-700">{r.text}</p> )}</div>{r.userId === CURRENT_USER_ID && editingReplyId !== r.id && (<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditingReplyId(r.id); setEditValue(r.text); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit3 size={14}/></button><button onClick={() => deleteReply(selectedThread.id, r.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button></div>)}</div>))}</div></div><div className="p-6 border-t bg-white flex gap-3"><input onKeyDown={e => { if(e.key === 'Enter' && e.target.value.trim()){ addReply(selectedThread.id, e.target.value); e.target.value = ''; }}} className="w-full p-4 bg-slate-50 rounded-2xl border outline-none text-sm font-medium" placeholder="Aporta tu visión técnica..." /></div>
          </div>
        </div>
      )}

      {/* Modal 3: Histórico de Respuestas en Retos */}
      {selectedPastChallenge && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedPastChallenge(null)}>
          <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in" onClick={e => e.stopPropagation()}><div className="w-full md:w-1/2 bg-slate-50 p-12 border-r border-slate-100 overflow-y-auto text-[#1e2b7a]"><h3 className="text-3xl font-black text-[#1e2b7a] uppercase italic mb-6 tracking-tighter leading-tight leading-none">{selectedPastChallenge.title}</h3><div className="space-y-8"><div><h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 leading-none flex items-center gap-2 uppercase leading-none"><Target size={14}/> Objetivo</h4><p className="text-sm font-semibold text-slate-800 leading-relaxed leading-none">{selectedPastChallenge.objective}</p></div><div><h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 leading-none flex items-center gap-2 uppercase leading-none"><FileText size={14}/> Descripción</h4><p className="text-sm text-slate-500 italic leading-relaxed">"{selectedPastChallenge.description}"</p></div></div></div><div className="w-full md:w-1/2 p-12 relative flex flex-col overflow-y-auto text-[#1e2b7a]"><button onClick={() => setSelectedPastChallenge(null)} className="absolute top-10 right-10 hover:rotate-90 transition-transform"><X size={28}/></button><div className="mb-8"><div className="flex items-center gap-3 mb-5"><div className="p-3 bg-amber-100 rounded-2xl shadow-sm"><Award className="text-[#f59e0b]" size={28}/></div><h4 className="text-xl font-black text-[#1e2b7a] uppercase italic tracking-tighter leading-none uppercase leading-none">Respuesta de Oro</h4></div><div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-[2.5rem] text-[13px] italic text-amber-950 shadow-sm leading-relaxed relative leading-none text-balance leading-relaxed"><span className="text-4xl text-amber-200 absolute -top-2 -left-2 opacity-50">"</span>{selectedPastChallenge.bestResponse}<span className="text-4xl text-amber-200 absolute -bottom-6 -right-2 opacity-50">"</span></div><div className="flex gap-1.5 mt-6 justify-center">{[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-[#f59e0b] fill-[#f59e0b]" />)}</div></div><p className="text-[10px] text-slate-400 font-bold uppercase mt-auto bg-slate-100 p-4 rounded-2xl text-center tracking-widest italic leading-none uppercase leading-none">RETO FINALIZADO</p></div></div>
        </div>
      )}

      {/* Modal 4: Detalle de Sello (Pasaporte) */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedBadge(null)}>
          <div className="bg-white rounded-[3rem] w-full max-w-sm p-10 shadow-2xl flex flex-col items-center text-center animate-in zoom-in" onClick={e => e.stopPropagation()}>
            <div className="w-24 h-24 bg-blue-50 text-[#3b82f6] rounded-full flex items-center justify-center mb-6 relative">
              <selectedBadge.icon size={40} />
              <div className="absolute -bottom-2 right-0 bg-[#f59e0b] text-white p-1.5 rounded-full shadow-lg"><CheckCircle size={20}/></div>
            </div>
            <span className="text-[10px] font-black bg-[#f1f5f9] text-[#64748b] px-3 py-1 rounded-full uppercase tracking-widest mb-4">{selectedBadge.date}</span>
            <h3 className="text-2xl font-black text-[#1e2b7a] uppercase italic tracking-tighter leading-tight mb-4">{selectedBadge.title}</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">"{selectedBadge.desc}"</p>
            <button onClick={() => setSelectedBadge(null)} className="w-full py-4 bg-[#1e2b7a] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-blue-900 transition-colors">CERRAR</button>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 pt-4 pb-40">
        
        {/* ACADEMY TAB ✨ DISEÑO PREMIUM SIN HUECOS Y CON TODA LA FUNCIONALIDAD */}
        {activeTab === 'courses' && (
          <div className="space-y-16 relative">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1e2b7a 1px, transparent 1px), linear-gradient(90deg, #1e2b7a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {['cafeteria', 'pills', 'structural', 'externalCerts'].map((cat, sIdx) => (
              <ScrollReveal key={cat} delay={sIdx * 100}>
                <div className={`p-1 w-full rounded-[4.5rem] bg-gradient-to-br shadow-xl relative z-10 ${cat === 'cafeteria' ? 'from-amber-200/50 to-transparent' : cat === 'pills' ? 'from-purple-200/50 to-transparent' : cat === 'structural' ? 'from-blue-200/50 to-transparent' : 'from-green-200/50 to-transparent'}`}>
                  <div className={`p-10 rounded-[4.4rem] bg-white/70 backdrop-blur-3xl relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 w-2 h-full ${cat === 'cafeteria' ? 'bg-amber-400' : cat === 'pills' ? 'bg-purple-400' : cat === 'structural' ? 'bg-blue-400' : 'bg-green-400'}`} />

                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10 text-[#1e2b7a]">
                      <div className="flex items-center gap-6">
                        <div className={`p-5 rounded-[2rem] shadow-xl ${cat === 'cafeteria' ? 'bg-amber-100 text-amber-600 shadow-amber-200/30' : cat === 'pills' ? 'bg-purple-100 text-purple-600 shadow-purple-200/30' : cat === 'structural' ? 'bg-blue-100 text-blue-600 shadow-blue-200/30' : 'bg-green-100 text-green-600 shadow-green-200/30'}`}>
                          {cat === 'cafeteria' ? <Coffee size={36}/> : cat === 'pills' ? <TrendingUp size={36}/> : cat === 'structural' ? <Library size={36}/> : <ShieldCheck size={36}/>}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{cat === 'cafeteria' ? 'CafeterIA' : cat === 'pills' ? 'TikTok Learning' : cat === 'structural' ? 'Estructurales' : 'Certificaciones'}</h2>
                            <span className="px-3 py-1 bg-white shadow-inner text-slate-400 text-[9px] font-black rounded-full uppercase tracking-widest leading-none">{content[cat].length} Unidades</span>
                          </div>
                          <p className="text-xs font-black uppercase mt-2 tracking-[0.2em] leading-none opacity-40 italic">
                            {cat === 'cafeteria' ? 'Inspiración de 30 min' : cat === 'pills' ? 'Píldoras rápidas' : cat === 'structural' ? 'Ejes Randstad' : 'Estándares de mercado'}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => {setTargetCategory(cat); setShowAddModal(true);}} className={`mt-10 px-6 py-4 text-white rounded-[2rem] shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-black uppercase text-[10px] italic tracking-widest leading-none group ${cat === 'cafeteria' ? 'bg-amber-600' : cat === 'pills' ? 'bg-purple-600' : cat === 'structural' ? 'bg-[#3b82f6]' : 'bg-green-600'}`}>
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Añadir Material
                      </button>
                    </div>

                    <div className={cat === 'pills' ? "flex gap-8 overflow-x-auto pb-10 scrollbar-hide px-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"}>
                      {content[cat].map((item) => (
                        <div key={item.id} onClick={() => setSelectedItem({ data: item, cat })} className={cat === 'pills' ? "min-w-[280px] h-[440px] bg-slate-900 rounded-[4rem] relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] cursor-pointer hover:scale-[1.03] transition-all border-4 border-white/10" : `group bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative h-full flex flex-col border-b-8 ${cat === 'cafeteria' ? 'hover:border-b-amber-500 border-b-transparent' : cat === 'structural' ? 'hover:border-b-blue-600 border-b-transparent' : 'hover:border-b-green-500 border-b-transparent'}`}>
                          {cat === 'pills' ? (
                            <div className="absolute bottom-12 left-10 right-10 z-20 text-white">
                              <p className="text-2xl font-black uppercase italic leading-tight tracking-tighter mb-4 leading-none">{item.title}</p>
                              <p className="text-white/40 text-xs font-medium leading-relaxed line-clamp-2 italic mb-8 leading-none">"{item.shortDesc}"</p>
                              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                <span className="font-black text-white/40 uppercase tracking-widest text-[10px] leading-none">{item.duration}</span>
                                <div className="p-4 bg-purple-600 rounded-[1.8rem] text-white shadow-xl shadow-purple-600/30 group-hover:scale-110 transition-transform leading-none"><PlayCircle size={32} /></div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col text-[#1e2b7a]">
                              <div className="flex justify-between items-start mb-10">
                                <div className={`p-5 rounded-3xl ${cat === 'cafeteria' ? 'bg-amber-50 text-amber-600' : cat === 'structural' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'} shadow-sm group-hover:rotate-6 transition-transform duration-500`}>
                                  {cat === 'cafeteria' ? <Coffee size={36}/> : cat === 'structural' ? <Library size={36}/> : <ShieldCheck size={36}/>}
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl text-slate-200 group-hover:text-blue-600 transition-colors leading-none leading-none"><ChevronRight size={24}/></div>
                              </div>
                              <h4 className={`font-black text-2xl uppercase italic tracking-tighter leading-[1.1] mb-6 transition-colors ${cat === 'cafeteria' ? 'group-hover:text-amber-600' : cat === 'structural' ? 'group-hover:text-blue-600' : 'group-hover:text-green-600'}`}>{item.title}</h4>
                              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 line-clamp-3 italic leading-relaxed text-pretty leading-relaxed">"{item.shortDesc}"</p>
                              <div className="mt-auto border-t border-slate-50 pt-8 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                <span className="flex items-center gap-2">{item.provider || 'RANDSTAD'}</span>
                                <span className={`px-4 py-2 rounded-2xl font-black ${cat === 'cafeteria' ? 'text-amber-600 bg-amber-50' : cat === 'structural' ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50'}`}>{item.duration || 'OFICIAL'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* --- COMUNIDAD --- */}
        {activeTab === 'forum' && (
          <div className="animate-in fade-in duration-300 text-[#1e2b7a]">
             <div className="flex justify-between items-start mb-10 text-[#1e2b7a]"><div><h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none uppercase leading-none">COMUNIDAD IA</h2><p className="text-[#94a3b8] font-bold text-[12px] mt-2 tracking-widest uppercase italic leading-none">Debate con expertos de Randstad Digital.</p></div><button onClick={() => setShowAddThreadModal(true)} className="bg-[#3b82f6] text-white px-8 py-4 rounded-[1.2rem] font-black uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2 italic tracking-widest leading-none leading-none"><Plus size={24}/> NUEVO TEMA</button></div>
             <div className="grid grid-cols-12 gap-8 text-[#1e2b7a]"><aside className="col-span-3 text-[#1e2b7a]"><ScrollReveal direction="left"><div className="bg-white p-8 rounded-[1.5rem] shadow-sm h-fit"><h3 className="text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.2em] mb-6 uppercase leading-none">Categorías</h3>{['PRODUCTIVIDAD', 'CONSULTORÍA', 'LEGAL', 'HERRAMIENTAS'].map(cat => (<div key={cat} className="flex justify-between items-center mb-4 text-[10px] font-black text-[#64748b] hover:text-[#3b82f6] cursor-pointer group uppercase leading-none"><span className="group-hover:translate-x-1 transition-transform">{cat}</span><span className="text-[#cbd5e1]">12</span></div>))}</div></ScrollReveal></aside><div className="col-span-9"><div className="flex gap-10 border-b border-slate-100 mb-8 px-2 font-black text-[10px] tracking-widest text-[#94a3b8] leading-none">{['TRENDING', 'NEW', 'VISTOS'].map(fCat => (<button key={fCat} onClick={() => setForumCategory(fCat.toLowerCase())} className={`pb-4 transition-all ${forumCategory === fCat.toLowerCase() ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : ''}`}>{fCat}</button>))}</div><div className="space-y-6">{content.forumThreads.map((thread, idx) => (<ScrollReveal key={thread.id} direction="up" delay={idx * 100}><div onClick={() => setSelectedThreadId(thread.id)} className="bg-white p-8 rounded-[1.8rem] shadow-sm border border-[#f1f5f9] flex items-center justify-between group hover:shadow-md transition-all cursor-pointer text-[#1e2b7a]"><div className="flex items-center gap-6"><div className={`w-14 h-14 rounded-[1.2rem] ${thread.avatar === 'AM' ? 'bg-[#ff7e3b]' : 'bg-[#3b82f6]'} text-white flex items-center justify-center font-black text-md shadow-md uppercase leading-none`}>{thread.avatar}</div><div><h4 className="font-black text-md text-[#1e2b7a] uppercase italic group-hover:text-[#3b82f6] transition-colors leading-tight leading-none leading-none">{thread.title}</h4><p className="text-[10px] font-bold text-[#94a3b8] uppercase mt-1 leading-none">POR {thread.user}</p></div></div><div className="flex items-center gap-10"><span className="bg-[#f1f5f9] px-4 py-1.5 rounded-full text-[9px] font-black text-[#64748b] tracking-widest uppercase leading-none leading-none">{thread.category}</span><div className="flex items-center gap-1 text-[#64748b] font-black text-sm w-8 leading-none"><span>{thread.comments}</span></div><button onClick={(e) => { e.stopPropagation(); likeThread(thread.id); }} className={`flex items-center gap-1 font-black text-sm w-10 transition-all ${thread.likedBy.includes(CURRENT_USER_ID) ? 'text-[#3b82f6] scale-110' : 'text-slate-300 hover:text-[#3b82f6]'}`}><ThumbsUp size={16} fill={thread.likedBy.includes(CURRENT_USER_ID) ? "currentColor" : "none"} /> <span>{thread.likes}</span></button><span className="text-[9px] font-black text-[#cbd5e1] uppercase tracking-tighter leading-none leading-none">{thread.date}</span></div></div></ScrollReveal>))}</div></div></div>
          </div>
        )}

        {/* --- RETOS --- */}
        {activeTab === 'challenges' && (
          <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-16 text-[#1e2b7a]"><ScrollReveal direction="up" delay={100}><div className="bg-[#243782] p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-16 items-center"><div className="flex-1 space-y-10"><div className="flex items-center gap-2 bg-[#1a2b7a] w-fit px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 italic leading-none"><Clock size={14} className="text-[#3b82f6]" /> {content.activeChallenge.deadline}</div><h3 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.95] uppercase leading-none">{content.activeChallenge.title}</h3><div className="bg-[#1a2b7a]/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm space-y-4"><div className="flex items-center gap-2 text-[#3b82f6] font-black text-[10px] uppercase tracking-widest leading-none"><Trophy size={16}/> OBJETIVO DEL RETO</div><p className="text-md font-medium leading-relaxed leading-none">{content.activeChallenge.objective}</p></div><p className="text-white/40 text-[13px] italic leading-relaxed pl-4 border-l-2 border-[#3b82f6]/40 leading-none">"{content.activeChallenge.description}"</p></div><div className="w-full md:w-[450px] bg-white rounded-[3rem] p-10 shadow-2xl self-stretch flex flex-col justify-center text-[#1e2b7a]">{!evaluation ? (<div className="space-y-8"><div className="flex justify-between items-center"><h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none uppercase text-pretty">TU PROPUESTA</h3><span className="text-[11px] font-black text-[#f59e0b] leading-none uppercase leading-none">+ {content.activeChallenge.rewardPoints} XP</span></div><div className="relative group"><textarea value={submissionText} onChange={e => setSubmissionText(e.target.value)} className="w-full p-6 bg-[#f8fafc] border-2 border-slate-100 rounded-[2rem] h-48 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 text-slate-800 leading-relaxed leading-none" placeholder="Prompt..." /><div className="absolute bottom-6 right-6 text-slate-200"><UploadCloud size={28} /></div></div><button onClick={evaluateChallenge} disabled={isEvaluating || !submissionText.trim()} className="w-full py-6 bg-[#96b5f6] text-white rounded-[2rem] font-black uppercase italic shadow-xl hover:bg-[#3b82f6] transition-all flex items-center justify-center gap-4 disabled:opacity-50 italic leading-none leading-none">{isEvaluating ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />} {isEvaluating ? 'EVALUANDO...' : 'ENTREGAR ✨'}</button></div>) : (<div className="animate-in zoom-in text-center space-y-6 text-[#1e2b7a]"><p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest leading-none uppercase leading-none">RESULTADO FINAL</p><div className="flex justify-center gap-2">{[1,2,3,4,5].map(i => <Star key={i} size={40} className={i <= evaluation.score ? "text-[#f59e0b] fill-[#f59e0b] drop-shadow-md" : "text-slate-100"} />)}</div><p className="text-6xl font-black text-[#1e2b7a] italic leading-none">{evaluation.score}<span className="text-2xl opacity-20">/5</span></p><p className="bg-slate-50 p-6 rounded-2xl text-[12px] italic text-[#64748b] leading-relaxed">"{evaluation.feedback}"</p><button onClick={() => setEvaluation(null)} className="text-[10px] font-black uppercase text-[#3b82f6] underline tracking-widest leading-none leading-none uppercase">REINTENTAR</button></div>)}</div></div></ScrollReveal><section className="space-y-10 text-[#1e2b7a]"><ScrollReveal direction="up"><div className="flex items-center gap-4 text-[#1e2b7a]"><div className="p-4 bg-white rounded-3xl shadow-sm text-[#1e2b7a]"><History size={28}/></div><div><h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none text-balance uppercase leading-none">Repositorio Histórico</h3><p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest mt-1 uppercase leading-none">Aprende de los mejores retos finalizados</p></div></div></ScrollReveal><div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#1e2b7a]">{content.pastChallenges.map((past, idx) => (<ScrollReveal key={past.id} direction="up" delay={idx * 100}><div onClick={() => setSelectedPastChallenge(past)} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#f1f5f9] flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer text-[#1e2b7a]"><div><div className="flex gap-4 mb-3 text-[9px] font-black uppercase tracking-widest leading-none"><span className="bg-[#1e2b7a] text-white px-3 py-1 rounded-full italic uppercase leading-none">CERRADO</span><span className="text-[#94a3b8] py-1 leading-none">{past.date}</span></div><h4 className="font-black text-xl text-[#1e2b7a] uppercase italic group-hover:text-[#3b82f6] transition-colors leading-tight leading-none leading-none">{past.title}</h4><p className="text-[9px] font-bold text-[#94a3b8] uppercase mt-2 italic flex items-center gap-2 tracking-widest leading-none uppercase leading-none uppercase leading-none">🏆 DESTACADO: <span className="text-[#3b82f6] font-black">{past.winner}</span></p></div><div className="flex flex-col items-end gap-3"><div className="flex gap-1">{[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= past.score ? "text-[#f59e0b] fill-[#f59e0b]" : "text-slate-100"} />)}</div><div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-300 group-hover:bg-[#3b82f6] group-hover:text-white transition-all shadow-inner leading-none leading-none leading-none leading-none"><ChevronRight size={24}/></div></div></div></ScrollReveal>))}</div></section></div>
        )}

        {/* --- RANKING --- */}
        {activeTab === 'ranking' && (
          <div className="animate-in fade-in duration-500 space-y-16 text-[#1e2b7a]">
            <ScrollReveal direction="none">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none uppercase">LÍDERES DE ADOPCIÓN IA</h2>
                <p className="text-[#94a3b8] font-bold text-xs uppercase tracking-[0.3em] leading-none uppercase">RECONOCIMIENTO AL TALENTO Y LA INNOVACIÓN</p>
              </div>
            </ScrollReveal>

            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 mb-20 px-4 text-[#1e2b7a]">
              {podiumUsers[1] && (
                <div className="order-2 md:order-1 flex-1 max-w-[280px] w-full">
                  <ScrollReveal direction="up" delay={200}>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-slate-200 mb-4 relative uppercase shadow-md leading-none">
                        <span className="text-2xl font-black text-slate-300 italic">{podiumUsers[1].avatar}</span>
                        <div className="absolute -top-3 -right-3 bg-slate-300 text-white p-1.5 rounded-xl shadow-lg leading-none"><Medal size={20}/></div>
                      </div>
                      <div className="bg-white w-full p-8 rounded-t-[3rem] shadow-sm border-x border-t border-slate-100 h-40 text-center flex flex-col justify-center text-[#1e2b7a]">
                        <p className="text-[10px] font-black text-slate-400 mb-1 leading-none uppercase">#2</p>
                        <p className="font-black text-[#1e2b7a] uppercase italic text-sm leading-tight leading-none">{podiumUsers[1].name}</p>
                        <p className="text-blue-500 font-black text-lg mt-2 leading-none">{podiumUsers[1].points} <span className="text-[10px] opacity-40 uppercase">XP</span></p>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              )}
              {podiumUsers[0] && (
                <div className="order-1 md:order-2 flex-1 max-w-[320px] w-full z-10">
                  <ScrollReveal direction="up" delay={0}>
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-28 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center border-4 border-[#f59e0b] mb-4 relative scale-110 uppercase text-[#1e2b7a] shadow-lg leading-none">
                        <span className="text-4xl font-black text-[#f59e0b] italic">{podiumUsers[0].avatar}</span>
                        <div className="absolute -top-6 bg-[#f59e0b] text-white px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 font-black text-[10px] uppercase italic tracking-widest animate-bounce leading-none"><Crown size={14}/> LÍDER</div>
                      </div>
                      <div className="bg-white w-full p-10 rounded-t-[4rem] shadow-2xl border-x border-t border-[#f1f5f9] h-56 text-center flex flex-col justify-center ring-4 ring-[#3b82f6]/5 text-[#1e2b7a]">
                        <p className="text-[11px] font-black text-[#f59e0b] mb-1 leading-none uppercase">#1</p>
                        <p className="font-black text-[#1e2b7a] uppercase italic text-lg leading-tight leading-none">{podiumUsers[0].name}</p>
                        <p className="text-[#3b82f6] font-black text-2xl mt-3 leading-none uppercase">{podiumUsers[0].points} <span className="text-xs opacity-40 uppercase leading-none">XP</span></p>
                        <span className="text-[9px] font-black bg-blue-50 text-[#3b82f6] px-3 py-1 rounded-full w-fit mx-auto mt-4 tracking-widest leading-none uppercase">{podiumUsers[0].tier}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              )}
              {podiumUsers[2] && (
                <div className="order-3 md:order-3 flex-1 max-w-[280px] w-full">
                  <ScrollReveal direction="up" delay={400}>
                    <div className="flex flex-col items-center text-[#1e2b7a]">
                      <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-amber-600/30 mb-4 relative uppercase shadow-md leading-none">
                        <span className="text-2xl font-black text-amber-700/40 italic">{podiumUsers[2].avatar}</span>
                        <div className="absolute -top-3 -right-3 bg-amber-700 text-white p-1.5 rounded-xl shadow-lg leading-none"><Medal size={20}/></div>
                      </div>
                      <div className="bg-white w-full p-8 rounded-t-[3rem] shadow-sm border-x border-t border-slate-100 h-32 text-center flex flex-col justify-center text-[#1e2b7a]">
                        <p className="text-[10px] font-black text-slate-400 mb-1 leading-none uppercase">#3</p>
                        <p className="font-black text-[#1e2b7a] uppercase italic text-sm leading-tight leading-none">{podiumUsers[2].name}</p>
                        <p className="text-blue-500 font-black text-lg mt-2 leading-none">{podiumUsers[2].points} <span className="text-[10px] opacity-40 uppercase">XP</span></p>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              )}
            </div>
            
            <ScrollReveal direction="none">
              <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1e2b7a] to-[#3b82f6] p-8 rounded-[3rem] shadow-2xl text-white flex flex-col gap-6 relative overflow-hidden group mb-12">
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center font-black text-2xl text-white shadow-inner uppercase leading-none">JP</div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1 flex items-center gap-2 leading-none uppercase">TU POSICIÓN ACTUAL</p>
                      <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none uppercase">JUAN PÉREZ <span className="text-blue-300 opacity-50 ml-2">#{sortedRanking[myIndex].position}</span></h4>
                    </div>
                  </div>
                  <div className="text-right text-white">
                    <p className="text-4xl font-black italic leading-none">{sortedRanking[myIndex].points} <span className="text-sm opacity-50 uppercase leading-none">XP</span></p>
                    <span className="text-[9px] font-black bg-white text-[#1e2b7a] px-3 py-1 rounded-lg uppercase tracking-widest mt-3 inline-block leading-none uppercase">{sortedRanking[myIndex].tier}</span>
                  </div>
                </div>
                <div className="relative z-10 pt-4 border-t border-white/10 flex gap-4">
                  <button onClick={askMentor} disabled={isAiLoading} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 leading-none text-white uppercase"><Lightbulb size={14} /> ✨ Mentor de IA ✨</button>
                  {mentorResponse && <div className="mt-4 p-4 bg-white/10 rounded-2xl text-[11px] font-medium italic animate-in fade-in slide-in-from-top-2 leading-none text-white leading-relaxed">"{mentorResponse}"</div>}
                </div>
                <Sparkles className="absolute -right-10 top-0 text-white/5 w-64 h-64 -rotate-12" />
              </div>
            </ScrollReveal>
            
            <div className="max-w-4xl mx-auto text-[#1e2b7a]">
              <div className="flex justify-between px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 leading-none text-right">
                <span>RANGO / PROFESIONAL</span><span className="text-right uppercase">TIER / TOTAL XP</span>
              </div>
              <div className={`transition-all duration-500 overflow-hidden ${showAllRanking ? 'max-h-[700px] overflow-y-auto pr-2' : 'max-h-[500px]'}`}>
                <div className="space-y-4">
                  {getDisplayRanking().map((user) => (
                    <div key={user.id} className={`p-6 px-10 bg-white border border-[#f1f5f9] rounded-[2rem] flex items-center justify-between group hover:shadow-lg transition-all ${user.id === CURRENT_USER_ID ? 'ring-2 ring-[#3b82f6] shadow-md bg-blue-50/10' : 'shadow-sm'}`}>
                      <div className="flex items-center gap-6 text-[#1e2b7a]">
                        <span className={`text-sm font-black italic w-6 leading-none ${user.id === CURRENT_USER_ID ? 'text-[#3b82f6]' : 'text-slate-300'}`}>{user.position}</span>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs uppercase ${user.id === CURRENT_USER_ID ? 'bg-[#3b82f6] text-white shadow-lg' : 'bg-slate-50 text-slate-400 shadow-inner'}`}>{user.avatar}</div>
                        <div>
                          <p className={`font-black text-sm uppercase italic leading-none ${user.id === CURRENT_USER_ID ? 'text-[#3b82f6]' : 'text-[#1e2b7a]'}`}>{user.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">{user.tier} </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase leading-none ${user.tier === 'AI Visionary' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>{user.tier}</span>
                        <p className="text-lg font-black italic text-[#1e2b7a] w-20 text-right leading-none uppercase">{user.points} <span className="text-[9px] opacity-20 uppercase leading-none">XP</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8 text-center">
                <button onClick={() => setShowAllRanking(!showAllRanking)} className="px-10 py-4 bg-white text-[#1e2b7a] border-2 border-[#f1f5f9] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#1e2b7a] hover:text-white transition-all shadow-sm mx-auto flex items-center gap-2 italic leading-none">
                  {showAllRanking ? <><ArrowUp size={14}/> MOSTRAR MENOS</> : <><ChevronRight className="rotate-90" size={14}/> VER EL RANKING COMPLETO (TOP 25)</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- NUEVA PESTAÑA: PASAPORTE ✨ --- */}
        {activeTab === 'passport' && (
          <div className="animate-in fade-in duration-500 space-y-16 text-[#1e2b7a]">
            
            <ScrollReveal direction="none">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none uppercase">PASAPORTE</h2>
                <p className="text-[#94a3b8] font-bold text-xs uppercase tracking-[0.3em] leading-none uppercase">TU IDENTIDAD EN EL HUB</p>
              </div>
            </ScrollReveal>

            {/* BLOQUE 1: PORTADA DEL PASAPORTE */}
            <ScrollReveal direction="up">
              <div className="max-w-2xl mx-auto bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group">
                 {/* Fondo decorativo */}
                 <div className="absolute top-0 -left-10 w-40 h-40 bg-[#f59e0b] rounded-full blur-[80px] opacity-20 pointer-events-none" />
                 <div className="absolute bottom-0 -right-10 w-40 h-40 bg-[#3b82f6] rounded-full blur-[80px] opacity-10 pointer-events-none" />

                 <div className="w-28 h-28 bg-[#f59e0b] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg mb-6 ring-4 ring-amber-50 uppercase z-10">JP</div>
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-2 z-10">{passportData.name}</h3>
                 <p className="text-[#3b82f6] font-bold uppercase tracking-widest text-sm mb-8 z-10">{passportData.role}</p>
                 
                 <div className="w-full bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 z-10">
                   <div className="flex justify-between items-end mb-4">
                     <div className="flex items-center gap-2 text-slate-700 font-black uppercase tracking-widest text-sm">
                       <passportData.levelIcon size={20} className="text-[#f59e0b]"/> {passportData.level}
                     </div>
                     <div className="text-right">
                       <span className="text-2xl font-black italic text-[#1e2b7a] leading-none">{passportData.xp}</span>
                       <span className="text-xs text-slate-400 font-bold ml-1 uppercase leading-none">XP</span>
                     </div>
                   </div>
                   <div className="h-4 bg-slate-200 rounded-full w-full overflow-hidden relative">
                     <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f59e0b] to-amber-300 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(passportData.xp / passportData.nextLevelXp) * 100}%` }}></div>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest text-right leading-none">Siguiente nivel: {passportData.nextLevel} ({passportData.nextLevelXp} XP)</p>
                 </div>
              </div>
            </ScrollReveal>

            {/* BLOQUE 2: SELLOS DE EXPERIENCIA */}
            <ScrollReveal direction="up" delay={100}>
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-white rounded-3xl shadow-sm"><Award size={28} className="text-[#1e2b7a]"/></div>
                  <div><h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">SELLOS</h3><p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest mt-1">Tus logros en el Hub</p></div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    {passportData.badges.map(badge => (
                      <div key={badge.id} onClick={() => badge.achieved && setSelectedBadge(badge)} className={`flex flex-col items-center text-center group ${badge.achieved ? 'cursor-pointer hover:-translate-y-2' : 'opacity-60 cursor-not-allowed'} transition-all`}>
                         <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-4 relative shadow-sm transition-colors ${badge.achieved ? 'bg-blue-50 text-[#3b82f6] group-hover:bg-blue-100 group-hover:shadow-md' : 'bg-slate-50 text-slate-400'}`}>
                           <badge.icon size={32} />
                           {badge.achieved ? (
                             <div className="absolute -top-2 -right-2 bg-[#f59e0b] text-white p-1 rounded-full shadow-md"><CheckCircle size={14}/></div>
                           ) : (
                             <div className="absolute -bottom-2 -right-2 bg-slate-200 text-slate-500 p-1.5 rounded-full"><Lock size={12}/></div>
                           )}
                         </div>
                         <span className={`text-[10px] font-black uppercase tracking-widest leading-tight ${badge.achieved ? 'text-[#1e2b7a]' : 'text-slate-400'}`}>{badge.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* BLOQUE 3: CERTIFICACIONES */}
            <ScrollReveal direction="up" delay={200}>
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-white rounded-3xl shadow-sm"><ShieldCheck size={28} className="text-[#1e2b7a]"/></div>
                  <div><h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">CERTIFICACIONES</h3><p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest mt-1">Itinerarios completados</p></div>
                </div>
                {/* Empty State Motivacional */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3.5rem] p-12 flex flex-col items-center text-center hover:bg-slate-100 transition-colors">
                  <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-300 mb-6"><Medal size={40}/></div>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs italic mb-3">AÚN NO HAY CERTIFICACIONES</p>
                  <p className="text-slate-400 text-sm font-medium">Completa tu primer itinerario oficial para obtener y compartir tu certificado.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* BLOQUE 4: HISTORIAL DE VIAJE */}
            <ScrollReveal direction="up" delay={300}>
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                  <div className="p-4 bg-white rounded-3xl shadow-sm"><History size={28} className="text-[#1e2b7a]"/></div>
                  <div><h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">MI VIAJE</h3><p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest mt-1">Tu evolución en el Hub</p></div>
                </div>
                <div className="relative pl-6 md:pl-10 space-y-8 pb-10">
                  {/* Línea central del timeline */}
                  <div className="absolute left-[2.2rem] md:left-[3.2rem] top-4 bottom-0 w-1 bg-blue-100 rounded-full"></div>
                  
                  {passportData.timeline.map((h, idx) => (
                    <div key={h.id} className="relative flex items-center gap-6 group">
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 ${h.bg} ${h.color}`}>
                        <h.icon size={18} />
                      </div>
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1 hover:shadow-md transition-all">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 leading-none">{h.date}</p>
                        <p className="font-black text-[#1e2b7a] text-sm uppercase italic leading-none">{h.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </main>

      {/* --- NAVEGACIÓN INFERIOR (5 ICONOS) --- */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-40">
        <div className="bg-white/90 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] p-2.5 flex justify-between items-center">
          <NavItem id="courses" icon={BookOpen} label="ACADEMY" />
          <NavItem id="forum" icon={MessageCircle} label="COMUNIDAD" />
          <NavItem id="challenges" icon={Trophy} label="RETOS" />
          <NavItem id="ranking" icon={BarChart3} label="RANKING" />
          <NavItem id="passport" icon={IdCard} label="PASAPORTE" />
        </div>
      </nav>

    </div>
  );
};

export default App;