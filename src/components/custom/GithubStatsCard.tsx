import { useEffect, useState } from 'react';
import { Star, GitCommit, GitPullRequest, CircleDot, Trophy, GitMerge, Users } from 'lucide-react';
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

    // Use proxy for dev, full URL for prod
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
        if (level.includes('S')) return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
        if (level.includes('A')) return 'text-green-400 border-green-400/20 bg-green-400/10';
        if (level.includes('B')) return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
        return 'text-zinc-400 border-zinc-400/20 bg-zinc-400/10';
    };

    if (loading) {
        return (
            <div className="w-full h-[240px] animate-pulse rounded-2xl bg-zinc-800/20 border border-zinc-800/50"></div>
        );
    }

    if (!stats) return null;

    const StatItem = ({ icon: Icon, label, value, colorClass }: any) => (
        <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <Icon size={14} className={colorClass} />
                <span>{label}</span>
            </div>
            <div className="text-xl font-bold text-zinc-200 pl-6">
                {value.toLocaleString()}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface p-6 rounded-2xl flex flex-col w-full h-full min-h-[240px]"
        >
            {/* Header with Rank */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-zinc-100 font-medium">
                    <Trophy className="text-teal-500" size={20} />
                    <span>Overall Stats</span>
                </div>

                {/* Rank Badge */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRankColor(stats.rank.level)}`}>
                    <span className="text-xs font-mono text-zinc-400 uppercase">Rank</span>
                    <span className="font-bold font-mono">{stats.rank.level}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
                <StatItem
                    icon={Star}
                    label="Stars"
                    value={stats.totalStars}
                    colorClass="text-yellow-500"
                />
                <StatItem
                    icon={GitCommit}
                    label="Commits"
                    value={stats.totalCommits}
                    colorClass="text-blue-500"
                />
                <StatItem
                    icon={GitPullRequest}
                    label="PRs"
                    value={stats.totalPRs}
                    colorClass="text-purple-500"
                />
                <StatItem
                    icon={CircleDot}
                    label="Issues"
                    value={stats.totalIssues}
                    colorClass="text-orange-500"
                />
                <StatItem
                    icon={GitMerge}
                    label="Merged"
                    value={stats.totalPRsMerged}
                    colorClass="text-green-500"
                />
                <StatItem
                    icon={Users}
                    label="Contributed"
                    value={stats.contributedTo}
                    colorClass="text-pink-500"
                />
            </div>
        </motion.div>
    );
}