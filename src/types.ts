export interface Log {
  id?: number;
  date: string;
  focus: number;
  sleep: number;
  energy: number;
  stress: number;
  checklist: string[];
  intention: string;
  amazing: string;
  affirmation: string;
  priority: string;
  gratitude: string;
  timestamp?: string;
}

export interface BrainDump {
  id?: number;
  text: string;
  analysis?: string;
  timestamp?: string;
}

export interface Settings {
  language: 'pt' | 'en' | 'es';
  display_name: string;
  is_pro: boolean;
  theme: 'light' | 'dark' | 'system';
  font_size: 'small' | 'medium' | 'large';
}

export const TRANSLATIONS = {
  pt: {
    greeting: "Bom dia",
    subtitle: "Sua interface neural para produtividade extrema e clareza mental. Otimize seu hardware biológico com nossas ferramentas de biohacking cognitivo.",
    tabs: { home: "Home", activation: "Ativação", brainDump: "Brain Dump", tracker: "Tracker", academy: "Academy", shop: "Shop" },
    biometrics: { focus: "Foco", sleep: "Sono", energy: "Energia", stress: "Stress" },
    explore: { title: "Explorar", activation: "Ativação Matinal", activationDesc: "Otimize seu ritual diário.", academy: "Neural Academy", academyDesc: "Conhecimento de elite.", tracker: "Biohacker Tracker", trackerDesc: "Métricas biológicas.", shop: "Shop", shopDesc: "Protocolos e suplementos." },
    activation: { title: "O Ritual", morning: "Ativação Matinal", elite: "Checklist de Elite", items: ["Copo de água com limão", "10min de luz solar", "Journaling (mínimo de 3 tópicos)", "Meditação de 5 min", "Exercício físico (20 min)"], fields: { intention: "Intenção do Dia", amazing: "O que faria hoje ser incrível?", affirmation: "Afirmação Diária", priority: "Prioridade Neural", gratitude: "Gratidão" }, save: "Salvar Log Neural", history: "Histórico de Ativações" },
    brainDump: { title: "Banco de Dados Cognitivo", placeholder: "Esvazie sua mente aqui...", archive: "Arquivar Insight", analyze: "Arquivar e Analisar", history: "Histórico Inteligente", diagnosis: "Diagnóstico Neural" },
    tracker: { title: "Biohacker Tracker", fasting: "Cronômetro de Jejum", additives: "Aditivos Prejudiciais", supplements: "Wiki de Suplementos", consult: "Consulte antes de comprar. Conhecimento é gratuito.", risk: "Risco" },
    academy: { title: "Recursos de Elite", audios: "Áudios", videos: "Vídeos", library: "Biblioteca", readingTime: "min de leitura" },
    shop: { title: "O Hub Comercial", supplements: "Suplementos", protocols: "Protocolos Neurais", lifestyle: "Lifestyle Drop", buy: "Comprar Agora" },
    profile: { 
      settings: "Configurações", 
      language: "Idioma", 
      displayName: "Nome de Exibição", 
      payment: "Formas de Pagamento", 
      terms: "Termos de Uso", 
      privacy: "Política de Privacidade",
      theme: "Tema",
      fontSize: "Tamanho da Fonte",
      themes: { light: "Claro", dark: "Escuro", system: "Sistema" },
      fontSizes: { small: "Pequeno", medium: "Médio", large: "Grande" }
    }
  },
  en: {
    greeting: "Good morning",
    subtitle: "Your neural interface for extreme productivity and mental clarity.",
    tabs: { home: "Home", activation: "Activation", brainDump: "Brain Dump", tracker: "Tracker", academy: "Academy", shop: "Shop" },
    biometrics: { focus: "Focus", sleep: "Sleep", energy: "Energy", stress: "Stress" },
    explore: { title: "Explore", activation: "Morning Activation", activationDesc: "Optimize your daily ritual.", academy: "Neural Academy", academyDesc: "Elite knowledge.", tracker: "Biohacker Tracker", trackerDesc: "Biological metrics.", shop: "Shop", shopDesc: "Protocols and supplements." },
    activation: { title: "The Ritual", morning: "Morning Activation", elite: "Elite Checklist", items: ["Glass of water with lemon", "10min of sunlight", "Journaling (min 3 topics)", "5 min meditation", "Physical exercise (20 min)"], fields: { intention: "Daily Intention", amazing: "What would make today amazing?", affirmation: "Daily Affirmation", priority: "Neural Priority", gratitude: "Gratitude" }, save: "Save Neural Log", history: "Activation History" },
    brainDump: { title: "Brain Dump", placeholder: "Empty your mind...", archive: "Archive Insight", analyze: "Archive & Analyze", history: "Smart History", diagnosis: "Neural Diagnosis" },
    tracker: { title: "Biohacker Tracker", fasting: "Fasting Timer", additives: "Harmful Additives", supplements: "Supplement Wiki", consult: "Consult before buying. Knowledge is free.", risk: "Risk" },
    academy: { title: "Elite Resources", audios: "Audios", videos: "Videos", library: "Library", readingTime: "min read" },
    shop: { title: "Commercial Hub", supplements: "Supplements", protocols: "Neural Protocols", lifestyle: "Lifestyle Drop", buy: "Buy Now" },
    profile: { 
      settings: "Settings", 
      language: "Language", 
      displayName: "Display Name", 
      payment: "Payment Methods", 
      terms: "Terms of Use", 
      privacy: "Privacy Policy",
      theme: "Theme",
      fontSize: "Font Size",
      themes: { light: "Light", dark: "Dark", system: "System" },
      fontSizes: { small: "Small", medium: "Medium", large: "Large" }
    }
  },
  es: {
    greeting: "Buenos días",
    subtitle: "Su interfaz neuronal para una productividad extrema y claridad mental.",
    tabs: { home: "Inicio", activation: "Activación", brainDump: "Brain Dump", tracker: "Tracker", academy: "Academy", shop: "Shop" },
    biometrics: { focus: "Foco", sleep: "Sueño", energy: "Energía", stress: "Estrés" },
    explore: { title: "Explorar", activation: "Activación Matutina", activationDesc: "Optimice su ritual diario.", academy: "Neural Academy", academyDesc: "Conocimiento de élite.", tracker: "Biohacker Tracker", trackerDesc: "Métricas biológicas.", shop: "Shop", shopDesc: "Protocolos y suplementos." },
    activation: { title: "El Ritual", morning: "Activación Matutina", elite: "Checklist de Élite", items: ["Vaso de agua con limón", "10min de luz solar", "Journaling (mínimo 3 temas)", "Meditación de 5 min", "Ejercicio físico (20 min)"], fields: { intention: "Intención del Día", amazing: "¿Qué haría que hoy fuera increíble?", affirmation: "Afirmación Diaria", priority: "Prioridade Neural", gratitude: "Gratitud" }, save: "Guardar Log Neural", history: "Historial de Activaciones" },
    brainDump: { title: "Brain Dump", placeholder: "Vacíe su mente...", archive: "Archivar Insight", analyze: "Archivar y Analizar", history: "Historial Inteligente", diagnosis: "Diagnóstico Neural" },
    tracker: { title: "Biohacker Tracker", fasting: "Temporizador de Ayuno", additives: "Aditivos Perjudiciales", supplements: "Wiki de Suplementos", consult: "Consulte antes de comprar. El conocimiento es gratuito.", risk: "Riesgo" },
    academy: { title: "Recursos de Élite", audios: "Audios", videos: "Videos", library: "Biblioteca", readingTime: "min de lectura" },
    shop: { title: "Hub Comercial", supplements: "Suplementos", protocols: "Protocolos Neurales", lifestyle: "Lifestyle Drop", buy: "Comprar Ahora" },
    profile: { 
      settings: "Configuración", 
      language: "Idioma", 
      displayName: "Nombre de Visualización", 
      payment: "Métodos de Pago", 
      terms: "Términos de Uso", 
      privacy: "Política de Privacidad",
      theme: "Tema",
      fontSize: "Tamaño de Fuente",
      themes: { light: "Claro", dark: "Oscuro", system: "Sistema" },
      fontSizes: { small: "Pequeño", medium: "Medio", large: "Grande" }
    }
  }
};
