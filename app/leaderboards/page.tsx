'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, Variants, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { Card, CardBody, Avatar, Chip, Tab, Tabs } from "@heroui/react"
import { Clock, Zap, Crown, ShieldCheck, Star, Flame, Medal } from 'lucide-react'

// --- Types & Data ---
type Period = 'weekly' | 'monthly'

type LeaderboardEntry = {
  rank: number
  username: string
  handle: string
  value: string | number
  avatar: string
  isLive?: boolean
}

type Moderator = {
  username: string
  role: string
  since: string
  avatar: string
}

// Data Dummy (Sama seperti sebelumnya)
const leaderboardData: Record<string, Record<Period, LeaderboardEntry[]>> = {
  watchtime: {
    weekly: [
      { rank: 1, username: 'Ghassan', handle: '@ghassan', value: '156h', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', isLive: true },
      { rank: 2, username: 'Naufal', handle: '@naufal_z', value: '142h', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { rank: 3, username: 'DrovicFan', handle: '@fan_no1', value: '138h', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
      { rank: 4, username: 'Siti_A', handle: '@siti_aminah', value: '120h', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026708c' },
      { rank: 5, username: 'BudiGaming', handle: '@budigaming', value: '115h', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    ],
    monthly: [
      { rank: 1, username: 'Ghassan', handle: '@ghassan', value: '624h', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', isLive: true },
      { rank: 2, username: 'DrovicFan', handle: '@fan_no1', value: '550h', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
      { rank: 3, username: 'Naufal', handle: '@naufal_z', value: '510h', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { rank: 4, username: 'Citra', handle: '@citra_love', value: '480h', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026701d' },
      { rank: 5, username: 'BudiGaming', handle: '@budigaming', value: '450h', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    ]
  },
  powerful: {
    weekly: [
      { rank: 1, username: 'Sultan_Indo', handle: '@sultan62', value: '850K', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
      { rank: 2, username: 'Gifters', handle: '@gifters_pro', value: '720K', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
      { rank: 3, username: 'MamaLemon', handle: '@mama_lemon', value: '680K', avatar: 'https://i.pravatar.cc/150?u=2042581f4e29026024d' },
      { rank: 4, username: 'AnakSultan', handle: '@anak_sultan', value: '500K', avatar: 'https://i.pravatar.cc/150?u=1042581f4e29026024d' },
      { rank: 5, username: 'Donatur', handle: '@donatur_tetap', value: '450K', avatar: 'https://i.pravatar.cc/150?u=5042581f4e29026024d' },
    ],
    monthly: [
      { rank: 1, username: 'Sultan_Indo', handle: '@sultan62', value: '3.5M', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
      { rank: 2, username: 'MamaLemon', handle: '@mama_lemon', value: '2.8M', avatar: 'https://i.pravatar.cc/150?u=2042581f4e29026024d' },
      { rank: 3, username: 'Gifters', handle: '@gifters_pro', value: '2.1M', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
      { rank: 4, username: 'HambaAllah', handle: '@hamba_allah', value: '1.9M', avatar: 'https://i.pravatar.cc/150?u=9042581f4e29026024d' },
      { rank: 5, username: 'Supporter', handle: '@support_system', value: '1.5M', avatar: 'https://i.pravatar.cc/150?u=8042581f4e29026024d' },
    ]
  }
}

const moderators: Moderator[] = [
  { username: 'Mod_Agus', role: 'Head Mod', since: '2023', avatar: 'https://i.pravatar.cc/150?u=mod1' },
  { username: 'Mod_Dewi', role: 'Chat Protector', since: '2024', avatar: 'https://i.pravatar.cc/150?u=mod2' },
  { username: 'Mod_Bambang', role: 'Bot Slayer', since: '2024', avatar: 'https://i.pravatar.cc/150?u=mod3' },
  { username: 'Mod_Lisa', role: 'Community Manager', since: '2023', avatar: 'https://i.pravatar.cc/150?u=mod4' },
]

export default function LeaderboardsPage() {
  const [period, setPeriod] = useState<Period>('weekly')
  const containerRef = useRef(null)

  // 1. SETUP LENIS
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => { lenis.destroy() }
  }, [])

  // 2. SCROLL & PARALLAX HOOKS
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // --- EFEK TRANSISI WARNA BACKGROUND (Morphing) ---
  // Dari Hitam -> Biru Gelap -> Ungu -> Emas (Saat scroll)
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ["#09090b", "#0f172a", "#2e1065", "#422006"] 
    // Tailwind Colors: Zinc-950 -> Slate-900 -> Violet-950 -> Yellow-950 (Darkened)
  )

  // --- EFEK 3D OBJECTS MOVEMENT ---
  // Object 1 (Top Left): Turun & Muter
  const obj1Y = useTransform(scrollYProgress, [0, 1], [0, 500])
  const obj1Rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  
  // Object 2 (Bottom Right): Naik (Lawan arah) & Muter Balik
  const obj2Y = useTransform(scrollYProgress, [0, 1], [0, -300])
  const obj2Rotate = useTransform(scrollYProgress, [0, 1], [0, -180])

  // Object 3 (Center): Scale Up pas di tengah
  const obj3Scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.8, 1.2, 0.8])
  const obj3Opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.3, 0])

  // Header Parallax (Smooth Fade Out & Slide Up)
  const headerY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Variants
  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return <div className="relative"><Crown className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-pulse" size={32} /></div>
    if (rank === 2) return <Medal className="text-gray-300 drop-shadow-md" size={24} />
    if (rank === 3) return <Medal className="text-orange-400 drop-shadow-md" size={24} />
    return <span className="text-default-400 font-bold text-lg w-6 text-center">{rank}</span>
  }

  return (
    // Gunakan motion.div di root untuk transisi warna background
    <motion.div 
      ref={containerRef} 
      style={{ backgroundColor: bgColor }} // Background berubah warna sesuai scroll
      className="min-h-screen text-foreground relative overflow-hidden transition-colors duration-500"
    >
      
      {/* --- 3D FLOATING OBJECTS (Lenis Reactive) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        
        {/* Object 1: Biru Neon (Kiri Atas) */}
        <motion.div 
          style={{ y: obj1Y, rotate: obj1Rotate }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-[40%] blur-[80px] opacity-50 border border-white/5" 
        />
        
        {/* Object 2: Emas/Ungu (Kanan Bawah) */}
        <motion.div 
           style={{ y: obj2Y, rotate: obj2Rotate }}
           className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-gradient-to-tl from-yellow-500/20 to-purple-500/20 rounded-[30%] blur-[100px] opacity-40 border border-white/5" 
        />

        {/* Object 3: Center Highlight (Muncul pas scroll tengah) */}
        <motion.div 
           style={{ scale: obj3Scale, opacity: obj3Opacity }}
           className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-pink-500/20 rounded-full blur-[120px]" 
        />

        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 py-24 pb-40 relative z-10">
        
        {/* Header Section (Parallax & Fade) */}
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="flex flex-col items-center text-center mb-20 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
             <Chip color="secondary" variant="shadow" className="mb-6 animate-bounce">Live Data Updates</Chip>
             <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 text-white drop-shadow-2xl">
               HALL OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">FAME</span>
             </h1>
             <p className="text-default-300 text-xl max-w-xl mx-auto font-medium">
               Honoring the legends and guardians of the Drovic community.
             </p>
          </motion.div>

          {/* Glass Tabs */}
          <Tabs 
            aria-label="Period" 
            color="primary" 
            variant="bordered" 
            radius="full"
            size="lg"
            selectedKey={period}
            onSelectionChange={(key) => setPeriod(key as Period)}
            classNames={{
               tabList: "bg-white/10 backdrop-blur-md border border-white/10 p-1",
               cursor: "bg-primary/80 backdrop-blur-md shadow-lg", 
               tabContent: "font-bold text-white group-data-[selected=true]:text-white" 
            }}
          >
            <Tab key="weekly" title="This Weekly" />
            <Tab key="monthly" title="All Time Monthly" />
          </Tabs>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-32">
          
          {/* --- LEFT: WATCHTIME (Glassmorphism + Neon Blue) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 mb-2 pl-2">
              <div className="p-4 bg-blue-500/20 backdrop-blur-md rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Clock className="text-blue-400" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Top Viewers</h2>
                <p className="text-blue-200 text-sm">Masters of dedication</p>
              </div>
            </div>

            {/* Glass Container */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`watchtime-${period}`}
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  {leaderboardData.watchtime[period].map((user) => (
                    <motion.div key={user.username} variants={itemVariants}>
                      <div className="group relative flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-blue-500/30 cursor-default hover:scale-[1.02] hover:shadow-lg">
                        <div className="flex items-center gap-5">
                          <div className="w-8 flex justify-center">
                            <RankBadge rank={user.rank} />
                          </div>
                          <div className="relative">
                            <Avatar isBordered color={user.rank === 1 ? "warning" : "primary"} src={user.avatar} className="w-12 h-12 transition-transform group-hover:scale-110 shadow-lg" />
                            {user.isLive && ( <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_red]" /> )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">{user.username}</span>
                            <span className="text-xs text-gray-400 font-mono">{user.handle}</span>
                          </div>
                        </div>
                        <Chip variant="flat" classNames={{ base: "bg-blue-500/20 border border-blue-500/30", content: "font-black text-blue-300 tracking-wider" }}>
                          {user.value}
                        </Chip>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* --- RIGHT: POWER (Glassmorphism + Neon Gold) --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 mb-2 pl-2">
              <div className="p-4 bg-yellow-500/20 backdrop-blur-md rounded-2xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <Zap className="text-yellow-400" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Most Powerful</h2>
                <p className="text-yellow-200 text-sm">Supporters with huge impact</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`powerful-${period}`}
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  {leaderboardData.powerful[period].map((user) => (
                    <motion.div key={user.username} variants={itemVariants}>
                      <div className="group relative flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-yellow-500/30 cursor-default hover:scale-[1.02] hover:shadow-lg">
                        <div className="flex items-center gap-5">
                          <div className="w-8 flex justify-center">
                            <RankBadge rank={user.rank} />
                          </div>
                          <Avatar isBordered color={user.rank === 1 ? "warning" : "default"} src={user.avatar} className={`w-12 h-12 transition-transform group-hover:scale-110 ${user.rank === 1 ? 'shadow-[0_0_20px_rgba(234,179,8,0.6)]' : 'shadow-lg'}`} />
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-lg group-hover:text-yellow-300 transition-colors">{user.username}</span>
                            <div className="flex items-center gap-1">
                              <Flame size={12} className="text-orange-500" />
                              <span className="text-xs text-gray-400 font-mono">POWER</span>
                            </div>
                          </div>
                        </div>
                        <Chip variant="flat" classNames={{ base: "bg-yellow-500/20 border border-yellow-500/30", content: "font-black text-yellow-300 tracking-wider" }}>
                          {user.value}
                        </Chip>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* --- MODERATORS SECTION (The Guardians) --- */}
        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12 space-y-4">
             <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full mb-2 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <ShieldCheck className="text-green-400" size={40} />
             </div>
             <h2 className="text-4xl font-black text-white">THE GUARDIANS</h2>
             <p className="text-gray-400">Protectors of the chat realm.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
             {moderators.map((mod, index) => (
                <Card 
                  key={mod.username}
                  isPressable
                  className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-green-500/50 transition-all hover:-translate-y-2 shadow-lg hover:shadow-green-900/20"
                >
                   <CardBody className="flex flex-col items-center text-center p-8 gap-4">
                      <div className="relative">
                         <Avatar src={mod.avatar} className="w-24 h-24" isBordered color="success" />
                         <div className="absolute -bottom-2 -right-2 bg-green-600 text-white p-1.5 rounded-full border-4 border-black">
                            <Star size={14} fill="currentColor" />
                         </div>
                      </div>
                      <div>
                         <h3 className="font-bold text-xl text-white">{mod.username}</h3>
                         <Chip size="sm" variant="flat" color="success" className="mt-2 font-bold uppercase text-[10px] tracking-widest">
                            {mod.role}
                         </Chip>
                         <p className="text-gray-500 text-xs mt-3 font-mono">Serving since {mod.since}</p>
                      </div>
                   </CardBody>
                </Card>
             ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}