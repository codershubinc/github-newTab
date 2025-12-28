import { useEffect, useState } from 'react';
import { Code2, PieChart, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageUtil } from '@src/utils/storageUtil';

// --- ENUMS & TYPES ---
export enum ChartType {
    DONUT = 'donut',
    GRAPH = 'graph'
}

interface LangStats { name: string; color: string; size: number; count: number; }
type LangsResponse = Record<string, LangStats>;

// --- HELPERS ---
const getLangIcon = (langName: string) => {
    const n = langName.toLowerCase();
    const map: Record<string, string> = {
        'c#': 'csharp', 'c++': 'cplusplus', 'css': 'css3', 'html': 'html5',
        'shell': 'bash', 'vue': 'vuejs', 'jupyter notebook': 'jupyter', 'vim script': 'vim',
    };
    const slug = map[n] || n.replace(/\s+/g, '');
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;
};

// Short Name Helper
const getShortName = (name: string) => {
    const map: Record<string, string> = {
        'JavaScript': 'JS', 'TypeScript': 'TS', 'Python': 'PY',
        'Java': 'JV', 'C#': 'C#', 'C++': 'CPP', 'HTML': 'HTML',
        'CSS': 'CSS', 'Rust': 'RS', 'Go': 'GO', 'Shell': 'SH',
        'Vue': 'VUE', 'React': 'RCT', 'Dart': 'DT', 'Kotlin': 'KT',
        'Swift': 'SW', 'Ruby': 'RB', 'PHP': 'PHP'
    };
    return map[name] || name.substring(0, 3).toUpperCase();
};

