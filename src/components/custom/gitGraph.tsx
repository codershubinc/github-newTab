import React, { useEffect, useRef, useState } from 'react';
import { gitContribution } from './gitGraphLogic';
import { motion } from 'framer-motion';
import { Activity, Calendar } from 'lucide-react';

const GitGraphComp = () => {
    const gridContainerRef = useRef(null);
    const [todaysContribution, setTodaysContribution] = useState('');
    const [todaysContributionMsg, setTodaysContributionMsg] = useState('');
    const [totalContributions, setTotalContributions] = useState('');
    const [contributionData, setContributionData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        gitContribution(setTodaysContribution, setTodaysContributionMsg, setTotalContributions, setContributionData)
            .then(() => setLoading(false));
    }, []);

    // Theme: Zinc Background + Emerald (Green) Data Cells
    const getLevelColor = (color: string) => {
        if (!color || color === '#ebedf0') return '#27272a'; // Zinc-800 (Empty)
        if (color === '#9be9a8') return '#065f46'; // Darkest
        if (color === '#40c463') return '#10b981'; // Normal
        if (color === '#30a14e') return '#34d399'; // Bright
        if (color === '#216e39') return '#6ee7b7'; // Brightest
        return color;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            // Layout: Wide Rectangle, Consistent with ProfileCard
            className="card-surface px-8 py-5 rounded-2xl inline-flex items-center justify-between gap-10 shadow-2xl border border-zinc-800/50 overflow-visible relative z-30 "
        >
            {loading ? (
                <div className="flex flex-col items-center gap-3 text-sm text-zinc-500 min-w-[300px] justify-center h-[100px]">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-500 border-t-zinc-200"></div>
                    Retrieving Contribution Data...
                </div>
            ) : (
                <>
                    {/* Left: Stats Block (Compact & Bold) */}
                    <div className="flex flex-col justify-center gap-1.5 min-w-[160px] border-r border-zinc-800/50 pr-8">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                                <Calendar size={16} className="text-zinc-400" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Today</span>
                        </div>

                        <div className="text-4xl font-bold text-zinc-100 tracking-tight leading-none">
                            {todaysContribution}
                        </div>

                        <div className="text-xs font-medium text-emerald-500 flex items-center gap-1.5 mt-1">
                            <Activity size={12} />
                            {todaysContributionMsg}
                        </div>

                        <div className="mt-3 pt-3 border-t border-zinc-800/50">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase text-zinc-500 font-bold">Total Year</span>
                                <span className="text-sm font-mono text-white">{totalContributions}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: The Grid (Wide & Clear) */}
                    <div className="flex justify-center relative z-10">
                        <motion.div
                            ref={gridContainerRef}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            // 13px cells + 3px gap = Perfect "Old Feel" readability
                            className="grid grid-rows-[repeat(7,13px)] grid-flow-col gap-[3px] overflow-visible"
                        >
                            {contributionData?.map((item: any, index) => (
                                <motion.div
                                    key={index}
                                    className="w-[13px] h-[13px] rounded-[2px] group relative"
                                    style={{ backgroundColor: getLevelColor(item?.color) }}
                                    whileHover={{ scale: 1.5, zIndex: 100, borderRadius: "4px" }}
                                >
                                    {/* Tooltip: Popover style */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-[100] pointer-events-none">
                                        <div className="bg-zinc-950 text-zinc-100 text-[11px] px-3 py-2 rounded-lg border border-zinc-700 whitespace-nowrap shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] font-medium relative flex flex-col items-center gap-0.5">
                                            {/* Little arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-700"></div>

                                            <span className="text-white font-bold text-sm">{item?.contributionCount} <span className='text-sm text-gray-500'>contributions</span></span>
                                            <span className="text-zinc-500 text-[9px] uppercase tracking-wide">{item?.date}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default GitGraphComp;