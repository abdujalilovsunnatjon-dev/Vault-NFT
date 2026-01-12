import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Trophy,
    TrendingUp,
    Users,
    Target,
    CheckCircle,
    Star,
    Award,
    Clock
} from 'lucide-react'
import { cn } from '../lib/utils'

const Season = () => {
    const [activeTab, setActiveTab] = useState<'global' | 'season1' | 'season2'>('season2')

    const stats = [
        { icon: TrendingUp, label: 'Earned Points', value: '1,250', change: '+12.5%' },
        { icon: Target, label: 'Purchase Volume', value: '45.2 TON', change: '+8.2%' },
        { icon: Users, label: 'Referrals', value: '8', change: '+3' },
        { icon: Trophy, label: 'Tasks Completed', value: '12/20', change: '60%' },
    ]

    const tasks = [
        { id: 1, title: 'Subscribe to Channel', points: 50, completed: true },
        { id: 2, title: 'Buy First NFT', points: 100, completed: true },
        { id: 3, title: 'Invite 3 Friends', points: 300, completed: false },
        { id: 4, title: 'Trade 5+ Items', points: 150, completed: false },
        { id: 5, title: 'Reach Level 10', points: 200, completed: false },
    ]

    const leaderboard = [
        { rank: 1, name: 'crypto_king', points: 5420, change: '↑' },
        { rank: 2, name: 'nft_guru', points: 4980, change: '↑' },
        { rank: 3, name: 'web3_wizard', points: 4520, change: '↓' },
        { rank: 4, name: 'ton_whale', points: 4210, change: '↑' },
        { rank: 5, name: 'you', points: 1250, change: '↑' },
    ]

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between"
            >
                <div>
                    <div className="flex items-center mb-1">
                        <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                        <h1 className="text-2xl font-bold">Season #2</h1>
                    </div>
                    <p className="text-gray-400 text-sm">Earn rewards by trading NFTs</p>
                </div>
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-primary-500/30 rounded-full"
                    />
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <span className="text-xl font-bold">02</span>
                    </div>
                </div>
            </motion.header>

            {/* Progress Bar */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                className="space-y-2"
            >
                <div className="flex justify-between text-sm">
                    <span>Season Progress</span>
                    <span className="font-bold">42%</span>
                </div>
                <div className="progress-bar">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '42%' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="progress-fill"
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>15 days left</span>
                    <span>Level 8/20</span>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex space-x-1 border-b border-border pb-2">
                {[
                    { id: 'global', label: 'Global' },
                    { id: 'season1', label: 'Season 1' },
                    { id: 'season2', label: 'Season 2' },
                ].map((tab) => (
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
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="season-tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
            >
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-surface rounded-2xl p-4 border border-border"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 rounded-lg bg-primary-500/20">
                                    <Icon className="w-4 h-4 text-primary-500" />
                                </div>
                                <span className="text-xs font-medium text-green-400">
                                    {stat.change}
                                </span>
                            </div>
                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                            <div className="text-xs text-gray-400">{stat.label}</div>
                        </motion.div>
                    )
                })}
            </motion.div>

            {/* Tasks */}
            <div>
                <h2 className="text-lg font-bold mb-4">Daily Tasks</h2>
                <div className="space-y-3">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-surface rounded-xl p-4 flex items-center justify-between border border-border"
                        >
                            <div className="flex items-center">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center mr-3",
                                    task.completed
                                        ? "bg-green-500/20"
                                        : "bg-surface-light"
                                )}>
                                    {task.completed ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{task.title}</h3>
                                    <p className="text-sm text-gray-400">Complete to earn points</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                <span className="font-bold">{task.points}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Leaderboard Preview */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Top Traders</h2>
                    <button className="text-sm text-primary-500 font-medium">
                        View All
                    </button>
                </div>
                <div className="bg-surface rounded-2xl overflow-hidden border border-border">
                    {leaderboard.map((player, index) => (
                        <motion.div
                            key={player.rank}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "flex items-center px-4 py-3 border-b border-border last:border-0",
                                player.rank === 5 && "bg-primary-500/10"
                            )}
                        >
                            <div className="flex items-center justify-center w-8">
                                {player.rank <= 3 ? (
                                    <Award className={cn(
                                        "w-5 h-5",
                                        player.rank === 1 && "text-yellow-400",
                                        player.rank === 2 && "text-gray-400",
                                        player.rank === 3 && "text-amber-700"
                                    )} />
                                ) : (
                                    <span className="text-gray-400 font-bold">{player.rank}</span>
                                )}
                            </div>
                            <div className="flex-1 ml-3">
                                <div className="font-medium">{player.name}</div>
                                <div className="text-xs text-gray-400 flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    {player.points.toLocaleString()} pts
                                </div>
                            </div>
                            <div className={cn(
                                "text-sm font-bold",
                                player.change === '↑' ? "text-green-400" : "text-red-400"
                            )}>
                                {player.change}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Season