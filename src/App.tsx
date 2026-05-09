import React, { useState } from 'react';
import { 
  Settings, Trash2, Globe, Volume2, Accessibility, Info, Sparkles, 
  User, MapPin, LayoutGrid, X, Rocket, Wand2, Plus, Megaphone, 
  Target, Pencil, Share2, CheckCircle2, ChevronRight, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CopilotKit, useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

type AvatarGender = 'male' | 'female';
type Step = 'onboarding' | 'dashboard' | 'generator';

interface MarketingResource {
  id: string;
  type: 'post' | 'story' | 'strategy';
  title: string;
  content: string;
  status: 'draft' | 'ready';
  platform: 'Instagram' | 'Facebook' | 'LinkedIn';
}

function AppContent() {
  const [avatarGender, setAvatarGender] = useState<AvatarGender>('female');
  const [step, setStep] = useState<Step>('onboarding');
  const [resources, setResources] = useState<MarketingResource[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Filters for content generation
  const [filterPlatform, setFilterPlatform] = useState('Instagram');
  const [filterTone, setFilterTone] = useState('Empático');
  const [filterObjective, setFilterObjective] = useState('Ventas');

  useCopilotReadable({
    description: "The user's marketing resources and drafts",
    value: resources,
  });

  useCopilotReadable({
    description: "The current step in the application flow",
    value: step,
  });

  useCopilotAction({
    name: "addMarketingResource",
    description: "Adds a new marketing resource (post, story, or strategy) to the dashboard",
    parameters: [
      { name: "type", type: "string", enum: ["post", "story", "strategy"], required: true },
      { name: "title", type: "string", required: true },
      { name: "content", type: "string", required: true },
      { name: "platform", type: "string", required: true },
    ],
    handler: async ({ type, title, content, platform }) => {
      const newResource: MarketingResource = {
        id: Math.random().toString(36).substr(2, 9),
        type: type as any,
        title,
        content,
        platform: platform as any,
        status: 'draft',
      };
      setResources(prev => [newResource, ...prev]);
      setStep('dashboard');
    },
  });

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    // This will be handled by CopilotKit in a real scenario, 
    // but we can simulate the UI feedback here.
    setTimeout(() => {
      const demoPost: MarketingResource = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'post',
        title: `Contenido para ${filterPlatform}`,
        content: `Nueva estrategia de ${filterObjective} con un tono ${filterTone}. Diseñada específicamente para ser inclusiva y visual. Incluye soporte de Lengua de Señas para máximo alcance en la comunidad sorda.`,
        platform: filterPlatform as any,
        status: 'ready',
      };
      setResources(prev => [demoPost, ...prev]);
      setIsGenerating(false);
      setStep('dashboard');
    }, 2000);
  };

  const applyTemplate = (template: Partial<MarketingResource>) => {
    const newResource: MarketingResource = {
      id: Math.random().toString(36).substr(2, 9),
      type: template.type || 'post',
      title: template.title || 'Nueva Plantilla',
      content: template.content || '',
      platform: template.platform || 'Instagram',
      status: 'draft',
    };
    setResources(prev => [newResource, ...prev]);
    setShowTemplates(false);
    setStep('dashboard');
  };

  if (step === 'onboarding') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl border border-zinc-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <Rocket className="text-white" size={32} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              AI Tinkerers Hackathon
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none mb-2">SignMarket</h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              El agente de marketing que habla tu idioma. <br/>
              <span className="font-bold text-zinc-900 decoration-indigo-500 underline underline-offset-4 decoration-2">Accesible. Inclusivo. Universal.</span>
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 text-center">Configura tu Agente</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAvatarGender('female')}
                  className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 ${
                    avatarGender === 'female' ? 'border-indigo-600 bg-indigo-50/50 scale-105' : 'border-zinc-100 bg-zinc-50 grayscale opacity-60'
                  }`}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    <User size={28} className={avatarGender === 'female' ? 'text-indigo-600' : 'text-zinc-400'} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${avatarGender === 'female' ? 'text-indigo-600' : 'text-zinc-500'}`}>Consultora</span>
                </button>
                <button
                  onClick={() => setAvatarGender('male')}
                  className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 ${
                    avatarGender === 'male' ? 'border-indigo-600 bg-indigo-50/50 scale-105' : 'border-zinc-100 bg-zinc-50 grayscale opacity-60'
                  }`}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    <User size={28} className={avatarGender === 'male' ? 'text-indigo-600' : 'text-zinc-400'} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${avatarGender === 'male' ? 'text-indigo-600' : 'text-zinc-500'}`}>Consultor</span>
                </button>
              </div>
            </div>

            <button
              id="start-button"
              onClick={() => setStep('dashboard')}
              className="w-full py-5 bg-zinc-900 text-white rounded-full font-black tracking-widest uppercase text-xs shadow-2xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Iniciar Agencia IA 
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 font-sans">
      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white border-r border-zinc-100 flex flex-col items-center py-8 gap-8 z-30">
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg -rotate-3">
          <Rocket className="text-white" size={20} />
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={() => setStep('dashboard')} className={`p-3 rounded-2xl transition-all ${step === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-400 hover:bg-zinc-50'}`}>
            <LayoutGrid size={24} />
          </button>
          <button onClick={() => setStep('generator')} className={`p-3 rounded-2xl transition-all ${step === 'generator' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-400 hover:bg-zinc-50'}`}>
            <Plus size={24} />
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <button className="p-3 text-zinc-400 hover:bg-zinc-50 rounded-2xl"><Accessibility size={24} /></button>
          <button className="p-3 text-zinc-400 hover:bg-zinc-50 rounded-2xl"><Settings size={24} /></button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pl-20 min-h-screen">
        <div className="max-w-6xl mx-auto p-10">
          <header className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">Dashboards</span>
                <span className="text-zinc-300">/</span>
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Resumen General</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter">Panel de Estrategia AI</h1>
            </div>
            
            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Tu Agente</span>
                <span className="font-bold text-sm">{avatarGender === 'female' ? 'Consultora Signa' : 'Consultor Mark'}</span>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <User size={20} />
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {step === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Estrategias Generadas', value: resources.filter(r => r.type === 'strategy').length, icon: Target, color: 'text-blue-500' },
                    { label: 'Contenido Listos', value: resources.length, icon: Megaphone, color: 'text-indigo-500' },
                    { label: 'Canales Activos', value: 3, icon: Share2, color: 'text-amber-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm flex items-center justify-between overflow-hidden relative">
                      <div className="relative z-10">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">{stat.label}</span>
                        <span className="text-4xl font-black tracking-tighter">{stat.value}</span>
                      </div>
                      <stat.icon className={`${stat.color} opacity-20 absolute -right-4 -bottom-4 rotate-12`} size={80} />
                    </div>
                  ))}
                </div>

                {/* Content Grid */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black tracking-tight">Recursos Recientes</h2>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowTemplates(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                      >
                        <LayoutGrid size={16} /> Plantillas
                      </button>
                      <button 
                        onClick={() => setStep('generator')}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-zinc-200 transition-all hover:scale-105 active:scale-95"
                      >
                        <Plus size={16} /> Crear Nuevo
                      </button>
                    </div>
                  </div>

                  {showTemplates && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100"
                    >
                      {[
                        { title: 'Lanzamiento de Marca', type: 'strategy', platform: 'Instagram', content: 'Campaña visual enfocada en la historia del emprendedor sordo. 5 videos en LSCH explicando la misión.' },
                        { title: 'Promoción de Temporada', type: 'post', platform: 'Facebook', content: 'Oferta especial de 30% de descuento. Gráfico de alto contraste con texto claro y código QR.' },
                        { title: 'Testimonio Inclusivo', type: 'story', platform: 'LinkedIn', content: 'Entrevista a un cliente satisfecho. Subtítulos dinámicos y recuadro de interpretación.' },
                      ].map((t, i) => (
                        <button 
                          key={i} 
                          onClick={() => applyTemplate(t as any)}
                          className="text-left bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group"
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2 block">{t.type}</span>
                          <h4 className="font-bold text-zinc-900 mb-2 group-hover:text-indigo-600">{t.title}</h4>
                          <p className="text-xs text-zinc-500 line-clamp-2">{t.content}</p>
                        </button>
                      ))}
                      <button onClick={() => setShowTemplates(false)} className="col-span-full text-center text-[10px] font-black uppercase tracking-widest text-zinc-400 py-2">Cerrar Plantillas</button>
                    </motion.div>
                  )}

                  {resources.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-zinc-200 p-20 text-center">
                      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Pencil className="text-zinc-300" />
                      </div>
                      <h3 className="font-bold text-zinc-400 mb-2">No hay contenido generado todavía</h3>
                      <button onClick={() => setStep('generator')} className="text-indigo-600 font-bold text-sm decoration-indigo-200 underline underline-offset-4">Empieza creando tu primera estrategia</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {resources.map((res) => (
                        <motion.div 
                          layoutId={res.id}
                          key={res.id} 
                          className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-full">{res.platform}</span>
                            <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${res.status === 'ready' ? 'text-green-600' : 'text-amber-600'}`}>
                              <CheckCircle2 size={12} /> {res.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-black mb-3 tracking-tight">{res.title}</h3>
                          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-6">{res.content}</p>
                          <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                                <Share2 size={14} />
                              </div>
                              <span className="text-xs font-bold text-zinc-400">Publicar</span>
                            </div>
                            <button className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-300 hover:bg-red-50 hover:text-red-400 transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="generator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-white p-12 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <Wand2 className="text-indigo-500 opacity-20" size={120} />
                  </div>
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-10 tracking-tighter">Filtros de Generación</h2>
                    
                    <div className="space-y-10">
                      {/* Platform */}
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-1">
                          <Globe size={12} /> Plataforma Destino
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {['Instagram', 'Facebook', 'LinkedIn'].map((p) => (
                            <button
                              key={p}
                              onClick={() => setFilterPlatform(p)}
                              className={`py-6 rounded-3xl border-2 font-black text-xs tracking-widest uppercase transition-all ${
                                filterPlatform === p ? 'border-zinc-900 bg-zinc-900 text-white scale-105 shadow-xl shadow-zinc-200' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tone */}
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-1">
                          <Volume2 size={12} /> Tono de Comunicación
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {['Empático', 'Profesional', 'Divertido', 'Urgente'].map((t) => (
                            <button
                              key={t}
                              onClick={() => setFilterTone(t)}
                              className={`py-4 rounded-2xl border-2 font-black text-[10px] tracking-widest uppercase transition-all ${
                                filterTone === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Objective */}
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-1">
                          <Target size={12} /> Objetivo de Negocio
                        </label>
                        <div className="flex flex-wrap gap-4">
                          {['Ventas', 'Consciencia', 'Engagement', 'Inclusión'].map((o) => (
                            <button
                              key={o}
                              onClick={() => setFilterObjective(o)}
                              className={`px-8 py-4 rounded-full border-2 font-black text-[10px] tracking-widest uppercase transition-all ${
                                filterObjective === o ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'
                              }`}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-8">
                        <button
                          id="generate-button"
                          onClick={handleGenerateContent}
                          disabled={isGenerating}
                          className={`w-full py-6 bg-zinc-900 text-white rounded-3xl font-black tracking-[0.2em] uppercase text-sm shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 ${
                            isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600 hover:shadow-indigo-100'
                          }`}
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              IA Generando...
                            </>
                          ) : (
                            <>
                              <Sparkles size={20} />
                              Generar con Inteligencia Artificial
                            </>
                          )}
                        </button>
                        <p className="text-center text-zinc-400 text-xs mt-6 font-bold uppercase tracking-widest">
                          Soporte completo para <span className="text-indigo-500">Lengua de Señas Chilena</span> en el contenido visual
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <CopilotPopup
        instructions={`Eres el asistente experto de SignMarket Studio. Tu nombre es ${avatarGender === 'female' ? 'Signa' : 'Mark'}. Ayuda al usuario a navegar la plataforma y a generar contenido de marketing inclusivo. Habla de forma clara, directa y empática. El usuario es un emprendedor sordo, así que prioriza explicaciones visuales y estructuradas.`}
        labels={{
          title: `SignMarket Assistant - ${avatarGender === 'female' ? 'Signa' : 'Mark'}`,
          initial: "Hola, soy tu consultor de marketing IA. ¿Qué quieres lograr con tu negocio hoy?",
          placeholder: "Escribe tu idea de marketing aquí...",
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <CopilotKit runtimeUrl="/copilotkit">
      <AppContent />
    </CopilotKit>
  );
}
