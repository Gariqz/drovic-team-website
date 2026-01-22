'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { Button, Modal, ModalContent, useDisclosure, Card, Chip } from "@heroui/react"
// Import Client Supabase
import { createClient } from '@/src/lib/supabase'
// Import Icons
import { Image as ImageIcon, Video, Play, ExternalLink, MousePointer2, X, Share2, CheckCircle2, AlertTriangle, Eye, Heart, Calendar } from 'lucide-react'
import Link from 'next/link'

// 1. IMPORT LIBRARY EMBED
import { TikTokEmbed } from 'react-social-media-embed';

// --- Types (Sesuai kolom Database) ---
interface GalleryItem {
  id: number
  type: 'photo' | 'video' | 'clip'
  title: string
  date_display: string 
  thumbnail_class: string 
  thumbnail_url?: string | null 
  url: string // Pastikan URL di DB formatnya https://www.tiktok.com/@user/video/ID
  height_class: string 
  views?: string
  likes?: string
  tags?: string[]
}

export default function GalleryPage() {
  const supabase = createClient()
  const container = useRef<HTMLDivElement>(null)
  
  // State Data
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  
  // Toast State
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' })

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('id', { ascending: false }) 
      
      if (error) {
        console.error('Error fetching gallery:', error)
        showToast('Failed to load gallery items', 'error')
      } else {
        setGalleryItems(data || [])
      }
      setIsLoading(false)
    }

    fetchGallery()
  }, [])

  // --- HELPER: TOAST ---
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  // --- LENIS SCROLL ---
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => { lenis.destroy() }
  }, [])

  // --- SCROLL ANIMATION ---
  const { scrollY } = useScroll() 
  const y1 = useTransform(scrollY, [0, 1000], [0, -50])
  const y2 = useTransform(scrollY, [0, 1000], [0, -150])
  const y3 = useTransform(scrollY, [0, 1000], [0, -80])
  const y4 = useTransform(scrollY, [0, 1000], [0, -200])

  const bgRotate = useTransform(scrollY, [0, 1000], [0, 360])
  const bgY = useTransform(scrollY, [0, 1000], [0, 200])

  // --- SPLIT COLUMNS (MASONRY LOGIC) ---
  const col1 = galleryItems.filter((_, i) => i % 4 === 0)
  const col2 = galleryItems.filter((_, i) => i % 4 === 1)
  const col3 = galleryItems.filter((_, i) => i % 4 === 2)
  const col4 = galleryItems.filter((_, i) => i % 4 === 3)

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item)
    onOpen()
  }

  const handleShare = async () => {
    if (!selectedItem) return
    const shareData = { title: selectedItem.title, text: `Check this out!`, url: selectedItem.url }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        showToast("Shared successfully!")
      } else {
        await navigator.clipboard.writeText(selectedItem.url)
        showToast("Link copied to clipboard!")
      }
    } catch (err) {
      showToast("Failed to share", "error")
    }
  }

  return (
    <div ref={container} className="min-h-screen bg-[#0a0a0a] text-foreground relative overflow-hidden">
      
      {/* TOAST */}
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

        {/* LOADING STATE */}
        {isLoading ? (
           <div className="w-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* Col 1 & 2 Aman */}
            <Column items={col1} y={y1} onClick={handleItemClick} />
            <Column items={col2} y={y2} onClick={handleItemClick} className="mt-6 md:mt-24" />
            
            {/* FIX: DI SINI MASALAHNYA. Class 'hidden' dihapus biar muncul di semua layar */}
            <Column 
              items={col3} 
              y={y3} 
              onClick={handleItemClick} 
              className="flex mt-6 md:mt-0" 
            />
            <Column 
              items={col4} 
              y={y4} 
              onClick={handleItemClick} 
              className="flex mt-6 md:mt-24 lg:mt-32" 
            />
          </div>
        )}

      </main>

      {/* --- RESPONSIVE MODAL PREVIEW (FIXED LAYOUT) --- */}
      <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange} 
          size="5xl" 
          placement="center"
          backdrop="blur"
          hideCloseButton
          scrollBehavior="inside"
          classNames={{
             base: "bg-transparent shadow-none max-h-[95vh] my-auto", 
             wrapper: "z-[9999]"
          }}
        >
          {/* FIX: ModalContent dibatasi tinggi max-nya biar pas di layar */}
          <ModalContent className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl mx-2 md:mx-0 flex flex-col max-h-[90vh] md:max-h-[600px]">
            {(onClose) => (
              // FIX: Container utama bisa di-scroll di mobile (overflow-y-auto)
              <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
                
                {/* 1. VISUAL AREA (EMBED TIKTOK LOGIC DISINI) */}
                {/* FIX: min-h dikecilin jadi 300px di mobile biar tombol bawah kelihatan */}
                <div className="relative w-full md:w-2/3 bg-black flex-shrink-0 min-h-[300px] md:h-full flex items-center justify-center p-0 md:p-8 overflow-hidden group">
                   
                   {/* Background Glow */}
                   <div className={`absolute inset-0 ${selectedItem?.thumbnail_class} opacity-10 blur-[100px] scale-150 pointer-events-none`} />
                   
                   {/* CLOSE BUTTON */}
                   <motion.button 
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="absolute top-4 left-4 z-50 p-2 md:p-3 bg-black/50 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-colors border border-white/10"
                   >
                      <X size={20} />
                   </motion.button>

                   {/* --- LOGIC DISPLAY UTAMA --- */}
                   <div className="relative z-10 w-full h-full flex items-center justify-center">
                      
                      {selectedItem?.type === 'photo' ? (
                         // --- JIKA TIPE FOTO: Tampilkan Gambar Full ---
                         <div className="w-full h-full max-h-[500px] flex items-center justify-center relative p-6">
                            {selectedItem?.thumbnail_url ? (
                               <img 
                                 src={selectedItem.thumbnail_url} 
                                 alt={selectedItem.title} 
                                 className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
                               />
                            ) : (
                               <div className={`w-full h-full ${selectedItem?.thumbnail_class} opacity-50 rounded-xl`} />
                            )}
                         </div>
                      ) : (
                         // --- JIKA TIPE VIDEO/CLIP: Tampilkan Embed TikTok ---
                         // FIX: Padding y di mobile biar embed ga kepotong
                         <div className="w-full h-full flex items-center justify-center overflow-y-auto custom-scrollbar py-4 md:py-0">
                            <div className="scale-90 md:scale-100 origin-center">
                               {selectedItem?.url && (
                                 <TikTokEmbed 
                                   url={selectedItem.url} 
                                   width={325} 
                                   height={570} // Ukuran standar player TikTok
                                 />
                               )}
                            </div>
                         </div>
                      )}

                   </div>
                </div>

                {/* 2. DETAILS PANEL */}
                {/* FIX: flex-shrink-0 biar ga gepeng, dan overflow-y-auto di desktop kalo konten panjang */}
                <div className="w-full md:w-1/3 bg-zinc-900/90 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 p-6 md:p-8 flex flex-col justify-between gap-6 flex-shrink-0 md:overflow-y-auto">
                   
                   <div>
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

                      <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                         {selectedItem?.title}
                      </h2>
                      <div className="flex items-center gap-2 text-default-400 text-sm mb-6">
                         <Calendar size={14} />
                         <span>{selectedItem?.date_display}</span> 
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                         <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-default-400 text-[10px] mb-1">
                               <Eye size={12} /> Views
                            </div>
                            <div className="text-lg font-bold text-white">{selectedItem?.views}</div>
                         </div>
                         <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-default-400 text-[10px] mb-1">
                               <Heart size={12} /> Likes
                            </div>
                            <div className="text-lg font-bold text-white">{selectedItem?.likes}</div>
                         </div>
                      </div>
                   </div>

                  {/* FIX: Tambah padding bottom di mobile biar tombol ga mepet banget sama bawah layar */}
                  <div className="space-y-3 pb-6 md:pb-0">
                    <Button 
                        // Link Eksternal buat opsi
                        as="a" 
                        href={selectedItem?.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer" 
                        size="lg" 
                        color="primary" 
                        variant="shadow" 
                        className="w-full font-bold text-white shadow-lg shadow-primary/20"
                        endContent={<ExternalLink size={18} />}
                    >
                        Open in App
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

// --- FIX: HELPER BUAT BACA HEIGHT DARI DB ("h-[400px]" -> { height: "400px" }) ---
const getHeightStyle = (cls?: string) => {
  if (!cls) return { height: '300px' } // Default kalo kosong
  
  // Regex buat ambil angka di dalam kurung siku [...]
  const match = cls.match(/h-\[(.*?)\]/)
  
  if (match && match[1]) {
    return { height: match[1] } // Return object style { height: '400px' }
  }
  
  return {} // Kalo formatnya beda (misal class biasa h-64), biarin aja (semoga kebaca)
}

// --- SUB-COMPONENT COLUMN ---
const Column = ({ items, y, onClick, className = '' }: { items: GalleryItem[], y: any, onClick: (item: GalleryItem) => void, className?: string }) => {
  return (
    <motion.div style={{ y }} className={`flex flex-col gap-6 ${className}`}>
      {items.map((item) => {
        // Panggil helper di sini
        const inlineStyle = getHeightStyle(item.height_class)

        return (
          <Card 
            key={item.id}
            isPressable
            onPress={() => onClick(item)}
            // FIX: Tambahin style prop buat height
            style={inlineStyle}
            // FIX: Tambahin fallback di className juga kalau style kosong
            className={`w-full border-none relative group overflow-hidden bg-zinc-900 shadow-xl ${!inlineStyle.height ? (item.height_class || 'h-64') : ''}`}
          >
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110">
               {item.thumbnail_url ? (
                 <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
               ) : (
                 <div className={`w-full h-full ${item.thumbnail_class} opacity-80 group-hover:opacity-100 transition-opacity`} />
               )}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20">
                     {item.type === 'photo' ? <ImageIcon className="text-white" /> : <Play className="text-white fill-white" />}
                  </div>
               </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-20">
               <div className="flex gap-2 mb-2">
                  <Chip size="sm" classNames={{ base: "bg-white/20 border border-white/20 text-white uppercase text-[10px] font-bold backdrop-blur-sm" }}>{item.type}</Chip>
               </div>
               <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 drop-shadow-md">{item.title}</h3>
               <p className="text-white/70 text-sm mt-1">{item.date_display}</p>
            </div>
          </Card>
        )
      })}
    </motion.div>
  )
}