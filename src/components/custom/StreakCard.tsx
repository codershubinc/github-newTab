import { useEffect, useState, useCallback } from 'react';
import { Trophy, Layers, Github, Code, RefreshCw, AlertCircle, Calendar, Zap, Target } from 'lucide-react';

// --- Types ---
interface StreakData {
    currentStreak: number;
    longestStreak: number;
    totalContributions: number;
    currentRange: string;
}

// --- LEETCODE HELPER FUNCTIONS ---
interface LeetCodeResponse {
    data: {
        matchedUser: {
            submissionCalendar: string;
            submitStats: {
                acSubmissionNum: { count: number }[];
            };
        };
    };
}

const calculateLeetCodeStats = (calendar: Record<string, number>, total: number): StreakData => {
    const timestamps = Object.keys(calendar).map(Number);

    if (timestamps.length === 0) {
        return { currentStreak: 0, longestStreak: 0, totalContributions: total, currentRange: 'No active streak' };
    }

    const uniqueDates = Array.from(new Set(
        timestamps.map(ts => {
            const d = new Date(ts * 1000);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        })
    )).sort((a, b) => a - b);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakEndTimestamp = 0;

    for (let i = 0; i < uniqueDates.length; i++) {
        if (i > 0 && uniqueDates[i] === uniqueDates[i - 1] + 86400000) {
            tempStreak++;
        } else {
            tempStreak = 1;
        }

        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (uniqueDates[i] === today.getTime() || uniqueDates[i] === yesterday.getTime()) {
            currentStreak = tempStreak;
            streakEndTimestamp = uniqueDates[i];
        }
    }

    let range = 'No active streak';
    if (currentStreak > 0) {
        const endDate = new Date(streakEndTimestamp);
        const startDate = new Date(streakEndTimestamp);
        startDate.setDate(endDate.getDate() - (currentStreak - 1));
        const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        range = `${fmt(startDate)} - ${fmt(endDate)}`;
    }

    return {
        currentStreak,
        longestStreak,
        totalContributions: total,
        currentRange: range
    };
};

