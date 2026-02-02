/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useMotionTemplate, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Github, 
  Mail, 
  BookOpen,
  Cuboid,
  Award,
  ExternalLink,
  Target,
  Quote,
  Gem,
  ScrollText,
  Cpu,
  Globe,
  Twitter,
} from 'lucide-react';
import { Project, Paper, Certificate } from './types';

// --- Types ---
interface Particle {
    x: number; y: number; 
    ox: number; oy: number; 
    vx: number; vy: number;
    color: string;
    size: number;
}

// --- Icons & Logos ---

const XLogo = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const LinkedInLogo = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// --- Interactions ---

const MagicCursor = () => {
  const [hoverState, setHoverState] = useState<'default' | 'active'>('default');
  const [isClicking, setIsClicking] = useState(false);
  
  const cursorX = useSpring(0, { stiffness: 1200, damping: 40, mass: 0.3 }); // Snappy response
  const cursorY = useSpring(0, { stiffness: 1200, damping: 40, mass: 0.3 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('interactive-hover') ||
        target.closest('.interactive-hover');
        
      setHoverState(isInteractive ? 'active' : 'default');
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ 
        x: cursorX, 
        y: cursorY, 
        translateX: '-50%', 
        translateY: '-50%',
      }}
    >
      <motion.div 
        animate={{ scale: isClicking ? 0.7 : hoverState === 'active' ? 1.5 : 1 }}
        className="relative flex items-center justify-center"
      >
          {/* Diamond Cursor */}
          <div className="w-3 h-3 rotate-45 bg-[#FCF6BA] shadow-[0_0_20px_4px_rgba(212,175,55,0.8)] z-10 border border-[#AA771C]" />
          
          {/* Magic Rings */}
          <motion.div 
             animate={{ rotate: 360, scale: [1, 1.1, 1] }}
             transition={{ rotate: { duration: 4, ease: "linear", repeat: Infinity }, scale: { duration: 1, repeat: Infinity } }}
             className="absolute w-8 h-8 border border-[#D4AF37]/50 rounded-full border-dashed opacity-60"
          />
           <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 8, ease: "linear", repeat: Infinity }}
             className="absolute w-12 h-12 border border-[#8F7218]/30 rounded-full opacity-40"
          />
      </motion.div>
    </motion.div>
  );
};

// --- Radiant Jewel Component ---
const SparklingJewel = () => (
    <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-gold-500/20 blur-[6px] rounded-full animate-pulse"></div>
        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 relative z-10 drop-shadow-[0_0_3px_rgba(212,175,55,0.8)]">
            <path d="M12 2L2 12l10 10 10-10L12 2z" fill="url(#jewelGradient)" stroke="#FCF6BA" strokeWidth="0.5" />
            <defs>
                <linearGradient id="jewelGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FCF6BA" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8F7218" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

// --- Royal Background with Interactive Particles Only (No Dunes/Sky) ---
const RoyalBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true }); // Enable alpha for transparency
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // Interactive Gold Dust
        const dust = Array.from({length: 200}, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2,
            color: Math.random() > 0.5 ? '#FCF6BA' : '#D4AF37'
        }));

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            // Clear entire canvas to show dark background from HTML/CSS
            ctx.clearRect(0, 0, width, height);

            // Update & Draw Particles
            dust.forEach(d => {
                // Physics: Mouse Interaction (Repulsion)
                const dx = mouseRef.current.x - d.x;
                const dy = mouseRef.current.y - d.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const forceRadius = 150;

                if (dist < forceRadius) {
                    const force = (forceRadius - dist) / forceRadius;
                    const angle = Math.atan2(dy, dx);
                    // Push particles away smoothly
                    d.vx -= Math.cos(angle) * force * 0.5;
                    d.vy -= Math.sin(angle) * force * 0.5;
                }

                // Standard Movement
                d.x += d.vx;
                d.y += d.vy;
                
                // Friction / Damping
                d.vx *= 0.96; 
                d.vy *= 0.96;

                // Wrap around screen
                if(d.x > width) d.x = 0;
                if(d.x < 0) d.x = width;
                if(d.y > height) d.y = 0;
                if(d.y < 0) d.y = height;
                
                // Sparkle effect (random opacity flicker)
                const alpha = 0.3 + Math.random() * 0.7;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = d.color;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            requestAnimationFrame(animate);
        };
        const animId = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full" />;
};

