import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Zap, 
  Brain, 
  Activity, 
  BookOpen, 
  ShoppingBag, 
  Menu, 
  X, 
  User, 
  Settings as SettingsIcon, 
  Globe, 
  CreditCard, 
  ShieldCheck, 
  FileText,
  LogOut,
  ChevronRight,
  ChevronDown,
  Play,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Clock,
  Trash2,
  Save,
  Plus,
  Sparkles,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Log, BrainDump as BrainDumpType, Settings, TRANSLATIONS } from './types';

// Context for global state
const AppContext = createContext<{
  settings: Settings;
  setSettings: (s: Settings) => void;
  t: any;
  logs: Log[];
  setLogs: (l: Log[]) => void;
  notes: BrainDumpType[];
  setNotes: (n: BrainDumpType[]) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  currentAudio: { url: string, title: string } | null;
  setCurrentAudio: (a: { url: string, title: string } | null) => void;
}>({} as any);

// --- Components ---

const ProgressBar = ({ value, label, icon: Icon, colorClass }: { value: number, label: string, icon: any, colorClass: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider opacity-70">
      <div className="flex items-center gap-2">
        <Icon size={14} className={colorClass.replace('bg-', 'text-')} />
        <span>{label}</span>
      </div>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${colorClass} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
      />
    </div>
  </div>
);

const GlassCard = ({ children, className = "", onClick, ...props }: { children: React.ReactNode, className?: string, onClick?: () => void, [key: string]: any }) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.02 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={`glass-card p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    {...props}
  >
    {children}
  </motion.div>
);

// --- Tabs ---

const Dashboard = () => {
  const { settings, t, logs, setActiveTab } = useContext(AppContext);
  const latestLog = logs[0] || { focus: 0, sleep: 0, energy: 0, stress: 0 };
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = [
    { title: "Playlists Neurais Alpha", tag: "Destaque Academy", img: "https://picsum.photos/seed/alpha/800/400" },
    { title: "Meditações de Foco", tag: "Academy", img: "https://picsum.photos/seed/med/800/400" },
    { title: "Biohacking 101", tag: "Vídeos", img: "https://picsum.photos/seed/bio/800/400" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-display font-bold">
          {t.greeting}, <span className="neuro-gradient-text">{settings.display_name}</span>
        </h1>
        <p className="text-sm text-white/60 leading-relaxed max-w-md">
          {t.subtitle}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Biometria Neural</h3>
          <div className="space-y-4">
            <ProgressBar value={latestLog.focus} label={t.biometrics.focus} icon={Brain} colorClass="bg-neuro-blue" />
            <ProgressBar value={latestLog.sleep} label={t.biometrics.sleep} icon={Clock} colorClass="bg-indigo-500" />
            <ProgressBar value={latestLog.energy} label={t.biometrics.energy} icon={Zap} colorClass="bg-neuro-cyan" />
            <ProgressBar value={latestLog.stress} label={t.biometrics.stress} icon={AlertTriangle} colorClass="bg-rose-500" />
          </div>
        </GlassCard>

        <div className="flex flex-col gap-4">
          <div className="flex-1 overflow-hidden rounded-2xl relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0"
              >
                <img 
                  src={carouselItems[carouselIndex].img} 
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neuro-dark to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-widest bg-neuro-blue px-2 py-1 rounded mb-2 inline-block">
                    {carouselItems[carouselIndex].tag}
                  </span>
                  <h4 className="font-bold">{carouselItems[carouselIndex].title}</h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-display font-bold">{t.explore.title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'activation', title: t.explore.activation, desc: t.explore.activationDesc, icon: Zap },
            { id: 'academy', title: t.explore.academy, desc: t.explore.academyDesc, icon: BookOpen },
            { id: 'tracker', title: t.explore.tracker, desc: t.explore.trackerDesc, icon: Activity },
            { id: 'shop', title: t.explore.shop, desc: t.explore.shopDesc, icon: ShoppingBag },
          ].map((item) => (
            <GlassCard key={item.id} className="p-4" onClick={() => setActiveTab(item.id)}>
              <item.icon className="text-neuro-cyan mb-3" size={24} />
              <h4 className="font-bold text-sm">{item.title}</h4>
              <p className="text-[10px] opacity-50 mt-1">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Daily Activation Summary */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold">Ativação Diária</h3>
        <GlassCard className="p-4">
          {latestLog.date === new Date().toISOString().split('T')[0] ? (
            <div className="flex items-center gap-3 text-neuro-cyan">
              <CheckCircle2 size={20} />
              <span className="text-sm font-bold">Ritual concluído hoje</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-50">Você ainda não ativou seu sistema hoje.</span>
              <button onClick={() => setActiveTab('activation')} className="text-xs font-bold text-neuro-blue flex items-center gap-1">
                Ativar agora <ArrowRight size={12} />
              </button>
            </div>
          )}
        </GlassCard>
      </section>
    </div>
  );
};

const Activation = () => {
  const { settings, t, logs, setLogs, setCurrentAudio } = useContext(AppContext);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [fields, setFields] = useState({
    intention: '',
    amazing: '',
    affirmation: '',
    priority: '',
    gratitude: ''
  });
  const [showHistory, setShowHistory] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const hasLoggedToday = logs.some(log => log.date === today);

  useEffect(() => {
    // Stop audio on unmount
    return () => setCurrentAudio(null);
  }, []);

  const progress = (checklist.length / t.activation.items.length) * 100;
  const fieldsProgress = (Object.values(fields).filter(v => (v as string).trim().length > 0).length / 5) * 100;

  const handleSave = async () => {
    if (hasLoggedToday) return;
    
    const newLog: Log = {
      date: today,
      focus: 70 + Math.random() * 30,
      sleep: 60 + Math.random() * 40,
      energy: 50 + Math.random() * 50,
      stress: 20 + Math.random() * 30,
      checklist,
      ...fields
    };

    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog)
    });

    if (res.ok) {
      const updatedLogs = await fetch('/api/logs').then(r => r.json());
      setLogs(updatedLogs);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h2 className="text-2xl font-display font-bold neuro-gradient-text">{t.activation.title}</h2>
      </header>

      {hasLoggedToday && (
        <div className="p-4 bg-neuro-cyan/10 border border-neuro-cyan/20 rounded-2xl text-neuro-cyan text-sm font-bold flex items-center gap-2">
          <CheckCircle2 size={18} />
          Ativação de hoje já concluída.
        </div>
      )}

      {/* Audio Player Trigger */}
      <GlassCard className="p-4 flex items-center gap-4" onClick={() => setCurrentAudio({ url: "https://docs.google.com/uc?export=download&id=1WpPi6vJz3Ejd322_iqcScFD6DWWFlVyM", title: "Link Audio Gamma" })}>
        <div className="w-12 h-12 neuro-gradient-bg rounded-full flex items-center justify-center shadow-lg">
          <Play size={20} fill="white" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Link Audio Gamma</div>
          <div className="text-sm font-bold">Clique para iniciar áudio binaural</div>
        </div>
      </GlassCard>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-lg font-bold">{t.activation.morning}</h3>
          <span className="text-xs font-mono text-neuro-cyan">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} className="h-full neuro-gradient-bg" />
        </div>
        <GlassCard className={`space-y-3 ${hasLoggedToday ? 'opacity-50 pointer-events-none' : ''}`}>
          {t.activation.items.map((item: string) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => setChecklist(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  checklist.includes(item) ? 'bg-neuro-cyan border-neuro-cyan' : 'border-white/20 group-hover:border-white/40'
                }`}
              >
                {checklist.includes(item) && <CheckCircle2 size={14} className="text-neuro-dark" />}
              </div>
              <span className={`text-sm transition-opacity ${checklist.includes(item) ? 'opacity-100' : 'opacity-50'}`}>{item}</span>
            </label>
          ))}
        </GlassCard>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-lg font-bold">{t.activation.elite}</h3>
          <span className="text-xs font-mono text-neuro-blue">{Math.round(fieldsProgress)}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${fieldsProgress}%` }} className="h-full bg-neuro-blue" />
        </div>
        <div className={`space-y-4 ${hasLoggedToday ? 'opacity-50 pointer-events-none' : ''}`}>
          {Object.entries(t.activation.fields).map(([key, label]: [string, any]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest opacity-50">{label}</label>
                {!settings.is_pro && (
                  <button className="text-[8px] uppercase tracking-widest bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <Sparkles size={8} /> Pro Upgrade
                  </button>
                )}
              </div>
              <textarea 
                maxLength={settings.is_pro ? 2000 : 500}
                value={(fields as any)[key]}
                onChange={(e) => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-neuro-blue min-h-[80px] resize-none"
                placeholder="..."
              />
            </div>
          ))}
        </div>
      </section>

      <button 
        disabled={hasLoggedToday}
        onClick={handleSave}
        className={`w-full p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
          hasLoggedToday ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'neuro-gradient-bg shadow-lg shadow-neuro-blue/20 active:scale-95'
        }`}
      >
        <Save size={20} />
        {hasLoggedToday ? 'Log de hoje concluído' : t.activation.save}
      </button>

      <section className="space-y-4">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full p-4 glass-card"
        >
          <span className="font-bold">{t.activation.history}</span>
          <ChevronDown className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-2"
            >
              {logs.map(log => (
                <div key={log.id} className="glass-card overflow-hidden">
                  <div className="p-4 flex justify-between items-center" onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}>
                    <div className="space-y-1">
                      <div className="text-sm font-bold">{log.date}</div>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-neuro-blue" style={{ opacity: log.focus / 100 }} />
                        <div className="w-2 h-2 rounded-full bg-indigo-500" style={{ opacity: log.sleep / 100 }} />
                        <div className="w-2 h-2 rounded-full bg-neuro-cyan" style={{ opacity: log.energy / 100 }} />
                        <div className="w-2 h-2 rounded-full bg-rose-500" style={{ opacity: log.stress / 100 }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <ChevronDown size={18} className={`opacity-30 transition-transform ${selectedLog?.id === log.id ? 'rotate-180' : ''}`} />
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          await fetch(`/api/logs/${log.id}`, { method: 'DELETE' });
                          setLogs(logs.filter(l => l.id !== log.id));
                        }}
                        className="text-rose-500 opacity-50 hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {selectedLog?.id === log.id && (
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: 'auto' }}
                      className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase opacity-30">Progresso Ritual</div>
                          <div className="text-xs font-bold text-neuro-cyan">
                            {(() => {
                              try {
                                return JSON.parse(log.checklist as any).length;
                              } catch (e) {
                                return 0;
                              }
                            })()} / {t.activation.items.length} itens
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase opacity-30">Métricas Médias</div>
                          <div className="text-xs font-bold">
                            {Math.round((log.focus + log.sleep + log.energy + (100 - log.stress)) / 4)}%
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase opacity-30">Intenção</div>
                        <p className="text-xs opacity-70 italic">"{log.intention}"</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

// --- Tabs ---

const BrainDump = () => {
  const { settings, t, notes, setNotes, setActiveTab } = useContext(AppContext);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedNote, setSelectedNote] = useState<BrainDumpType | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const notesToday = notes.filter(n => n.date === today);
  const limit = settings.is_pro ? 3 : 1;
  const canSave = notesToday.length < limit;

  const handleArchive = async (analyze = false) => {
    if (!text.trim() || !canSave) return;
    if (analyze && !settings.is_pro) return;
    
    setIsAnalyzing(analyze);

    let analysis = '';
    if (analyze) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Analise o seguinte insight neural e forneça um Diagnóstico Neural em Português (máximo 100 palavras): "${text}"`,
        });
        analysis = response.text || '';
      } catch (e) {
        analysis = 'Erro na análise neural.';
      }
    }

    const res = await fetch('/api/brain-dump', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, analysis })
    });

    if (res.ok) {
      const updatedNotes = await fetch('/api/brain-dump').then(r => r.json());
      setNotes(updatedNotes);
      setText('');
      setIsAnalyzing(false);
    }
  };

  const filteredNotes = settings.is_pro 
    ? notes 
    : notes.filter(n => {
        const noteDate = new Date(n.timestamp || Date.now());
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        return noteDate >= tenDaysAgo;
      });

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h2 className="text-2xl font-display font-bold neuro-gradient-text">{t.brainDump.title}</h2>
      </header>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs opacity-50">Entradas hoje: {notesToday.length}/{limit}</span>
          {!settings.is_pro && (
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Free Plan</span>
          )}
        </div>
        
        <GlassCard className="space-y-4">
          <textarea 
            maxLength={500}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.brainDump.placeholder}
            className="w-full bg-transparent border-none focus:ring-0 text-lg min-h-[200px] resize-none placeholder:opacity-30"
          />
          <div className="flex justify-between items-center text-[10px] opacity-30 font-mono">
            <span>{text.length}/500</span>
            <span>NEURAL INPUT ACTIVE</span>
          </div>
        </GlassCard>
        
        {!canSave && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-bold flex items-center gap-2">
            <AlertTriangle size={14} />
            Limite diário atingido. Assine o Pro para mais entradas.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button 
            disabled={!text.trim() || isAnalyzing || !canSave}
            onClick={() => handleArchive(false)}
            className="p-4 glass-card text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 disabled:opacity-30"
          >
            <Save size={18} />
            {t.brainDump.archive}
          </button>
          <button 
            disabled={!text.trim() || isAnalyzing || !canSave}
            onClick={() => handleArchive(true)}
            className={`p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              settings.is_pro 
                ? 'neuro-gradient-bg shadow-lg shadow-neuro-cyan/20' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
            {t.brainDump.analyze}
          </button>
        </div>

        {!settings.is_pro && (
          <GlassCard className="p-4 border-amber-500/20 bg-amber-500/5" onClick={() => setActiveTab('profile')}>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-amber-500" size={20} />
              <h4 className="font-bold text-sm text-amber-500">Desbloqueie o Potencial Máximo</h4>
            </div>
            <p className="text-[10px] opacity-70 mb-3">Análises de IA, 3 entradas diárias e histórico ilimitado.</p>
            <button className="w-full py-2 bg-amber-500 text-neuro-dark rounded-lg text-xs font-bold">Assinar Pro Agora</button>
          </GlassCard>
        )}
      </section>

      <section className="space-y-4">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full p-4 glass-card"
        >
          <span className="font-bold">Histórico de Insights</span>
          <ChevronDown className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-2"
            >
              {filteredNotes.map(note => (
                <div key={note.id} className="glass-card overflow-hidden">
                  <div className="p-4 flex justify-between items-center" onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}>
                    <div className="space-y-1">
                      <div className="text-xs font-bold opacity-30">{new Date(note.timestamp!).toLocaleString()}</div>
                      <div className="text-sm font-bold truncate max-w-[200px]">{note.text}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {note.analysis && <Sparkles size={14} className="text-neuro-cyan" />}
                      <ChevronDown size={18} className={`opacity-30 transition-transform ${selectedNote?.id === note.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {selectedNote?.id === note.id && (
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: 'auto' }}
                      className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4"
                    >
                      <p className="text-sm opacity-80 leading-relaxed">{note.text}</p>
                      {note.analysis && (
                        <div className="p-4 bg-neuro-cyan/5 border border-neuro-cyan/20 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-neuro-cyan text-[10px] font-bold uppercase tracking-widest">
                            <Sparkles size={12} /> Diagnóstico Neural
                          </div>
                          <p className="text-xs opacity-90 leading-relaxed">{note.analysis}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
              {!settings.is_pro && notes.length > filteredNotes.length && (
                <div className="p-4 text-center text-[10px] opacity-30 italic">
                  Entradas com mais de 10 dias ocultas. Assine Pro para ver tudo.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

const Tracker = () => {
  const { t } = useContext(AppContext);
  const [fastingTime, setFastingTime] = useState(0);
  const [isFasting, setIsFasting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('additives');

  useEffect(() => {
    let interval: any;
    if (isFasting) {
      interval = setInterval(() => setFastingTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isFasting]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const circadianData = [
    { time: '06:00', level: 20 },
    { time: '09:00', level: 80 },
    { time: '12:00', level: 60 },
    { time: '15:00', level: 40 },
    { time: '18:00', level: 70 },
    { time: '21:00', level: 30 },
    { time: '00:00', level: 10 },
    { time: '03:00', level: 5 },
  ];

  const additives = [
    { name: "Glutamato Monossódico", risk: "Alto", desc: "Neurotoxina que pode causar dores de cabeça e fadiga." },
    { name: "Aspartame", risk: "Médio", desc: "Adoçante artificial ligado a distúrbios cognitivos." },
    { name: "Corante Vermelho 40", risk: "Alto", desc: "Associado a hiperatividade e falta de foco." },
    { name: "Xarope de Milho (HFCS)", risk: "Alto", desc: "Causa picos de insulina e inflamação neural." },
    { name: "Gorduras Trans", risk: "Extremo", desc: "Destrói a integridade das membranas neuronais." },
    { name: "BHA/BHT", risk: "Médio", desc: "Conservantes com potencial disruptor endócrino." },
    { name: "Bromato de Potássio", risk: "Alto", desc: "Proibido em vários países, carcinogênico." },
    { name: "Nitritos de Sódio", risk: "Médio", desc: "Comumente em embutidos, afeta oxigenação." }
  ];

  const supplements = [
    { name: "Creatina", benefits: ["Memória", "Energia ATP"], dose: "5g/dia", time: "Manhã" },
    { name: "Ômega 3", benefits: ["Anti-inflamatório", "Foco"], dose: "2g/dia", time: "Com refeição" },
    { name: "Magnésio Treonato", benefits: ["Sono", "Neuroplasticidade"], dose: "400mg/dia", time: "Noite" },
    { name: "Cafeína + L-Teanina", benefits: ["Foco calmo", "Alerta"], dose: "100/200mg", time: "Manhã" },
    { name: "Vitamina D3+K2", benefits: ["Imunidade", "Humor"], dose: "5000 UI", time: "Manhã" },
    { name: "Juba de Leão", benefits: ["NGF", "Foco"], dose: "1g/dia", time: "Manhã" },
    { name: "Ashwagandha", benefits: ["Redução Cortisol"], dose: "600mg/dia", time: "Noite" }
  ];

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h2 className="text-2xl font-display font-bold neuro-gradient-text">{t.tracker.title}</h2>
      </header>

      {/* Fasting Timer - Elegant Redesign */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="80" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle 
              cx="96" cy="96" r="80" fill="transparent" 
              stroke="url(#neuro-gradient)" strokeWidth="8" strokeDasharray="502"
              animate={{ strokeDashoffset: 502 - (502 * (fastingTime % 3600) / 3600) }}
            />
            <defs>
              <linearGradient id="neuro-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#007AFF" />
                <stop offset="100%" stopColor="#00F2FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center z-10">
            <div className="text-[10px] uppercase tracking-widest opacity-30 mb-1">{t.tracker.fasting}</div>
            <div className="text-3xl font-mono font-bold tracking-tighter text-white">
              {formatTime(fastingTime)}
            </div>
            <button 
              onClick={() => setIsFasting(!isFasting)}
              className="mt-2 text-[10px] font-bold uppercase tracking-widest text-neuro-cyan hover:text-white transition-colors"
            >
              {isFasting ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>

      {/* Circadian Rhythm Chart */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Ritmo Circadiano</h3>
        <GlassCard className="p-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={circadianData}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#00F2FF', fontSize: '10px' }}
                labelStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="level" stroke="#007AFF" fillOpacity={1} fill="url(#colorLevel)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-[8px] opacity-30 uppercase tracking-widest mt-2">
            <span>Manhã</span>
            <span>Tarde</span>
            <span>Noite</span>
          </div>
        </GlassCard>
      </section>

      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
        <button 
          onClick={() => setActiveSubTab('additives')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'additives' ? 'bg-neuro-graphite shadow-lg' : 'opacity-50'}`}
        >
          {t.tracker.additives}
        </button>
        <button 
          onClick={() => setActiveSubTab('supplements')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'supplements' ? 'bg-neuro-graphite shadow-lg' : 'opacity-50'}`}
        >
          {t.tracker.supplements}
        </button>
      </div>

      <section className="space-y-4">
        <p className="text-xs opacity-50 text-center italic">{t.tracker.consult}</p>
        
        {activeSubTab === 'additives' ? (
          <div className="space-y-3">
            {additives.map(item => (
              <GlassCard key={item.name} className="p-0 overflow-hidden">
                <details className="group">
                  <summary className="list-none p-4 flex justify-between items-center cursor-pointer">
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                      item.risk === 'Extremo' ? 'bg-rose-600' : item.risk === 'Alto' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}>
                      {item.risk}
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-xs opacity-60 leading-relaxed border-t border-white/5 pt-3">
                    {item.desc}
                  </div>
                </details>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {supplements.map(item => (
              <GlassCard key={item.name} className="p-0 overflow-hidden">
                <details className="group">
                  <summary className="list-none p-4 flex justify-between items-center cursor-pointer">
                    <span className="font-bold text-sm">{item.name}</span>
                    <ChevronDown size={16} className="opacity-30 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] uppercase opacity-30 mb-1">Benefícios</div>
                        <div className="flex flex-wrap gap-1">
                          {item.benefits.map(b => <span key={b} className="bg-white/5 px-2 py-1 rounded text-[10px]">{b}</span>)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase opacity-30 mb-1">Dosagem/Horário</div>
                        <div className="text-xs">{item.dose} - {item.time}</div>
                      </div>
                    </div>
                    <button className="w-full p-3 neuro-gradient-bg rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                      <ShoppingBag size={14} />
                      {t.shop.buy}
                    </button>
                  </div>
                </details>
              </GlassCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Academy = () => {
  const { t, setCurrentAudio } = useContext(AppContext);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const articles = [
    { 
      title: "Otimização do Ciclo Circadiano", 
      time: 5, 
      category: "Cronobiologia", 
      content: "O ciclo circadiano é o relógio biológico interno que regula processos fisiológicos ao longo de 24 horas. Para otimizá-lo, a exposição à luz solar matinal é fundamental, pois sinaliza ao cérebro o início do dia e regula a produção de cortisol. Evitar luz azul à noite e manter horários regulares de sono são pilares para a regeneração neural e consolidação da memória." 
    },
    { 
      title: "Neuroplasticidade e Aprendizado", 
      time: 8, 
      category: "Biohacking", 
      content: "A neuroplasticidade é a capacidade do cérebro de formar novas conexões neurais. Este processo não se limita à infância; adultos podem promover a plasticidade através de desafios cognitivos constantes, exercícios físicos aeróbicos (que aumentam o BDNF) e sono de qualidade. O aprendizado deliberado e a repetição espaçada são técnicas de elite para fixação de novos conhecimentos." 
    },
    { 
      title: "Protocolos de Foco Profundo", 
      time: 6, 
      category: "Performance", 
      content: "O Deep Work, ou trabalho profundo, exige a eliminação de distrações e a entrada em um estado de fluxo. Protocolos eficazes incluem a técnica Pomodoro modificada (50 min foco / 10 min pausa), o uso de frequências binaurais Alpha e a suplementação estratégica com L-Teanina. A meditação pré-trabalho também prepara o córtex pré-frontal para tarefas de alta demanda analítica." 
    }
  ];

  const videos = [
    { title: "Masterclass: Biohacking de Performance", duration: "45:00", id: "2YW4KJzeXaQ" },
    { title: "Protocolos de Suplementação Avançada", duration: "32:15", id: "2YW4KJzeXaQ" }
  ];

  const audios = [
    { title: "Frequência Alpha: Foco Profundo", url: "https://docs.google.com/uc?export=download&id=1WpPi6vJz3Ejd322_iqcScFD6DWWFlVyM" },
    { title: "Meditação Guiada: Clareza Mental", url: "https://docs.google.com/uc?export=download&id=1WpPi6vJz3Ejd322_iqcScFD6DWWFlVyM" }
  ];

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h2 className="text-2xl font-display font-bold neuro-gradient-text">Neural Academy</h2>
      </header>

      {/* Internal Video Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-neuro-dark/95 backdrop-blur-xl"
          >
            <div className="w-full max-w-2xl aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-white/10">
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Masterclasses</h3>
        <div className="grid grid-cols-1 gap-4">
          {videos.map(video => (
            <GlassCard key={video.title} className="p-4 flex items-center gap-4 group" onClick={() => setActiveVideo(video.id)}>
              <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-neuro-blue/20 transition-colors">
                <Play size={24} className="text-neuro-blue" fill="currentColor" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{video.title}</h4>
                <div className="text-[10px] opacity-40 mt-1 flex items-center gap-2">
                  <Clock size={10} /> {video.duration}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Áudios Neurais</h3>
        <div className="grid grid-cols-1 gap-4">
          {audios.map(audio => (
            <GlassCard key={audio.title} className="p-4 flex items-center gap-4" onClick={() => setCurrentAudio({ url: audio.url, title: audio.title })}>
              <div className="w-12 h-12 neuro-gradient-bg rounded-full flex items-center justify-center shadow-lg">
                <Headphones size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{audio.title}</h4>
                <div className="text-[10px] text-neuro-cyan font-bold uppercase tracking-tighter mt-1">Player Flutuante</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Biblioteca de Elite</h3>
        <div className="grid grid-cols-1 gap-4">
          {articles.map(article => (
            <GlassCard key={article.title} className="p-4 space-y-2" onClick={() => setSelectedArticle(article)}>
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm">{article.title}</h4>
                <span className="text-[10px] opacity-40">{article.time} min</span>
              </div>
              <p className="text-xs opacity-50 line-clamp-2">{article.content}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-neuro-dark/90 backdrop-blur-md"
          >
            <GlassCard className="max-w-md w-full max-h-[80vh] overflow-y-auto p-8 relative">
              <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 opacity-50 hover:opacity-100">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-display font-bold mb-6 neuro-gradient-text">{selectedArticle.title}</h3>
              <div className="prose prose-invert prose-sm">
                <p className="text-white/80 leading-relaxed">{selectedArticle.content}</p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Shop = () => {
  const { t } = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState('all');

  const products = [
    { id: 1, name: "Neuro-Focus Stack", price: "R$ 189,00", category: "supplements", img: "https://picsum.photos/seed/supp/400/400", desc: "Nootrópico avançado para foco extremo." },
    { id: 2, name: "Protocolo Sono Profundo", price: "R$ 97,00", category: "protocols", img: "https://picsum.photos/seed/prot/400/400", desc: "Reset de receptores para regeneração neural." },
    { id: 3, name: "Camiseta Neural Tech", price: "R$ 129,00", category: "lifestyle", img: "https://picsum.photos/seed/shirt/400/400", desc: "Vestuário de alta performance." },
    { id: 4, name: "Magnésio Treonato Premium", price: "R$ 145,00", category: "supplements", img: "https://picsum.photos/seed/mag/400/400", desc: "Otimização da plasticidade sináptica." },
    { id: 5, name: "Blueprint Biohacking 2.0", price: "R$ 147,00", category: "protocols", img: "https://picsum.photos/seed/blue/400/400", desc: "Guia definitivo de otimização biológica." },
    { id: 6, name: "Eco-Bag Neuro", price: "R$ 59,00", category: "lifestyle", img: "https://picsum.photos/seed/bag/400/400", desc: "Sustentabilidade e estilo neural." }
  ];

  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h2 className="text-2xl font-display font-bold neuro-gradient-text">{t.shop.title}</h2>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'supplements', 'protocols', 'lifestyle'].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat ? 'neuro-gradient-bg shadow-lg' : 'bg-white/5 opacity-50'
            }`}
          >
            {cat === 'all' ? 'Todos' : t.shop[cat as keyof typeof t.shop]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map(product => (
          <GlassCard key={product.id} className="p-0 overflow-hidden group flex flex-col">
            <div className="h-48 overflow-hidden">
              <img src={product.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg">{product.name}</h4>
                <div className="text-neuro-cyan font-mono font-bold">{product.price}</div>
              </div>
              <p className="text-sm opacity-50">{product.desc}</p>
              <button className="w-full py-4 neuro-gradient-bg rounded-xl font-bold text-sm shadow-lg shadow-neuro-blue/30 active:scale-95 transition-transform flex items-center justify-center gap-2">
                <ShoppingBag size={18} />
                Adquirir Agora
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [settings, setSettings] = useState<Settings>({ 
    language: 'pt', 
    display_name: 'Usuário', 
    is_pro: false, 
    theme: 'dark', 
    font_size: 'medium' 
  });
  const [activeTab, setActiveTab] = useState('home');
  const [logs, setLogs] = useState<Log[]>([]);
  const [notes, setNotes] = useState<BrainDumpType[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{ url: string, title: string } | null>(null);
  const [showLegal, setShowLegal] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      setSettings({
        ...data,
        is_pro: !!data.is_pro
      });
    });
    fetch('/api/logs').then(res => res.json()).then(setLogs);
    fetch('/api/brain-dump').then(res => res.json()).then(setNotes);
  }, []);

  useEffect(() => {
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }

    // Apply font size
    root.style.fontSize = settings.font_size === 'small' ? '14px' : settings.font_size === 'large' ? '18px' : '16px';
  }, [settings.theme, settings.font_size]);

  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.pt;

  return (
    <AppContext.Provider value={{ 
      settings, setSettings, t, logs, setLogs, notes, setNotes, activeTab, setActiveTab,
      currentAudio, setCurrentAudio
    }}>
      <div className={`max-w-lg mx-auto min-h-screen flex flex-col px-6 pt-8 transition-colors duration-300`}>
        
        {/* Navbar */}
        <nav className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 neuro-gradient-bg rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,122,255,0.5)]">
              <Brain size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tighter">NEURON</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('academy')} className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
              <BookOpen size={18} />
              <span className="text-[10px] font-bold uppercase tracking-tight hidden sm:inline">Academy</span>
            </button>
            <button onClick={() => setActiveTab('shop')} className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
              <ShoppingBag size={18} />
              <span className="text-[10px] font-bold uppercase tracking-tight hidden sm:inline">Shop</span>
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="neumorph-button p-2 rounded-xl">
              <Menu size={20} />
            </button>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
            {activeTab === 'home' && <Dashboard />}
            {activeTab === 'activation' && <Activation />}
            {activeTab === 'brainDump' && <BrainDump />}
            {activeTab === 'tracker' && <Tracker />}
            {activeTab === 'academy' && <Academy />}
            {activeTab === 'shop' && <Shop />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Audio Player */}
        <AnimatePresence>
          {currentAudio && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass-card p-3 flex items-center gap-4 z-50 border-neuro-cyan/30"
            >
              <div className="w-10 h-10 neuro-gradient-bg rounded-lg flex items-center justify-center shadow-lg">
                <Play size={16} fill="white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-neuro-cyan font-bold truncate">{currentAudio.title}</div>
                <audio autoPlay controls className="w-full h-6 opacity-50 scale-90 origin-left">
                  <source src={currentAudio.url} type="audio/mpeg" />
                </audio>
              </div>
              <button onClick={() => setCurrentAudio(null)} className="opacity-50 hover:opacity-100 p-1">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Nav */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass-card p-2 flex justify-around items-center z-40">
          {[
            { id: 'home', icon: Home, label: t.tabs.home },
            { id: 'activation', icon: Zap, label: t.tabs.activation },
            { id: 'brainDump', icon: Brain, label: t.tabs.brainDump },
            { id: 'tracker', icon: Activity, label: t.tabs.tracker },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id ? 'text-neuro-cyan bg-white/5' : 'text-white/40'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed top-0 right-0 h-full w-80 bg-neuro-dark border-l border-white/10 z-[60] p-8 overflow-y-auto no-scrollbar"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-display font-bold">{t.profile.settings}</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="opacity-50 hover:opacity-100">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-50">{t.profile.displayName}</label>
                    <input 
                      type="text" 
                      value={settings.display_name}
                      onChange={(e) => {
                        const newSettings = { ...settings, display_name: e.target.value };
                        setSettings(newSettings);
                        fetch('/api/settings', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newSettings)
                        });
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-neuro-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-50">{t.profile.language}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['pt', 'en', 'es'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            const newSettings = { ...settings, language: lang as any };
                            setSettings(newSettings);
                            fetch('/api/settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(newSettings)
                            });
                          }}
                          className={`p-2 rounded-lg border text-xs font-bold uppercase ${
                            settings.language === lang ? 'border-neuro-blue bg-neuro-blue/10 text-neuro-blue' : 'border-white/10 opacity-50'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-50">{t.profile.theme}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['light', 'dark', 'system'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => {
                            const newSettings = { ...settings, theme: theme as any };
                            setSettings(newSettings);
                            fetch('/api/settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(newSettings)
                            });
                          }}
                          className={`p-2 rounded-lg border text-[10px] font-bold uppercase ${
                            settings.theme === theme ? 'border-neuro-blue bg-neuro-blue/10 text-neuro-blue' : 'border-white/10 opacity-50'
                          }`}
                        >
                          {t.profile.themes[theme as keyof typeof t.profile.themes]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-50">{t.profile.fontSize}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['small', 'medium', 'large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            const newSettings = { ...settings, font_size: size as any };
                            setSettings(newSettings);
                            fetch('/api/settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(newSettings)
                            });
                          }}
                          className={`p-2 rounded-lg border text-[10px] font-bold uppercase ${
                            settings.font_size === size ? 'border-neuro-blue bg-neuro-blue/10 text-neuro-blue' : 'border-white/10 opacity-50'
                          }`}
                        >
                          {t.profile.fontSizes[size as keyof typeof t.profile.fontSizes]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <CreditCard size={18} className="text-neuro-cyan" />
                      <span className="text-sm">{t.profile.payment}</span>
                    </button>
                    <button onClick={() => setShowLegal('terms')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <ShieldCheck size={18} className="text-neuro-cyan" />
                      <span className="text-sm">{t.profile.terms}</span>
                    </button>
                    <button onClick={() => setShowLegal('privacy')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <FileText size={18} className="text-neuro-cyan" />
                      <span className="text-sm">{t.profile.privacy}</span>
                    </button>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors">
                      <LogOut size={18} />
                      <span className="text-sm font-bold">Log Out</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Legal Modal */}
        <AnimatePresence>
          {showLegal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-neuro-dark/95 backdrop-blur-xl"
            >
              <GlassCard className="max-w-md w-full max-h-[80vh] overflow-y-auto p-8 relative">
                <button onClick={() => setShowLegal(null)} className="absolute top-4 right-4 opacity-50 hover:opacity-100">
                  <X size={24} />
                </button>
                <h3 className="text-2xl font-display font-bold mb-6 neuro-gradient-text">
                  {showLegal === 'terms' ? t.profile.terms : t.profile.privacy}
                </h3>
                <div className="prose prose-invert prose-sm opacity-80 leading-relaxed space-y-4">
                  <p><strong>1. Introdução</strong></p>
                  <p>Bem-vindo ao NEURON. Ao utilizar nosso aplicativo, você concorda com estes termos. Nosso objetivo é fornecer ferramentas de otimização cognitiva baseadas em ciência.</p>
                  <p><strong>2. Uso de Dados</strong></p>
                  <p>Seus dados biométricos e registros de insights são armazenados localmente e sincronizados de forma segura. Não vendemos suas informações para terceiros.</p>
                  <p><strong>3. Responsabilidade</strong></p>
                  <p>O NEURON é uma ferramenta de suporte e não substitui aconselhamento médico profissional. Sempre consulte um especialista antes de iniciar novos protocolos de suplementação ou biohacking.</p>
                  <p><strong>4. Assinatura Pro</strong></p>
                  <p>A assinatura Pro oferece recursos avançados como análise de IA e histórico ilimitado. O cancelamento pode ser feito a qualquer momento nas configurações da sua loja de aplicativos.</p>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppContext.Provider>
  );
}
