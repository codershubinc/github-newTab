import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Save, RotateCcw, LogOut, X, User as UserIcon,
    MapPin, Briefcase, Linkedin, Youtube, Twitter, Facebook,
    Instagram, Link as LinkIcon, Twitch
} from 'lucide-react';
import { useSidebarLogic } from './sidebarLogic';
import getYearsFromDate from '@src/utils/yrs';

export default function ProfileCard() {
    const { user, storeUsername, refreshUser, removeUser } = useSidebarLogic();
    const [isFlipped, setIsFlipped] = useState(false);

    // Helper: Larger Icons (size={22})
    const getSocialIcon = (provider: string) => {
        switch (provider.toLowerCase()) {
            case 'linkedin': return <Linkedin size={22} />;
            case 'youtube': return <Youtube size={22} />;
            case 'twitter': return <Twitter size={22} />;
            case 'facebook': return <Facebook size={22} />;
            case 'instagram': return <Instagram size={22} />;
            case 'twitch': return <Twitch size={22} />;
            default: return <LinkIcon size={22} />;
        }
    };

    const frontVariants = {
        initial: { rotateY: 0 },
        animate: { rotateY: isFlipped ? 180 : 0 },
    };

    const backVariants = {
        initial: { rotateY: -180 },
        animate: { rotateY: isFlipped ? 0 : -180 },
    };

    return (
        // 1. CONTAINER: No background here. Just structure.
        <div className="w-full h-full perspective-1000 relative">

            {/* 2. FRONT SIDE: Changed to RELATIVE so it dictates height */}
            <motion.div
                className="w-full h-full relative backface-hidden card-surface rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl bg-zinc-900/50 backdrop-blur-md border border-white/5"
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                initial="initial"
                animate="animate"
                variants={frontVariants}
                style={{ backfaceVisibility: 'hidden' }}
            >
                <div className="w-full flex justify-end shrink-0">
                    <button
                        onClick={() => setIsFlipped(true)}
                        className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-colors relative z-50"
                    >
                        <Settings size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-6 flex-1 w-full mt-2">
                    {!user ? (
                        <div className="flex flex-col items-center gap-6 text-zinc-500 justify-center min-h-[300px]">
                            <UserIcon size={60} className="opacity-50" />
                            <p className="text-xl font-medium">No User Configured</p>
                        </div>
                    ) : (
                        <>
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                                <img
                                    src={user.avatar_url}
                                    alt="Avatar"
                                    className="relative w-36 h-36 rounded-full border-[5px] border-zinc-950 shadow-2xl"
                                />
                                <div className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-500 border-[5px] border-zinc-950 rounded-full z-10"></div>
                            </div>

                            {/* Name */}
                            <div className="space-y-1 mt-2">
                                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">{user.name}</h1>
                                <p className="text-base font-mono text-zinc-400">@{user.login}</p>
                            </div>

                            {/* Bio & Details */}
                            <div className="flex flex-col items-center gap-3 max-w-[95%]">
                                {user.bio && (
                                    <p className="text-sm text-zinc-300 italic leading-relaxed">"{user.bio}"</p>
                                )}

                                <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500 mt-1">
                                    {user.company && (
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase size={14} /><span>{user.company}</span>
                                        </div>
                                    )}
                                    {user.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} /><span>{user.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Socials */}
                                {user.social_accounts && user.social_accounts.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                        {user.social_accounts.map((social: any, idx: number) => (
                                            <a
                                                key={idx}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500 hover:scale-110 transition-all shadow-md"
                                                title={social.provider}
                                            >
                                                {getSocialIcon(social.provider)}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="w-full h-[1px] bg-zinc-800/50 my-4"></div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 w-full px-2">
                                <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-800/60 transition-colors">
                                    <span className="text-xl font-bold text-white">{user.public_repos}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Repos</span>
                                </div>
                                <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-800/60 transition-colors">
                                    <span className="text-xl font-bold text-white">{user.followers}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Followers</span>
                                </div>
                                <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-800/60 transition-colors">
                                    <span className="text-xl font-bold text-white">{user.following}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Following</span>
                                </div>
                            </div>

                            <p className="text-xs text-emerald-500 font-mono mt-auto pt-4 opacity-80">
                                Joined {getYearsFromDate(user.created_at)} Years Ago
                            </p>
                        </>
                    )}
                </div>
            </motion.div>

            {/* 3. BACK SIDE: Absolute is fine here as it overlays the front */}
            <motion.div
                className="w-full h-full absolute inset-0 backface-hidden card-surface rounded-2xl p-10 flex flex-col shadow-2xl bg-zinc-900/95 border border-white/10"
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                initial="initial"
                animate="animate"
                variants={backVariants}
                style={{ backfaceVisibility: 'hidden' }}
            >
                <div className="flex justify-between items-center mb-10 shrink-0">
                    <span className="text-xl font-bold text-zinc-200">Settings</span>
                    <button
                        onClick={() => setIsFlipped(false)}
                        className="text-zinc-500 hover:text-white p-2 relative z-50 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-8 flex-1 justify-center">
                    <div className="space-y-3">
                        <label className="text-sm text-zinc-500 uppercase font-bold tracking-wider">GitHub Username</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                id="userName"
                                placeholder="codershubinc"
                                className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-200 text-lg rounded-xl px-5 py-4 focus:border-zinc-600 outline-none transition-colors"
                            />
                            <button
                                onClick={() => { storeUsername(); setIsFlipped(false); }}
                                className="px-5 bg-zinc-100 text-zinc-900 rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg"
                            >
                                <Save size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-zinc-800">
                        <button onClick={refreshUser} className="flex flex-col items-center gap-3 p-5 bg-zinc-900 rounded-2xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800">
                            <RotateCcw size={28} /> <span className="text-base">Refresh</span>
                        </button>
                        <button onClick={removeUser} className="flex flex-col items-center gap-3 p-5 bg-red-900/10 rounded-2xl hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-all border border-red-900/20">
                            <LogOut size={28} /> <span className="text-base">Logout</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}