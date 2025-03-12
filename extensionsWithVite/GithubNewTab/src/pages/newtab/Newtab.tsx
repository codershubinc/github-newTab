import '@pages/newtab/Newtab.css';
import Sidebar from '@src/components/custom/sidebar';
import { StorageUtil } from '@src/utils/storageUtil';
import GitGraphComp from '@src/components/custom/gitGraph';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Newtab() {
  const STORE = new StorageUtil();
  const [loading, setLoading] = useState(true);
  const githubUser = STORE.getInfo('githubUserName');

  useEffect(() => {
    if (githubUser) {
      setTimeout(() => setLoading(false), 500); // Simulate a loading time
    }
  }, [githubUser]);

  return (
    <div className="App w-[100vw] h-[100vh] bg-gray-950 flex md:flex-row flex-col">
      <Sidebar />

      <div className="gitContainer"></div>
      <div
        className={`flex w-full flex-col items-center justify-center ${!githubUser ? 'hidden' : ''
          }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-400">Fetching GitHub Stats...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col max-w-full text-center items-center justify-center"
          >
            <GitGraphComp />

            <div className="flex items-center justify-center gap-4">
              {/* Top Languages (Main Image) */}
              <motion.img
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}&exclude_repo=DJango&langs_count=10&layout=donut&theme=radical`}
                alt="Top Languages"
                className="w-[500px] h-[540px] rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              />

              {/* Streak & Stats (Side Images) */}
              <div className="flex flex-col items-center justify-center gap-4">
                <motion.img
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUser}&theme=radical&nocache=${new Date().getTime()}`}
                  alt="GitHub Streak"
                  className="w-[500px] h-[270px] rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />

                <motion.img
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  src={`https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&rank_icon=&theme=radical`}
                  alt="GitHub Stats"
                  className="w-[500px] h-[270px] rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