// --- Sand Text (High Res, Sparkles) ---
const SandText = ({ text }: { text: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        let width = containerRef.current.clientWidth;
        let height = containerRef.current.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2); 
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        let particles: Particle[] = [];
        
        // --- Init ---
        // 1. Draw Text
        // Increased container height to h-56 in JSX to allow room for descenders
        const fontSize = Math.min(width * 0.25, 140);
        ctx.font = `900 ${fontSize}px "Cinzel", serif`;
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Shift text slightly up to leave room for 'g' descender
        ctx.fillText(text, width / 2, (height / 2) - 10);
        
        // 2. Scan
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        ctx.clearRect(0, 0, width, height);

        const step = 2 * dpr; // Density adjustment
        for (let y = 0; y < canvas.height; y += step) {
            for (let x = 0; x < canvas.width; x += step) {
                const i = (y * canvas.width + x) * 4;
                if (data[i + 3] > 128) {
                    const rand = Math.random();
                    let color = '#D4AF37'; // Gold
                    if (rand > 0.8) color = '#FCF6BA'; // Pale
                    if (rand > 0.95) color = '#FFFFFF'; // Diamond
                    
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        ox: x / dpr,
                        oy: y / dpr,
                        vx: 0,
                        vy: 0,
                        color,
                        size: Math.random() * 1.5 + 0.5
                    });
                }
            }
        }

        // --- Loop ---
        let startTime = Date.now();
        const loop = () => {
            const elapsed = Date.now() - startTime;
            ctx.clearRect(0, 0, width, height);
            
            const rect = canvas.getBoundingClientRect();
            const mx = mouseRef.current.x - rect.left;
            const my = mouseRef.current.y - rect.top;

            // Typing Reveal
            const progress = Math.min(1, elapsed / 2500); 
            const count = Math.floor(particles.length * progress);

            for (let i = 0; i < count; i++) {
                const p = particles[i];
                
                // Wind Force
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const interactRadius = 100;
                
                if (dist < interactRadius) {
                     const force = (interactRadius - dist) / interactRadius;
                     const angle = Math.atan2(dy, dx);
                     p.vx -= Math.cos(angle) * force * 2;
                     p.vy -= Math.sin(angle) * force * 2;
                }

                const hx = p.ox - p.x;
                const hy = p.oy - p.y;
                
                p.vx += hx * 0.05;
                p.vy += hy * 0.05;
                
                p.vx *= 0.9;
                p.vy *= 0.9;
                
                p.x += p.vx;
                p.y += p.vy;

                if (Math.random() > 0.98) {
                    ctx.fillStyle = "#FFF"; 
                } else {
                    ctx.fillStyle = p.color;
                }
                ctx.fillRect(p.x, p.y, p.size, p.size);
            }
            requestAnimationFrame(loop);
        };
        
        loop();

        const handleMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMove);

        return () => window.removeEventListener('mousemove', handleMove);
    }, [text]);

    return (
        <div ref={containerRef} className="w-full h-56 relative z-20">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

// --- Expensive Card ---
const RoyalCard = ({ children, className = "", onClick }: { children?: React.ReactNode, className?: string, onClick?: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]); 
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);
  
  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }
  
  function handleMouseLeave() {
      x.set(0);
      y.set(0);
  }
  
  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`group relative royal-card rounded-lg ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="absolute inset-0 arabesque-pattern opacity-10 pointer-events-none z-0" />
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-700 group-hover:opacity-100 z-30 mix-blend-overlay"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${x}px ${y}px,
              rgba(252, 246, 186, 0.2),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-20 h-full p-8 flex flex-col">{children}</div>
    </motion.div>
  );
};

// --- Content Data ---

const MAIN_PROJECTS: Project[] = [
  {
    id: "01",
    title: "MindMate",
    subtitle: "AI journal for emotional clarity with mood analytics and private journal intel.",
    category: "AI_AGENT",
    link: "https://mindmate.abhnv.me/",
    features: ["EMOTIONAL CLARITY", "MOOD ANALYTICS", "PRIVATE INTEL"]
  },
  {
    id: "02",
    title: "GramGPT",
    subtitle: "Multilingual AI assistant for rural India providing agricultural assistance.",
    category: "AGRI_TECH",
    link: "https://gramgpt.abhnv.me/",
    features: ["MULTILINGUAL", "VOICE AI", "AGRI ASSIST"]
  },
  {
    id: "03",
    title: "ScamShield",
    subtitle: "Gamified scam-detection & awareness platform with phishing scenarios.",
    category: "CYBER_SEC",
    link: "https://scamshield.abhnv.me/",
    features: ["GAMIFIED", "PHISHING DETECTION", "AWARENESS"]
  },
  {
    id: "04",
    title: "IELTS Ace",
    subtitle: "AI-powered IELTS preparation platform with speaking & writing evaluation.",
    category: "ED_TECH",
    link: "https://www.abhnv.in/ielts-ace",
    features: ["AI EVALUATION", "LEARNING PATHS", "SPEAKING & WRITING"]
  },
  {
    id: "05",
    title: "UniWiz",
    subtitle: "Global admissions & university planning tool with scholarship guidance.",
    category: "ED_TECH",
    link: "https://uniwiz.abhnv.me/",
    features: ["ADMISSIONS", "SCHOLARSHIPS", "GLOBAL INSIGHTS"]
  },
  {
    id: "06",
    title: "Dashey",
    subtitle: "Smart productivity & workflow dashboard with task automation and analytics.",
    category: "PRODUCTIVITY",
    link: "https://abhnv.in/dashey",
    features: ["WORKFLOW", "AUTOMATION", "ANALYTICS"]
  }
];

const AR_PROJECTS: Project[] = [
  {
    id: "AR-01",
    title: "Aether",
    subtitle: "Futuristic holographic interface concept with air-gesture control.",
    category: "HOLOGRAPHIC",
    link: "https://www.abhnv.in/Aether",
    features: ["AIR GESTURES", "SPATIAL COMPUTING", "UI CONCEPT"]
  },
  {
    id: "AR-02",
    title: "Air Blocks",
    subtitle: "Spatial creativity & block-based design engine. Build voxels mid-air.",
    category: "CREATIVITY",
    link: "https://www.abhnv.in/Air-Blocks",
    features: ["VOXEL ENGINE", "HAND TRACKING", "3D DESIGN"]
  }
];

const RESEARCH_PAPERS: Paper[] = [
  {
    id: "PAPER 01",
    title: "Data For Sale",
    subtitle: "Interactive research on the data economy & privacy.",
    link: "https://www.abhnv.in/research/paper"
  },
  {
    id: "PAPER 02",
    title: "Hidden Watts",
    subtitle: "Exploring invisible energy, systems, and inefficiencies.",
    link: "https://www.abhnv.in/research/paper2"
  },
  {
    id: "PAPER 03",
    title: "The Glass Ballot Box",
    subtitle: "End-to-end verifiable digital voting system.",
    link: "https://www.abhnv.in/research/paper3"
  }
];

const CERTIFICATES: Certificate[] = [
  { name: "Cryptography I", issuer: "Stanford University", link: "https://coursera.org/verify/68X34EAOUTGZ" },
  { name: "Decentralized Finance (DeFi)", issuer: "Wharton Online", link: "https://coursera.org/verify/specialization/QCJKZ0828MR9" },
  { name: "Applied Cryptography", issuer: "Stanford University", link: "https://coursera.org/verify/HYQB0ZG2VEAC" },
  { name: "Generative AI Fundamentals", issuer: "IBM", link: "https://coursera.org/verify/specialization/5Z7BSFCR8TZ3" },
  { name: "AI Foundations for Everyone", issuer: "IBM", link: "https://coursera.org/verify/specialization/HLLF7L2BHM8E" },
  { name: "Entrepreneurship", issuer: "Wharton Online", link: "https://coursera.org/verify/specialization/9ZVCVEY4IL0A" },
  { name: "CS50's Intro to AI", issuer: "Harvard University", link: "https://cs50.harvard.edu/certificates/b2a3a725-fafe-4a0e-bb10-7e7f55433bc7" },
  { name: "Google Cybersecurity", issuer: "Google", link: "https://coursera.org/verify/professional-cert/AOHLGIZVO0HM" },
  { name: "CS50's Intro to Python", issuer: "Harvard University", link: "https://cs50.harvard.edu/certificates/f45543c6-4430-4399-b015-e4f0a19118dc" },
  { name: "Elements of AI", issuer: "Univ. of Helsinki", link: "https://certificates.mooc.fi/validate/v3u4c9jcesr" },
  { name: "Ethics of AI", issuer: "Univ. of Helsinki", link: "https://certificates.mooc.fi/validate/lassvl2cm4" },
  { name: "Building IoT Systems", issuer: "Univ. of Helsinki", link: "https://courses.mooc.fi/certificates/validate/vqgbszbeu79jare" },
  { name: "Financial Markets", issuer: "Yale University", link: "https://coursera.org/verify/16N19GG1SQRJ" },
  { name: "CS50x – Intro to CS", issuer: "Harvard University", link: "https://cs50.harvard.edu/certificates/62867486-5c48-4ef8-8c93-c01c59f27dca" }
];

// --- Components ---

const CertificateCard = ({ cert }: { cert: Certificate }) => (
    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="block group relative p-4 bg-black/40 border border-gold-900/30 rounded-sm hover:border-gold-500/50 transition-all duration-300 interactive-hover overflow-hidden">
        <div className="absolute inset-0 bg-gold-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <div className="relative z-10 flex justify-between items-start">
             <div>
                <h4 className="text-gold-100 font-serif text-sm group-hover:text-gold-400 transition-colors">{cert.name}</h4>
                <p className="text-gold-600 text-[10px] font-display uppercase tracking-widest mt-1">{cert.issuer}</p>
             </div>
             <Award size={16} className="text-gold-900 group-hover:text-gold-500 transition-colors" />
        </div>
    </a>
);

// --- Main App ---

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen text-gold-100 selection:bg-gold-500 selection:text-black overflow-x-hidden cursor-none font-serif">
        <MagicCursor />
        <RoyalBackground />
        
        <main className="relative z-10">
          
          {/* Top Progress Bar - Gold Foil */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[4px] z-50 shadow-[0_2px_10px_rgba(212,175,55,0.5)]"
            style={{ 
                scaleX,
                background: 'linear-gradient(90deg, #BF953F, #FCF6BA, #AA771C)' 
            }}
          />

          {/* Hero */}
          <section className="relative min-h-screen flex flex-col justify-center items-center px-6">
            <div className="relative z-10 text-center max-w-4xl mx-auto w-full flex flex-col items-center">
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-8 w-full flex flex-col items-center justify-center"
              >
                {/* Massive Sand Title */}
                <div className="w-full max-w-3xl mb-2">
                    <SandText text="trgt" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, filter: "blur(12px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, delay: 0.8 }} 
              >
                <p className="text-2xl md:text-4xl font-serif text-gold-100/90 tracking-wide leading-relaxed drop-shadow-md">
                  Precision <span className="text-gold-gradient mx-3 text-3xl">♦</span> Engineering
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="mt-20"
              >
                <button 
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-12 py-5 bg-black/40 text-gold-300 font-display font-bold tracking-[0.2em] text-sm border border-gold-500/50 hover:text-black transition-all duration-500 interactive-hover hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] relative overflow-hidden group rounded-sm"
                >
                  <span className="relative z-10 text-gold-gradient">ACQUIRE TARGETS</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 z-0"></div>
                </button>
              </motion.div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="py-40 px-6 md:px-12 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-6 mb-24 justify-center">
                 <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gold-700"></div>
                 <h2 className="text-5xl font-display font-bold text-gold-gradient drop-shadow-lg">Primary Targets</h2>
                 <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-gold-700"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {MAIN_PROJECTS.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: index * 0.15 }}
                    >
                      <RoyalCard className="h-full">
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full flex flex-col justify-between interactive-hover">
                          <div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                              <div className="flex flex-col gap-2">
                                 <div className="flex items-center gap-3">
                                    <span className="text-xs font-display text-gold-500">{project.id}</span>
                                    <span className="px-3 py-1 text-[9px] font-display font-bold tracking-widest border border-gold-900/40 bg-gold-900/10 text-gold-400 rounded-full">{project.category}</span>
                                 </div>
                                 <h3 className="text-2xl font-serif text-gold-100 group-hover:text-gold-400 transition-colors">{project.title}</h3>
                              </div>
                              <ArrowUpRight className="text-gold-700 group-hover:text-gold-300 transition-all duration-500" size={24} />
                            </div>
                            <p className="mb-8 text-base text-gold-100/60 font-serif leading-relaxed">{project.subtitle}</p>
                          </div>
                          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-auto pt-6 border-t border-gold-500/10">
                            {project.features.map((feat, i) => (
                              <span key={i} className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-gold-600 group-hover:text-gold-400 transition-colors">
                                <SparklingJewel /> {feat}
                              </span>
                            ))}
                          </div>
                        </a>
                      </RoyalCard>
                    </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* AR Section */}
          <section className="py-40 px-6 md:px-12 relative z-10">
             <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-6 mb-24 justify-center">
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gold-700"></div>
                    <h2 className="text-4xl font-display font-bold text-gold-gradient">Spatial Constructs</h2>
                    <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-gold-700"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {AR_PROJECTS.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.15 }}
                        >
                            <RoyalCard>
                                <a href={project.link} className="interactive-hover block h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-serif text-gold-100">{project.title}</h3>
                                        <Cuboid className="text-gold-500" size={24} />
                                    </div>
                                    <p className="text-gold-100/60 mb-8">{project.subtitle}</p>
                                    <div className="flex flex-wrap gap-4">
                                        {project.features.map((f, i) => (
                                            <span key={i} className="text-xs font-display text-gold-500 border border-gold-900/50 px-2 py-1 rounded">{f}</span>
                                        ))}
                                    </div>
                                </a>
                            </RoyalCard>
                        </motion.div>
                    ))}
                </div>
             </div>
          </section>

          {/* Research Section */}
          <section className="py-32 px-6 md:px-12 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-6 mb-24 justify-center">
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gold-700"></div>
                    <h2 className="text-4xl font-display font-bold text-gold-gradient">ResearchVerse</h2>
                    <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-gold-700"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {RESEARCH_PAPERS.map((paper, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <RoyalCard>
                                <a href={paper.link} target="_blank" className="interactive-hover block h-full flex flex-col">
                                    <ScrollText className="text-gold-500 mb-6" size={32} strokeWidth={1} />
                                    <div className="text-xs text-gold-700 font-display mb-2">{paper.id}</div>
                                    <h3 className="text-xl font-serif text-gold-100 mb-4">{paper.title}</h3>
                                    <p className="text-gold-100/60 text-sm mb-6 flex-grow">{paper.subtitle}</p>
                                    <div className="flex items-center gap-2 text-gold-500 text-xs font-display uppercase tracking-widest mt-auto">
                                        Read Paper <ArrowUpRight size={14} />
                                    </div>
                                </a>
                            </RoyalCard>
                        </motion.div>
                    ))}
                </div>
            </div>
          </section>

          {/* Credentials Section */}
          <section className="py-32 px-6 md:px-12 relative z-10 bg-black/20">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-6 mb-16 justify-center">
                    <Gem size={16} className="text-gold-600" />
                    <h2 className="text-2xl font-display font-bold text-gold-300 tracking-wider">CREDENTIALS</h2>
                    <Gem size={16} className="text-gold-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CERTIFICATES.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                           <CertificateCard cert={cert} />
                        </motion.div>
                    ))}
                </div>
            </div>
          </section>

          {/* Footer / Presence */}
          <footer className="py-32 border-t border-gold-900/30 text-center bg-black/80 relative overflow-hidden backdrop-blur-md">
             <div className="absolute inset-0 arabesque-pattern opacity-5 pointer-events-none"></div>
             <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
               
               <Quote size={40} className="text-gold-800 mb-8 opacity-50" />
               <p className="text-xl md:text-3xl font-serif text-gold-200 italic max-w-2xl leading-relaxed mb-12">
                   "I build software that feels inevitable. Currently shipping experiments and building products for the next generation of the web."
               </p>

               <div className="flex items-center gap-3 px-6 py-2 border border-gold-500/30 rounded-full bg-gold-900/10 mb-16">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gold-400 text-xs font-display tracking-widest uppercase">Open to collaborations</span>
               </div>

               <div className="flex justify-center gap-12 mb-16">
                  <a href="https://www.linkedin.com/in/abhnv07/" target="_blank" className="text-gold-600 hover:text-gold-300 transition-colors interactive-hover"><LinkedInLogo size={24} /></a>
                  <a href="https://github.com/Abhinavv-007" target="_blank" className="text-gold-600 hover:text-gold-300 transition-colors interactive-hover"><Github size={24} /></a>
                  <a href="https://x.com/Abhnv007" target="_blank" className="text-gold-600 hover:text-gold-300 transition-colors interactive-hover"><XLogo size={24} /></a>
                  <a href="https://www.abhnv.in/contact" target="_blank" className="text-gold-600 hover:text-gold-300 transition-colors interactive-hover"><Mail size={24} /></a>
               </div>

               <div className="flex justify-center gap-16 text-xs text-gold-800 mb-8 font-display font-bold tracking-[0.2em]">
                  <a href="#" className="hover:text-gold-500 transition-colors interactive-hover">PRIVACY</a>
                  <a href="https://github.com/Abhinavv-007" className="hover:text-gold-500 transition-colors interactive-hover">SOURCE</a>
                  <a href="https://www.abhnv.in/contact" className="hover:text-gold-500 transition-colors interactive-hover">CONTACT</a>
               </div>
               
               <p className="text-[10px] text-gold-900 font-serif italic tracking-widest">
                 Built & launched by Abhinav Raj
               </p>
            </div>
          </footer>

        </main>
    </div>
  );
};

export default App;