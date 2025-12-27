import { useEffect, useState } from 'react';
import { Music, ExternalLink, Disc3 } from 'lucide-react';
import { motion } from 'framer-motion';


export default function SpotifyCard() {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSpotify = async () => {
        try {
            // ORIGINAL URL:
            const targetUrl = 'https://sp-card-t.vercel.app/json';

            // PROXY FIX: Use a CORS proxy to bypass browser restrictions
            // We prepend the proxy URL to the actual target
            // const proxyUrl = `/sp-proxy${new URL(targetUrl).pathname}`;

            const res = await fetch(targetUrl);
            console.log("got spotify data", data);


            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Spotify fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpotify();
        // Poll every 10 seconds to check for song changes
        const interval = setInterval(fetchSpotify, 10000);
        return () => clearInterval(interval);
    }, []);

    // --- Loading State ---
    if (loading) return <div className="h-[100px] animate-pulse bg-zinc-800/20 rounded-3xl w-full"></div>;

    // --- Not Playing State ---
    if (!data || !data.is_playing || !data?.raw?.item) {
        return (
            <div className="w-full bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex items-center gap-4 text-zinc-500">
                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Music size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-400">Not Playing</span>
                    <span className="text-xs">Spotify is paused</span>
                </div>
            </div>
        );
    }

    // --- Playing State ---
    const { name, album, artists, external_urls } = data.raw.item;
    const coverImage = album.images[0]?.url;
    const artistNames = artists.map((a: any) => a.name).join(', ');

    return (
        <a
            href={external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full group cursor-pointer"
        >
            <div className="w-full bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-4 flex items-center gap-4 transition-all hover:bg-zinc-900/50 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">

                {/* Album Art with Spin Animation */}
                <div className="relative shrink-0">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                        className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-900 shadow-lg relative z-10"
                    >
                        <img src={coverImage} alt="Album Art" className="w-full h-full object-cover" />
                    </motion.div>

                    {/* Center Vinyl Hole */}
                    <div className="absolute inset-0 m-auto w-4 h-4 bg-zinc-900 rounded-full z-20 border border-zinc-700"></div>

                    {/* Floating Icon */}
                    <div className="absolute -bottom-1 -right-1 z-30 bg-emerald-500 text-black p-1 rounded-full shadow-lg">
                        <Disc3 size={12} className="animate-spin-slow" />
                    </div>
                </div>

                {/* Track Info */}
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider mb-0.5">Now Playing</span>
                        <ExternalLink size={12} className="text-zinc-600 group-hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100" />
                    </div>

                    <h3 className="text-sm font-bold text-white truncate w-full pr-2" title={name}>
                        {name}
                    </h3>
                    <p className="text-xs text-zinc-400 truncate w-full" title={artistNames}>
                        {artistNames}
                    </p>
                </div>
            </div>
        </a>
    );
}