import React, { useEffect, useRef, useState } from 'react';
import { gitContribution } from './gitGraphLogic';

const GitGraphComp = () => {
    const gridContainerRef = useRef(null);
    const [todaysContribution, setTodaysContribution] = useState('');
    const [todaysContributionMsg, setTodaysContributionMsg] = useState('');
    const [totalContributions, setTotalContributions] = useState('');
    const [contributionData, setContributionData] = useState([]);

    useEffect(() => {
        gitContribution(setTodaysContribution, setTodaysContributionMsg, setTotalContributions, setContributionData);
    }, []);

    return (
        <div className="flex flex-col items-center p-4 bg-black text-white font-mono">
            <div className="text-xl font-bold mb-2">{todaysContribution}</div>
            <div className="text-lg mb-2 italic text-red-400 flex items-center">
                <span className="mr-2">😢</span> {todaysContributionMsg}
            </div>
            <div className="text-lg mb-4">{totalContributions}</div>
            <div ref={gridContainerRef} className="grid grid-cols-[repeat(53,1fr)] grid-rows-7 gap-1 mt-4">
                {contributionData.map((item: any, index) => (
                    //   z-index: 20;
                    //   width: 500px;
                    //   margin: auto 0;
                    //   display: grid;
                    //   grid-template-rows: repeat(7, 15px); /* 7 rows for days */
                    //   grid-auto-flow: column; /* Fill columns first */
                    //   grid-auto-columns: 15px; /* Width for each column */
                    //   gap: 3px; /* Small gap between cells */
                    //   width: fit-content;
                    // }
                    <div
                        key={index}
                        className="w-4 h-4 rounded-sm relative transition-transform duration-200 grid grid-rows-7 group"
                        style={{ backgroundColor: item.color }}
                    >
                        <div className="absolute left-1/2 bottom-full mb-1 w-32 -translate-x-1/2 opacity-0 bg-black text-white text-xs text-center rounded p-1 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
                            {item.contributionCount} contributions on {item.date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GitGraphComp;
