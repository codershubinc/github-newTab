import React, { useEffect, useRef, useState } from 'react';
import { gitContribution } from './gitGraphLogic';
import { motion } from 'framer-motion';

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

    return (
        <div className="relative flex flex-col items-center p-6 bg-gray-900 bg-opacity-80 backdrop-blur-md text-gray-200 font-mono transition-all duration-300 shadow-lg rounded-lg overflow-visible">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-400"></div>
                    <p className="mt-2 text-sm text-gray-400">Loading Contributions...</p>
                </div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold mb-2 text-white">
                        {todaysContribution}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-lg mb-2 italic text-red-400 flex items-center">
                        {todaysContributionMsg}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg mb-4 text-gray-300">
                        {totalContributions}
                    </motion.div>
                    <motion.div
                        ref={gridContainerRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative grid grid-rows-[repeat(7,15px)] grid-flow-col gap-1 mt-4 z-10 overflow-visible">
                        {contributionData?.map((item: any, index) => (
                            <motion.div
                                key={index}
                                className="w-4 h-4 rounded-sm relative transition-all duration-300 transform group hover:scale-110 overflow-visible z-10"
                                style={{ backgroundColor: item?.color }}
                                whileHover={{ scale: 1.2 }}
                            >
                                <div className="absolute left-1/2 bottom-full mb-1 w-32 -translate-x-1/2 opacity-0 bg-gray-800 text-white text-xs text-center rounded p-1 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 z-50 overflow-visible">
                                    {item?.contributionCount} contributions on {item?.date}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default GitGraphComp;