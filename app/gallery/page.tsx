'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion'
import Lenis from 'lenis'
import { Button, Modal, ModalContent, ModalBody, ModalFooter, useDisclosure, Card, Chip } from "@heroui/react"
import { Image as ImageIcon, Video, Play, ExternalLink, MousePointer2, X, Share2, CheckCircle2, AlertTriangle, Eye, Heart, Calendar, Hash } from 'lucide-react'
import Link from 'next/link'

// --- Types ---
interface GalleryItem {
  id: number
  type: 'photo' | 'video' | 'clip'
  title: string
  date: string
  thumbnail: string
  url: string
  description?: string
  height: string
  // Mock Data Tambahan biar Informatif
  views?: string
  likes?: string
  tags?: string[]
}

// --- Mock Data ---
const galleryItems: GalleryItem[] = [
  { id: 1, type: 'photo', title: 'Victory Royale', date: 'Jan 15, 2026', thumbnail: 'bg-blue-500', url: '#', height: 'h-[400px]', views: '12.5K', likes: '2.3K', tags: ['#Gaming', '#Win'] },
  { id: 2, type: 'video', title: 'Mic Fails', date: 'Jan 14, 2026', thumbnail: 'bg-purple-500', url: '#', height: 'h-[300px]', views: '45K', likes: '5K', tags: ['#Funny', '#Fail'] },
  { id: 3, type: 'clip', title: 'Insane Clutch', date: 'Jan 13, 2026', thumbnail: 'bg-red-500', url: '#', height: 'h-[350px]', views: '8.2K', likes: '1.1K', tags: ['#Clutch', '#Pro'] },
  { id: 4, type: 'photo', title: 'Team Dinner', date: 'Jan 12, 2026', thumbnail: 'bg-green-500', url: '#', height: 'h-[500px]', views: '5K', likes: '800', tags: ['#Vlog', '#Life'] },
  { id: 5, type: 'video', title: 'Highlights #42', date: 'Jan 11, 2026', thumbnail: 'bg-indigo-600', url: '#', height: 'h-[300px]', views: '22K', likes: '3K', tags: ['#Recap', '#Stream'] },
  { id: 6, type: 'clip', title: 'Rangga Crying', date: 'Jan 10, 2026', thumbnail: 'bg-yellow-500', url: '#', height: 'h-[450px]', views: '100K', likes: '12K', tags: ['#Meme', '#Sad'] },
  { id: 7, type: 'photo', title: 'Setup Tour', date: 'Jan 09, 2026', thumbnail: 'bg-slate-600', url: '#', height: 'h-[350px]', views: '15K', likes: '1.5K', tags: ['#Setup', '#Tech'] },
  { id: 8, type: 'clip', title: 'Jumpscare!', date: 'Jan 08, 2026', thumbnail: 'bg-rose-600', url: '#', height: 'h-[400px]', views: '50K', likes: '4K', tags: ['#Horror', '#Scream'] },
  { id: 9, type: 'photo', title: 'Fan Meetup', date: 'Jan 07, 2026', thumbnail: 'bg-orange-500', url: '#', height: 'h-[300px]', views: '3K', likes: '500', tags: ['#Event', '#Fans'] },
  { id: 10, type: 'video', title: 'Q&A Session', date: 'Jan 06, 2026', thumbnail: 'bg-teal-500', url: '#', height: 'h-[500px]', views: '10K', likes: '1K', tags: ['#Talk', '#Info'] },
  { id: 11, type: 'photo', title: 'New Jersey', date: 'Jan 05, 2026', thumbnail: 'bg-cyan-600', url: '#', height: 'h-[400px]', views: '8K', likes: '900', tags: ['#Merch', '#Style'] },
  { id: 12, type: 'clip', title: 'Fail Moment', date: 'Jan 04, 2026', thumbnail: 'bg-pink-600', url: '#', height: 'h-[350px]', views: '30K', likes: '2.5K', tags: ['#Lol', '#Fail'] },
]

