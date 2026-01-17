'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion'
import Lenis from 'lenis'
import { Button, Card, CardBody, CardFooter, Chip, Tab, Tabs, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react"
import { Download, Image as ImageIcon, Sparkles, Smile, Zap, Search, Check, X, Expand, AlertTriangle, FileBox, CheckCircle2, ChevronRight, FileText } from 'lucide-react'

// --- Types & Data ---
type AssetCategory = 'all' | 'stickers' | 'gifs' | 'emotes' | 'wallpapers'
interface Asset { id: number; name: string; category: string; size: string; format: string; downloads: number; color: string; icon: any }

// Data Dummy
const assets: Asset[] = [
  { id: 1, name: 'Drovic Logo Sticker', category: 'stickers', size: '512x512', format: 'PNG', downloads: 1250, color: 'bg-gradient-to-br from-blue-600 to-indigo-700', icon: Sparkles },
  { id: 2, name: 'Hype Emote Pack', category: 'emotes', size: '128x128', format: 'PNG', downloads: 890, color: 'bg-gradient-to-tr from-purple-500 to-pink-500', icon: Smile },
  { id: 3, name: 'Victory Dance GIF', category: 'gifs', size: '480x480', format: 'GIF', downloads: 2340, color: 'bg-gradient-to-bl from-yellow-400 to-orange-500', icon: Zap },
  { id: 4, name: 'Team Wallpaper 4K', category: 'wallpapers', size: '3840x2160', format: 'JPG', downloads: 567, color: 'bg-gradient-to-r from-slate-800 to-slate-600', icon: ImageIcon },
  { id: 6, name: 'Laugh Emote', category: 'emotes', size: '128x128', format: 'PNG', downloads: 1120, color: 'bg-gradient-to-t from-green-400 to-emerald-600', icon: Smile },
  { id: 7, name: 'GG Sticker', category: 'stickers', size: '512x512', format: 'PNG', downloads: 980, color: 'bg-gradient-to-br from-cyan-500 to-blue-500', icon: Sparkles },
  { id: 8, name: 'Celebration GIF', category: 'gifs', size: '480x480', format: 'GIF', downloads: 1890, color: 'bg-gradient-to-tl from-rose-500 to-red-600', icon: Zap },
  { id: 9, name: 'Mobile Wallpaper', category: 'wallpapers', size: '1080x1920', format: 'JPG', downloads: 723, color: 'bg-gradient-to-b from-indigo-500 to-purple-600', icon: ImageIcon },
  { id: 10, name: 'Sad Emote', category: 'emotes', size: '128x128', format: 'PNG', downloads: 654, color: 'bg-gradient-to-tr from-gray-500 to-gray-700', icon: Smile },
  { id: 11, name: 'Thank You Sticker', category: 'stickers', size: '512x512', format: 'PNG', downloads: 1456, color: 'bg-gradient-to-bl from-pink-400 to-rose-400', icon: Sparkles },
  { id: 12, name: 'Hype Train GIF', category: 'gifs', size: '480x480', format: 'GIF', downloads: 2100, color: 'bg-gradient-to-r from-amber-400 to-orange-500', icon: Zap },
  { id: 13, name: 'Desktop Wallpaper', category: 'wallpapers', size: '2560x1440', format: 'JPG', downloads: 845, color: 'bg-gradient-to-br from-blue-900 to-slate-900', icon: ImageIcon },
  { id: 15, name: 'Love Emote', category: 'emotes', size: '128x128', format: 'PNG', downloads: 1567, color: 'bg-gradient-to-tr from-red-400 to-pink-500', icon: Smile },
  { id: 16, name: 'Team Logo Pack', category: 'stickers', size: 'Various', format: 'ZIP', downloads: 2890, color: 'bg-gradient-to-bl from-violet-600 to-indigo-600', icon: Sparkles },
]

export default function AssetsPage() {
  const [filter, setFilter] = useState<AssetCategory>('all')
  const [downloadedItems, setDownloadedItems] = useState<number[]>([])
  
  // State: Preview Modal
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onOpenChange: onPreviewChange } = useDisclosure()
  
  // State: Download Confirmation Modal
  const [confirmAsset, setConfirmAsset] = useState<Asset | null>(null)
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmChange, onClose: onConfirmClose } = useDisclosure()

  // Toast State
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' })

  const containerRef = useRef(null)
  const lenisRef = useRef<Lenis | null>(null)

  // 1. LENIS SETUP
  useEffect(() => {
    const lenis = new Lenis()
    lenisRef.current = lenis
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf); return () => { lenis.destroy() }
  }, [])

  // 2. SCROLL ANIMATION
  const { scrollY } = useScroll() 

  const bgY = useTransform(scrollY, [0, 1000], [0, 300]) 
  const bgRotate = useTransform(scrollY, [0, 1000], [0, 180])
  const headerY = useTransform(scrollY, [0, 300], [0, -50]) 
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.5])

  const filteredAssets = filter === 'all' ? assets : assets.filter(asset => asset.category === filter)

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
  }, [filter])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  const initiateDownload = (asset: Asset) => {
    setConfirmAsset(asset)
    onConfirmOpen()
  }

  const performDownload = () => {
    if (!confirmAsset) return
    setDownloadedItems([...downloadedItems, confirmAsset.id])
    onConfirmClose()
    showToast(`Downloading ${confirmAsset.name}...`)
    
    setTimeout(() => {
      setDownloadedItems(prev => prev.filter(id => id !== confirmAsset.id))
      showToast("Download Complete!", "success")
    }, 2000)
  }

  const handlePreview = (asset: Asset) => {
    setSelectedAsset(asset)
    onPreviewOpen()
  }

  // Animation Variants
  const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
  const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-foreground relative overflow-hidden selection:bg-primary/20">
      
      {/* --- TOAST --- */}
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

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div style={{ y: bgY, rotate: bgRotate }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[120px] opacity-40" />
        <motion.div style={{ y: useTransform(scrollY, [0, 1000], [0, -200]), x: bgY }} className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="flex flex-col items-center text-center mb-16 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
             <Chip color="success" variant="dot" className="mb-4 text-white border-white/20 bg-white/5">Free Resources</Chip>
             <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-2 text-white">
               ASSETS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">LIBRARY</span>
             </h1>
             <p className="text-default-400 text-lg max-w-xl mx-auto">
               High-quality stickers, emotes, and wallpapers for your content. Free for personal use.
             </p>
          </motion.div>

          <Tabs 
            aria-label="Category" 
            color="secondary" 
            variant="solid" 
            radius="full"
            size="lg"
            selectedKey={filter}
            onSelectionChange={(key) => setFilter(key as AssetCategory)}
            classNames={{
               tabList: "bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/10 p-1",
               cursor: "shadow-md bg-secondary", 
               tabContent: "font-bold text-default-400 group-data-[selected=true]:text-white" 
            }}
          >
            <Tab key="all" title="All Assets" />
            <Tab key="stickers" title="Stickers" />
            <Tab key="emotes" title="Emotes" />
            <Tab key="gifs" title="GIFs" />
            <Tab key="wallpapers" title="Wallpapers" />
          </Tabs>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-screen content-start"
        >
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset) => {
              const IconComponent = asset.icon
              const isDownloaded = downloadedItems.includes(asset.id)

              return (
                <motion.div 
                  layout
                  key={asset.id} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="w-full h-full border-none bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 group overflow-visible">
                    <div onClick={() => handlePreview(asset)} className={`relative h-48 w-full overflow-hidden rounded-t-xl ${asset.color} cursor-pointer`}>
                       <div className="absolute inset-0 flex items-center justify-center"><IconComponent size={64} className="text-white/80 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" /></div>
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><div className="bg-white/20 p-2 rounded-full backdrop-blur-sm"><Expand className="text-white" size={24} /></div></div>
                       <div className="absolute top-3 right-3"><Chip size="sm" classNames={{ base: "bg-black/30 backdrop-blur-md text-white font-bold border border-white/20" }}>{asset.format}</Chip></div>
                    </div>
                    <CardBody className="p-5 flex flex-col gap-1">
                       <h3 onClick={() => handlePreview(asset)} className="font-bold text-lg text-white leading-tight line-clamp-1 group-hover:text-secondary transition-colors cursor-pointer">{asset.name}</h3>
                       <div className="flex justify-between items-center text-default-400 text-xs font-mono mt-1"><span>{asset.size}</span><div className="flex items-center gap-1"><Download size={12} />{asset.downloads.toLocaleString('en-US')}</div></div>
                    </CardBody>
                    <CardFooter className="p-4 pt-0">
                       <Button onPress={() => initiateDownload(asset)} isDisabled={isDownloaded} className={`w-full font-bold shadow-lg transition-all ${isDownloaded ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-white text-black hover:bg-secondary hover:text-white"}`} variant={isDownloaded ? "flat" : "solid"} size="md" radius="full">
                          {isDownloaded ? <><Check size={18} className="mr-2" /> Downloaded</> : <><Download size={18} className="mr-2" /> Download</>}
                       </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {filteredAssets.length === 0 && <div className="text-center py-32 opacity-50"><Search size={48} className="mx-auto mb-4 text-default-500" /><p className="text-xl text-default-400">No assets found in this category.</p></div>}

        {/* --- PREVIEW MODAL --- */}
        <Modal 
          isOpen={isPreviewOpen} onOpenChange={onPreviewChange} 
          size="2xl" placement="center" backdrop="blur" hideCloseButton 
          classNames={{ base: "bg-transparent shadow-none" }}
        >
          <ModalContent className="bg-black/90 border border-white/10 backdrop-blur-3xl rounded-3xl overflow-visible relative">
            {(onClose) => {
               const ModalIcon = selectedAsset?.icon || ImageIcon
               return (
               <>
                 <motion.button whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="absolute -top-12 right-0 md:-right-12 z-50 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-colors border border-white/20"><X size={24} /></motion.button>
                 <ModalBody className="p-0 overflow-hidden rounded-t-3xl bg-zinc-900/50">
                    <div className={`w-full h-[300px] flex items-center justify-center ${selectedAsset?.color}`}><ModalIcon size={120} className="text-white drop-shadow-2xl animate-pulse" /></div>
                    <div className="p-6 space-y-4">
                       <p className="text-default-300 text-sm leading-relaxed">This asset is high-quality and ready for use in your OBS, Discord, or Social Media.</p>
                    </div>
                 </ModalBody>
                 <ModalFooter className="bg-white/5 border-t border-white/10 justify-center rounded-b-3xl p-6">
                   <Button color="secondary" className="font-bold text-white w-full" onPress={() => { if (selectedAsset) { onClose(); initiateDownload(selectedAsset) }}} startContent={<Download size={18} />}>Download Asset</Button>
                 </ModalFooter>
               </>
            )}}
          </ModalContent>
        </Modal>

        {/* --- CONFIRMATION MODAL (FIXED: Compact & Catchy) --- */}
        <Modal 
          isOpen={isConfirmOpen} 
          onOpenChange={onConfirmChange} 
          size="sm" // Ubah jadi Small biar compact banget
          placement="center" 
          backdrop="blur" 
          hideCloseButton 
          classNames={{ base: "bg-transparent shadow-none" }}
        >
          <ModalContent className="bg-zinc-900/95 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden p-0 shadow-2xl">
            {(onClose) => (
              <div className="flex flex-col items-center text-center p-6 pt-8">
                
                {/* 1. Icon Animation (Heartbeat effect) */}
                <div className="relative mb-6">
                   <div className={`absolute inset-0 ${confirmAsset?.color} blur-xl opacity-40 rounded-full`} />
                   <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center ${confirmAsset?.color} shadow-lg border border-white/20`}
                   >
                      <Download size={32} className="text-white drop-shadow-md" />
                   </motion.div>
                </div>

                {/* 2. Text Info */}
                <h3 className="text-xl font-black text-white mb-2">Ready to Download?</h3>
                <p className="text-default-400 text-xs px-4 mb-6">
                   You are about to save <strong>{confirmAsset?.name}</strong> to your device.
                </p>

                {/* 3. Compact File Detail Box */}
                <div className="w-full bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-black/20 rounded-lg text-secondary">
                         <FileText size={16} />
                      </div>
                      <div className="text-left">
                         <div className="text-white text-xs font-bold">{confirmAsset?.format}</div>
                         <div className="text-default-500 text-[10px] uppercase">Format</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-white text-xs font-bold">{confirmAsset?.size}</div>
                      <div className="text-default-500 text-[10px] uppercase">Size</div>
                   </div>
                </div>

                {/* 4. Actions (Full Width Stack / Grid) */}
                <div className="grid grid-cols-2 gap-3 w-full">
                   <Button 
                      className="font-bold text-default-400 hover:text-white" 
                      variant="flat" 
                      onPress={onClose}
                   >
                      Cancel
                   </Button>
                   <Button 
                      className="font-bold text-white shadow-lg shadow-secondary/20" 
                      color="secondary" 
                      variant="shadow" 
                      onPress={performDownload}
                   >
                      Confirm
                   </Button>
                </div>

              </div>
            )}
          </ModalContent>
        </Modal>

        <div className="mt-20 text-center text-xs text-default-500 font-mono"><p>Asset Library v2.0 • Free for personal use only • Do not redistribute</p></div>
      </div>
    </div>
  )
}