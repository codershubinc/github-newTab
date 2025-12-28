import { useEffect, useState } from 'react';
import { Star, GitCommit, GitPullRequest, CircleDot, Trophy, GitMerge, Users, Github, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface GithubStats {
    name: string;
    totalPRs: number;
    totalPRsMerged: number;
    mergedPRsPercentage: number;
    totalReviews: number;
    totalCommits: number;
    totalIssues: number;
    totalStars: number;
    totalDiscussionsStarted: number;
    totalDiscussionsAnswered: number;
    contributedTo: number;
    rank: {
        level: string;
        percentile: number;
    };
}

export default function GithubStatsCard({ username }: { username: string }) {
    const [stats, setStats] = useState<GithubStats | null>(null);
    const [loading, setLoading] = useState(true);

    const baseUrl = import.meta.env.DEV
        ? '/api-proxy'
        : 'https://github-readme-states-repo-self-inst.vercel.app';

    useEffect(() => {
        if (!username) return;

        fetch(`${baseUrl}/api/json-stats?username=${username}`)
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch github stats", err);
                setLoading(false);
            });
    }, [username]);

    // Helper to determine rank color
    const getRankColor = (level: string) => {
        if (level.includes('S')) return 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]';
        if (level.includes('A')) return 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]';
        if (level.includes('B')) return 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]';
        return 'text-zinc-400';
    };

    if (loading) {
        return (
            <div className="w-full h-full min-h-[300px] animate-pulse rounded-[2rem] bg-zinc-800/20 border border-zinc-800/50"></div>
        );
    }

    if (!stats) return null;

    const StatItem = ({ icon: Icon, label, value, colorClass }: any) => (
        <div className="flex flex-col gap-1 relative group">
            <div className="flex items-center gap-2 mb-0.5">
                <div className={`p-1.5 rounded-lg bg-zinc-800/50 ${colorClass.replace('text-', 'text-opacity-80 text-')}`}>
                    <Icon size={16} className={colorClass} />
                </div>
                <span className="text-sm uppercase font-bold text-zinc-300 tracking-wider group-hover:text-zinc-300 transition-colors">
                    {label}
                </span>
            </div>
            <span className="text-2xl font-bold text-zinc-100 tracking-tight pl-1">
                {value.toLocaleString()}
            </span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface p-8 rounded-[2rem] flex flex-col w-full h-full min-h-[300px] bg-zinc-900/40 backdrop-blur-md border border-white/5 relative overflow-hidden group"
        >
            {/* --- BACKGROUND DECORATION --- */}
            <Github
                className="absolute -right-8 -bottom-8 text-white/10 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
                size={220}
            />

            {/* --- HEADER --- */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Github size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Overall Stats <span className='text-[10px] lowercase'>(1 yr)</span></span>
                    </div>
                    {/* RANK DISPLAY */}
                    <div className="flex items-baseline gap-3 mt-2">
                        <span className={`text-7xl font-black italic tracking-tighter ${getRankColor(stats.rank.level)}`}>
                            {stats.rank.level}
                        </span>
                        <div className="flex flex-col justify-end pb-2">
                            <span className="text-md font-bold text-zinc-300">Rank</span>
                            <span className="text-sm text-zinc-300 font-mono">Top {stats.rank.percentile.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                {/* Total Stars (Hero Stat) */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                        <Star size={16} fill="currentColor" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Stars</span>
                    </div>
                    <span className="text-4xl font-black text-white tracking-tighter shadow-orange-glow">
                        {stats.totalStars.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 relative z-10 mt-auto">
                <StatItem
                    icon={GitCommit}
                    label="Commits"
                    value={stats.totalCommits}
                    colorClass="text-blue-400"
                />
                <StatItem
                    icon={GitPullRequest}
                    label="PRs"
                    value={stats.totalPRs}
                    colorClass="text-purple-400"
                />
                <StatItem
                    icon={CircleDot}
                    label="Issues"
                    value={stats.totalIssues}
                    colorClass="text-orange-400"
                />
                <StatItem
                    icon={Users}
                    label="Contribs"
                    value={stats.contributedTo}
                    colorClass="text-pink-400"
                />
            </div>

            {/* Decorative Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/0 via-zinc-900/0 to-white/5 pointer-events-none rounded-[2rem]"></div>
        </motion.div>
    );
}