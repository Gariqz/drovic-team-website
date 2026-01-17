'use client'

import { useEffect } from "react"
import { Button, Card, CardBody, Chip } from "@heroui/react"
import { Trophy, Users, Clock, ArrowRight, Zap, Heart, Image as ImageIcon, Crown, Medal } from "lucide-react"
import Link from "next/link"
import { motion, Variants, useScroll, useTransform, useSpring } from "framer-motion"
import Lenis from 'lenis'

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function Home() {
  // 1. Setup Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => { lenis.destroy() }
  }, [])

  // 2. Parallax Hooks
  const { scrollY } = useScroll() // Gunakan pixel value biar konsisten
  
  // Background Movements
  const bgY = useTransform(scrollY, [0, 1000], [0, 300])
  const bgRotate = useTransform(scrollY, [0, 1000], [0, 180])
  
  // Floating Stats Movement
  const statsY = useTransform(scrollY, [0, 500], [0, -80])
  const smoothStatsY = useSpring(statsY, { stiffness: 50, damping: 15 })

  // --- DATA ---
  const stats = [
    { icon: Clock, label: "Watch Hours", value: "500K+", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: Users, label: "Community", value: "10K+", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { icon: Zap, label: "Live Streaming", value: "24/7", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  ]

  const features = [
    {
      icon: Trophy,
      title: "Leaderboards",
      description: "Compete with the best. Check the top supporters & viewers.",
      link: "/leaderboards",
      color: "warning",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      icon: Users,
      title: "Our Team",
      description: "Get to know the chaotic personalities behind the screen.",
      link: "/team",
      color: "primary",
      gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
      icon: ImageIcon, // Diganti jadi Gallery
      title: "Gallery",
      description: "Visual archives of our best wins, fails, and memories.",
      link: "/gallery",
      color: "secondary",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
  ]

  // Helper Rank Badge (Sama kayak Leaderboard page)
  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] animate-pulse" size={24} />
    if (rank === 2) return <Medal className="text-gray-300 drop-shadow-md" size={20} />
    if (rank === 3) return <Medal className="text-orange-400 drop-shadow-md" size={20} />
    return <span className="text-default-500 font-bold w-6 text-center">#{rank}</span>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground selection:bg-primary/30 overflow-hidden relative">
      
      {/* --- DYNAMIC BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div 
          style={{ y: bgY, rotate: bgRotate }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" 
        />
        <motion.div 
          style={{ y: useTransform(scrollY, [0, 1000], [0, -200]), x: bgY }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-secondary/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" 
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-6 pt-32 pb-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-10 relative z-10"
        >
          {/* Live Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <Chip 
              variant="shadow"
              color="danger" 
              classNames={{
                base: "bg-red-500/10 border border-red-500/20 backdrop-blur-md py-1",
                content: "font-bold text-red-500 tracking-widest flex items-center gap-2 uppercase text-xs"
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live on TikTok
            </Chip>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-2xl">
            THE FUTURE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
              INTERACTIVE STREAM
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Join the <strong>DROVIC</strong> community. Experience gaming, chaos, and competition like never before.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
            <Button
              as={Link}
              href="https://tiktok.com/@drovic.vn"
              target="_blank"
              size="lg"
              className="font-bold text-black bg-white hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
              radius="full"
              endContent={<ArrowRight size={20} />}
            >
              Follow on TikTok
            </Button>
            
            <Button
              as={Link}
              href="/team"
              variant="bordered"
              size="lg"
              className="font-bold border-zinc-700 text-white hover:bg-white/10"
              radius="full"
              startContent={<Users size={20} />}
            >
              Meet the Team
            </Button>
          </motion.div>

          {/* Floating Stats */}
          <motion.div 
            variants={itemVariants} 
            style={{ y: smoothStatsY }}
            className="pt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto"
          >
             {stats.map((stat, idx) => {
               const Icon = stat.icon
               return (
                 <div key={idx} className="group flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 shadow-lg transition-all hover:-translate-y-2">
                    <div className={`p-4 rounded-2xl ${stat.bg} mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={stat.color} size={28} />
                    </div>
                    <span className="text-3xl font-black text-white">{stat.value}</span>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</span>
                 </div>
               )
             })}
          </motion.div>
        </motion.div>
      </section>

      {/* --- EXPLORE SECTION (Updated) --- */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Universe</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Everything you need to stay connected and entertained.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card 
                    as={Link}
                    href={feature.link}
                    isPressable
                    className="h-full border-none bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 overflow-hidden group"
                  >
                    <CardBody className="p-8 space-y-6 text-center relative z-10">
                      {/* Glow Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      <div className="flex justify-center relative z-10">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 duration-300 bg-white/5 border border-white/10 group-hover:bg-white/10`}>
                          <Icon size={36} className="text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-2 relative z-10">
                        <h3 className="text-2xl font-black text-white">
                          {feature.title}
                        </h3>
                        <p className="text-zinc-400 font-medium">
                          {feature.description}
                        </p>
                      </div>

                      <div className="pt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                           <ArrowRight size={16} />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- HALL OF FAME (Reskinned to match Leaderboards Page) --- */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Decorative Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-2">
               <Trophy className="text-yellow-500" size={24} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              COMMUNITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-600">LEGENDS</span>
            </h2>
            <p className="text-zinc-400">Current leaders of this month. Are you on the list?</p>
          </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. TOP VIEWERS CARD */}
            <motion.div 
               initial={{ x: -50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
            >
               <Card className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 h-full">
                 <CardBody className="p-6">
                   <div className="flex items-center gap-4 mb-8 pl-2">
                     <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                       <Clock className="text-blue-400" size={28} />
                     </div>
                     <div>
                       <h3 className="text-2xl font-black text-white">Top Watchtime</h3>
                       <p className="text-blue-200/60 text-sm">Most dedicated viewers</p>
                     </div>
                   </div>
                   
                   <div className="space-y-3">
                     {[
                       { name: "Ghassan", value: "1,250 hrs", rank: 1, img: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
                       { name: "Yasir", value: "980 hrs", rank: 2, img: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
                       { name: "Ilham", value: "750 hrs", rank: 3, img: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
                     ].map((user) => (
                       <div 
                         key={user.rank}
                         className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group"
                       >
                         <div className="flex items-center gap-4">
                           <div className="w-8 flex justify-center"><RankBadge rank={user.rank} /></div>
                           <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full border border-white/10" />
                           <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{user.name}</span>
                         </div>
                         <Chip size="sm" variant="flat" classNames={{ base: "bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20" }}>{user.value}</Chip>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-6 pt-4 border-t border-white/5 text-center">
                      <Link href="/leaderboards" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                         View Full Leaderboard <ArrowRight size={14} />
                      </Link>
                   </div>
                 </CardBody>
               </Card>
            </motion.div>

            {/* 2. TOP SUPPORTERS CARD */}
            <motion.div 
               initial={{ x: 50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.1 }}
            >
               <Card className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 h-full">
                 <CardBody className="p-6">
                   <div className="flex items-center gap-4 mb-8 pl-2">
                     <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                       <Zap className="text-yellow-400" size={28} />
                     </div>
                     <div>
                       <h3 className="text-2xl font-black text-white">Top Supporters</h3>
                       <p className="text-yellow-200/60 text-sm">Most powerful contributors</p>
                     </div>
                   </div>
                   
                   <div className="space-y-3">
                     {[
                       { name: "Juan", value: "50K pts", rank: 1, img: "https://i.pravatar.cc/150?u=a048581f4e29026701d" },
                       { name: "Radit", value: "42K pts", rank: 2, img: "https://i.pravatar.cc/150?u=2042581f4e29026024d" },
                       { name: "Sultan", value: "35K pts", rank: 3, img: "https://i.pravatar.cc/150?u=1042581f4e29026024d" },
                     ].map((user) => (
                       <div 
                         key={user.rank}
                         className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group"
                       >
                         <div className="flex items-center gap-4">
                           <div className="w-8 flex justify-center"><RankBadge rank={user.rank} /></div>
                           <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full border border-white/10" />
                           <span className="font-bold text-white group-hover:text-yellow-400 transition-colors">{user.name}</span>
                         </div>
                         <Chip size="sm" variant="flat" classNames={{ base: "bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20" }}>{user.value}</Chip>
                       </div>
                     ))}
                   </div>

                   <div className="mt-6 pt-4 border-t border-white/5 text-center">
                      <Link href="/leaderboards" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                         View Full Leaderboard <ArrowRight size={14} />
                      </Link>
                   </div>
                 </CardBody>
               </Card>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER REMOVED (Global in Layout.tsx) */}
    </div>
  )
}