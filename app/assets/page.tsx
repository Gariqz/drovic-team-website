'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import { Button, Card, CardBody, CardFooter, Chip, Tab, Tabs, Modal, ModalContent, ModalBody, useDisclosure, ModalFooter } from "@heroui/react"
// Import Client Supabase (Pastikan path ini sesuai file lu)
import { createClient } from '@/src/lib/supabase'
// Import Icons
import { Download, Image as ImageIcon, Sparkles, Smile, Zap, Search, Check, X, Expand, AlertTriangle, CheckCircle2, FileText } from 'lucide-react'

// --- ICON MAPPER ---
const iconMap: { [key: string]: any } = {
  sparkles: Sparkles,
  smile: Smile,
  zap: Zap,
  image: ImageIcon,
  file: FileText,
  download: Download
}

// --- Types ---
type AssetCategory = 'all' | 'stickers' | 'gifs' | 'emotes' | 'wallpapers'

interface Asset {
  id: number
  name: string
  category: string
  size: string
  format: string
  downloads: number
  color_class: string
  icon_name: string
  file_url?: string
}

export default function AssetsPage() {
  const supabase = createClient()
  
  // State
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<AssetCategory>('all')
  const [downloadedItems, setDownloadedItems] = useState<number[]>([])
  
  // Modal States
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onOpenChange: onPreviewChange } = useDisclosure()
  
  const [confirmAsset, setConfirmAsset] = useState<Asset | null>(null)
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmChange, onClose: onConfirmClose } = useDisclosure()

  // Toast
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' })

  // Refs & Scroll
  const containerRef = useRef(null)
  const lenisRef = useRef<Lenis | null>(null)

  // 1. FETCH DATA
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('id', { ascending: true })
      
      if (error) {
        console.error('Error fetching assets:', error)
        showToast('Gagal memuat assets database', 'error')
      } else {
        setAssets(data || [])
      }
      setIsLoading(false)
    }
    fetchAssets()
  }, [])

  // 2. LENIS & SCROLL
  useEffect(() => {
    const lenis = new Lenis()
    lenisRef.current = lenis
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf); return () => { lenis.destroy() }
  }, [])

  const { scrollY } = useScroll() 
  const bgY = useTransform(scrollY, [0, 1000], [0, 300]) 
  const bgRotate = useTransform(scrollY, [0, 1000], [0, 180])
  const headerY = useTransform(scrollY, [0, 300], [0, -50]) 
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.5])

  const filteredAssets = filter === 'all' ? assets : assets.filter(asset => asset.category === filter)

  // Reset scroll pas ganti filter
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
  }, [filter])

  // Actions
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
    
    // TODO: Ganti ini dengan window.open(confirmAsset.file_url) saat data real sudah ada
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

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div style={{ y: bgY, rotate: bgRotate }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[120px] opacity-40" />
        <motion.div style={{ y: useTransform(scrollY, [0, 1000], [0, -200]), x: bgY }} className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* HEADER SECTION */}
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="flex flex-col items-center text-center mb-16 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
             <Chip color="success" variant="dot" className="mb-4 text-white border-white/20 bg-white/5">Free Resources</Chip>
             <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-2 text-white">
               ASSETS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">LIBRARY</span>
             </h1>
             <p className="text-default-400 text-lg max-w-xl mx-auto">
               High-quality stickers, emotes, and wallpapers for your content.
             </p>
          </motion.div>

          {/* FIX: TABS STYLING BIAR GAK ACAK-ACAKAN DI MOBILE */}
          <Tabs 
            aria-label="Category" 
            color="secondary" 
            variant="solid" 
            radius="full"
            size="lg"
            selectedKey={filter}
            onSelectionChange={(key) => setFilter(key as AssetCategory)}
            classNames={{
               // Base: Batasi lebar di mobile (90vw), enable horizontal scroll (overflow-x-auto)
               base: "w-full max-w-[90vw] md:max-w-fit overflow-x-auto scrollbar-hide py-2 mx-auto", 
               // TabList: Flex nowrap biar itemnya jejer ke samping, bukan turun ke bawah
               tabList: "bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/10 p-1 flex-nowrap inline-flex min-w-max",
               cursor: "shadow-md bg-secondary", 
               // Tab: Min width fit biar gak kepotong teksnya
               tab: "min-w-fit px-0",
               tabContent: "font-bold text-default-400 group-data-[selected=true]:text-white whitespace-nowrap px-4" 
            }}
          >
            <Tab key="all" title="All Assets" />
            <Tab key="stickers" title="Stickers" />
            <Tab key="emotes" title="Emotes" />
            <Tab key="gifs" title="GIFs" />
            <Tab key="wallpapers" title="Wallpapers" />
          </Tabs>
        </motion.div>

        {/* LOADING STATE */}
        {isLoading ? (
           <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              <p className="text-zinc-500 animate-pulse text-sm">Loading assets from server...</p>
           </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-screen content-start"
          >
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((asset) => {
                const IconComponent = iconMap[asset.icon_name] || Sparkles
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
                      <div onClick={() => handlePreview(asset)} className={`relative h-48 w-full overflow-hidden rounded-t-xl ${asset.color_class} cursor-pointer`}>
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
        )}

        {/* EMPTY STATE */}
        {!isLoading && filteredAssets.length === 0 && (
           <div className="text-center py-32 opacity-50">
              <Search size={48} className="mx-auto mb-4 text-default-500" />
              <p className="text-xl text-default-400">No assets found in this category.</p>
           </div>
        )}

        {/* --- PREVIEW MODAL --- */}
        <Modal 
          isOpen={isPreviewOpen} onOpenChange={onPreviewChange} 
          size="2xl" placement="center" backdrop="blur" hideCloseButton 
          classNames={{ base: "bg-transparent shadow-none mx-4" }}
        >
          <ModalContent className="bg-black/90 border border-white/10 backdrop-blur-3xl rounded-3xl overflow-visible relative">
            {(onClose) => {
               const ModalIcon = selectedAsset ? (iconMap[selectedAsset.icon_name] || ImageIcon) : ImageIcon
               return (
               <>
                 <motion.button whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="absolute -top-12 right-0 md:-right-12 z-50 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-colors border border-white/20"><X size={24} /></motion.button>
                 <ModalBody className="p-0 overflow-hidden rounded-t-3xl bg-zinc-900/50">
                    <div className={`w-full h-[300px] flex items-center justify-center ${selectedAsset?.color_class}`}>
                       <ModalIcon size={120} className="text-white drop-shadow-2xl animate-pulse" />
                    </div>
                    <div className="p-6 space-y-4">
                       <p className="text-default-300 text-sm leading-relaxed">High-quality asset ready for your creative projects. Click download to get the file.</p>
                    </div>
                 </ModalBody>
                 <ModalFooter className="bg-white/5 border-t border-white/10 justify-center rounded-b-3xl p-6">
                   <Button color="secondary" className="font-bold text-white w-full" onPress={() => { if (selectedAsset) { onClose(); initiateDownload(selectedAsset) }}} startContent={<Download size={18} />}>Download Asset</Button>
                 </ModalFooter>
               </>
            )}}
          </ModalContent>
        </Modal>

        {/* --- CONFIRMATION MODAL (Compact & Clean) --- */}
        <Modal 
          isOpen={isConfirmOpen} 
          onOpenChange={onConfirmChange} 
          size="md" 
          placement="center" 
          backdrop="blur" 
          hideCloseButton 
          classNames={{ base: "bg-transparent shadow-none mx-4" }}
        >
          <ModalContent className="bg-zinc-900/95 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden p-0 shadow-2xl max-w-sm w-full mx-auto">
            {(onClose) => (
              <div className="flex flex-col p-5 w-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${confirmAsset?.color_class} shadow-lg border border-white/10`}>
                      <Download size={20} className="text-white" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white leading-tight">Download Asset?</h3>
                      <p className="text-default-400 text-[10px] truncate mt-0.5">{confirmAsset?.name}</p>
                   </div>
                </div>
                {/* Details */}
                <div className="flex gap-2 mb-5">
                   <div className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2 flex flex-col items-center">
                      <span className="text-[10px] text-default-500 uppercase font-bold">Format</span>
                      <span className="text-xs font-bold text-white">{confirmAsset?.format}</span>
                   </div>
                   <div className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2 flex flex-col items-center">
                      <span className="text-[10px] text-default-500 uppercase font-bold">Size</span>
                      <span className="text-xs font-bold text-white">{confirmAsset?.size}</span>
                   </div>
                </div>
                {/* Actions */}
                <div className="flex gap-3">
                   <Button className="flex-1 font-bold text-default-400 hover:text-white h-9 min-w-0" variant="flat" size="sm" onPress={onClose}>Cancel</Button>
                   <Button className="flex-1 font-bold text-white shadow-lg shadow-secondary/20 h-9 min-w-0" color="secondary" variant="shadow" size="sm" onPress={performDownload}>Confirm</Button>
                </div>
              </div>
            )}
          </ModalContent>
        </Modal>

        <div className="mt-20 text-center text-xs text-default-500 font-mono"><p>Asset Library v2.0 • Free for personal use only</p></div>
      </div>
    </div>
  )
}