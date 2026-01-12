import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface NavItem {
    path: string
    icon: LucideIcon
    label: string
}

interface BottomNavProps {
    items: NavItem[]
}

const BottomNav = ({ items }: BottomNavProps) => {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border"
            style={{
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)'
            }}
        >
            <div className="flex justify-around items-center h-16 px-4">
                {items.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 transition-all duration-200",
                                isActive ? "text-primary-500" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="relative p-2 rounded-xl"
                            >
                                <Icon size={22} />
                                {isActive && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute inset-0 bg-primary-500/10 rounded-xl -z-10"
                                    />
                                )}
                            </motion.div>
                            <span className="text-xs mt-1 font-medium">{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </motion.nav>
    )
}

export default BottomNav