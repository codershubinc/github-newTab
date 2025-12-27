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
    <div className="w-screen h-screen flex flex-col overflow-y-auto overflow-x-hidden text-zinc-200 bg-[#09090b]">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#09090b] to-[#09090b]"></div>

      <main className="relative z-10 w-full min-h-full p-6 flex flex-col items-center gap-8">

        {/* ROW 1: GitGraph (Fits content, not full width) */}
        <div className="shrink-0 mt-4">
          <GitGraphComp />
        </div>

        {/* ROW 2: Main Cards Area */}
        <div className="flex-1 w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!githubUser ? (
              <div className="w-[360px] h-[480px]">
                <ProfileCard />
              </div>
            ) : loading ? (
              /* Loading Skeleton - Matches card sizes */
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="w-[360px] h-[480px] bg-zinc-800/20 rounded-2xl animate-pulse border border-zinc-800/50"></div>
                <div className="w-[360px] h-[480px] bg-zinc-800/20 rounded-2xl animate-pulse border border-zinc-800/50"></div>
                <div className="w-[360px] h-[480px] flex flex-col gap-6">
                  <div className="flex-1 bg-zinc-800/20 rounded-2xl animate-pulse border border-zinc-800/50"></div>
                  <div className="flex-1 bg-zinc-800/20 rounded-2xl animate-pulse border border-zinc-800/50"></div>
                </div>
              </div>
            ) : (
              /* ACTUAL CONTENT: Centered Flex Row */
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-wrap items-stretch justify-center gap-6"
              >

                {/* CARD 1: Profile */}
                <div className="w-[360px] min-h-[480px]">
                  <ProfileCard />
                </div>

                {/* CARD 2: Languages */}
                <div className="w-[360px] min-h-[480px]">
                  <TopLangsCard username={githubUser} />
                </div>

                {/* CARD 3: Stats Stack */}
                <div className="w-[360px] min-h-[480px] flex flex-col gap-6">
                  <div className="h-[200px] shrink-0">
                    <StreakCard username={githubUser} />
                  </div>
                  <div className="flex-1 min-h-[250px]">
                    <GithubStatsCard username={githubUser} />
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="shrink-0 py-4">
          <Footer />
        </div>

      </main>
    </div>
  );
}