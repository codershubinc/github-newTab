import { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LangStats { name: string; color: string; size: number; count: number; }
type LangsResponse = Record<string, LangStats>;

export default function TopLangsCard({ username }: { username: string }) {
    const [langs, setLangs] = useState<LangStats[]>([]);
    const [loading, setLoading] = useState(true);

    const baseUrl = import.meta.env.DEV ? '/api-proxy' : 'https://github-readme-states-repo-self-inst.vercel.app';

    useEffect(() => {
        if (!username) return;
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-surface rounded-2xl flex flex-col w-full h-full overflow-hidden"
        >
            <div className="px-6 py-5 shrink-0 border-b border-zinc-800/50 flex justify-between items-center">
                <div className="flex items-center gap-3 text-zinc-100 font-medium text-lg">
                    <Code2 className="text-purple-500" size={24} />
                    <span>Top 10 Languages</span>
                </div>
                <div className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-md border border-zinc-800">
                    {langs.length} Detected
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between px-6 py-4">
                {top10.map((lang, index) => {
                    const percent = ((lang.size / totalSize) * 100).toFixed(1);
                    return (
                        <div key={lang.name} className="flex items-center justify-between group py-1">
                            <div className="flex items-center gap-4 min-w-0">
                                <span className="w-3 h-3 rounded-full shrink-0 ring-2 ring-zinc-900" style={{ backgroundColor: lang.color }}></span>
                                <span className="text-sm text-zinc-300 font-medium truncate group-hover:text-white transition-colors">{lang.name}</span>
                            </div>
                            <div className="flex items-center gap-3 w-[45%]">
                                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.05 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: lang.color }}
                                    />
                                </div>
                                <span className="text-xs text-zinc-500 font-mono w-10 text-right">{percent}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}