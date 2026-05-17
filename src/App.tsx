/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  MoreHorizontal, 
  MessageCircle, 
  ChevronRight, 
  Plus, 
  Rocket, 
  Search, 
  BookOpen, 
  LayoutGrid, 
  Users, 
  Settings, 
  ArrowLeft, 
  Code, 
  Terminal, 
  Activity, 
  Bookmark,
  Music,
  Globe,
  Leaf,
  TrendingUp,
  Zap,
  Star,
  User,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    status: 'building' | 'thinking' | 'here';
  };
  content: string;
  timestamp: string;
  trail?: string;
}

interface Trail {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  builders?: number;
  thoughts?: number;
  daysActive?: number;
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: {
      name: 'alexramos',
      handle: 'alexramos',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Ramos&background=1e2d40&color=f1f5f9',
      status: 'building'
    },
    content: "Some days feel productive. Others feel invisible. Learning to trust the process, even when there's no feedback.",
    timestamp: '2h',
    trail: 'Building my SaaS'
  },
  {
    id: '2',
    author: {
      name: 'serenawu',
      handle: 'serenawu',
      avatar: 'https://ui-avatars.com/api/?name=Serena+Wu&background=1e2d40&color=f1f5f9',
      status: 'thinking'
    },
    content: "Just broken through something I've been stuck on for 72 hours. I don't even want to explain it. I just needed to say it somewhere that gets it.",
    timestamp: '5h',
    trail: 'Sharpening my Craft'
  },
  {
    id: '3',
    author: {
      name: 'marcus_beats',
      handle: 'marcus',
      avatar: 'https://ui-avatars.com/api/?name=Marcus+Beats&background=1e2d40&color=f1f5f9',
      status: 'building'
    },
    content: "Finally got the sub-bass to sit right in the mix without muddying the kick. 2am breakthroughs are the best.",
    timestamp: '8h',
    trail: 'Growing my Music'
  },
  {
    id: '4',
    author: {
      name: 'grace_glow',
      handle: 'graceglow',
      avatar: 'https://ui-avatars.com/api/?name=Grace+Glow&background=1e2d40&color=f1f5f9',
      status: 'building'
    },
    content: "Sampling the new charcoal cleanser formula today. The texture is exactly where I wanted it. Scalability is the next challenge.",
    timestamp: '12h',
    trail: 'Skincare Empire'
  },
  {
    id: '5',
    author: {
      name: 'pastor_john',
      handle: 'pjohn',
      avatar: 'https://ui-avatars.com/api/?name=John+D&background=1e2d40&color=f1f5f9',
      status: 'thinking'
    },
    content: "A calling isn't just about what you do, it's about who you become while doing it. Reframing the message for a younger generation today.",
    timestamp: '1d',
    trail: 'Spreading the Word'
  }
];

const INITIAL_TRAILS: Trail[] = [
  {
    id: '1',
    name: 'Building my SaaS',
    description: 'The journey of building in public.',
    icon: <Rocket className="w-5 h-5" />,
    builders: 12,
    thoughts: 34,
    daysActive: 8
  },
  {
    id: '2',
    name: 'Growing my Music',
    description: 'Artists and producers honing their sound.',
    icon: <Music className="w-5 h-5" />,
    builders: 28,
    thoughts: 89,
    daysActive: 45
  },
  {
    id: '3',
    name: 'Building my Brand',
    description: 'Fashion, cosmetics, and accessories.',
    icon: <Sparkles className="w-5 h-5" />,
    builders: 15,
    thoughts: 42,
    daysActive: 12
  },
  {
    id: '4',
    name: 'Spreading the Word',
    description: 'Ministers, preachers, and evangelists.',
    icon: <Globe className="w-5 h-5" />,
    builders: 9,
    thoughts: 24,
    daysActive: 60
  },
  {
    id: '5',
    name: 'Skincare Empire',
    description: 'Innovating in the world of beauty.',
    icon: <Leaf className="w-5 h-5" />,
    builders: 7,
    thoughts: 18,
    daysActive: 22
  },
  {
    id: '6',
    name: 'Growing my Influence',
    description: 'Content creators and influencers.',
    icon: <TrendingUp className="w-5 h-5" />,
    builders: 34,
    thoughts: 112,
    daysActive: 150
  },
  {
    id: '7',
    name: 'Sharpening my Craft',
    description: 'Anyone leveling up their skills.',
    icon: <Zap className="w-5 h-5" />,
    builders: 56,
    thoughts: 289,
    daysActive: 365
  }
];

