import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Gift,
    Upload,
    Download,
    Send,
    ShoppingBag,
    PlusCircle,
    Package
} from 'lucide-react'
import { mockGifts } from '../data/mockData'
import { cn } from '../lib/utils'

const MyGifts = () => {
    const [activeTab, setActiveTab] = useState<'gifts' | 'offers' | 'activity'>('gifts')

    const tabs = [
        { id: 'gifts', label: 'Gifts', count: 5 },
        { id: 'offers', label: 'Offers', count: 3 },
        { id: 'activity', label: 'My Activity', count: 12 },
    ]

    const actionButtons = [
        { icon: PlusCircle, label: 'Add', color: 'bg-primary-600' },
        { icon: Upload, label: 'Withdraw', color: 'bg-accent' },
        { icon: ShoppingBag, label: 'Sell', color: 'bg-purple-600' },
        { icon: Send, label: 'Send', color: 'bg-pink-600' },
    ]

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-2xl font-bold">My Gifts</h1>
                    <p className="text-gray-400 text-sm">Manage your NFT gifts and offers</p>
                </div>
                <div className="flex items-center bg-surface rounded-xl px-3 py-2">
                    <Gift className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="font-bold">12</span>
                </div>
            </motion.header>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-3"
            >
                {actionButtons.map((button, index) => {
                    const Icon = button.icon
                    return (
                        <motion.button
                            key={button.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 hover:scale-105",
                                button.color
                            )}
                        >
                            <Icon className="w-6 h-6 mb-2" />
                            <span className="text-xs font-medium">{button.label}</span>
                        </motion.button>
                    )
                })}
            </motion.div>

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
                                layoutId="gifts-tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Gifts Grid */}
            {activeTab === 'gifts' && (
                <>
                    {mockGifts.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {mockGifts.map((gift, index) => (
                                <motion.div
                                    key={gift.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-surface rounded-2xl overflow-hidden border border-border"
                                >
                                    <div className="aspect-square relative overflow-hidden">
                                        <img
                                            src={gift.image}
                                            alt={gift.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-xs rounded-full px-2 py-1 text-xs">
                                            #{gift.id}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm mb-1">{gift.name}</h3>
                                        <p className="text-xs text-gray-400 mb-3">From: {gift.from}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-primary-500">
                                                {gift.value} TON
                                            </span>
                                            <button className="text-xs bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded-lg">
                                                Open
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-center"
                        >
                            <div className="relative mb-6">
                                <Package className="w-24 h-24 text-gray-600" />
                                <Gift className="w-12 h-12 text-primary-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No gifts yet</h3>
                            <p className="text-gray-400 mb-6 max-w-sm">
                                You haven't received any gifts yet. Explore the marketplace to find amazing NFTs!
                            </p>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary px-6"
                            >
                                Go to Marketplace
                            </motion.button>
                        </motion.div>
                    )}
                </>
            )}

            {/* Offers Tab */}
            {activeTab === 'offers' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    {/* Offer cards would go here */}
                    <div className="text-center py-16 text-gray-400">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No active offers</p>
                    </div>
                </motion.div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                >
                    {/* Activity items would go here */}
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-surface rounded-xl p-4 flex items-center"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center mr-3">
                                <Gift className="w-5 h-5 text-primary-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className="font-medium">Gift Received</span>
                                    <span className="text-sm text-primary-500">+2.5 TON</span>
                                </div>
                                <p className="text-xs text-gray-400">2 hours ago</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}

export default MyGifts