export default function TopLangsCard({ username }: { username: string }) {
    const STORE = new StorageUtil()
    const [langs, setLangs] = useState<LangStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState<ChartType>(STORE.getInfo('topLangsChartType') as ChartType || ChartType.DONUT);

    const baseUrl = import.meta.env.DEV ? '/api-proxy' : 'https://github-readme-states-repo-self-inst.vercel.app';

    useEffect(() => {
        if (!username) return;
        const chartTypeStored = STORE.getInfo('topLangsChartType') as ChartType;
        if (chartTypeStored) setChartType(chartTypeStored);

        fetch(`${baseUrl}/api/json-top-langs?username=${username}`)
            .then((res) => res.json())
            .then((data: LangsResponse) => {
                const langArray = Object.values(data);
                langArray.sort((a, b) => b.size - a.size);
                setLangs(langArray);
                setLoading(false);
            })
            .catch((err) => { console.error(err); setLoading(false); });
    }, [username]);

    if (loading) return <div className="w-full h-full animate-pulse rounded-2xl bg-zinc-800/20 border border-zinc-800/50"></div>;
    if (langs.length === 0) return null;

    const top10 = langs.slice(0, 10);
    const totalSize = langs.reduce((acc, curr) => acc + curr.size, 0);

    // --- CHART GENERATOR: Conic Gradient for Donut ---
    const getConicGradient = () => {
        let currentDeg = 0;
        const segments = top10.map(lang => {
            const deg = (lang.size / totalSize) * 360;
            const segment = `${lang.color} ${currentDeg}deg ${currentDeg + deg}deg`;
            currentDeg += deg;
            return segment;
        });
        return `conic-gradient(${segments.join(', ')})`;
    };

    return (
        <div className="card-surface rounded-2xl flex flex-col w-full h-full overflow-hidden border border-white/5 bg-zinc-900/40 backdrop-blur-md">

            {/* --- HEADER --- */}
            <div className="px-5 py-4 shrink-0 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-2 text-zinc-100 font-bold text-base">
                    <Code2 className="text-purple-500" size={20} />
                    <span>Top Languages</span>
                </div>

                {/* Toggle Controls */}
                <div className="flex bg-zinc-900/80 rounded-lg p-1 border border-zinc-800/50">
                    <button
                        onClick={() => { STORE.storeInfo("topLangsChartType", ChartType.GRAPH); setChartType(ChartType.GRAPH) }}
                        className={`p-1.5 rounded-md transition-all ${chartType === ChartType.GRAPH ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        title="Bar Graph"
                    >
                        <BarChart3 size={14} />
                    </button>
                    <button
                        onClick={() => { STORE.storeInfo("topLangsChartType", ChartType.DONUT); setChartType(ChartType.DONUT) }}
                        className={`p-1.5 rounded-md transition-all ${chartType === ChartType.DONUT ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        title="Donut Chart"
                    >
                        <PieChart size={14} />
                    </button>
                </div>
            </div>

            {/* --- CONTENT WRAPPER --- */}
            <div className="flex-1 flex flex-col min-h-0">

                {/* 1. LIST SECTION (Always Visible - Top 55%) */}
                <div className="flex-[4] overflow-y-auto custom-scrollbar p-4 min-h-0 border-b border-zinc-800/30">
                    <div className="flex flex-col gap-4">
                        {top10.map((lang, index) => {
                            const percent = ((lang.size / totalSize) * 100).toFixed(1);
                            return (
                                <div key={lang.name} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Bigger Icons */}
                                        <img
                                            src={getLangIcon(lang.name)}
                                            alt=""
                                            className={` w-8 h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity ${["Rust", "Shell"].includes(lang.name) && "bg-amber-50 rounded-2xl"} `}
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                        <span className="text-sm text-zinc-300 font-medium truncate group-hover:text-white transition-colors">{lang.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 w-[45%]">
                                        <div className="flex-1 h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ delay: index * 0.05 }} className="h-full rounded-full" style={{ backgroundColor: lang.color }} />
                                        </div>
                                        {/* Bigger Font */}
                                        <span className="text-[15px] text-zinc-100 font-mono font-bold w-10 text-right">{percent}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. CHART SECTION (Toggleable - Bottom 45%) */}
                <div className="flex-[3] relative bg-zinc-900/10 min-h-[190px]">
                    <AnimatePresence mode="wait">

                        {/* CHART: BAR GRAPH */}
                        {chartType === ChartType.GRAPH && (
                            <motion.div
                                key="graph"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute inset-0 flex items-end justify-between gap-2 px-4 pb-4 pt-10"
                            >
                                {top10.slice(0, 7).map((lang) => {
                                    const percent = (lang.size / totalSize) * 100;
                                    return (
                                        <div key={lang.name} className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">

                                            {/* 1. PERCENTAGE (Top) */}
                                            <span className="text-sm font-bold text-white mb-0 drop-shadow-md">
                                                {percent.toFixed(1)}%
                                            </span>
                                            {/* Shortname moved above bar for visibility */}
                                            <span className="text-[13px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                                {getShortName(lang.name)}
                                            </span>

                                            {/* 2. BAR */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(percent, 10)}%` }}
                                                className="w-full rounded-t-sm opacity-90 group-hover:opacity-100 transition-all relative shadow-lg min-h-[6px]"
                                                style={{ backgroundColor: lang.color }}
                                            />

                                            {/* 3. ICON (Bottom) */}
                                            <div className="flex flex-col items-center gap-1 mt-2">
                                                <img
                                                    src={getLangIcon(lang.name)}
                                                    alt=""
                                                    className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {/* CHART: DONUT */}
                        {chartType === ChartType.DONUT && (
                            <motion.div
                                key="donut"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 flex flex-row items-center justify-center gap-8 px-4"
                            >
                                {/* The Donut */}
                                <div className="relative w-32 h-32 shrink-0 rounded-full shadow-lg" style={{ background: getConicGradient() }}>
                                    <div className="absolute inset-[18px] bg-[#101012] rounded-full flex flex-col items-center justify-center z-10">
                                        <span className="text-xl font-bold text-white">{top10.length}</span>
                                    </div>
                                </div>

                                {/* Legend (Right of Donut) */}
                                <div className="flex flex-col gap-1.5 justify-center">
                                    {top10.slice(0, 5).map(lang => (
                                        <div key={lang.name} className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: lang.color }}></span>
                                            <span className="text-sm text-zinc-300 font-medium">{lang.name}</span>
                                            <span className="text-[13px] text-zinc-100 font-mono font-bold ml-auto">
                                                {((lang.size / totalSize) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}