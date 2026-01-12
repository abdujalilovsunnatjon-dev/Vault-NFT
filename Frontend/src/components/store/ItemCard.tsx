import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Heart, Zap, Check, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api'

interface Item {
    id: string
    name: string
    image: string
    price: number
    collection: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    views: number
    likes: number
}

interface ItemCardProps {
    item: Item
}

const ItemCard = ({ item }: ItemCardProps) => {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

    const handleBuy = async () => {
        if (status === 'pending') return;

        try {
            setStatus('pending')
            await api.post('/nft/buy', { itemId: item.id })
            setStatus('success')
            // Optional: You might want to refresh user balance or item list here
            setTimeout(() => setStatus('idle'), 2000)
        } catch (error) {
            console.error('Buy failed:', error)
            setStatus('error')
            setTimeout(() => setStatus('idle'), 2000)
        }
    }

    const rarityColors = {
        common: 'bg-gray-500',
        rare: 'bg-blue-500',
        epic: 'bg-purple-500',
        legendary: 'bg-yellow-500',
    }

    return (
        <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-surface rounded-2xl overflow-hidden border border-border card-hover"
        >
            {/* Rarity Badge */}
            <div className="absolute top-3 left-3 z-10">
                <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    rarityColors[item.rarity]
                )}>
                    {item.rarity.toUpperCase()}
                </span>
            </div>

            {/* Like Button */}
            <motion.button
                whileTap={{ scale: 1.2 }}
                className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-xs rounded-full p-2"
            >
                <Heart className="w-4 h-4" />
            </motion.button>

            {/* Image */}
            <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-gray-400">{item.collection}</p>
                    </div>
                    <Zap className="w-4 h-4 text-yellow-400" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{item.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{item.likes.toLocaleString()}</span>
                    </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold">{item.price} TON</div>
                        <div className="text-xs text-gray-400">≈ ${(item.price * 2.4).toFixed(2)}</div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleBuy();
                        }}
                        disabled={status === 'pending' || status === 'success'}
                        className={cn(
                            "text-sm font-medium px-3 py-2 rounded-lg transition-all min-w-[80px] flex justify-center items-center",
                            status === 'success' ? "bg-green-600 text-white" :
                                status === 'error' ? "bg-red-600 text-white" :
                                    "bg-primary-600 hover:bg-primary-700 text-white"
                        )}
                    >
                        {status === 'pending' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                            status === 'success' ? <Check className="w-4 h-4" /> :
                                status === 'error' ? "Err" :
                                    "Buy"}
                    </motion.button>
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-primary-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    )
}

export default ItemCard