import { useEffect, useState } from 'react';
import { Flame, Trophy, Layers, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakData {
    mode: string;
    totalContributions: number;
    firstContribution: string;
    longestStreak: {
        start: string;
        end: string;
        length: number;
    };
    currentStreak: {
        start: string;
        end: string;
        length: number;
    };
}

export default function StreakCard({ username }: { username: string }) {
    const [data, setData] = useState<StreakData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        fetch(`https://github-readme-streak-stats-chi-three.vercel.app?user=${username}&type=json`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch streaks", err);
                setLoading(false);
            });
    }, [username]);

    // Helper to format dates nicely (e.g. "2025-12-12" -> "Dec 12")
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="w-full h-[200px] animate-pulse rounded-2xl bg-zinc-800/20 border border-zinc-800/50"></div>
        );
    }

    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface p-6 rounded-2xl flex flex-col justify-between w-full h-full min-h-[200px]"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-zinc-100 font-medium">
                    <Flame className="text-orange-500 fill-orange-500/20" size={20} />
                    <span>Current Streak</span>
                </div>
                <div className="text-xs font-mono text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800">
                    {formatDate(data.currentStreak.start)} - {formatDate(data.currentStreak.end)}
                </div>
            </div>

            {/* Main Big Number */}
            <div className="flex items-end gap-2 mb-6">
                <span className="text-6xl font-bold text-white tracking-tighter">
                    {data.currentStreak.length}
                </span>
                <span className="text-zinc-500 font-medium mb-2 text-lg">days</span>
            </div>

            {/* Footer Stats Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/50 pt-4 mt-auto">

                {/* Longest Streak */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                        <Trophy size={12} className="text-yellow-500" />
                        <span>Longest</span>
                    </div>
                    <div className="text-xl font-bold text-zinc-200">
                        {data.longestStreak.length} <span className="text-xs font-normal text-zinc-500">days</span>
                    </div>
                </div>

                {/* Total Contributions */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                        <Layers size={12} className="text-blue-500" />
                        <span>Total</span>
                    </div>
                    <div className="text-xl font-bold text-zinc-200">
                        {data.totalContributions.toLocaleString()}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}