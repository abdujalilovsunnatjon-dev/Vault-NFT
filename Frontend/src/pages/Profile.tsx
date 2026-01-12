import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Settings,
    LogOut,
    Share2,
    Gift,
    TrendingUp,
    ChevronRight,
    Bell,
    Globe,
    Heart,
    Shield,
    Mail
} from 'lucide-react'
import { useTelegram } from '../contexts/TelegramContext'
import { cn } from '../lib/utils'

const Profile = () => {
    const { user } = useTelegram()
    const [showSettings, setShowSettings] = useState(false)

    const stats = [
        { label: 'Total Volume', value: '245.8 TON', change: '+18.2%' },
        { label: 'Bought', value: '42 NFTs', change: '+12' },
        { label: 'Sold', value: '28 NFTs', change: '+8' },
    ]

    const menuItems = [
        { icon: Bell, label: 'Notifications', badge: '3' },
        { icon: Globe, label: 'Language', value: 'English' },
        { icon: Heart, label: 'Favorites', value: '24' },
        { icon: Shield, label: 'Privacy' },
        { icon: Mail, label: 'Contact Team' },
        { icon: Settings, label: 'Advanced Settings' },
    ]

    const referralCode = 'VAULT-' + Math.random().toString(36).substr(2, 6).toUpperCase()

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-gray-400 text-sm">Manage your account</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettings(true)}
                    className="bg-surface rounded-xl p-2"
                >
                    <Settings className="w-5 h-5" />
                </motion.button>
            </motion.header>

            {/* Profile Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface rounded-2xl p-6 border border-border"
            >
                <div className="flex items-center mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-surface" />
                    </div>
                    <div className="ml-4 flex-1">
                        <h2 className="text-xl font-bold">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-gray-400">@{user?.username || 'username'}</p>
                        <div className="flex items-center mt-2 text-sm">
                            <div className="flex items-center mr-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                                <span className="text-gray-400">Online</span>
                            </div>
                            <span className="text-gray-400">Member since 2024</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-xl font-bold mb-1">{stat.value}</div>
                            <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                            <div className="text-xs text-green-400">{stat.change}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Cashback Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span>Cashback Progress</span>
                        <span className="font-bold">75%</span>
                    </div>
                    <div className="progress-bar">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="progress-fill"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Spend 50 TON more for 5% cashback</span>
                        <span>250/300 TON</span>
                    </div>
                </div>

                {/* Season Points */}
                <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/30 flex items-center justify-center mr-2">
                                <TrendingUp className="w-4 h-4 text-primary-500" />
                            </div>
                            <div>
                                <div className="font-bold">Season Points</div>
                                <div className="text-sm text-gray-300">Rank #124 • Top 15%</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">1,250</div>
                            <div className="text-sm text-green-400">+125 today</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Giveaways Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600/20 to-orange-600/20 border border-pink-500/30 p-6"
            >
                <div className="relative z-10">
                    <div className="flex items-center mb-2">
                        <Gift className="w-6 h-6 mr-2 text-pink-400" />
                        <span className="font-medium">Weekly Giveaway</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Win 500 TON</h3>
                    <p className="text-gray-300 text-sm mb-4">Trade any NFT to enter</p>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="bg-pink-600 hover:bg-pink-700 rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        Enter Now
                    </motion.button>
                </div>
            </motion.div>

            {/* Referral Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface rounded-2xl p-6 border border-border"
            >
                <h3 className="text-lg font-bold mb-4">Invite Friends</h3>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-2xl font-bold">Earn 10%</div>
                        <div className="text-sm text-gray-400">from friends' trades</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold">8 friends</div>
                        <div className="text-sm text-green-400">+120 TON earned</div>
                    </div>
                </div>

                <div className="flex space-x-3 mb-4">
                    <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-2">Your code</div>
                        <div className="bg-surface-light rounded-xl px-4 py-3 font-mono font-bold">
                            {referralCode}
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="self-end bg-primary-600 hover:bg-primary-700 rounded-xl px-4 py-3"
                    >
                        <Share2 className="w-5 h-5" />
                    </motion.button>
                </div>

                <div className="text-xs text-gray-400">
                    Share your code with friends. Both get 50 points when they join!
                </div>
            </motion.div>

            {/* Menu Items */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
            >
                {menuItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <motion.button
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-surface rounded-xl p-4 flex items-center justify-between hover:bg-surface-light transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-primary-500/20 mr-3">
                                    <Icon className="w-4 h-4 text-primary-500" />
                                </div>
                                <span className="font-medium">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-2 bg-primary-500 text-xs px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center">
                                {item.value && (
                                    <span className="text-sm text-gray-400 mr-2">{item.value}</span>
                                )}
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </motion.button>
                    )
                })}

                {/* Logout Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-red-500/10 text-red-400 rounded-xl p-4 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="font-medium">Log Out</span>
                </motion.button>
            </motion.div>
        </div>
    )
}

export default Profile