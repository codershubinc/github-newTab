import { useEffect, useState, useCallback } from 'react';
import { GitCommit, Star, GitPullRequest, Eye, PlusCircle, Activity, RefreshCw } from 'lucide-react';
import { StorageUtil } from '@src/utils/storageUtil';

interface Event {
    id: string;
    type: string;
    repo: { name: string };
    created_at: string;
    actor: {
        login: string;
        avatar_url: string;
    };
}

// 15 Minutes Cache Duration
const CACHE_DURATION = 15 * 60 * 1000;

export default function ActivityFeed({ username }: { username: string }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    const STORE = new StorageUtil();

    const saveToCache = (data: Event[]) => {
        const now = Date.now();
        STORE.storeInfo('githubUserActivity', JSON.stringify(data));
        STORE.storeInfo('githubActivityTimestamp', now.toString());
        setLastUpdated(now);
    };

    const fetchFromAPI = useCallback(async (isManual = false) => {
        if (!username) return;

        if (isManual) setIsRefreshing(true);

        try {
            const cacheBuster = isManual ? `&_t=${Date.now()}` : '';
            const url = `https://api.github.com/users/${username}/events?per_page=7${cacheBuster}`;

            const res = await fetch(url);

            if (res.status === 204) {
                console.warn("GitHub returned 204 No Content.");
                return;
            }

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setEvents(data);
                    saveToCache(data);
                }
            } else {
                console.warn(`GitHub API Error: ${res.status}`);
            }
        } catch (error) {
            console.error("Failed to fetch activity", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [username]);

    const loadEvents = useCallback(() => {
        const cachedData = STORE.getInfo('githubUserActivity');
        const cachedTime = STORE.getInfo('githubActivityTimestamp');

        const now = Date.now();
        const timeDiff = cachedTime ? now - parseInt(String(cachedTime)) : Infinity;

        if (cachedData && timeDiff < CACHE_DURATION) {
            try {
                setEvents(JSON.parse(String(cachedData)));
                setLastUpdated(parseInt(String(cachedTime)));
                setLoading(false);
            } catch (e) {
                fetchFromAPI(false);
            }
        }
        else {
            fetchFromAPI(false);
        }
    }, [username, fetchFromAPI]);

    useEffect(() => {
        loadEvents();
        const interval = setInterval(() => {
            const cachedTime = STORE.getInfo('githubActivityTimestamp');
            const now = Date.now();
            if (cachedTime && (now - parseInt(String(cachedTime)) > CACHE_DURATION)) {
                fetchFromAPI(false);
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [loadEvents, fetchFromAPI]);

    // --- Helpers ---
    const getIcon = (type: string) => {
        switch (type) {
            case 'PushEvent': return <GitCommit size={20} className="text-emerald-400" />;
            case 'WatchEvent': return <Star size={20} className="text-yellow-400" />;
            case 'PullRequestEvent': return <GitPullRequest size={20} className="text-purple-400" />;
            case 'CreateEvent': return <PlusCircle size={20} className="text-blue-400" />;
            case 'IssueCommentEvent': return <Eye size={20} className="text-cyan-400" />;
            default: return <Activity size={20} className="text-zinc-500" />;
        }
    };

    const getActionText = (type: string) => {
        switch (type) {
            case 'PushEvent': return 'Pushed to';
            case 'WatchEvent': return 'Starred';
            case 'PullRequestEvent': return 'Opened PR in';
            case 'CreateEvent': return 'Created';
            case 'IssueCommentEvent': return 'Commented in';
            default: return 'Activity in';
        }
    };

    const formatTime = (iso: string) => {
        const date = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 1000 / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const getLastUpdatedText = () => {
        if (!lastUpdated) return '';
        const diffMins = Math.floor((Date.now() - lastUpdated) / 60000);
        if (diffMins < 1) return 'Updated just now';
        return `Updated ${diffMins}m ago`;
    };

    if (loading) return <div className="h-[200px] animate-pulse bg-zinc-800/20 rounded-3xl"></div>;

    return (
        <div className="card-surface p-6 rounded-2xl w-full h-full bg-zinc-900/40 backdrop-blur-md border border-white/5 relative group/card transition-all hover:bg-zinc-900/50 overflow-hidden">

            {/* Background Decoration */}
            <Activity className="absolute -right-6 top-0 text-white/10 group-hover/card:text-white/10 transition-colors pointer-events-none" size={140} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2  bg-zinc-800 rounded-xl text-blue-500 shadow-lg shadow-black/20">
                        <Activity size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-200 tracking-wide">
                        Recent Activity
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-mono opacity-0 group-hover/card:opacity-100 transition-opacity whitespace-nowrap">
                        {getLastUpdatedText()}
                    </span>
                    <button
                        onClick={() => fetchFromAPI(true)}
                        disabled={isRefreshing}
                        className={`p-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all ${isRefreshing ? 'animate-spin text-white' : ''}`}
                        title="Force Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-0 relative pl-3 z-10">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-zinc-800/50 rounded-full"></div>

                {events.map((event) => (
                    <div key={event.id} className="flex gap-5 relative mb-6 last:mb-0 group/item items-start">

                        {/* Big Icon */}
                        <div className="relative   z-10 w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover/item:border-zinc-600 group-hover/item:scale-110 group-hover/item:shadow-lg transition-all shadow-sm">
                            {getIcon(event.type)}
                        </div>

                        {/* Content Column */}
                        <div className="flex flex-col min-w-0 pt-0.5 gap-1">

                            {/* ROW 1: Event Description */}
                            <div className="text-base text-zinc-300 truncate w-full pr-2 leading-tight">
                                <span className="text-zinc-400">{getActionText(event.type)}</span>{' '}
                                <span className="font-bold text-white group-hover/item:text-blue-400 transition-colors block sm:inline">
                                    {event.repo.name.split('/')[1]}
                                </span>
                            </div>

                            {/* ROW 2: Metadata */}
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 font-medium">
                                <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-0.5 rounded-md border border-zinc-800/50">
                                    <img
                                        src={event.actor.avatar_url}
                                        alt={event.actor.login}
                                        className="w-4 h-4 rounded-full"
                                    />
                                    <span className="text-zinc-300">{event.actor.login}</span>
                                </div>
                                <span className="text-zinc-700">•</span>
                                <span className="font-mono text-zinc-400">{formatTime(event.created_at)}</span>
                            </div>

                        </div>
                    </div>
                ))}

                {events.length === 0 && (
                    <p className="text-base text-zinc-500 italic pl-2 py-6">No recent public activity found.</p>
                )}
            </div>
        </div>
    );
}