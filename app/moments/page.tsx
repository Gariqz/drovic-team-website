'use client'

import { useState } from 'react'
import { Gift, Laugh, Heart, Drama, Sparkles, TrendingUp, Award, Flame } from 'lucide-react'

interface Moment {
  id: number
  category: string
  title: string
  description: string
  date: string
  icon: any
  color: string
  bgGradient: string
  stats?: {
    label: string
    value: string
  }
  videoThumb?: string
}

const moments: Moment[] = [
  {
    id: 1,
    category: 'Biggest Gift',
    title: 'Universe Gift from BigSpender1',
    description: 'The most expensive gift ever received on stream! BigSpender1 sent a Universe gift worth $1,000 during our anniversary stream. The entire chat went absolutely wild!',
    date: 'January 10, 2024',
    icon: Gift,
    color: '#FFD700',
    bgGradient: 'from-yellow-400 to-yellow-600',
    stats: { label: 'Gift Value', value: '$1,000' },
    videoThumb: '#FFD700'
  },
  {
    id: 2,
    category: 'Funniest Moment',
    title: 'The Epic Fail Compilation',
    description: 'Drovic tried to do a backflip celebration and completely missed the mark. What followed was 5 minutes of non-stop laughter from the entire team and chat!',
    date: 'January 8, 2024',
    icon: Laugh,
    color: '#00CED1',
    bgGradient: 'from-cyan-400 to-cyan-600',
    stats: { label: 'Laugh Reactions', value: '15K+' },
    videoThumb: '#00CED1'
  },
  {
    id: 3,
    category: 'Most Heartwarming',
    title: 'Community Raises $5K for Charity',
    description: 'Our amazing community came together during the charity stream and raised over $5,000 for children in need. This is why we love you all!',
    date: 'January 5, 2024',
    icon: Heart,
    color: '#FF69B4',
    bgGradient: 'from-pink-400 to-pink-600',
    stats: { label: 'Total Raised', value: '$5,000' },
    videoThumb: '#FF69B4'
  },
  {
    id: 4,
    category: 'Best Drama',
    title: 'The Great Debate: Pineapple on Pizza',
    description: 'What started as a simple question turned into a 2-hour heated debate between team members. The chat was divided and chaos ensued. Team Pineapple won!',
    date: 'January 3, 2024',
    icon: Drama,
    color: '#9370DB',
    bgGradient: 'from-purple-400 to-purple-600',
    stats: { label: 'Poll Votes', value: '25K+' },
    videoThumb: '#9370DB'
  },
  {
    id: 5,
    category: 'Most Viral Clip',
    title: 'Drovic\'s Victory Dance Goes Viral',
    description: 'After winning an impossible game, Drovic did a spontaneous victory dance that got clipped and went viral on TikTok with over 2M views!',
    date: 'December 28, 2023',
    icon: TrendingUp,
    color: '#FF6347',
    bgGradient: 'from-red-400 to-red-600',
    stats: { label: 'Total Views', value: '2M+' },
    videoThumb: '#FF6347'
  },
  {
    id: 6,
    category: 'Best Reaction',
    title: 'Shocked by Surprise Birthday',
    description: 'The team secretly organized a surprise birthday stream for Drovic. His genuine shocked reaction was priceless and brought tears to everyone\'s eyes!',
    date: 'December 20, 2023',
    icon: Sparkles,
    color: '#FFD700',
    bgGradient: 'from-yellow-400 to-orange-500',
    stats: { label: 'Emotional Reactions', value: '30K+' },
    videoThumb: '#FFA500'
  },
  {
    id: 7,
    category: 'Epic Comeback',
    title: 'From 1HP to Victory',
    description: 'Down to literally 1 health point with no hope, Drovic somehow pulled off the most insane comeback win in gaming history. The entire chat couldn\'t believe it!',
    date: 'December 15, 2023',
    icon: Flame,
    color: '#FF4500',
    bgGradient: 'from-orange-500 to-red-600',
    stats: { label: 'Hype Reactions', value: '40K+' },
    videoThumb: '#FF4500'
  },
  {
    id: 8,
    category: 'Milestone Achievement',
    title: 'Hit 100K Followers!',
    description: 'The moment we\'ve all been waiting for! We finally hit 100,000 followers on TikTok. Massive celebration stream with giveaways and special guests!',
    date: 'December 10, 2023',
    icon: Award,
    color: '#4169E1',
    bgGradient: 'from-blue-400 to-blue-600',
    stats: { label: 'Milestone', value: '100K' },
    videoThumb: '#4169E1'
  }
]

export default function MomentsPage() {
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">Best Moments</h1>
          <p className="text-xl text-gray-600">Epic memories from our streaming journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {moments.map((moment) => {
            const IconComponent = moment.icon
            return (
              <div
                key={moment.id}
                onClick={() => setSelectedMoment(moment)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className={`h-48 bg-gradient-to-br ${moment.bgGradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent size={64} className="text-white opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold" style={{ color: moment.color }}>
                      {moment.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {moment.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {moment.description}
                  </p>
                  
                  {moment.stats && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{moment.stats.label}</span>
                      <span className="text-lg font-bold" style={{ color: moment.color }}>
                        {moment.stats.value}
                      </span>
                    </div>
                  )}

                  <div className="mt-4">
                    <span className="text-xs text-gray-400">{moment.date}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {selectedMoment && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedMoment(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`h-64 bg-gradient-to-br ${selectedMoment.bgGradient} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <selectedMoment.icon size={96} className="text-white" />
                </div>
                <button
                  onClick={() => setSelectedMoment(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold" style={{ color: selectedMoment.color }}>
                    {selectedMoment.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  {selectedMoment.title}
                </h2>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {selectedMoment.description}
                </p>

                {selectedMoment.stats && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">{selectedMoment.stats.label}</span>
                      <span className="text-3xl font-bold" style={{ color: selectedMoment.color }}>
                        {selectedMoment.stats.value}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <span>{selectedMoment.date}</span>
                  <span>📺 Watch on TikTok</span>
                </div>

                <div className="flex gap-3">
                  <button 
                    className="flex-1 px-6 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: selectedMoment.color }}
                  >
                    Watch Full Video
                  </button>
                  <button className="flex-1 px-6 py-3 border-2 border-blue-900 text-blue-900 font-semibold rounded-full hover:bg-blue-900 hover:text-white transition-all">
                    Share Moment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}