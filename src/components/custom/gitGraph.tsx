import React, { useEffect, useRef, useState } from 'react';
import { gitContribution } from './gitGraphLogic';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

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

    const getLevelColor = (color: string) => {
        if (!color || color === '#ebedf0') return '#27272a';
        if (color === '#9be9a8') return '#065f46';
        if (color === '#40c463') return '#10b981';
        if (color === '#30a14e') return '#34d399';
        if (color === '#216e39') return '#6ee7b7';
        return color;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            // CHANGE: w-auto inline-flex (instead of w-full)
            className="card-surface px-8 py-4 rounded-2xl flex items-center justify-between gap-8 w-auto inline-flex shadow-lg"
        >
            {loading ? (
                <div className="flex items-center gap-3 text-sm text-zinc-500 w-full justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-500 border-t-zinc-200"></div>
                    Loading Graph...
                </div>
            ) : (
                <div className="w-full flex items-center gap-10">
                    {/* Stats Block */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="text-3xl font-bold text-zinc-100 tracking-tight leading-none">
                            {todaysContribution}
                        </div>
                        <div className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Activity size={16} className="text-emerald-500" />
                            {todaysContributionMsg}
                        </div>
                        <div className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded border border-zinc-800 w-max mt-1">
                            {totalContributions}
                        </div>
                    </div>

                    {/* The Grid - Expanded */}
                    <div className="flex-1 flex justify-center h-full items-center">
                        <motion.div
                            ref={gridContainerRef}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            // 12px cells + 3px gap fills space better
                            className="grid grid-rows-[repeat(7,12px)] grid-flow-col gap-[3px] overflow-hidden"
                        >
                            {contributionData?.map((item: any, index) => (
                                <motion.div
                                    key={index}
                                    className="w-[12px] h-[12px] rounded-[2px] group relative"
                                    style={{ backgroundColor: getLevelColor(item?.color) }}
                                    whileHover={{ scale: 1.4, zIndex: 50, borderRadius: "4px" }}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                                        <div className="bg-zinc-950 text-zinc-100 text-[12px] px-2 py-1 rounded border border-zinc-700 shadow-xl max-w-[260px] whitespace-normal break-words overflow-auto">
                                            <span className="font-bold">{item?.contributionCount}</span> on {item?.date}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default GitGraphComp;