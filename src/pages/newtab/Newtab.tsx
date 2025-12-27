import '@pages/newtab/Newtab.css';
import { StorageUtil } from '@src/utils/storageUtil';
import GitGraphComp from '@src/components/custom/gitGraph';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@src/components/custom/footer';

// Right Side Components
import StreakCard from '@src/components/custom/StreakCard';
import TopLangsCard from '@src/components/custom/TopLangsCard';
import GithubStatsCard from '@src/components/custom/GithubStatsCard';
import ProfileCard from '@src/components/custom/ProfileCard';

// Left Side Components
import ZenClock from '@src/components/custom/ZenClock';
import FocusBoard from '@src/components/custom/FocusBoard';
import ActivityFeed from '@src/components/custom/ActivityFeed';
import SpotifyCard from '@src/components/custom/SpotifyCard'; // <--- Import this

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

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/image.png" alt="bg" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-[#09090b]/85 backdrop-blur-sm"></div>
      </div>

      <main className="relative z-10 w-full min-h-full p-8 flex flex-wrap lg:flex-nowrap justify-center gap-10 overflow-visible max-w-[1800px] mx-auto">

        {/* === LEFT COLUMN: Productivity & Zen === */}
        <div className="hidden lg:flex flex-col gap-6 w-[350px] shrink-0 sticky top-8 h-fit">

          {/* 1. Zen Clock */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="pl-4 mb-2"
          >
            <ZenClock />
          </motion.div>

          {/* 2. Spotify Card (NEW) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
          >
            <SpotifyCard />
          </motion.div>

          {/* 3. Focus Board */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FocusBoard />
          </motion.div>

          {/* 4. Activity Feed */}
          {githubUser && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ActivityFeed username={githubUser} />
            </motion.div>
          )}
        </div>


        {/* === RIGHT COLUMN: Dashboard Stats === */}
        <div className="flex flex-col items-center gap-8 w-fit shrink-0">

          {/* 1. GitGraph */}
          <div className="shrink-0 mt-4 relative z-50 w-full flex justify-center">
            <GitGraphComp />
          </div>

          {/* 2. Main Card Area */}
          <div className="relative z-0">
            <AnimatePresence mode="wait">
              {!githubUser ? (
                <div className="w-[400px]">
                  <ProfileCard />
                </div>
              ) : loading ? (
                <div className="flex flex-wrap gap-6 justify-center w-full max-w-[2300px]">
                  <div className="w-[400px] h-[700px] bg-zinc-800/30 rounded-2xl animate-pulse"></div>
                  <div className="w-[400px] h-[700px] bg-zinc-800/30 rounded-2xl animate-pulse"></div>
                  <div className="w-[400px] h-[700px] bg-zinc-800/30 rounded-2xl animate-pulse"></div>
                </div>
              ) : (
                // GLASS CONTAINER
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex   gap-6 justify-evenly p-8 rounded-[3rem] border border-gray-800 bg-black/20 backdrop-blur-md w-full  shadow-2xl max-w-[2350px] "
                >

                  {/* Profile Card */}
                  <div className="w-full max-w-[600px] xl:w-[600px]">
                    <ProfileCard />
                  </div>

                  {/* Languages Card */}
                  <div className="w-full max-w-[400px] xl:w-[400px] h-full">
                    <TopLangsCard username={githubUser} />
                  </div>

                  {/* Stats Stack */}
                  <div className="w-full max-w-[400px] xl:w-[400px] flex flex-col gap-6">
                    <div className="h-60">
                      <StreakCard username={githubUser} />
                    </div>
                    <div className="min-h-[300px]">
                      <GithubStatsCard username={githubUser} />
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="shrink-0 py-4">
            <Footer />
          </div>

        </div>
      </main>
    </div>
  );
}