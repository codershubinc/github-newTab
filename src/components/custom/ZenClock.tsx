import { useState, useEffect } from 'react';

export default function ZenClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        // Returns HH:MM
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    };

    const getSeconds = (date: Date) => {
        // Returns SS
        return date.toLocaleTimeString('en-US', { second: '2-digit' }).padStart(2, '0');
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const getGreeting = () => {
        const hour = time.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="flex flex-col select-none">
            <h2 className="text-xl text-emerald-500 font-medium tracking-wide uppercase mb-1">
                {getGreeting()}
            </h2>

            {/* Time Row */}
            <div className="flex items-baseline gap-2 -ml-2">
                {/* HH:MM (Big) */}
                <h1 className="text-[6rem] leading-[0.9] font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/20 tracking-tighter">
                    {formatTime(time)}
                </h1>

                {/* Seconds (Smaller) */}
                <span className="text-3xl font-light text-zinc-500 w-[50px]">
                    {getSeconds(time)}
                </span>
            </div>

            <p className="text-2xl text-zinc-500 font-light tracking-widest mt-2 uppercase">
                {formatDate(time)}
            </p>
        </div>
    );
}