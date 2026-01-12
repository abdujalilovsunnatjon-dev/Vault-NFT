import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Search,
    Filter,
    Plus,
    Rocket,
    Star,
    Flame,
    Sparkles
} from 'lucide-react'
import ItemCard from '../components/store/ItemCard'
import CategoryFilter from '../components/store/CategoryFilter'
import { mockItems, mockCollections } from '../data/mockData'
import { cn } from '../lib/utils'

const Store = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'collections' | 'bundles'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    const tabs = [
        { id: 'all', label: 'All Items', count: 42 },
        { id: 'collections', label: 'Collections', count: 8 },
        { id: 'bundles', label: 'Bundles', count: 12 },
    ]

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-center"
            >
                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-surface rounded-xl px-3 py-2">
                        <Star className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" />
                        <span className="font-bold">1,250</span>
                    </div>
                    <span className="text-sm text-gray-400">points</span>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-surface rounded-xl px-3 py-2">
                        <span className="font-bold">25.4</span>
                        <span className="text-sm text-gray-400 ml-1">TON</span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="bg-primary-600 rounded-xl p-2"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>
            </motion.header>

            {/* Banner */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 p-6"
            >
                <div className="relative z-10">
                    <div className="flex items-center mb-2">
                        <Rocket className="w-6 h-6 mr-2 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">Season 2 is open</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Earn 3x Points</h2>
                    <p className="text-gray-300 text-sm">Complete missions and climb the leaderboard</p>
                </div>

                {/* Animated background elements */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-4 right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"
                />
                <Sparkles className="absolute bottom-4 right-4 w-16 h-16 text-purple-400/30" />
            </motion.div>

            {/* Search and Filter */}
            <div className="flex space-x-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field w-full pl-10"
                    />
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="btn-secondary flex items-center"
                >
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                </motion.button>
            </div>

            {/* Category Filters */}
            <CategoryFilter
                value={activeTab}
                onChange={setActiveTab}
            />


            {/* Tabs */}
            <div className="flex space-x-1 border-b border-border pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "relative px-4 py-2 text-sm font-medium transition-colors",
                            activeTab === tab.id
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                        )}
                    >
                        {tab.label}
                        <span className="ml-2 text-xs bg-surface rounded-full px-2 py-0.5">
                            {tab.count}
                        </span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="active-tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
            >
                {mockItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ItemCard item={item} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default Store