export default function StreakCard({ username, leetcodeUsername }: { username: string; leetcodeUsername?: string }) {
    const [ghData, setGhData] = useState<StreakData | null>(null);
    const [lcData, setLcData] = useState<StreakData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const lcUser = leetcodeUsername || username;

    // --- FETCH GITHUB ---
    const fetchGithub = useCallback(() => {
        if (!username) return;
        setLoading(true);
        fetch(`https://github-readme-streak-stats-chi-three.vercel.app?user=${username}&type=json`)
            .then(res => res.json())
            .then(data => {
                const formatDate = (str: string) => {
                    const d = new Date(str);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                };
                setGhData({
                    currentStreak: data.currentStreak.length,
                    longestStreak: data.longestStreak.length,
                    totalContributions: data.totalContributions,
                    currentRange: `${formatDate(data.currentStreak.start)} - ${formatDate(data.currentStreak.end)}`
                });
            })
            .catch(err => {
                console.error("Github fetch failed", err);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, [username]);

    // --- FETCH LEETCODE ---
    const fetchLeetCode = useCallback(async () => {
        if (!lcUser) return;
        const query = `
            query userProfileCalendar($username: String!) {
                matchedUser(username: $username) {
                    submissionCalendar
                    submitStats {
                        acSubmissionNum { count }
                    }
                }
            }
        `;

        try {
            // Using proxy for local, direct for prod/extension
            const GRAPHQL_URL = window.location.hostname === 'localhost'
                ? 'https://corsproxy.io/?https://leetcode.com/graphql'
                : 'https://leetcode.com/graphql';

            const response = await fetch(GRAPHQL_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, variables: { username: lcUser } }),
            });

            if (response.ok) {
                const result: LeetCodeResponse = await response.json();
                const user = result.data.matchedUser;
                if (user) {
                    const calendar = JSON.parse(user.submissionCalendar);
                    const total = user.submitStats.acSubmissionNum[0].count;
                    setLcData(calculateLeetCodeStats(calendar, total));
                }
            }
        } catch (error) {
            console.error("LeetCode fetch failed", error);
        }
    }, [lcUser]);

    useEffect(() => {
        fetchGithub();
        fetchLeetCode();
    }, [fetchGithub, fetchLeetCode]);

    if (loading && !ghData && !lcData) {
        return <div className="w-full h-full animate-pulse rounded-2xl bg-zinc-800/20 border border-zinc-800/50"></div>;
    }

    if (error && !ghData && !lcData) {
        return (
            <div className="card-surface p-6 rounded-2xl flex flex-col items-center justify-center w-full h-full min-h-[220px] bg-zinc-900/40 border border-red-900/20">
                <AlertCircle className="text-red-500 mb-2" size={32} />
                <span className="text-zinc-400 text-lg font-medium">Failed to load data</span>
            </div>
        );
    }

    return (
        <div className="card-surface p-6 rounded-[2rem] w-full h-full min-h-fit bg-zinc-900/40 backdrop-blur-md border border-white/5 relative group transition-colors duration-500 flex flex-col justify-center overflow-hidden">

            <div className="flex w-full h-full gap-8 relative z-10">

                {/* --- LEFT SIDE: GITHUB --- */}
                <div className="flex-1 flex flex-col justify-between relative group/gh">
                    {/* Background Icon Decoration */}
                    <Github className="absolute -right-4 top-10 text-white/10 group-hover/gh:text-white/10 transition-colors" size={100} />

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-zinc-800 rounded-xl text-white shadow-lg shadow-black/20">
                            <Github size={20} />
                        </div>
                        <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest">GitHub</span>
                    </div>

                    {/* Main Number */}
                    <div className="flex flex-col flex-1 justify-center py-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                                {ghData ? ghData.currentStreak : '-'}
                            </span>
                            <span className="text-zinc-400 text-xl font-bold uppercase">Days</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar size={12} className="text-emerald-500" />
                            <span className="text-xs text-emerald-400 font-mono font-medium">
                                {ghData ? ghData.currentRange : ''}
                            </span>
                        </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="grid grid-cols-2 gap-3 border-t border-zinc-700/50 pt-4 mt-auto">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Longest
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy size={16} className="text-yellow-500" />
                                <span className="text-xl font-bold text-white">{ghData?.longestStreak || 0}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Total
                            </div>
                            <div className="flex items-center gap-2">
                                <Layers size={16} className="text-blue-500" />
                                <span className="text-xl font-bold text-white">{ghData?.totalContributions.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- DIVIDER --- */}
                <div className="w-px bg-gradient-to-b from-transparent via-zinc-600/50 to-transparent my-2" />

                {/* --- RIGHT SIDE: LEETCODE --- */}
                <div className="flex-1 flex flex-col justify-between relative group/lc">
                    {/* Background Icon Decoration */}
                    <Code className="absolute -right-4 top-10 text-yellow-500/10 group-hover/lc:text-yellow-500/10 transition-colors" size={100} />

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-zinc-800 rounded-xl text-yellow-500 shadow-lg shadow-black/20">
                            <Code size={20} />
                        </div>
                        <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest">LeetCode</span>
                    </div>

                    {/* Main Number */}
                    <div className="flex flex-col flex-1 justify-center py-2">
                        {lcData ? (
                            <>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                                        {lcData.currentStreak}
                                    </span>
                                    <span className="text-zinc-400 text-xl font-bold uppercase">Days</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Zap size={12} className="text-yellow-500" />
                                    <span className="text-xs text-yellow-400 font-mono font-medium">
                                        {lcData.currentRange}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 animate-pulse py-4">
                                <div className="h-12 w-24 bg-zinc-800/50 rounded-lg"></div>
                                <div className="h-4 w-32 bg-zinc-800/30 rounded"></div>
                            </div>
                        )}
                    </div>

                    {/* Stats Footer */}
                    <div className="grid grid-cols-2 gap-3 border-t border-zinc-700/50 pt-4 mt-auto">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Longest
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy size={16} className="text-orange-500" />
                                <span className="text-xl font-bold text-white">{lcData?.longestStreak || 0}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Total
                            </div>
                            <div className="flex items-center gap-2">
                                <Target size={16} className="text-purple-500" />
                                <span className="text-xl font-bold text-white">{lcData?.totalContributions.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}