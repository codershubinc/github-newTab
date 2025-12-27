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
            case 'PushEvent': return <GitCommit size={14} className="text-emerald-400" />;
            case 'WatchEvent': return <Star size={14} className="text-yellow-400" />;
            case 'PullRequestEvent': return <GitPullRequest size={14} className="text-purple-400" />;
            case 'CreateEvent': return <PlusCircle size={14} className="text-blue-400" />;
            case 'IssueCommentEvent': return <Eye size={14} className="text-cyan-400" />;
            default: return <Activity size={14} className="text-zinc-500" />;
        }
    };

    // Capitalized for Top Line
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
        <div className="w-full bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col group/card transition-all hover:bg-zinc-900/40">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    Recent Activity
                </h3>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600 opacity-0 group-hover/card:opacity-100 transition-opacity whitespace-nowrap">
                        {getLastUpdatedText()}
                    </span>
                    <button
                        onClick={() => fetchFromAPI(true)}
                        disabled={isRefreshing}
                        className={`p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all ${isRefreshing ? 'animate-spin text-white' : ''}`}
                        title="Force Refresh"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-0 relative pl-2">
                <div className="absolute left-[15px] top-2 bottom-4 w-[1px] bg-zinc-800/50"></div>

                {events.map((event) => (
                    <div key={event.id} className="flex gap-4 relative mb-5 last:mb-0 group/item">
                        {/* Icon */}
                        <div className="relative z-10 w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover/item:border-zinc-600 group-hover/item:scale-110 transition-all shadow-sm">
                            {getIcon(event.type)}
                        </div>

                        {/* Content Column */}
                        <div className="flex flex-col min-w-0 pt-0.5">

                            {/* ROW 1: Event Description (Action + Repo) */}
                            <div className="text-sm text-zinc-200 truncate w-full pr-2">
                                <span className="text-zinc-400">{getActionText(event.type)}</span>{' '}
                                <span className="font-medium text-white group-hover/item:text-blue-400 transition-colors">
                                    {event.repo.name}
                                </span>
                            </div>

                            {/* ROW 2: Subheading (by Avatar User • Time) */}
                            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-500">
                                <span>by</span>

                                <img
                                    src={event.actor.avatar_url}
                                    alt={event.actor.login}
                                    className="w-3.5 h-3.5 rounded-full border border-zinc-800"
                                />

                                <span className="font-medium text-zinc-400">{event.actor.login}</span>

                                <span className="text-zinc-700">•</span>

                                <span className="font-mono text-zinc-600">{formatTime(event.created_at)}</span>
                            </div>

                        </div>
                    </div>
                ))}

                {events.length === 0 && (
                    <p className="text-sm text-zinc-500 italic pl-2 py-4">No recent public activity found.</p>
                )}
            </div>
        </div>
    );
}