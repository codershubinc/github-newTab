import { StorageUtil } from '@src/utils/storageUtil';
import { useSidebarLogic } from './sidebarLogic';
import getYearsFromDate from '@src/utils/yrs';
import { RotateCcw, LogOut, Menu, User, Save, Github } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import refetchUserDaily from '@src/utils/refetchUserDaily';

function Sidebar() {
    const { user, error, loadUser, storeUsername, refreshUser, removeUser } = useSidebarLogic();
    const STORE = new StorageUtil(); // used for quote logic if needed
    const [isMinimized, setIsMinimized] = useState(true); // Default to minimized for cleaner start
    const [loading, setLoading] = useState(true);

    setTimeout(() => setLoading(false), 500);

    // Self-invoking async function for refetch
    ; (async () => { await refetchUserDaily() })()

    return (
        <motion.div
            initial={{ width: '80px' }}
            animate={{ width: isMinimized ? '80px' : '360px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-screen bg-zinc-950 border-r border-zinc-800 text-zinc-200 flex flex-col relative z-50 shadow-2xl"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="absolute top-4 right-4 z-50 p-2 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-lg transition-all border border-transparent hover:border-zinc-700"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <AnimatePresence mode="wait">
                    {isMinimized ? (
                        /* Minimized State Icon */
                        <motion.div
                            key="mini"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center pt-20 gap-6"
                        >
                            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                                <Github className="text-white" size={24} />
                            </div>
                        </motion.div>
                    ) : (
                        /* Expanded State */
                        <motion.div
                            key="full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-6 pt-20 flex flex-col gap-8 h-full"
                        >
                            {/* LOGO / BRAND */}
                            <div className="flex items-center gap-3 px-2">
                                <div className="p-2 bg-white rounded-lg">
                                    <Github className="text-black" size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white text-lg leading-none">GitDash</h2>
                                    <p className="text-xs text-zinc-500">Developer Extension</p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-zinc-500 border-t-transparent"></div>
                                </div>
                            ) : error ? (
                                /* ERROR / SETUP STATE */
                                <div className="flex flex-col gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 border-l-2 border-l-red-500">
                                    <p className="text-zinc-300 text-sm font-medium">Configuration Required</p>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">GitHub Username</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                id="userName"
                                                placeholder="e.g. torvalds"
                                                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                            />
                                            <button
                                                onClick={storeUsername}
                                                className="p-2 bg-zinc-100 text-zinc-900 rounded-md hover:bg-white transition-colors"
                                            >
                                                <Save size={18} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={loadUser}
                                            className="text-xs text-zinc-500 hover:text-zinc-300 underline text-left mt-1"
                                        >
                                            Retry connection
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* USER PROFILE STATE */
                                <div className="flex flex-col gap-6">
                                    {/* Profile Card */}
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" />
                                        <div className="flex flex-col items-center text-center">
                                            <div className="relative">
                                                <img
                                                    className="w-24 h-24 rounded-full border-4 border-zinc-900 shadow-lg"
                                                    src={user?.avatar_url}
                                                    alt="User Avatar"
                                                />
                                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-zinc-900 rounded-full"></div>
                                            </div>

                                            <h3 className="mt-4 text-xl font-bold text-white">{user?.name}</h3>
                                            <p className="text-sm text-zinc-500 font-mono">@{user?.login}</p>

                                            <div className="flex items-center gap-4 mt-4 text-xs font-mono text-zinc-400">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-bold text-white text-base">{user?.public_repos}</span>
                                                    <span>Repos</span>
                                                </div>
                                                <div className="w-[1px] h-8 bg-zinc-800"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="font-bold text-white text-base">{getYearsFromDate(user?.created_at)}y</span>
                                                    <span>Joined</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={refreshUser}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
                                        >
                                            <RotateCcw size={14} /> Refresh
                                        </button>
                                        <button
                                            onClick={removeUser}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-950/30 border border-red-900/50 rounded-lg text-xs font-medium text-red-400 hover:bg-red-900/50 hover:text-red-200 transition-all"
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>

                                    <hr className="border-zinc-800" />

                                    {/* Quote Widget (Styled Transparent) */}
                                    <div className="opacity-70 hover:opacity-100 transition-opacity">
                                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-2">Daily Inspiration</p>
                                        <img
                                            className="w-full"
                                            src={`https://quotes-github-readme.vercel.app/api?type=horizontal&theme=transparent&title_color=fff&text_color=a1a1aa&quote_color=52525b&bg_color=09090b&nocache=${new Date().getTime()}`}
                                            alt="Inspirational Quote"
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default Sidebar;