import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RotateCcw, LogOut, Github, X, User } from 'lucide-react';
import { useSidebarLogic } from './sidebarLogic';
import getYearsFromDate from '@src/utils/yrs';

export default function ProfileCard() {
    const { user, storeUsername, refreshUser, removeUser } = useSidebarLogic();
    const [isFlipped, setIsFlipped] = useState(false);

    const frontVariants = {
        animate: { rotateY: isFlipped ? 180 : 0 },
        initial: { rotateY: 0 },
    };
    const backVariants = {
        animate: { rotateY: isFlipped ? 0 : -180 },
        initial: { rotateY: -180 },
    };

    return (
        <div className="w-full h-full perspective-1000 relative">

            {/* FRONT */}
            <motion.div
                className="w-full h-full absolute backface-hidden card-surface rounded-2xl p-6 flex flex-col items-center text-center justify-between shadow-2xl"
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                initial="initial"
                animate={isFlipped ? "animate" : "initial"}
                style={{ backfaceVisibility: 'hidden' }}
            >
                <div className="w-full flex justify-end">
                    <button onClick={() => setIsFlipped(true)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors">
                        <Settings size={18} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-3 flex-1 justify-center -mt-6">
                    {!user ? (
                        <div className="flex flex-col items-center gap-4 text-zinc-500">
                            <User size={56} className="opacity-50" />
                            <p className="text-sm font-medium">User Not Found</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-0.5">
                                <h1 className="text-2xl font-bold text-zinc-200 tracking-tight">{user.login}</h1>
                                <p className="text-sm font-medium text-zinc-400">
                                    <span className="text-white font-serif italic">Welcome</span> {user.name}
                                </p>
                            </div>

                            <div className="relative my-3">
                                <img
                                    src={user.avatar_url}
                                    alt="Avatar"
                                    className="w-28 h-28 rounded-full border-4 border-zinc-800 shadow-xl transition-transform hover:scale-105"
                                />
                                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-zinc-900 rounded-full"></div>
                            </div>

                            <div className="w-16 h-[1px] bg-zinc-800 my-2"></div>

                            <div className="flex flex-col gap-1 text-xs text-zinc-400">
                                <p>
                                    Github Joined: <span className="font-bold text-zinc-300">{(user.created_at)?.split('T')[0]}</span>
                                </p>
                                <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-wide">
                                    {getYearsFromDate(user.created_at)} Years Ago
                                </p>
                                <div className="mt-3 px-4 py-2 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                    <span className="block text-xl font-bold text-white">{user.public_repos}</span>
                                    <span className="text-[10px] uppercase tracking-wider">Public Repos</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="w-full mt-4 opacity-75 hover:opacity-100 transition-opacity">
                    <img
                        className="w-full rounded-lg"
                        src={`https://quotes-github-readme.vercel.app/api?type=horizontal&theme=transparent&title_color=fff&text_color=a1a1aa&quote_color=52525b&bg_color=09090b&nocache=${new Date().getTime()}`}
                        alt="Quote"
                    />
                </div>
            </motion.div>

            {/* BACK */}
            <motion.div
                className="w-full h-full absolute backface-hidden card-surface rounded-2xl p-6 flex flex-col shadow-2xl"
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                initial="initial"
                animate={isFlipped ? "animate" : "initial"}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
                <div className="flex justify-between items-center mb-8">
                    <span className="text-base font-bold text-zinc-200">Settings</span>
                    <button onClick={() => setIsFlipped(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
                </div>

                <div className="flex flex-col gap-5 flex-1 justify-center">
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">GitHub Username</label>
                        <div className="flex gap-2">
                            <input type="text" id="userName" placeholder="username" className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-lg px-3 py-2.5 focus:border-zinc-600 outline-none" />
                            <button onClick={() => { storeUsername(); setIsFlipped(false); }} className="px-3 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-white"><Save size={18} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-zinc-800">
                        <button onClick={refreshUser} className="flex flex-col items-center gap-2 p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800">
                            <RotateCcw size={20} /> <span className="text-xs">Refresh</span>
                        </button>
                        <button onClick={removeUser} className="flex flex-col items-center gap-2 p-3 bg-red-900/10 rounded-xl hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-all border border-red-900/20">
                            <LogOut size={20} /> <span className="text-xs">Logout</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}