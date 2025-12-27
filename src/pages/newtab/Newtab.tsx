import '@pages/newtab/Newtab.css';
import { StorageUtil } from '@src/utils/storageUtil';
import GitGraphComp from '@src/components/custom/gitGraph';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@src/components/custom/footer';

import StreakCard from '@src/components/custom/StreakCard';
import TopLangsCard from '@src/components/custom/TopLangsCard';
import GithubStatsCard from '@src/components/custom/GithubStatsCard';
import ProfileCard from '@src/components/custom/ProfileCard';

export default function Newtab() {
  const STORE = new StorageUtil();
  const [loading, setLoading] = useState(true);
  const githubUser = STORE.getInfo('githubUserName');

  useEffect(() => {
    if (githubUser) setTimeout(() => setLoading(false), 500);
    else setLoading(false);
  }, [githubUser]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-y-auto overflow-x-hidden text-zinc-200">

      {/* === BACKGROUND IMAGE SECTION === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 1. The Image */}
        <img
          src="/image.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* 2. Dark Overlay (Adjust opacity 'bg-black/50' if image is too dark/bright) */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <main className="relative z-10 w-full min-h-full p-8 flex flex-col items-center gap-10 overflow-visible">

        {/* ROW 1: GitGraph */}
        <div className="shrink-0 mt-6 relative z-50 overflow-visible">
          <GitGraphComp />
        </div>

        {/* ROW 2: Main Content Area */}
        <div className="flex-1 w-full flex justify-center items-start relative z-0">
          <AnimatePresence mode="wait">
            {!githubUser ? (
              <div className="w-[400px] h-[600px]">
                <ProfileCard />
              </div>
            ) : loading ? (
              /* Loading Skeleton */
              <div className="flex flex-wrap gap-8 justify-center items-start">
                <div className="w-[400px] h-[600px] bg-zinc-800/40 rounded-2xl animate-pulse border border-white/10"></div>
                <div className="flex flex-wrap gap-8 justify-center">
                  <div className="w-[400px] h-[600px] bg-zinc-800/40 rounded-2xl animate-pulse border border-white/10"></div>
                  <div className="w-[400px] h-[600px] flex flex-col gap-8">
                    <div className="flex-1 bg-zinc-800/40 rounded-2xl animate-pulse border border-white/10"></div>
                    <div className="flex-1 bg-zinc-800/40 rounded-2xl animate-pulse border border-white/10"></div>
                  </div>
                </div>
              </div>
            ) : (
              // GLASS CONTAINER WRAPPER
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                // Added: backdrop-blur-xl to blur the background image behind the cards
                className="relative flex flex-wrap xl:flex-nowrap gap-8 justify-center p-10 rounded-[3rem] border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl"
              >

                {/* SECTION 1: Profile Card */}
                <div className="shrink-0">
                  <div className="w-[400px] min-h-[600px]">
                    <ProfileCard />
                  </div>
                </div>

                {/* SECTION 2: Stats & Languages Group */}
                <div className="flex flex-wrap gap-8 justify-center">
                  {/* Card: Languages */}
                  <div className="w-[400px] min-h-[600px]">
                    <TopLangsCard username={githubUser} />
                  </div>

                  {/* Stack: Stats */}
                  <div className="w-[400px] min-h-[600px] flex flex-col gap-8">
                    <div className="h-[240px] shrink-0">
                      <StreakCard username={githubUser} />
                    </div>
                    <div className="flex-1 min-h-[300px]">
                      <GithubStatsCard username={githubUser} />
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="shrink-0 py-6 relative z-0">
          <Footer />
        </div>

      </main>
    </div>
  );
}