export default function App() {
  const [screen, setScreen] = useState<'entry' | 'hub' | 'trail' | 'profile' | 'builders' | 'onboarding'>('entry');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [trails, setTrails] = useState<Trail[]>(INITIAL_TRAILS);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [activeTrailId, setActiveTrailId] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(847);

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    building: '',
    selectedTrails: [] as string[],
    helpOthers: '',
    helpMe: ''
  });
  
  // Builders Search/Filter state
  const [builderSearch, setBuilderSearch] = useState('');
  const [builderTrailFilter, setBuilderTrailFilter] = useState<string | null>(null);

  const buildersData = [
    {
      id: 'b1',
      name: 'Marcus Beats',
      handle: 'marcus_beats',
      building: 'Growing my Music',
      help: 'I mix and master tracks. Looking for visual artists.',
      status: 'building',
      trails: ['Growing my Music', 'Sharpening my Craft'],
      avatar: 'https://ui-avatars.com/api/?name=Marcus+Beats&background=1e2d40&color=f1f5f9'
    },
    {
      id: 'b2',
      name: 'Grace Glow',
      handle: 'grace_glow',
      building: 'Skincare Empire',
      help: 'I formulate skincare products. Looking for e-commerce help.',
      status: 'building',
      trails: ['Skincare Empire', 'Building my Brand'],
      avatar: 'https://ui-avatars.com/api/?name=Grace+Glow&background=1e2d40&color=f1f5f9'
    },
    {
      id: 'b3',
      name: 'Pastor John',
      handle: 'pastor_john',
      building: 'Spreading the Word',
      help: 'I craft sermons and content. Looking for video editors.',
      status: 'thinking',
      trails: ['Spreading the Word'],
      avatar: 'https://ui-avatars.com/api/?name=John+D&background=1e2d40&color=f1f5f9'
    },
    {
      id: 'b4',
      name: 'Adiva Styles',
      handle: 'adiva_styles',
      building: 'Building my Brand',
      help: 'I design accessories. Looking for photographers.',
      status: 'building',
      trails: ['Building my Brand', 'Sharpening my Craft'],
      avatar: 'https://ui-avatars.com/api/?name=Adiva+Styles&background=1e2d40&color=f1f5f9'
    },
    {
      id: 'b5',
      name: 'Success Wav',
      handle: 'success_wav',
      building: 'Growing my Music',
      help: 'I write and produce. Looking for sync licensing help.',
      status: 'building',
      trails: ['Growing my Music'],
      avatar: 'https://ui-avatars.com/api/?name=Success+W&background=1e2d40&color=f1f5f9'
    },
    {
      id: 'b6',
      name: 'Alex Ramos',
      handle: 'alexramos',
      building: 'Building my SaaS',
      help: 'I build full-stack apps. Looking for a designer.',
      status: 'building',
      trails: ['Building my SaaS', 'AI Engineering'],
      avatar: 'https://ui-avatars.com/api/?name=Alex+Ramos&background=1e2d40&color=f1f5f9'
    }
  ];

  const filteredBuilders = buildersData.filter(builder => {
    const matchesSearch = 
      builder.name.toLowerCase().includes(builderSearch.toLowerCase()) ||
      builder.handle.toLowerCase().includes(builderSearch.toLowerCase()) ||
      builder.help.toLowerCase().includes(builderSearch.toLowerCase());
    
    const matchesTrail = !builderTrailFilter || builder.trails.includes(builderTrailFilter);
    
    return matchesSearch && matchesTrail;
  });
  
  // Create Trail Modal State
  const [showCreateTrailModal, setShowCreateTrailModal] = useState(false);
  const [newTrailData, setNewTrailData] = useState({
    name: '',
    description: '',
    icon: 'Rocket',
    manifesto: ''
  });

  const availableIcons = {
    Rocket: <Rocket />,
    Music: <Music />,
    Sparkles: <Sparkles />,
    Globe: <Globe />,
    Leaf: <Leaf />,
    TrendingUp: <TrendingUp />,
    Zap: <Zap />,
    Code: <Code />,
    Activity: <Activity />,
    Star: <Star />
  };

  const handleCreateTrail = () => {
    if (!newTrailData.name || !newTrailData.description) return;
    
    const IconComponent = availableIcons[newTrailData.icon as keyof typeof availableIcons];
    const newTrail: Trail = {
      id: Date.now().toString(),
      name: newTrailData.name,
      description: newTrailData.description,
      icon: React.cloneElement(IconComponent as React.ReactElement, { className: 'w-5 h-5' }),
      builders: 1,
      thoughts: 0,
      daysActive: 0
    };
    
    setTrails([newTrail, ...trails]);
    setShowCreateTrailModal(false);
    setNewTrailData({ name: '', description: '', icon: 'Rocket', manifesto: '' });
  };

  // Profile data (moved to state to be updateable)
  const [userProfile, setUserProfile] = useState({
    name: 'Draxiels',
    handle: 'draxiels',
    bio: 'Product designer & full-stack builder. Obsessed with high-signal digital experiences and dark mode aesthetics.',
    building: 'Building a home for serious builders.',
    status: 'building' as const,
    helpOthers: 'I can help with UI/UX prototyping, Node.js architecture, and product growth strategies.',
    helpMe: 'I am looking for creative engineers and distribution experts who value deep focus.',
    avatar: 'https://ui-avatars.com/api/?name=Draxiels&background=3b82f6&color=fff'
  });

  const [userTrailNames, setUserTrailNames] = useState(['Building my SaaS', 'Sharpening my Craft', 'Growing my Influence']);
  const userTrails = trails.filter(t => userTrailNames.includes(t.name));

  // Status mapping
  const statusColors = {
    building: 'bg-emerald-500',
    thinking: 'bg-amber-500',
    here: 'bg-blue-500'
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      const post: Post = {
        id: Date.now().toString(),
        author: {
          name: userProfile.name,
          handle: userProfile.handle,
          avatar: userProfile.avatar,
          status: userProfile.status
        },
        content: newPostContent,
        timestamp: 'now',
        trail: activeTrailId ? trails.find(t => t.id === activeTrailId)?.name : undefined
      };
      setPosts([post, ...posts]);
      setNewPostContent('');
      setIsPosting(false);
    }, 300);
  };

  const activeTrail = activeTrailId ? trails.find(t => t.id === activeTrailId) : null;
  const filteredPosts = activeTrailId 
    ? posts.filter(p => p.trail === activeTrail?.name)
    : screen === 'profile' 
      ? posts.filter(p => p.author.handle === userProfile.handle)
      : posts;

  // Render Screen 1: The Entry
  if (screen === 'entry') {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle Network Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e2d40_1px,transparent_1px),linear-gradient(to_bottom,#1e2d40_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 flex flex-col items-center text-center space-y-12"
        >
          <div className="space-y-4">
            <h1 className="text-5xl font-mono tracking-tight text-white font-bold uppercase transition-all">
              The Calling
            </h1>
            <AnimatePresence mode="wait">
              <motion.p 
                key="manifesto-line"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-slate-500 font-mono text-sm uppercase tracking-[0.2em]"
              >
                For the ones building something real.
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setScreen('onboarding')}
            className="px-16 py-4 bg-transparent border border-blue-500 text-blue-500 font-bold uppercase tracking-[0.3em] rounded-sm transition-all duration-300 shadow-lg shadow-blue-500/10"
          >
            Enter
          </motion.button>
        </motion.div>

        <div className="absolute bottom-12 left-12 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-slate-500">{liveCount} builders active right now.</span>
        </div>
      </div>
    );
  }

  // Render Screen 1.5: Onboarding
  if (screen === 'onboarding') {
    const finishOnboarding = () => {
      setUserProfile(prev => ({
        ...prev,
        name: onboardingData.name,
        handle: onboardingData.name.toLowerCase().replace(/\s+/g, ''),
        building: onboardingData.building,
        helpOthers: onboardingData.helpOthers,
        helpMe: onboardingData.helpMe,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(onboardingData.name)}&background=3b82f6&color=fff`
      }));
      setUserTrailNames(onboardingData.selectedTrails);
      setScreen('hub');
    };

    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center relative overflow-hidden p-6">
        {/* Subtle Network Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e2d40_1px,transparent_1px),linear-gradient(to_bottom,#1e2d40_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Step Indicator */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-4 items-center">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step} 
              className={`h-1 transition-all duration-500 rounded-full ${onboardingStep >= step ? 'w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'w-4 bg-navy-800'}`} 
            />
          ))}
          <span className="ml-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Step {onboardingStep} of 4</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl z-10"
          >
            {/* Step 1: Identity */}
            {onboardingStep === 1 && (
              <div className="space-y-8 text-center sm:text-left">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight text-white uppercase italic">What do they call you?</h2>
                  <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">This is how the community will know you.</p>
                </div>
                <input 
                  autoFocus
                  type="text" 
                  value={onboardingData.name}
                  onChange={e => setOnboardingData({...onboardingData, name: e.target.value})}
                  placeholder="Your name or alias"
                  className="w-full bg-transparent border-b-2 border-navy-800 pb-4 text-3xl text-white outline-none focus:border-blue-500 transition-colors placeholder:text-slate-800"
                />
                <button 
                  disabled={!onboardingData.name.trim()}
                  onClick={() => setOnboardingStep(2)}
                  className="w-full sm:w-auto px-12 py-4 bg-blue-500 text-white font-bold uppercase text-xs tracking-[0.3em] rounded-sm hover:bg-blue-600 transition-all disabled:opacity-20"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Calling */}
            {onboardingStep === 2 && (
              <div className="space-y-8 text-center sm:text-left">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight text-white uppercase italic">Drop your echo.</h2>
                  <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Be specific. Vague answers attract vague people.</p>
                </div>
                <textarea 
                  autoFocus
                  value={onboardingData.building}
                  onChange={e => setOnboardingData({...onboardingData, building: e.target.value})}
                  placeholder="e.g. I am building a skincare brand for the next generation."
                  className="w-full bg-navy-900 border border-navy-800 rounded-sm p-6 text-xl text-white outline-none focus:border-blue-500 transition-colors placeholder:text-slate-800 h-32 resize-none"
                />
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button 
                    disabled={!onboardingData.building.trim()}
                    onClick={() => setOnboardingStep(3)}
                    className="w-full sm:w-auto px-12 py-4 bg-blue-500 text-white font-bold uppercase text-xs tracking-[0.3em] rounded-sm hover:bg-blue-600 transition-all disabled:opacity-20"
                  >
                    Continue →
                  </button>
                  <button onClick={() => setOnboardingStep(1)} className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">← Back</button>
                </div>
              </div>
            )}

            {/* Step 3: Trails */}
            {onboardingStep === 3 && (
              <div className="space-y-8">
                <div className="space-y-2 text-center sm:text-left">
                  <h2 className="text-4xl font-bold tracking-tight text-white uppercase italic">Which paths are you walking?</h2>
                  <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">You can join more later. Start with what's true right now.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {trails.map(trail => (
                    <button 
                      key={trail.id}
                      onClick={() => {
                        const exists = onboardingData.selectedTrails.includes(trail.name);
                        const next = exists 
                          ? onboardingData.selectedTrails.filter(t => t !== trail.name)
                          : [...onboardingData.selectedTrails, trail.name];
                        setOnboardingData({...onboardingData, selectedTrails: next});
                      }}
                      className={`p-4 rounded-sm border text-left transition-all group ${
                        onboardingData.selectedTrails.includes(trail.name) 
                        ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'bg-navy-900 border-navy-800 hover:border-navy-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {React.cloneElement(trail.icon as React.ReactElement, { 
                          className: `w-5 h-5 ${onboardingData.selectedTrails.includes(trail.name) ? 'text-blue-500' : 'text-slate-500'}` 
                        })}
                        <span className={`text-xs font-bold uppercase tracking-widest ${onboardingData.selectedTrails.includes(trail.name) ? 'text-blue-500' : 'text-slate-300'}`}>
                          {trail.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{trail.description}</p>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button 
                    disabled={onboardingData.selectedTrails.length === 0}
                    onClick={() => setOnboardingStep(4)}
                    className="w-full sm:w-auto px-12 py-4 bg-blue-500 text-white font-bold uppercase text-xs tracking-[0.3em] rounded-sm hover:bg-blue-600 transition-all disabled:opacity-20"
                  >
                    Continue →
                  </button>
                  <button onClick={() => setOnboardingStep(2)} className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">← Back</button>
                </div>
              </div>
            )}

            {/* Step 4: Reciprocity */}
            {onboardingStep === 4 && (
              <div className="space-y-8 text-center sm:text-left">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight text-white uppercase italic">What do you bring to the table?</h2>
                  <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">The Calling runs on reciprocity. Give first.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">I can help others with...</label>
                    <input 
                      type="text" 
                      value={onboardingData.helpOthers}
                      onChange={e => setOnboardingData({...onboardingData, helpOthers: e.target.value})}
                      placeholder="e.g. I design logos, I mix tracks, I build apps"
                      className="w-full bg-navy-900 border border-navy-800 rounded-sm p-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">I'm looking for...</label>
                    <input 
                      type="text" 
                      value={onboardingData.helpMe}
                      onChange={e => setOnboardingData({...onboardingData, helpMe: e.target.value})}
                      placeholder="e.g. Someone who can help me grow an audience"
                      className="w-full bg-navy-900 border border-navy-800 rounded-sm p-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button 
                    disabled={!onboardingData.helpOthers.trim() || !onboardingData.helpMe.trim()}
                    onClick={finishOnboarding}
                    className="w-full sm:w-auto px-12 py-4 bg-blue-500 text-white font-bold uppercase text-xs tracking-[0.3em] rounded-sm hover:bg-blue-600 transition-all shadow-lg"
                  >
                    Enter The Calling →
                  </button>
                  <button onClick={() => setOnboardingStep(3)} className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">← Back</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Render Screen 2/3: The Hub / Trail Mode
  return (
    <div className="min-h-screen bg-navy-950 flex text-slate-100 selection:bg-blue-500/30">
      
      {/* LEFT PANEL: Navigation */}
      <aside 
        className={`bg-navy-950 border-r border-navy-800 flex flex-col transition-all duration-300 z-50 ${
          screen === 'trail' ? 'w-[64px]' : 'w-[220px]'
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <Terminal className="w-6 h-6 text-blue-500" />
          {screen !== 'trail' && <span className="font-bold tracking-tighter text-lg uppercase">The Calling</span>}
        </div>

        <div className="flex-grow px-3 space-y-1">
          {/* User Status */}
          {screen !== 'trail' && (
            <div 
              onClick={() => { setScreen('profile'); setActiveTrailId(null); }}
              className="mb-8 px-3 py-4 flex items-center gap-3 bg-navy-900 rounded-sm border border-navy-800 cursor-pointer hover:border-navy-700 transition-all group"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src={userProfile.avatar} alt="" />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-navy-900 rounded-full`} />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-mono font-bold truncate group-hover:text-blue-500 transition-colors">{userProfile.handle}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{userProfile.status}</span>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            <NavItem icon={<LayoutGrid />} label="Hub" active={screen === 'hub' && !activeTrailId} onClick={() => { setActiveTrailId(null); setScreen('hub'); }} compact={screen === 'trail'} />
            <NavItem icon={<BookOpen />} label="Trails" active={!!activeTrailId} compact={screen === 'trail'} onClick={() => { if(!activeTrailId) setActiveTrailId(trails[0].id); if(screen !== 'trail') setScreen('trail'); }} />
            <NavItem icon={<Users />} label="Builders" active={screen === 'builders'} onClick={() => { setScreen('builders'); setActiveTrailId(null); }} compact={screen === 'trail'} />
            <NavItem icon={<Plus />} label="Create" onClick={() => setShowCreateTrailModal(true)} compact={screen === 'trail'} />
          </nav>

          {screen !== 'trail' && (
            <div className="mt-8 pt-8 border-t border-navy-800/50 space-y-4">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Trails</span>
              <div className="space-y-1">
                {userTrails.map(t => (
                  <button key={t.id} onClick={() => { setActiveTrailId(t.id); setScreen('trail'); }} className={`w-full text-left px-3 py-1.5 text-xs transition-colors truncate font-mono ${activeTrailId === t.id ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}>
                    ◈ {t.name}
                  </button>
                ))}
                {userTrails.length === 0 && (
                  <span className="px-3 text-[10px] font-mono text-slate-700 uppercase italic">None yet</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <Settings className="w-5 h-5 text-slate-600 hover:text-slate-400 cursor-pointer transition-colors" />
        </div>
      </aside>

      {/* CENTER PANEL: Feed / Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="px-8 py-6 flex items-center justify-between border-b border-navy-800/50 bg-navy-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {(screen === 'trail' || screen === 'profile') && (
              <button 
                onClick={() => { setScreen('hub'); setActiveTrailId(null); }}
                className="p-1.5 hover:bg-navy-800 rounded transition-colors text-slate-500 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-2xl font-bold tracking-tight">
              {screen === 'trail' ? activeTrail?.name : screen === 'profile' ? 'Builder Dossier' : screen === 'builders' ? 'Directory' : 'The Hub'}
            </h2>
          </div>
          {screen === 'builders' && (
            <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] bg-emerald-500/10 px-3 py-1 rounded-sm border border-emerald-500/20 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {liveCount} online
            </div>
          )}
          {screen === 'hub' && (
            <div className="flex gap-1">
              {['All', 'Trails', 'Thoughts', 'Active'].map(f => (
                <button key={f} className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                  {f}
                </button>
              ))}
            </div>
          )}
          {screen === 'trail' && (
            <div className="flex gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>{activeTrail?.builders} builders</span>
              <span>{activeTrail?.thoughts} thoughts</span>
              <span>{activeTrail?.daysActive}d active</span>
            </div>
          )}
        </header>

        <div className="flex-grow overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className={`mx-auto py-8 px-8 space-y-6 ${screen === 'trail' || screen === 'profile' ? 'max-w-3xl' : 'max-w-5xl'}`}>
            
            {/* Builders Screen Content */}
            {screen === 'builders' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search allies by name, trail, or skill..."
                      value={builderSearch}
                      onChange={(e) => setBuilderSearch(e.target.value)}
                      className="w-full bg-navy-900 border border-navy-800 rounded-sm py-4 pl-12 pr-4 text-white focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {trails.map(trail => (
                      <button 
                        key={trail.id}
                        onClick={() => setBuilderTrailFilter(builderTrailFilter === trail.name ? null : trail.name)}
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-all ${
                          builderTrailFilter === trail.name 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'border-navy-800 text-slate-500 hover:border-navy-700 hover:text-slate-300'
                        }`}
                      >
                        {trail.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBuilders.map((builder) => (
                    <motion.div 
                      key={builder.id}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                      className="bg-navy-900 border border-navy-800 rounded-sm p-6 flex flex-col items-center text-center space-y-4 group cursor-default"
                    >
                      <div className="relative">
                        <div className="w-20 h-20 rounded-sm overflow-hidden border border-navy-800">
                          <img src={builder.avatar} alt={builder.name} className="w-full h-full object-cover" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-navy-900 ${builder.status === 'building' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-white tracking-tight leading-tight">{builder.name}</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">@{builder.handle}</p>
                      </div>

                      <div className="text-xs space-y-2">
                        <p className="text-blue-500 font-bold uppercase tracking-[0.1em] text-[10px]">Building: {builder.building}</p>
                        <p className="text-slate-400 italic text-[11px] leading-relaxed">"{builder.help}"</p>
                      </div>

                      <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                         {builder.trails.slice(0, 2).map((trail, i) => (
                           <span key={i} className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-navy-950 border border-navy-800 text-slate-500 rounded-sm truncate">
                             {trail}
                           </span>
                         ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredBuilders.length === 0 && (
                   <div className="py-20 text-center space-y-4 border border-dashed border-navy-800 rounded-sm">
                     <Users className="w-12 h-12 text-slate-800 mx-auto" />
                     <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">No builders found matching your search.</p>
                   </div>
                )}
              </div>
            )}
            
            {/* Profile Header (Only for Profile screen) */}
            {screen === 'profile' && (
              <div className="space-y-8 mb-12">
                <div className="relative group">
                  <div className="h-32 w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-sm border border-navy-800" />
                  <div className="absolute -bottom-6 left-8 flex items-end gap-6">
                    <div className="w-24 h-24 rounded-sm border-4 border-navy-950 overflow-hidden shadow-2xl">
                      <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="pb-2">
                       <h3 className="text-2xl font-bold text-white tracking-tight">{userProfile.name}</h3>
                       <div className="flex items-center gap-3">
                         <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">@{userProfile.handle}</span>
                         <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           Building
                         </span>
                       </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-navy-950/50 backdrop-blur-md border border-navy-800 rounded-sm text-slate-400 hover:text-white transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-navy-950/50 backdrop-blur-md border border-navy-800 rounded-sm text-slate-400 hover:text-white transition-all">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 pt-8">
                  <div className="space-y-8">
                    <section className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Biography</h4>
                      <p className="text-slate-100 leading-relaxed">{userProfile.bio}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">What I'm Building</h4>
                      <p className="text-xl font-bold text-white tracking-tight">{userProfile.building}</p>
                    </section>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                      <section className="space-y-2">
                        <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">How I can help</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{userProfile.helpOthers}</p>
                      </section>
                      <section className="space-y-2">
                        <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-[0.2em]">I am looking for</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{userProfile.helpMe}</p>
                      </section>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <section className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Walking Trails</h4>
                      <div className="flex flex-wrap gap-2">
                         {userTrails.map(trail => (
                           <button 
                             key={trail.id} 
                             onClick={() => { setActiveTrailId(trail.id); setScreen('trail'); }}
                             className="text-[9px] uppercase font-bold tracking-widest text-slate-400 border border-navy-800 px-3 py-1.5 rounded-sm hover:border-blue-500/50 hover:text-blue-500 transition-all"
                           >
                             {trail.name}
                           </button>
                         ))}
                      </div>
                    </section>
                  </div>
                </div>
                
                <div className="pt-12 border-t border-navy-800/50">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 text-center">Thought History</h4>
                </div>
              </div>
            )}

            {/* Compose (Hide on profile/builders if it doesn't fit) */}
            {(screen !== 'profile' && screen !== 'builders') && (
              <div className="bg-navy-900 border border-navy-800 rounded-sm p-6 focus-within:border-blue-500/50 transition-colors">
                <textarea 
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  placeholder={screen === 'trail' ? "Contribute to this trail..." : "Drop your echo."}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-600 resize-none min-h-[60px] text-lg"
                />
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-navy-800/50">
                  <div className="flex gap-4 text-slate-600">
                    <ImageIcon className="w-5 h-5 hover:text-slate-400 cursor-pointer" />
                    <Code className="w-5 h-5 hover:text-slate-400 cursor-pointer" />
                  </div>
                  <button 
                    onClick={handlePost}
                    disabled={!newPostContent.trim() || isPosting}
                    className="px-6 py-2 bg-blue-500 text-white font-bold uppercase text-xs tracking-widest rounded-sm hover:bg-blue-600 transition-all disabled:opacity-30 active:scale-95"
                  >
                    {isPosting ? 'Sending...' : 'Post'}
                  </button>
                </div>
              </div>
            )}

            {/* Posts */}
            <div className="space-y-4 pb-20">
              {screen === 'profile' && filteredPosts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-600 font-mono text-xs">Nothing posted yet. Start building in public.</p>
                </div>
              )}
              <AnimatePresence mode="popLayout">
                {filteredPosts.map(post => (
                  <motion.div 
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-navy-900 border border-navy-800 rounded-sm p-6 group hover:border-navy-700 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-navy-800 relative flex-shrink-0">
                        <img src={post.author.avatar} alt="" />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-navy-900 rounded-full ${statusColors[post.author.status]}`} />
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-200">@{post.author.handle}</span>
                            <span className="text-slate-600 text-[10px] font-mono tracking-tighter uppercase">{post.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            {post.trail && !activeTrailId && (
                              <button onClick={() => { setActiveTrailId(trails.find(t => t.name === post.trail)?.id || null); setScreen('trail'); }} className="text-[10px] uppercase font-bold text-slate-500 hover:text-blue-500 transition-colors">
                                {post.trail}
                              </button>
                            )}
                            <button className="text-slate-700 hover:text-slate-400">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        
                        <div className="flex items-center gap-8 pt-2 text-slate-600">
                          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-blue-500 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>Respond</span>
                          </button>
                          {screen !== 'trail' && (
                            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                              <span>Continue Trail →</span>
                            </button>
                          )}
                          <div className="ml-auto flex gap-4">
                            <Activity className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
                            <Bookmark className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT PANEL: Live Intel (Hides in Trail mode) */}
      {screen !== 'trail' && (
        <aside className="w-[280px] border-l border-navy-800 bg-navy-950 p-6 space-y-10 hidden xl:block overflow-y-auto">
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active Trails</h3>
            <div className="space-y-4">
              {trails.slice(0, 5).map(t => (
                <div key={t.id} className="group cursor-pointer" onClick={() => { setActiveTrailId(t.id); setScreen('trail'); }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono text-slate-300 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{t.name}</span>
                    <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-blue-500 transition-all" />
                  </div>
                  <div className="h-1 w-full bg-navy-900 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.random() * 60 + 20}%` }} className="h-full bg-blue-500/50" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Builders Online</h3>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className="relative w-8 h-8 group cursor-pointer">
                  <img 
                    src={`https://ui-avatars.com/api/?name=B${i}&background=111827&color=64748b`} 
                    alt="" 
                    className="w-full h-full rounded-sm border border-navy-800 group-hover:border-blue-500 transition-all"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-2 border-navy-950 rounded-full ${i % 3 === 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 bg-navy-900 border border-navy-800 rounded-sm space-y-4 border-l-amber-500 border-l-2">
            <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Daily Prompt</h3>
            <p className="text-sm text-slate-400 italic font-medium leading-relaxed">
              "What problem are you solving that nobody else sees yet?"
            </p>
          </section>
        </aside>
      )}

      {/* CREATE TRAIL MODAL */}
      <AnimatePresence>
        {showCreateTrailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setShowCreateTrailModal(false)}
               className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-navy-900 border border-navy-800 rounded-sm p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
              
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic">Start a New Trail</h2>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Define your movement.</p>
                 </div>
                 <button onClick={() => setShowCreateTrailModal(false)} className="p-2 hover:bg-navy-800 rounded-sm text-slate-500 hover:text-white transition-colors">
                    <Plus className="w-6 h-6 rotate-45" />
                 </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trail Name</label>
                  <input 
                    type="text" 
                    value={newTrailData.name}
                    onChange={e => setNewTrailData({...newTrailData, name: e.target.value})}
                    placeholder="e.g. Neo-Brutalism Design"
                    className="w-full bg-navy-950 border border-navy-800 rounded-sm p-4 text-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Mission (One Sentence)</label>
                  <input 
                    type="text" 
                    value={newTrailData.description}
                    onChange={e => setNewTrailData({...newTrailData, description: e.target.value})}
                    placeholder="A path for designers exploring raw textures."
                    className="w-full bg-navy-950 border border-navy-800 rounded-sm p-4 text-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Identity (Icon)</label>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(availableIcons).map(([name, icon]) => (
                      <button 
                        key={name}
                        onClick={() => setNewTrailData({...newTrailData, icon: name})}
                        className={`p-4 rounded-sm border flex items-center justify-center transition-all ${
                          newTrailData.icon === name ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-navy-950 border-navy-800 hover:border-navy-700'
                        }`}
                      >
                        {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${newTrailData.icon === name ? 'text-blue-500' : 'text-slate-600'}` })}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">The Manifesto</label>
                  <textarea 
                    value={newTrailData.manifesto}
                    onChange={e => setNewTrailData({...newTrailData, manifesto: e.target.value})}
                    placeholder="Why does this trail exist? What are we building towards?"
                    className="w-full bg-navy-950 border border-navy-800 rounded-sm p-4 text-white focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleCreateTrail}
                    className="px-10 py-3 bg-blue-500 text-white font-bold uppercase text-xs tracking-[0.2em] rounded-sm hover:bg-blue-600 transition-all active:scale-[0.98]"
                  >
                    Forge Trail
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick, compact = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, compact?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all relative group cursor-pointer ${
        active 
        ? 'text-blue-500 bg-blue-500/5' 
        : 'text-slate-500 hover:text-slate-100 hover:bg-navy-900'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 flex-shrink-0' })}
      {!compact && <span className="text-xs font-bold uppercase tracking-widest truncate">{label}</span>}
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-r-full" />}
    </button>
  );
}