export default function GalleryPage() {
  const container = useRef<HTMLDivElement>(null)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  
  // TOAST STATE
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' })

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => { lenis.destroy() }
  }, [])

  // SCROLL ANIMATION (Fixed using Pixel Value like Assets page)
  const { scrollY } = useScroll() 
  const y1 = useTransform(scrollY, [0, 1000], [0, -50])
  const y2 = useTransform(scrollY, [0, 1000], [0, -400])
  const y3 = useTransform(scrollY, [0, 1000], [0, -150])
  const y4 = useTransform(scrollY, [0, 1000], [0, -500])

  const bgRotate = useTransform(scrollY, [0, 1000], [0, 360])
  const bgY = useTransform(scrollY, [0, 1000], [0, 200])

  const col1 = galleryItems.slice(0, 3)
  const col2 = galleryItems.slice(3, 6)
  const col3 = galleryItems.slice(6, 9)
  const col4 = galleryItems.slice(9, 12)

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item)
    onOpen()
  }

  const handleShare = async () => {
    if (!selectedItem) return
    const shareData = { title: selectedItem.title, text: `Check this out!`, url: window.location.href }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        showToast("Shared successfully!")
      } else {
        await navigator.clipboard.writeText(window.location.href)
        showToast("Link copied to clipboard!")
      }
    } catch (err) {
      showToast("Failed to share", "error")
    }
  }

  return (
    <div ref={container} className="min-h-[200vh] bg-[#0a0a0a] text-foreground relative overflow-hidden">
      
      {/* --- TOAST NOTIFICATION (Fixed Centering) --- */}
      <AnimatePresence>
        {toast.show && (
          <div className="fixed bottom-10 left-0 right-0 flex justify-center z-[9999] pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-2xl text-white max-w-[90vw] pointer-events-auto"
            >
              {toast.type === 'success' ? <CheckCircle2 className="text-green-400 shrink-0" size={20} /> : <AlertTriangle className="text-red-400 shrink-0" size={20} />}
              <span className="font-medium text-sm truncate">{toast.msg}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div 
          style={{ rotate: bgRotate, y: bgY }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[100px] opacity-30" 
        />
        <motion.div 
          style={{ rotate: useTransform(scrollY, [0, 1000], [0, -180]), x: bgY }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tl from-yellow-500/10 to-red-500/10 rounded-full blur-[120px] opacity-30" 
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      <main className="container mx-auto px-6 py-32 relative z-10">
        
        <div className="mb-20 md:mb-32 text-center md:text-left md:flex justify-between items-end">
          <div>
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.9] text-white"
            >
              Visual <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Archives.</span>
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block text-right max-w-xs"
          >
            <p className="text-default-500 font-medium">
              A curated collection of chaos, wins, fails, and unforgettable memories from the Drovic Team.
            </p>
            <div className="mt-4 flex gap-2 justify-end text-xs font-bold uppercase tracking-widest text-default-400">
               <span>Scroll to explore</span>
               <MousePointer2 size={14} className="animate-bounce" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <Column items={col1} y={y1} onClick={handleItemClick} />
          <Column items={col2} y={y2} onClick={handleItemClick} className="mt-12 md:mt-24" />
          <Column items={col3} y={y3} onClick={handleItemClick} className="hidden lg:flex" />
          <Column items={col4} y={y4} onClick={handleItemClick} className="hidden lg:flex mt-32" />
        </div>

      </main>

      {/* --- REVAMPED MODAL PREVIEW --- */}
      <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange} 
          size="5xl" // Lebih besar biar immersive
          placement="center"
          backdrop="blur"
          hideCloseButton
          classNames={{
             base: "bg-transparent shadow-none", // Kita styling container sendiri
          }}
        >
          <ModalContent className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
            {(onClose) => (
              <div className="flex flex-col md:flex-row h-full min-h-[600px]">
                
                {/* 1. VISUAL AREA (KIRI/ATAS) - DOMINANT */}
                <div className="relative w-full md:w-2/3 bg-black flex items-center justify-center p-8 overflow-hidden group">
                   
                   {/* Ambient Background (Glow sesuai warna thumbnail) */}
                   <div className={`absolute inset-0 ${selectedItem?.thumbnail} opacity-20 blur-[100px] scale-150`} />
                   
                   {/* Content Container */}
                   <div className="relative z-10 w-full h-full flex items-center justify-center">
                      {selectedItem?.type === 'photo' ? (
                         <div className={`w-full h-full max-h-[400px] ${selectedItem?.thumbnail} rounded-2xl shadow-2xl flex items-center justify-center border border-white/10 transition-transform duration-700 group-hover:scale-[1.02]`}>
                            <ImageIcon size={80} className="text-white/50" />
                         </div>
                      ) : (
                         <div className="relative w-full aspect-video bg-black/50 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                            <div className={`absolute inset-0 ${selectedItem?.thumbnail} opacity-10 rounded-2xl`} />
                            <div className="p-6 bg-white/10 rounded-full border border-white/20 backdrop-blur-md animate-pulse">
                               <Video size={48} className="text-white" />
                            </div>
                            <p className="text-default-400 font-mono text-sm">PREVIEW MODE</p>
                         </div>
                      )}
                   </div>

                   {/* Custom Close Button */}
                   <motion.button 
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="absolute top-6 left-6 z-50 p-3 bg-black/50 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-colors border border-white/10"
                   >
                      <X size={20} />
                   </motion.button>
                </div>

                {/* 2. DETAILS PANEL (KANAN/BAWAH) - INFORMATIVE */}
                <div className="w-full md:w-1/3 bg-zinc-900/90 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col justify-between">
                   
                   <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                         <Chip size="sm" variant="flat" color="primary" className="uppercase font-bold tracking-wider text-[10px]">
                            {selectedItem?.type}
                         </Chip>
                         {selectedItem?.tags?.map(tag => (
                            <Chip key={tag} size="sm" variant="bordered" className="text-default-400 text-[10px] border-white/20">
                               {tag}
                            </Chip>
                         ))}
                      </div>

                      {/* Title & Date */}
                      <h2 className="text-3xl font-black text-white leading-tight mb-2">
                         {selectedItem?.title}
                      </h2>
                      <div className="flex items-center gap-2 text-default-400 text-sm mb-8">
                         <Calendar size={14} />
                         <span>{selectedItem?.date}</span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-default-400 text-xs mb-1">
                               <Eye size={14} /> Views
                            </div>
                            <div className="text-xl font-bold text-white">{selectedItem?.views}</div>
                         </div>
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-default-400 text-xs mb-1">
                               <Heart size={14} /> Likes
                            </div>
                            <div className="text-xl font-bold text-white">{selectedItem?.likes}</div>
                         </div>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="space-y-3">
                      <Button 
                         as={Link}
                         href={selectedItem?.url || '#'}
                         target="_blank"
                         size="lg" 
                         color="primary" 
                         variant="shadow" 
                         className="w-full font-bold text-white shadow-lg shadow-primary/20"
                         endContent={<ExternalLink size={18} />}
                      >
                         Open on TikTok
                      </Button>
                      <Button 
                         variant="flat" 
                         className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold"
                         onPress={handleShare}
                         startContent={<Share2 size={18} />}
                      >
                         Share Link
                      </Button>
                   </div>

                </div>
              </div>
            )}
          </ModalContent>
        </Modal>
    </div>
  )
}

// Sub-component Column
const Column = ({ items, y, onClick, className = '' }: { items: GalleryItem[], y: any, onClick: (item: GalleryItem) => void, className?: string }) => {
  return (
    <motion.div style={{ y }} className={`flex flex-col gap-6 ${className}`}>
      {items.map((item) => (
        <Card 
          key={item.id}
          isPressable
          onPress={() => onClick(item)}
          className={`w-full ${item.height} border-none relative group overflow-hidden bg-zinc-900 shadow-xl`}
        >
          {/* Thumbnail */}
          <div className={`absolute inset-0 ${item.thumbnail} transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100`}>
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/20">
                   {item.type === 'photo' ? <ImageIcon className="text-white" /> : <Play className="text-white fill-white" />}
                </div>
             </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
          
          <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <div className="flex gap-2 mb-2">
                <Chip size="sm" classNames={{ base: "bg-white/20 border border-white/20 text-white uppercase text-[10px] font-bold" }}>
                   {item.type}
                </Chip>
             </div>
             <h3 className="text-white font-bold text-xl leading-tight line-clamp-2">{item.title}</h3>
             <p className="text-white/50 text-sm mt-1">{item.date}</p>
          </div>
        </Card>
      ))}
    </motion.div>
  )
}