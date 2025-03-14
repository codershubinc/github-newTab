import { StorageUtil } from '@src/utils/storageUtil';
import { useSidebarLogic } from './sidebarLogic';
import getYearsFromDate from '@src/utils/yrs';
import { RotateCcw, Trash2, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import refetchUserDaily from '@src/utils/refetchUserDaily';

function Sidebar() {
    const { user, error, loadUser, storeUsername, refreshUser, removeUser } = useSidebarLogic();
    const STORE = new StorageUtil();
    const [isMinimized, setIsMinimized] = useState(false);
    const [loading, setLoading] = useState(true);

    // Simulate a loading state
    setTimeout(() => setLoading(false), 500);
    ; (async () => {
        await refetchUserDaily()
    })()

    return (
        <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed md:relative h-screen transition-all duration-300 rounded-r-full
            ${isMinimized ? 'w-16' : 'w-full md:w-[30vw] min-w-[300px]'}
            bg-gray-900 border-r border-gray-800 text-white p-5 flex flex-col rounded-md `}
        >
            {/* Minimize Button */}
            <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
            >
                <Menu className="w-5 h-5 text-white" />
            </button>

            {isMinimized ? null : (
                <>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                            <p className="mt-2 text-sm text-gray-400">Loading User...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-red-500 text-xl font-semibold">{error}</p>
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition"
                                onClick={loadUser}
                            >
                                Fetch User
                            </button>
                            <div className="flex flex-col gap-2 justify-between w-full">
                                <p className="text-lg font-medium">Store Username</p>
                                <input
                                    type="text"
                                    id="userName"
                                    className="p-2 border border-white rounded-md text-white bg-gray-800"
                                />
                                <button
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-bold transition"
                                    onClick={storeUsername}
                                >
                                    Store
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center text-center border border-solid border-gray-800 bg-gray-950 rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-500  "
                            >
                                {/* Refresh & Remove Buttons */}
                                <div className="flex gap-4 mb-2">
                                    <button onClick={refreshUser} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
                                        <RotateCcw className="w-5 h-5 text-white" />
                                    </button>
                                    <button onClick={removeUser} className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition">
                                        <Trash2 className="w-5 h-5 text-white" />
                                    </button>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-300">{user?.login}</h1>
                                <p className="text-xl font-semibold">
                                    <span className="text-white font-serif">Welcome</span> {user?.name}
                                </p>
                                <img
                                    className="border border-white rounded-full w-32 h-32 mt-3 transition-all duration-300 hover:scale-105"
                                    src={user?.avatar_url}
                                    alt="User Avatar"
                                />
                                <hr className="mx-auto bg-gray-700 my-4 w-3/4" />
                                <p className="text-lg">
                                    Github Joined: <span className="font-bold">{(user?.created_at)?.split('T')[0]}</span>
                                    (<span className="text-green-400">{getYearsFromDate(user?.created_at)}</span> yrs ago)
                                </p>
                                <p className="text-lg">
                                    Total Public Repos: <span className="font-bold">{user?.public_repos}</span>
                                </p>
                            </motion.div>

                            {/* Quote & Stats */}
                            <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="mt-4 w-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical"
                                alt="Inspirational Quote"
                            />

                            <hr className="w-[90%]" />

                            <div className="flex flex-col items-center justify-center gap-4">
                                <motion.img
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    src={`https://github-readme-streak-stats.herokuapp.com/?user=${STORE?.getInfo('githubUserName')}&theme=radical&nocache=${new Date().getTime()}`}
                                    alt="GitHub Streak"
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </motion.div>
    );
}

export default Sidebar;
