'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion'
import Lenis from 'lenis'
import { Card, CardBody, Avatar, Chip, Tab, Tabs } from "@heroui/react"
import { Clock, Zap, Crown, ShieldCheck, Star, Flame, Medal } from 'lucide-react'
// Import Client Supabase
import { createClient } from '@/src/lib/supabase'

// --- Types (Sesuai Database yang udah di-update) ---
type Period = 'weekly' | 'monthly'

interface LeaderboardEntry {
  id: number
  username: string
  handle: string | null      // Bisa null kalau user ga punya handle
  avatar_url: string | null  // URL foto profil
  category: 'watchtime' | 'powerful'
  period: Period             // weekly / monthly
  value: string              // '156h'
  rank: number
  is_live: boolean           // true/false
}

interface Moderator {
  id: number
  username: string
  role: string
  since: string
  avatar_url: string | null
}

export default function LeaderboardsPage() {
  const supabase = createClient()
  const [period, setPeriod] = useState<Period>('weekly')
  const containerRef = useRef(null)

  // State Data Real
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [moderators, setModerators] = useState<Moderator[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 1. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      
      // A. Ambil Data Leaderboard sesuai Period (Tab aktif)
      const { data: lbData, error: lbError } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('period', period) // Filter Weekly/Monthly di Database langsung
        .order('rank', { ascending: true })

      // B. Ambil Data Moderator
      const { data: modData, error: modError } = await supabase
        .from('moderators')
        .select('*')
        .order('id', { ascending: true })

      if (lbError) console.error('Error fetching leaderboard:', lbError)
      if (modError) console.error('Error fetching moderators:', modError)

      if (lbData) setLeaderboardData(lbData as LeaderboardEntry[])
      if (modData) setModerators(modData as Moderator[])

      setIsLoading(false)
    }

    fetchData()
  }, [period]) // Re-run setiap kali user ganti Tab Period

  // 2. FILTERING DATA (Client Side Split)
  // Pisahin data Watchtime vs Powerful dari hasil fetch tadi
  const watchtimeData = leaderboardData.filter(item => item.category === 'watchtime')
  const powerfulData = leaderboardData.filter(item => item.category === 'powerful')

  // 3. SETUP LENIS (Smooth Scroll)
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => { lenis.destroy() }
  }, [])

  // 4. ANIMATION HOOKS
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Background Morphing
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ["#09090b", "#0f172a", "#2e1065", "#422006"] 
  )

  // 3D Objects Animation
  const obj1Y = useTransform(scrollYProgress, [0, 1], [0, 500])
  const obj1Rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const obj2Y = useTransform(scrollYProgress, [0, 1], [0, -300])
  const obj2Rotate = useTransform(scrollYProgress, [0, 1], [0, -180])
  
  const headerY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Variants Framer Motion
  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  // Component Rank Badge
  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return <div className="relative"><Crown className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-pulse" size={32} /></div>
    if (rank === 2) return <Medal className="text-gray-300 drop-shadow-md" size={24} />
    if (rank === 3) return <Medal className="text-orange-400 drop-shadow-md" size={24} />
    return <span className="text-default-400 font-bold text-lg w-6 text-center">{rank}</span>
  }

  return (
    <motion.div 
      ref={containerRef} 
      style={{ backgroundColor: bgColor }} 
      className="min-h-screen text-foreground relative overflow-hidden transition-colors duration-500"
    >
      
      {/* DECORATION BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div style={{ y: obj1Y, rotate: obj1Rotate }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-[40%] blur-[80px] opacity-50 border border-white/5" />
        <motion.div style={{ y: obj2Y, rotate: obj2Rotate }} className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-gradient-to-tl from-yellow-500/20 to-purple-500/20 rounded-[30%] blur-[100px] opacity-40 border border-white/5" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 py-24 pb-40 relative z-10">
        
        {/* HEADER & TABS */}
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

        {/* LOADING INDICATOR */}
        {isLoading ? (
           <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
             <p className="text-zinc-400 animate-pulse">Syncing Leaderboard Data...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-32">
            
            {/* --- LEFT COLUMN: WATCHTIME --- */}
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

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`watchtime-${period}`}
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-3"
                  >
                    {watchtimeData.length > 0 ? watchtimeData.map((user) => (
                      <motion.div key={user.id} variants={itemVariants}>
                        <div className="group relative flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-blue-500/30 cursor-default hover:scale-[1.02] hover:shadow-lg">
                          <div className="flex items-center gap-5">
                            <div className="w-8 flex justify-center">
                              <RankBadge rank={user.rank} />
                            </div>
                            <div className="relative">
                              {/* Avatar Handling */}
                              <Avatar 
                                isBordered 
                                color={user.rank === 1 ? "warning" : "primary"} 
                                src={user.avatar_url || undefined} 
                                name={user.username.charAt(0)} // Fallback inisial
                                className="w-12 h-12 transition-transform group-hover:scale-110 shadow-lg"
                                classNames={{ img: "opacity-100" }} 
                              />
                              {user.is_live && ( <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_red]" /> )}
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
                    )) : (
                      <div className="text-center py-10 text-gray-500">No data for this period</div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* --- RIGHT COLUMN: POWERFUL --- */}
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
                    {powerfulData.length > 0 ? powerfulData.map((user) => (
                      <motion.div key={user.id} variants={itemVariants}>
                        <div className="group relative flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-yellow-500/30 cursor-default hover:scale-[1.02] hover:shadow-lg">
                          <div className="flex items-center gap-5">
                            <div className="w-8 flex justify-center">
                              <RankBadge rank={user.rank} />
                            </div>
                            <Avatar 
                                isBordered 
                                color={user.rank === 1 ? "warning" : "default"} 
                                src={user.avatar_url || undefined} 
                                name={user.username.charAt(0)}
                                className={`w-12 h-12 transition-transform group-hover:scale-110 ${user.rank === 1 ? 'shadow-[0_0_20px_rgba(234,179,8,0.6)]' : 'shadow-lg'}`} 
                                classNames={{ img: "opacity-100" }}
                            />
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
                    )) : (
                      <div className="text-center py-10 text-gray-500">No data for this period</div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
{/* --- MODERATORS SECTION (FIX COLOR) --- */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
             <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full mb-2 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <ShieldCheck className="text-green-400" size={40} />
             </div>
             {/* FIX: Title "THE GUARDIANS" warna Putih Explicit */}
             <h2 className="text-4xl font-black text-white">THE VANGUARDS</h2>
             <p className="text-gray-400">Protectors of the chat realm.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
             {moderators.map((mod) => (
                <Card 
                  key={mod.id}
                  isPressable
                  className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-green-500/50 transition-all hover:-translate-y-2 shadow-lg hover:shadow-green-900/20"
                >
                   <CardBody className="flex flex-col items-center text-center p-8 gap-4">
                      <div className="relative">
                        <Avatar 
                          src={mod.avatar_url || undefined} 
                          name={mod.username.charAt(0)}
                          className="w-24 h-24" 
                          isBordered 
                          color="success"
                          
                          // FIX: Paksa opacity gambar jadi 100 biar gak transparan
                          classNames={{
                            img: "opacity-100", 
                            base: "bg-transparent" // Opsional: biar background gak numpuk
                          }}
                        />
                         <div className="absolute -bottom-2 -right-2 bg-green-600 text-white p-1.5 rounded-full border-4 border-black">
                            <Star size={14} fill="currentColor" />
                         </div>
                      </div>
                      <div>
                         {/* FIX: Username Putih */}
                         <h3 className="font-bold text-xl text-white">{mod.username}</h3>
                         
                         {/* FIX: Role Chip teks-nya dipaksa putih dengan kelas 'text-white' di dalam Chip */}
                         <Chip size="sm" variant="flat" color="success" classNames={{ content: "text-white font-bold uppercase text-[10px] tracking-widest" }} className="mt-2">
                            {mod.role}
                         </Chip>
                         
                         {/* FIX: Text 'Since' abu-abu terang */}
                         <p className="text-gray-300 text-xs mt-3 font-mono">Serving since {mod.since}</p>
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