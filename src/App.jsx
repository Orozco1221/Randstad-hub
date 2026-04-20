import React, { useState, useEffect, useRef } from 'react';
// Importación de iconos de la librería lucide-react para la interfaz visual
import { 
  BookOpen, MessageSquare, Trophy, BarChart3, Search, Plus, Award, 
  Clock, CheckCircle2, ThumbsUp, User, ChevronRight, TrendingUp, 
  BrainCircuit, Coffee, PlayCircle, Library, ExternalLink, ShieldCheck,
  X, Info, Send, Video, FileText, Download, Eye, Sparkles, Loader2,
  MessageCircle, Users, Bell, Filter, CornerDownRight, Star, History,
  ClipboardList, UploadCloud, Lock, AlertTriangle, Share2, Link as LinkIcon,
  Bot, MessageSquareText, Trash2, Edit3, Medal, Crown, Target, ArrowUp,
  Lightbulb, Brain, Paperclip
} from 'lucide-react';

// ============================================================================
// CONFIGURACIÓN DE LA API DE IA (GEMINI)
// ============================================================================
const apiKey = ""; // Aquí debe ir la API Key de Google Gemini
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const CURRENT_USER_ID = "JP"; // Identificador del usuario actual simulado

// ============================================================================
// COMPONENTE AUXILIAR: ANIMACIÓN DE SCROLL
// Este componente envuelve otros elementos para que aparezcan suavemente
// cuando el usuario hace scroll y entran en el campo de visión (viewport).
// ============================================================================
const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    // IntersectionObserver detecta cuándo el elemento entra en la pantalla
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setIsVisible(entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  // Determina la clase CSS de animación según la dirección configurada
  const getDirectionClass = () => {
    if (direction === 'up') return isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95';
    if (direction === 'left') return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0';
    if (direction === 'right') return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0';
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
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================
const App = () => {
  // --- 1. ESTADOS DE NAVEGACIÓN Y MODALES ---
  const [activeTab, setActiveTab] = useState('courses'); // Pestaña actual (courses, forum, challenges, ranking)
  const [selectedItem, setSelectedItem] = useState(null); // Curso/Material seleccionado para ver el detalle
  const [selectedThreadId, setSelectedThreadId] = useState(null); // Hilo del foro seleccionado
  const [selectedPastChallenge, setSelectedPastChallenge] = useState(null); // Reto histórico seleccionado
  const [showAddModal, setShowAddModal] = useState(false); // Controla la visibilidad del modal "Añadir Material"
  const [showAddThreadModal, setShowAddThreadModal] = useState(false); // Controla el modal "Nuevo Tema" (Comunidad)
  const [targetCategory, setTargetCategory] = useState(null); // Categoría destino al añadir un nuevo curso
  
  // --- 2. ESTADOS DE IA Y FORMULARIOS ---
  const [forumCategory, setForumCategory] = useState('trending'); // Filtro de la comunidad
  const [isAiLoading, setIsAiLoading] = useState(false); // Indicador de carga general para peticiones a Gemini
  const [aiSummary, setAiSummary] = useState(""); // Guarda el resumen generado por IA de un curso
  const [aiChat, setAiChat] = useState([]); // Historial del chat con el Tutor IA dentro de un curso
  
  const [submissionText, setSubmissionText] = useState(""); // Texto del prompt enviado por el usuario en un Reto
  const [evaluation, setEvaluation] = useState(null); // Resultado (Score y Feedback) de la evaluación del reto por IA
  const [isEvaluating, setIsEvaluating] = useState(false); // Estado de carga específico para la evaluación del reto

  const [editingReplyId, setEditingReplyId] = useState(null); // ID de la respuesta del foro que se está editando
  const [editValue, setEditValue] = useState(""); // Valor del input al editar una respuesta

  const [showAllRanking, setShowAllRanking] = useState(false); // Toggle para mostrar el Top 25 completo o solo los cercanos
  const [aiQuiz, setAiQuiz] = useState(null); // Guarda el Quiz generado por IA para un curso
  const [mentorResponse, setMentorResponse] = useState(""); // Guarda el consejo generado por el Mentor IA en el Ranking

  // --- 3. BASE DE DATOS LOCAL SIMULADA (MOCK DATA) ---
  // Este estado contiene toda la información de la plataforma estructurada por categorías
  const [content, setContent] = useState({
    cafeteria: [
      { id: 101, title: 'IA y Reclutamiento Ético', duration: '30 min', instructor: 'Marta Pérez', description: 'Explora cómo evitar sesgos algorítmicos en la selección de talento IT y asegurar procesos equitativos.', shortDesc: 'Identificación de sesgos en algoritmos de selección.', mediaType: 'video', mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 102, title: 'Guía de Copilot para Teams', duration: '15 min', instructor: 'Juan García', description: 'Manual práctico con los mejores atajos de productividad para dominar la IA.', shortDesc: 'Trucos rápidos para maximizar el uso de Copilot en Teams.', mediaType: 'pdf', mediaUrl: '#' },
    ],
    pills: [
      { id: 201, title: '3 trucos de Prompting', duration: '2 min', views: '1.2k', description: 'Mejora tus mensajes en LinkedIn para atraer perfiles técnicos pasivos.', shortDesc: 'LinkedIn + IA: Triplica tu tasa de respuesta.', mediaType: 'video', mediaUrl: '#' },
      { id: 202, title: 'Generación de JD con IA', duration: '3 min', views: '850', description: 'Cómo estructurar ofertas de empleo en segundos con ayuda de GPT-4.', shortDesc: 'Crea ofertas de empleo atractivas en segundos.', mediaType: 'video', mediaUrl: '#' },
    ],
    structural: [
      { id: 301, title: 'Master en IA Generativa', duration: '12h', level: 'Experto', description: 'Curso troncal de Randstad Digital enfocado a la transformación estratégica del negocio mediante IA.', shortDesc: 'La base estratégica obligatoria para la consultoría del futuro.', mediaType: 'video', mediaUrl: '#' },
    ],
    externalCerts: [
      { id: 401, title: 'AWS Certified AI Practitioner', provider: 'Amazon', link: 'https://aws.amazon.com', description: 'Certificación oficial AWS para profesionales de IA.', shortDesc: 'Ruta oficial de Amazon para IA.' },
      { id: 402, title: 'Google Cloud GenAI Path', provider: 'Google', link: 'https://cloud.google.com', description: 'Ruta oficial de aprendizaje sobre el ecosistema de IA generativa.', shortDesc: 'Cursos gratuitos de Google sobre GenAI.' },
      { id: 403, title: 'Microsoft Certified: Azure AI Fundamentals', provider: 'Microsoft', link: 'https://learn.microsoft.com', description: 'Fundamentos de IA en el ecosistema Azure.', shortDesc: 'Certificación base para Microsoft Azure IA.' },
      { id: 404, title: 'Claude API Fundamentals', provider: 'Anthropic', link: 'https://www.anthropic.com', description: 'Dominio de modelos Claude para desarrollo.', shortDesc: 'Aprende a integrar la API de Anthropic.' },
    ],
    forumThreads: [
      { 
        id: 1, title: '¿CÓMO REDACTAR OFERTAS CON CHATGPT?', body: 'He probado varios prompts y el tono "técnico pero cercano" funciona genial para atraer talento.', user: 'ANA M.', avatar: 'AM', category: 'PRODUCTIVIDAD', likes: 15, comments: 2, date: 'HOY, 10:30', likedBy: [], 
        replies: [
          { id: 901, userId: 'CP', user: 'Carlos P.', text: 'Yo añado siempre el Stack tecnológico al inicio del prompt.', date: 'Hoy, 11:00' },
          { id: 902, userId: 'JP', user: 'Juan Pérez', text: 'Gran aporte Ana, estoy usando estructuras similares con buenos resultados.', date: 'Hoy, 12:00' }
        ] 
      },
    ],
    activeChallenge: {
      id: 501, title: "OPTIMIZACIÓN DE SCREENING IT CON LLMS", objective: "Reducir el tiempo de primer filtrado de candidatos en un 40% usando prompts estructurados.", description: "Crea un prompt que tome un CV en formato texto y una Job Description, y devuelva un JSON con el % de compatibilidad.", deadline: "VENCE EN 12 DÍAS", rewardPoints: 200
    },
    pastChallenges: [
      { id: 500, title: "EMAILS DE CAPTACIÓN MAGNÉTICOS", objective: "Mejorar apertura", description: "Secuencia de correos IA.", winner: "MARCOS SOTO", score: 5, date: "15 MAR", bestResponse: "Actúa como un reclutador senior de 10 años. Analiza el perfil LinkedIn y redacta un mensaje corto, sin jerga corporativa, que destaque un proyecto de Spring Boot mencionado en su Bio..." }
    ],
    ranking: [
      { id: '1', name: 'ANA MARTÍNEZ', points: 2850, tier: 'AI Visionary', avatar: 'AM' },
      { id: '2', name: 'CARLOS PÉREZ', points: 2420, tier: 'AI Strategist', avatar: 'CP' },
      { id: '3', name: 'MARTA SOTO', points: 2100, tier: 'AI Explorer', avatar: 'MS' },
      { id: 'JP', name: 'JUAN PÉREZ (TÚ)', points: 1850, tier: 'AI Explorer', avatar: 'JP' },
      { id: '5', name: 'ELENA BELMONTE', points: 1950, tier: 'AI Explorer', avatar: 'EB' },
      { id: '6', name: 'DAVID RUIZ', points: 1900, tier: 'AI Explorer', avatar: 'DR' },
      { id: '7', name: 'SARA GÓMEZ', points: 1880, tier: 'AI Explorer', avatar: 'SG' },
      { id: '8', name: 'PABLO LÓPEZ', points: 1720, tier: 'AI Learner', avatar: 'PL' },
      { id: '9', name: 'LUCÍA SANZ', points: 1650, tier: 'AI Learner', avatar: 'LS' },
      { id: '10', name: 'RAÚL DÍAZ', points: 1580, tier: 'AI Learner', avatar: 'RD' },
      { id: '11', name: 'MIGUEL ÁNGEL', points: 1400, tier: 'AI Learner', avatar: 'MA' },
      { id: '12', name: 'LAURA MONTES', points: 1350, tier: 'AI Learner', avatar: 'LM' },
      { id: '13', name: 'JORGE CANO', points: 1280, tier: 'AI Learner', avatar: 'JC' },
      { id: '14', name: 'BEATRIZ REY', points: 1200, tier: 'AI Learner', avatar: 'BR' },
      { id: '15', name: 'OSCAR VILA', points: 1150, tier: 'AI Learner', avatar: 'OV' },
      { id: '16', name: 'IRENE LUNA', points: 1100, tier: 'AI Learner', avatar: 'IL' },
      { id: '17', name: 'SERGIO BLANCO', points: 1050, tier: 'AI Learner', avatar: 'SB' },
      { id: '18', name: 'ALICIA ROLDÁN', points: 980, tier: 'AI Learner', avatar: 'AR' },
      { id: '19', name: 'RUBÉN SOLER', points: 920, tier: 'AI Learner', avatar: 'RS' },
      { id: '20', name: 'PAULA MORA', points: 850, tier: 'AI Learner', avatar: 'PM' },
      { id: '21', name: 'MARIO COSTA', points: 800, tier: 'AI Learner', avatar: 'MC' },
      { id: '22', name: 'GEMMA NIETO', points: 750, tier: 'AI Learner', avatar: 'GN' },
      { id: '23', name: 'ALEX PARRA', points: 700, tier: 'AI Learner', avatar: 'AP' },
      { id: '24', name: 'NEREA SALAS', points: 650, tier: 'AI Learner', avatar: 'NS' },
      { id: '25', name: 'BORJA TENA', points: 600, tier: 'AI Learner', avatar: 'BT' },
    ]
  });

  // --- 4. VARIABLES DERIVADAS DEL RANKING ---
  // Ordena a los usuarios por puntos de mayor a menor y les asigna una posición
  const sortedRanking = [...content.ranking].sort((a, b) => b.points - a.points).map((u, i) => ({...u, position: i+1}));
  const myIndex = sortedRanking.findIndex(u => u.id === CURRENT_USER_ID);
  const podiumUsers = sortedRanking.slice(0, 3); // Extrae el Top 3 para el podio visual
  // Determina qué usuarios mostrar en la tabla (Todos o los cercanos al usuario actual)
  const getDisplayRanking = () => showAllRanking ? sortedRanking : sortedRanking.slice(Math.max(0, myIndex - 2), Math.min(sortedRanking.length, myIndex + 3));
  
  // Hilo actualmente seleccionado en la Comunidad
  const selectedThread = content.forumThreads.find(t => t.id === selectedThreadId);

  // ============================================================================
  // INTEGRACIONES CON LA API DE GOOGLE GEMINI (INTELIGENCIA ARTIFICIAL)
  // ============================================================================

  // Función genérica para llamar a la API de Gemini con manejo de reintentos
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
        // Exponential backoff: espera progresivamente más tiempo antes de reintentar
        await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
        return callGemini(prompt, systemInstruction, retries + 1);
      }
      return "Error de conexión con la IA.";
    }
  };

  // Evalúa el prompt enviado por el usuario en la sección "Retos"
  const evaluateChallenge = async () => {
    if (!submissionText.trim()) return;
    setIsEvaluating(true);
    // Instruye a la IA para comportarse como un juez estricto y devolver un JSON
    const res = await callGemini(`Evalúa: ${submissionText}`, `Juez Senior Randstad. JSON: {"score": number, "feedback": string}`);
    try { 
      // Limpia los marcadores Markdown de bloque de código si los incluye la respuesta
      const cleaned = res.replace(/```json|```/g, "").trim();
      setEvaluation(JSON.parse(cleaned)); 
    } catch (e) { 
      // Fallback en caso de que el JSON devuelto esté malformado
      setEvaluation({ score: 3, feedback: "Análisis técnico completado satisfactoriamente." }); 
    }
    setIsEvaluating(false);
  };

  // Chatbot tutor específico dentro del modal de detalle de un curso
  const askTutor = async (q) => {
    if (!q.trim() || !selectedItem) return;
    setAiChat(prev => [...prev, { role: 'user', text: q }]);
    setIsAiLoading(true);
    const res = await callGemini(`Duda curso ${selectedItem.data.title}: ${q}`, "Eres el Tutor IA de Randstad Digital.");
    setAiChat(prev => [...prev, { role: 'ai', text: res }]);
    setIsAiLoading(false);
  };

  // Genera un resumen en 3 viñetas del curso seleccionado
  const generateSummary = async (item) => {
    setAiSummary(""); setIsAiLoading(true);
    const res = await callGemini(`Resume en 3 puntos críticos: ${item.description}`, "Experto Randstad.");
    setAiSummary(res); setIsAiLoading(false);
  };

  // Proporciona consejos personalizados basados en la posición actual del ranking
  const askMentor = async () => {
    setIsAiLoading(true);
    const res = await callGemini(`Mi puesto actual es #${sortedRanking[myIndex].position} con ${sortedRanking[myIndex].points} XP. Dame consejos para subir.`, "Mentor Randstad IA experto en gamificación.");
    setMentorResponse(res);
    setIsAiLoading(false);
  };

  // Genera un mini-examen de 3 preguntas basado en el título del curso
  const generateQuiz = async (item) => {
    setIsAiLoading(true);
    const res = await callGemini(`Crea un quiz JSON de 3 preguntas sobre el curso: ${item.title}. JSON: [{"q": "...", "a": ["...", "..."], "correct": 0}]`, "Tutor IA Randstad.");
    try { 
      setAiQuiz(JSON.parse(res.replace(/```json|```/g, "").trim())); 
    } catch (e) { }
    setIsAiLoading(false);
  };

  // Asistente en el formulario de creación para sugerir descripciones atractivas ("Sparkles")
  const suggestDescription = async (title, setDesc) => {
    if (!title.trim()) return;
    setIsAiLoading(true);
    const res = await callGemini(`Genera una descripción profesional de 2 líneas para un curso corporativo llamado: "${title}"`, "Directo y profesional.");
    setDesc(res); setIsAiLoading(false);
  };

  // ============================================================================
  // FUNCIONES DE GESTIÓN DE DATOS (CRUD LOCAL)
  // ============================================================================

  // Añade un nuevo recurso (video/pdf) a la categoría seleccionada (Cafetería, TikTok, etc.)
  const addItem = (category, newItem) => {
    if (!category) return;
    setContent(prev => ({ 
      ...prev, 
      [category]: [...prev[category], { 
        ...newItem, id: Date.now(), instructor: 'Admin', points: 50, duration: 'Variable', views: '0', shortDesc: newItem.description ? newItem.description.substring(0, 50) + '...' : 'Nueva formación.'
      }] 
    }));
    setShowAddModal(false);
    setTargetCategory(null);
  };

  // Alterna el "Me gusta" de un hilo en la comunidad para el usuario actual
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

  // Guarda la edición de una respuesta en un hilo del foro
  const saveEditReply = (threadId, replyId) => {
    setContent(prev => ({
      ...prev,
      forumThreads: prev.forumThreads.map(t => t.id === threadId ? { ...t, replies: t.replies.map(r => r.id === replyId ? { ...r, text: editValue } : r) } : t)
    }));
    setEditingReplyId(null);
  };

  // Elimina una respuesta en un hilo del foro
  const deleteReply = (threadId, replyId) => {
    setContent(prev => ({
      ...prev,
      forumThreads: prev.forumThreads.map(t => t.id === threadId ? { ...t, comments: t.comments - 1, replies: t.replies.filter(r => r.id !== replyId) } : t)
    }));
  };

  // Añade una nueva respuesta a un hilo existente
  const addReply = (threadId, text) => {
    const newReply = { id: Date.now(), userId: CURRENT_USER_ID, user: 'Juan Pérez', text, date: 'Ahora' };
    setContent(prev => ({ ...prev, forumThreads: prev.forumThreads.map(t => t.id === threadId ? { ...t, comments: t.comments + 1, replies: [...t.replies, newReply] } : t) }));
  };

  // Crea un nuevo hilo de discusión en la comunidad
  const addThread = (newT) => {
    setContent(prev => ({ ...prev, forumThreads: [{ ...newT, id: Date.now(), avatar: 'JP', user: 'Juan Pérez', comments: 0, likes: 0, likedBy: [], replies: [] }, ...prev.forumThreads] }));
    setShowAddThreadModal(false);
  };

  // ============================================================================
  // COMPONENTES UI REUTILIZABLES (INTERNOS)
  // ============================================================================

  // Botón de navegación del menú inferior
  const NavItem = ({ id, icon: Icon, label }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center p-3 transition-all ${activeTab === id ? 'text-[#3b82f6] border-b-2 border-[#3b82f6] font-black' : 'text-[#94a3b8] hover:text-[#3b82f6]'}`}>
      <Icon size={24} />
      <span className="text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">{label}</span>
    </button>
  );

  // Formulario flotante para subir nuevos materiales a la Academy
  const AddContentForm = ({ category }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('video');

    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowAddModal(false)}>
        <form className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in duration-300 text-[#1e2b7a]" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); addItem(category, { title, description: desc, mediaUrl: url, mediaType: type }); }}>
          <h3 className="text-xl font-black uppercase italic text-center mb-8 leading-none">AÑADIR MATERIAL</h3>
          <div className="space-y-4">
            {/* Selector de Tipo (Video/PDF) */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button type="button" onClick={() => setType('video')} className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${type === 'video' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>VIDEO</button>
              <button type="button" onClick={() => setType('pdf')} className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${type === 'pdf' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>PDF</button>
            </div>
            {/* Título */}
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none font-medium text-sm text-[#1A202C]" placeholder="Título del bloque..." required />
            {/* Descripción con Asistente IA */}
            <div className="relative">
              <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none h-24 font-medium text-sm text-[#1A202C] pr-10" placeholder="Descripción técnica..." required />
              {/* Botón Sparkles llama a suggestDescription (Gemini) */}
              <button type="button" onClick={() => suggestDescription(title, setDesc)} disabled={isAiLoading} className="absolute bottom-2 right-2 p-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-30"><Sparkles size={12} /></button>
            </div>
            {/* URL del Recurso */}
            <input value={url} onChange={e => setUrl(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none font-medium text-sm text-[#1A202C]" placeholder="URL recurso (YouTube, PDF...)" required />
            
            {/* Falso input para subir archivos del ordenador (UI Mock) */}
            <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
              <Paperclip size={18} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Adjuntar desde ordenador</span>
              <input type="file" className="hidden" />
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase italic shadow-lg mt-4 hover:bg-blue-700 transition-colors">PUBLICAR</button>
          </div>
        </form>
      </div>
    );
  };

  // ============================================================================
  // RENDERIZADO DE LA INTERFAZ PRINCIPAL (JSX)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 overflow-x-hidden relative">
      
      {/* --------------------------------------------------------- */}
      {/* CABECERA (HEADER FIJO SUPERIOR)                             */}
      {/* --------------------------------------------------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="transition-transform hover:scale-105 flex items-center justify-center mr-2">
            {/* Logo SVG de Randstad */}
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
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-white flex items-center justify-center text-[#3b82f6] font-black shadow-xl ring-1 ring-slate-100 uppercase leading-none">JP</div>
        </div>
      </header>

      {/* --------------------------------------------------------- */}
      {/* ZONA DE MODALES (SUPERPUESTOS)                            */}
      {/* --------------------------------------------------------- */}
      
      {/* Modal 1: Detalle de Curso/Material de la Academy */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => {setSelectedItem(null); setAiQuiz(null);}}>
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            {/* Columna Izquierda: Visor Multimedia (Iframe Youtube o Descargar PDF) */}
            <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center relative min-h-[400px]">
              {selectedItem.cat === 'externalCerts' ? ( <ShieldCheck size={80} className="text-blue-400 opacity-50 animate-pulse" /> ) : selectedItem.data.mediaType === 'video' ? ( <div className="w-full h-full">{selectedItem.data.mediaUrl && selectedItem.data.mediaUrl.includes('embed') ? ( <iframe src={selectedItem.data.mediaUrl} className="w-full h-full" frameBorder="0" allowFullScreen title="video"></iframe> ) : ( <div className="flex flex-col items-center justify-center h-full text-white"><PlayCircle size={84} className="text-blue-500 opacity-90 mb-4" /><p className="text-[10px] font-black uppercase tracking-widest italic">Contenido Multimedia</p></div> )}</div> ) : ( <div className="flex flex-col items-center"><FileText size={100} className="text-red-500 mb-6" /><a href={selectedItem.data.mediaUrl} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-xl leading-none">Descargar PDF</a></div> )}
              <button onClick={() => setSelectedItem(null)} className="absolute top-6 left-6 bg-white/10 p-2 rounded-full text-white md:hidden"><X size={20}/></button>
            </div>
            {/* Columna Derecha: Información y Herramientas IA */}
            <div className="w-full md:w-1/2 p-10 flex flex-col bg-white overflow-y-auto relative border-l border-slate-100 text-[#1e2b7a]">
              <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 hidden md:block"><X size={28}/></button>
              <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4 italic leading-none">{selectedItem.cat}</span>
              <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter leading-tight leading-none text-balance">{selectedItem.data.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium italic">"{selectedItem.data.description}"</p>
              
              {/* Bloques exclusivos para contenido local (No certificaciones externas) */}
              {selectedItem.cat !== 'externalCerts' && (
                <div className="space-y-6">
                  {/* Resumidor IA */}
                  <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 relative group"><div className="flex justify-between items-center mb-4"><span className="text-[11px] font-black text-blue-600 uppercase flex items-center gap-2 italic tracking-widest leading-none"><Sparkles size={16}/> Resumen IA</span>{!aiSummary && !isAiLoading && <button onClick={() => generateSummary(selectedItem.data)} className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-full font-black uppercase leading-none">Generar ✨</button>}</div>{isAiLoading && !aiChat.length ? <Loader2 className="animate-spin text-blue-400" size={16}/> : <p className="text-[13px] text-blue-900 font-medium italic leading-relaxed">{aiSummary || "Analiza los puntos fundamentales del bloque formativo."}</p>}</div>
                  {/* Tutor / Chat IA */}
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 leading-none"><Bot size={16} className="text-blue-500" /> Tutor Randstad IA ✨</p><div className="max-h-32 overflow-y-auto space-y-3 mb-4 scrollbar-hide">{aiChat.map((msg, i) => ( <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[90%] p-2.5 rounded-2xl text-[11px] font-medium leading-snug ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-700 shadow-sm'}`}>{msg.text}</div></div> ))}</div><div className="flex gap-2"><input onKeyDown={e => e.key === 'Enter' && askTutor(e.target.value)} className="flex-grow p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600" placeholder="¿Dudas?" /><button className="p-3 bg-slate-950 text-white rounded-xl hover:bg-black transition-all leading-none"><Send size={16}/></button></div></div>
                  {/* Generador de Quizzes IA */}
                  {!aiQuiz && <button onClick={() => generateQuiz(selectedItem.data)} className="w-full py-4 border-2 border-dashed border-[#3b82f6] text-[#3b82f6] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 leading-none">✨ Ponerme a prueba (Smart Quiz) ✨</button>}
                  {aiQuiz && <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 animate-in slide-in-from-bottom-2 text-[#1e2b7a]"><p className="text-[10px] font-black uppercase text-amber-600 mb-3 tracking-widest leading-none">Quiz IA</p><p className="text-xs font-bold text-slate-800 mb-4 leading-relaxed">{aiQuiz[0].q}</p><div className="flex flex-wrap gap-2">{aiQuiz[0].a.map((ans, idx) => (<button key={idx} className="px-3 py-2 bg-white border rounded-xl text-[10px] hover:bg-amber-100 transition-all font-medium leading-none">{ans}</button>))}</div></div>}
                </div>
              )}
              {/* Botones de Acción (Bottom) */}
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
            <div className="p-8 overflow-y-auto space-y-6 flex-grow text-[#1e2b7a]"><h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight leading-none">{selectedThread.title}</h3><p className="text-slate-700 bg-blue-50/30 p-6 rounded-2xl italic border border-blue-100 leading-relaxed text-pretty">"{selectedThread.body}"</p><div className="flex gap-6 border-y py-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none"><button onClick={() => likeThread(selectedThread.id)} className={`flex items-center gap-2 transition-all ${selectedThread.likedBy.includes(CURRENT_USER_ID) ? 'text-blue-600 font-black' : ''}`}><ThumbsUp size={16} fill={selectedThread.likedBy.includes(CURRENT_USER_ID) ? "currentColor" : "none"}/> {selectedThread.likes} Likes</button><div className="flex items-center gap-2 leading-none"><MessageCircle size={16}/> {selectedThread.comments} Comentarios</div></div><div className="space-y-4 pt-4">{selectedThread.replies.map((r) => (<div key={r.id} className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 relative group animate-in slide-in-from-left-2"><div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><CornerDownRight size={16}/></div><div className="flex-grow"><p className="font-black text-[9px] text-blue-600 uppercase mb-1 leading-none">{r.user}</p>{editingReplyId === r.id ? (<div className="mt-2 space-y-2"><textarea value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full p-3 border rounded-xl text-sm outline-none text-slate-700" /><div className="flex gap-2"><button onClick={() => saveEditReply(selectedThread.id, r.id)} className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg shadow-sm">GUARDAR</button><button onClick={() => setEditingReplyId(null)} className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg shadow-sm">CANCELAR</button></div></div>) : ( <p className="text-sm text-slate-700">{r.text}</p> )}</div>{/* Permite editar/borrar si el mensaje es del usuario actual */}{r.userId === CURRENT_USER_ID && editingReplyId !== r.id && (<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditingReplyId(r.id); setEditValue(r.text); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit3 size={14}/></button><button onClick={() => deleteReply(selectedThread.id, r.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button></div>)}</div>))}</div></div><div className="p-6 border-t bg-white flex gap-3"><input onKeyDown={e => { if(e.key === 'Enter' && e.target.value.trim()){ addReply(selectedThread.id, e.target.value); e.target.value = ''; }}} className="w-full p-4 bg-slate-50 rounded-2xl border outline-none text-sm font-medium" placeholder="Aporta tu visión técnica..." /></div>
          </div>
        </div>
      )}

      {/* Modal 3: Histórico de Respuestas en Retos */}
      {selectedPastChallenge && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedPastChallenge(null)}>
          <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in" onClick={e => e.stopPropagation()}><div className="w-full md:w-1/2 bg-slate-50 p-12 border-r border-slate-100 overflow-y-auto text-[#1e2b7a]"><h3 className="text-3xl font-black text-[#1e2b7a] uppercase italic mb-6 tracking-tighter leading-tight leading-none">{selectedPastChallenge.title}</h3><div className="space-y-8"><div><h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 leading-none flex items-center gap-2 uppercase leading-none"><Target size={14}/> Objetivo</h4><p className="text-sm font-semibold text-slate-800 leading-relaxed leading-none">{selectedPastChallenge.objective}</p></div><div><h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 leading-none flex items-center gap-2 uppercase leading-none"><FileText size={14}/> Descripción</h4><p className="text-sm text-slate-500 italic leading-relaxed">"{selectedPastChallenge.description}"</p></div></div></div><div className="w-full md:w-1/2 p-12 relative flex flex-col overflow-y-auto text-[#1e2b7a]"><button onClick={() => setSelectedPastChallenge(null)} className="absolute top-10 right-10 hover:rotate-90 transition-transform"><X size={28}/></button><div className="mb-8"><div className="flex items-center gap-3 mb-5"><div className="p-3 bg-amber-100 rounded-2xl shadow-sm"><Award className="text-[#f59e0b]" size={28}/></div><h4 className="text-xl font-black text-[#1e2b7a] uppercase italic tracking-tighter leading-none uppercase leading-none">Respuesta de Oro</h4></div><div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-[2.5rem] text-[13px] italic text-amber-950 shadow-sm leading-relaxed relative leading-none text-balance leading-relaxed"><span className="text-4xl text-amber-200 absolute -top-2 -left-2 opacity-50">"</span>{selectedPastChallenge.bestResponse}<span className="text-4xl text-amber-200 absolute -bottom-6 -right-2 opacity-50">"</span></div><div className="flex gap-1.5 mt-6 justify-center">{[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-[#f59e0b] fill-[#f59e0b]" />)}</div></div><p className="text-[10px] text-slate-400 font-bold uppercase mt-auto bg-slate-100 p-4 rounded-2xl text-center tracking-widest italic leading-none uppercase leading-none">RETO FINALIZADO</p></div></div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* CONTENEDOR PRINCIPAL: RENDERIZA SEGÚN LA PESTAÑA ACTIVA   */}
      {/* --------------------------------------------------------- */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 pt-4 pb-40 text-[#1e2b7a]">
        
        {/* ========================================================= */}
        {/* PESTAÑA: ACADEMY (Módulos de Formación)                     */}
        {/* ========================================================= */}
        {activeTab === 'courses' && (
          <div className="space-y-16 relative">
            
            {/* Patrón de malla técnica de fondo general para Academy */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1e2b7a 1px, transparent 1px), linear-gradient(90deg, #1e2b7a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Renderizado iterativo de las 4 categorías de formación */}
            {['cafeteria', 'pills', 'structural', 'externalCerts'].map((cat, sIdx) => (
              <ScrollReveal key={cat} delay={sIdx * 100}>
                {/* Contenedor Premium de "Cristal" con degradados de color según la categoría */}
                <div className={`p-1 w-full rounded-[4.5rem] bg-gradient-to-br shadow-xl relative z-10 ${cat === 'cafeteria' ? 'from-amber-200/50 to-transparent' : cat === 'pills' ? 'from-purple-200/50 to-transparent' : cat === 'structural' ? 'from-blue-200/50 to-transparent' : 'from-green-200/50 to-transparent'}`}>
                  <div className={`p-10 rounded-[4.4rem] bg-white/70 backdrop-blur-3xl relative overflow-hidden`}>
                    
                    {/* Barra lateral indicadora de color (Acentúa la identidad de cada bloque) */}
                    <div className={`absolute top-0 right-0 w-2 h-full ${cat === 'cafeteria' ? 'bg-amber-400' : cat === 'pills' ? 'bg-purple-400' : cat === 'structural' ? 'bg-blue-400' : 'bg-green-400'}`} />

                    {/* Cabecera de la Categoría */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10 text-[#1e2b7a]">
                      <div className="flex items-center gap-6">
                        <div className={`p-5 rounded-[2rem] shadow-xl ${cat === 'cafeteria' ? 'bg-amber-100 text-amber-600 shadow-amber-200/30' : cat === 'pills' ? 'bg-purple-100 text-purple-600 shadow-purple-200/30' : cat === 'structural' ? 'bg-blue-100 text-blue-600 shadow-blue-200/30' : 'bg-green-100 text-green-600 shadow-green-200/30'}`}>
                          {cat === 'cafeteria' ? <Coffee size={36}/> : cat === 'pills' ? <TrendingUp size={36}/> : cat === 'structural' ? <Library size={36}/> : <ShieldCheck size={36}/>}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{cat === 'cafeteria' ? 'CafeterIA' : cat === 'pills' ? 'TikTok Learning' : cat === 'structural' ? 'Estructurales' : 'Certificaciones'}</h2>
                            {/* Contador de unidades por categoría */}
                            <span className="px-3 py-1 bg-white shadow-inner text-slate-400 text-[9px] font-black rounded-full uppercase tracking-widest leading-none">{content[cat].length} Unidades</span>
                          </div>
                          <p className="text-xs font-black uppercase mt-2 tracking-[0.2em] leading-none opacity-40 italic">
                            {cat === 'cafeteria' ? 'Inspiración de 30 min' : cat === 'pills' ? 'Píldoras rápidas' : cat === 'structural' ? 'Ejes Randstad' : 'Estándares de mercado'}
                          </p>
                        </div>
                      </div>
                      {/* Botón para abrir el formulario y añadir contenido a ESTA categoría */}
                      <button onClick={() => {setTargetCategory(cat); setShowAddModal(true);}} className={`mt-10 px-6 py-4 text-white rounded-[2rem] shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-black uppercase text-[10px] italic tracking-widest leading-none group ${cat === 'cafeteria' ? 'bg-amber-600 shadow-amber-600/20' : cat === 'pills' ? 'bg-purple-600 shadow-purple-600/20' : cat === 'structural' ? 'bg-[#3b82f6] shadow-blue-600/20' : 'bg-green-600 shadow-green-600/20'}`}>
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Añadir Material
                      </button>
                    </div>

                    {/* Listado de Cursos/Materiales (Scroll horizontal para 'Pills', Grid normal para el resto) */}
                    <div className={cat === 'pills' ? "flex gap-8 overflow-x-auto pb-10 scrollbar-hide px-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"}>
                      {content[cat].map((item) => (
                        <div key={item.id} onClick={() => setSelectedItem({ data: item, cat })} className={cat === 'pills' ? "min-w-[280px] h-[440px] bg-slate-900 rounded-[4rem] relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] cursor-pointer hover:scale-[1.03] transition-all border-4 border-white/10" : `group bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative h-full flex flex-col border-b-8 ${cat === 'cafeteria' ? 'hover:border-b-amber-500 border-b-transparent' : cat === 'structural' ? 'hover:border-b-blue-600 border-b-transparent' : 'hover:border-b-green-500 border-b-transparent'}`}>
                          {/* Diseño específico de tarjeta oscura para TikTok Learning */}
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
                            /* Diseño de tarjeta clara para el resto de bloques */
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

        {/* ========================================================= */}
        {/* PESTAÑA: COMUNIDAD (Foro de debate)                         */}
        {/* ========================================================= */}
        {activeTab === 'forum' && (
          <div className="animate-in fade-in duration-300 text-[#1e2b7a]">
             <div className="flex justify-between items-start mb-10 text-[#1e2b7a]"><div><h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none uppercase leading-none">COMUNIDAD IA</h2><p className="text-[#94a3b8] font-bold text-[12px] mt-2 tracking-widest uppercase italic leading-none">Debate con expertos de Randstad Digital.</p></div><button onClick={() => setShowAddThreadModal(true)} className="bg-[#3b82f6] text-white px-8 py-4 rounded-[1.2rem] font-black uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2 italic tracking-widest leading-none leading-none"><Plus size={24}/> NUEVO TEMA</button></div>
             <div className="grid grid-cols-12 gap-8 text-[#1e2b7a]"><aside className="col-span-3 text-[#1e2b7a]"><ScrollReveal direction="left"><div className="bg-white p-8 rounded-[1.5rem] shadow-sm h-fit"><h3 className="text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.2em] mb-6 uppercase leading-none">Categorías</h3>{['PRODUCTIVIDAD', 'CONSULTORÍA', 'LEGAL', 'HERRAMIENTAS'].map(cat => (<div key={cat} className="flex justify-between items-center mb-4 text-[10px] font-black text-[#64748b] hover:text-[#3b82f6] cursor-pointer group uppercase leading-none"><span className="group-hover:translate-x-1 transition-transform">{cat}</span><span className="text-[#cbd5e1]">12</span></div>))}</div></ScrollReveal></aside><div className="col-span-9"><div className="flex gap-10 border-b border-slate-100 mb-8 px-2 font-black text-[10px] tracking-widest text-[#94a3b8] leading-none">{['TRENDING', 'NEW', 'VISTOS'].map(fCat => (<button key={fCat} onClick={() => setForumCategory(fCat.toLowerCase())} className={`pb-4 transition-all ${forumCategory === fCat.toLowerCase() ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : ''}`}>{fCat}</button>))}</div><div className="space-y-6">{content.forumThreads.map((thread, idx) => (<ScrollReveal key={thread.id} direction="up" delay={idx * 100}><div onClick={() => setSelectedThreadId(thread.id)} className="bg-white p-8 rounded-[1.8rem] shadow-sm border border-[#f1f5f9] flex items-center justify-between group hover:shadow-md transition-all cursor-pointer text-[#1e2b7a]"><div className="flex items-center gap-6"><div className={`w-14 h-14 rounded-[1.2rem] ${thread.avatar === 'AM' ? 'bg-[#ff7e3b]' : 'bg-[#3b82f6]'} text-white flex items-center justify-center font-black text-md shadow-md uppercase leading-none`}>{thread.avatar}</div><div><h4 className="font-black text-md text-[#1e2b7a] uppercase italic group-hover:text-[#3b82f6] transition-colors leading-tight leading-none">{thread.title}</h4><p className="text-[10px] font-bold text-[#94a3b8] uppercase mt-1 leading-none">POR {thread.user}</p></div></div><div className="flex items-center gap-10"><span className="bg-[#f1f5f9] px-4 py-1.5 rounded-full text-[9px] font-black text-[#64748b] tracking-widest uppercase leading-none leading-none">{thread.category}</span><div className="flex items-center gap-1 text-[#64748b] font-black text-sm w-8 leading-none"><span>{thread.comments}</span></div><button onClick={(e) => { e.stopPropagation(); likeThread(thread.id); }} className={`flex items-center gap-1 font-black text-sm w-10 transition-all ${thread.likedBy.includes(CURRENT_USER_ID) ? 'text-[#3b82f6] scale-110' : 'text-slate-300 hover:text-[#3b82f6]'}`}><ThumbsUp size={16} fill={thread.likedBy.includes(CURRENT_USER_ID) ? "currentColor" : "none"} /> <span>{thread.likes}</span></button><span className="text-[9px] font-black text-[#cbd5e1] uppercase tracking-tighter leading-none leading-none">{thread.date}</span></div></div></ScrollReveal>))}</div></div></div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: RETOS (Desafíos y Evaluador IA)                    */}
        {/* ========================================================= */}
        {activeTab === 'challenges' && (
          <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-16 text-[#1e2b7a]">
            {/* Cabecera del Reto Activo con Input y Evaluador de Gemini */}
            <ScrollReveal direction="up" delay={100}><div className="bg-[#243782] p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-16 items-center"><div className="flex-1 space-y-10"><div className="flex items-center gap-2 bg-[#1a2b7a] w-fit px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 italic leading-none"><Clock size={14} className="text-[#3b82f6]" /> {content.activeChallenge.deadline}</div><h3 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.95] uppercase leading-none">{content.activeChallenge.title}</h3><div className="bg-[#1a2b7a]/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm space-y-4"><div className="flex items-center gap-2 text-[#3b82f6] font-black text-[10px] uppercase tracking-widest leading-none"><Trophy size={16}/> OBJETIVO DEL RETO</div><p className="text-md font-medium leading-relaxed leading-none">{content.activeChallenge.objective}</p></div><p className="text-white/40 text-[13px] italic leading-relaxed pl-4 border-l-2 border-[#3b82f6]/40 leading-none">"{content.activeChallenge.description}"</p></div><div className="w-full md:w-[450px] bg-white rounded-[3rem] p-10 shadow-2xl self-stretch flex flex-col justify-center text-[#1e2b7a]">{!evaluation ? (<div className="space-y-8"><div className="flex justify-between items-center"><h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none uppercase text-pretty">TU PROPUESTA</h3><span className="text-[11px] font-black text-[#f59e0b] leading-none uppercase leading-none">+ {content.activeChallenge.rewardPoints} XP</span></div><div className="relative group"><textarea value={submissionText} onChange={e => setSubmissionText(e.target.value)} className="w-full p-6 bg-[#f8fafc] border-2 border-slate-100 rounded-[2rem] h-48 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 text-slate-800 leading-relaxed leading-none" placeholder="Prompt..." /><div className="absolute bottom-6 right-6 text-slate-200"><UploadCloud size={28} /></div></div><button onClick={evaluateChallenge} disabled={isEvaluating || !submissionText.trim()} className="w-full py-6 bg-[#96b5f6] text-white rounded-[2rem] font-black uppercase italic shadow-xl hover:bg-[#3b82f6] transition-all flex items-center justify-center gap-4 disabled:opacity-50 italic leading-none leading-none">{isEvaluating ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />} {isEvaluating ? 'EVALUANDO...' : 'ENTREGAR ✨'}</button></div>) : (<div className="animate-in zoom-in text-center space-y-6 text-[#1e2b7a]"><p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest leading-none uppercase leading-none">RESULTADO FINAL</p><div className="flex justify-center gap-2">{[1,2,3,4,5].map(i => <Star key={i} size={40} className={i <= evaluation.score ? "text-[#f59e0b] fill-[#f59e0b] drop-shadow-md" : "text-slate-100"} />)}</div><p className="text-6xl font-black text-[#1e2b7a] italic leading-none">{evaluation.score}<span className="text-2xl opacity-20">/5</span></p><p className="bg-slate-50 p-6 rounded-2xl text-[12px] italic text-[#64748b] leading-relaxed">"{evaluation.feedback}"</p><button onClick={() => setEvaluation(null)} className="text-[10px] font-black uppercase text-[#3b82f6] underline tracking-widest leading-none leading-none uppercase">REINTENTAR</button></div>)}</div></div></ScrollReveal>
            {/* Listado de Retos Históricos */}
            <section className="space-y-10 text-[#1e2b7a]"><ScrollReveal direction="up"><div className="flex items-center gap-4"><div className="p-4 bg-white rounded-3xl shadow-sm"><History size={28} className="text-[#1e2b7a]"/></div><div><h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none text-balance uppercase">Repositorio Histórico</h3><p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest mt-1 uppercase">Aprende de los mejores retos finalizados</p></div></div></ScrollReveal><div className="grid grid-cols-1 md:grid-cols-2 gap-8">{content.pastChallenges.map((past, idx) => (<ScrollReveal key={past.id} direction="up" delay={idx * 100}><div onClick={() => setSelectedPastChallenge(past)} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#f1f5f9] flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer"><div><div className="flex gap-4 mb-3 text-[9px] font-black uppercase tracking-widest leading-none"><span className="bg-[#1e2b7a] text-white px-3 py-1 rounded-full italic uppercase">CERRADO</span><span className="text-[#94a3b8] py-1 leading-none">{past.date}</span></div><h4 className="font-black text-xl text-[#1e2b7a] uppercase italic group-hover:text-[#3b82f6] transition-colors leading-tight">{past.title}</h4><p className="text-[9px] font-bold text-[#94a3b8] uppercase mt-2 italic flex items-center gap-2 tracking-widest leading-none uppercase">🏆 DESTACADO: <span className="text-[#3b82f6] font-black">{past.winner}</span></p></div><div className="flex flex-col items-end gap-3"><div className="flex gap-1">{[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= past.score ? "text-[#f59e0b] fill-[#f59e0b]" : "text-slate-100"} />)}</div><div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-300 group-hover:bg-[#3b82f6] group-hover:text-white transition-all shadow-inner leading-none"><ChevronRight size={24}/></div></div></div></ScrollReveal>))}</div></section>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: RANKING (Podio, Posición Actual y Lista)         */}
        {/* ========================================================= */}
        {activeTab === 'ranking' && (
          <div className="animate-in fade-in duration-500 space-y-16 text-[#1e2b7a]">
            {/* Título de la sección */}
            <ScrollReveal direction="none">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none uppercase">LÍDERES DE ADOPCIÓN IA</h2>
                <p className="text-[#94a3b8] font-bold text-xs uppercase tracking-[0.3em] leading-none uppercase">RECONOCIMIENTO AL TALENTO Y LA INNOVACIÓN</p>
              </div>
            </ScrollReveal>

            {/* Podio Principal (Top 3) */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 mb-20 px-4 text-[#1e2b7a]">
              {/* Segundo Puesto (Izquierda) */}
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
              {/* Primer Puesto (Centro - LÍDER) */}
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
              {/* Tercer Puesto (Derecha) */}
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
            
            {/* Banner de Posición Actual del Usuario (Con Mentor IA) */}
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
            
            {/* Lista del Top 25 */}
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
                {/* Botón para expandir/contraer el ranking */}
                <button onClick={() => setShowAllRanking(!showAllRanking)} className="px-10 py-4 bg-white text-[#1e2b7a] border-2 border-[#f1f5f9] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#1e2b7a] hover:text-white transition-all shadow-sm mx-auto flex items-center gap-2 italic leading-none">
                  {showAllRanking ? <><ArrowUp size={14}/> MOSTRAR MENOS</> : <><ChevronRight className="rotate-90" size={14}/> VER EL RANKING COMPLETO (TOP 25)</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL AÑADIR (FUERA DE MAIN PARA EVITAR CORTES DE JSX) --- */}
      {showAddModal && <AddContentForm category={targetCategory} />}

      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-40">
        <div className="bg-white/90 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] p-2.5 flex justify-around items-center">
          <NavItem id="courses" icon={BookOpen} label="ACADEMY" />
          <NavItem id="forum" icon={MessageCircle} label="COMUNIDAD" />
          <NavItem id="challenges" icon={Trophy} label="RETOS" />
          <NavItem id="ranking" icon={BarChart3} label="RANKING" />
        </div>
      </nav>

    </div>
  );
};

export default App;