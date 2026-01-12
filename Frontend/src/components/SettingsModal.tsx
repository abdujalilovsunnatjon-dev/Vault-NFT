import { motion, AnimatePresence } from 'framer-motion'
import { X, Moon, Bell, Globe, Smartphone, Shield } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const [language, setLanguage] = useState('en')
    const [haptic, setHaptic] = useState(true)
    const [notifications, setNotifications] = useState(true)

    const settings = [
        {
            icon: Globe,
            label: 'Language',
            type: 'select' as const,
            value: language,
            options: [
                { value: 'en', label: 'English' },
                { value: 'ru', label: 'Русский' },
                { value: 'zh', label: '中文' },
                { value: 'es', label: 'Español' },
            ],
            onChange: setLanguage,
        },
        {
            icon: Smartphone,
            label: 'Haptic Feedback',
            type: 'toggle' as const,
            value: haptic,
            onChange: setHaptic,
        },
        {
            icon: Bell,
            label: 'Push Notifications',
            type: 'toggle' as const,
            value: notifications,
            onChange: setNotifications,
        },
        {
            icon: Shield,
            label: 'Privacy Mode',
            type: 'toggle' as const,
            value: false,
            onChange: () => { },
        },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-surface rounded-3xl w-full max-w-md overflow-hidden border border-border">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <div>
                                    <h2 className="text-xl font-bold">Settings</h2>
                                    <p className="text-sm text-gray-400">Customize your experience</p>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 hover:bg-surface-light rounded-xl"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Settings List */}
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                {settings.map((setting, index) => {
                                    const Icon = setting.icon
                                    return (
                                        <motion.div
                                            key={setting.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between p-4 rounded-xl bg-surface-light"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-lg bg-primary-500/20 mr-3">
                                                    <Icon className="w-4 h-4 text-primary-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{setting.label}</div>
                                                    {setting.type === 'select' && (
                                                        <div className="text-xs text-gray-400">
                                                            {setting.options.find(opt => opt.value === setting.value)?.label}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {setting.type === 'toggle' && (
                                                <button
                                                    onClick={() => setting.onChange(!setting.value)}
                                                    className={cn(
                                                        "w-12 h-6 rounded-full transition-all duration-300",
                                                        setting.value
                                                            ? "bg-primary-500 justify-end"
                                                            : "bg-gray-600 justify-start"
                                                    )}
                                                >
                                                    <div className="w-4 h-4 rounded-full bg-white m-1 transform transition-transform" />
                                                </button>
                                            )}

                                            {setting.type === 'select' && (
                                                <select
                                                    value={setting.value}
                                                    onChange={(e) => setting.onChange(e.target.value)}
                                                    className="bg-surface border border-border rounded-lg px-3 py-1 text-sm"
                                                >
                                                    {setting.options.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-border">
                                <button className="w-full btn-primary">
                                    Save Changes
                                </button>
                                <button className="w-full mt-3 text-sm text-gray-400 hover:text-white transition-colors">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default SettingsModal