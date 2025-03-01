import { StorageUtil } from '@src/utils/storageUtil';
import { useSidebarLogic } from './sidebarLogic'
import getYearsFromDate from '@src/utils/yrs'
import { RotateCcw, Trash2 } from 'lucide-react'



function Sidebar() {
    const { user, error, loadUser, storeUsername, refreshUser, removeUser } = useSidebarLogic()
    const STORE = new StorageUtil();

    return (
        <div className=" w-full h-[40vh]  md:w-[30vw] min-w-[500px] md:h-screen border border-solid border-slate-800 p-5 bg-slate-900 text-white">
            {error ? (
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
                            className="p-2 border border-white rounded-md text-white bg-slate-800"
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
                    <div className="flex flex-col items-center text-center border border-solid border-slate-800 bg-[#141321] rounded-4xl hover:rounded-[40px] shadow-sm hover:shadow-lg shadow-gray-500 transition-all duration-700 hover:transform-3d p-4">
                        {/* Icon Buttons */}
                        <div className="flex gap-4 mb-2">
                            <button onClick={refreshUser} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
                                <RotateCcw className="w-5 h-5 text-white" />
                            </button>
                            <button onClick={removeUser} className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition">
                                <Trash2 className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <h1 className="text-3xl font-bold text-slate-300">{user?.login}</h1>
                        <p className="text-xl font-semibold">
                            <span className="text-white font-serif">Welcome</span> {user?.name}
                        </p>
                        <img
                            className="border border-white rounded-full w-32 h-32 mt-3"
                            src={user?.avatar_url}
                            alt="User Avatar"
                        />
                        <hr className="mx-auto bg-slate-700 my-4 w-3/4" />
                        <p className="text-lg">
                            Github Joined: <span className="font-bold">{(user?.created_at)?.split('T')[0]}</span>
                            (<span className="text-green-400">{getYearsFromDate(user?.created_at)}</span> yrs ago)
                        </p>
                        <p className="text-lg">
                            Total Public Repos: <span className="font-bold">{user?.public_repos}</span>
                        </p>
                    </div>
                    <img className='mt-4 w-full rounded-lg shadow-md' src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical" alt="Inspirational Quote" />
                    <hr className='w-[90%]' />
                    <img
                        src={`https://github-readme-streak-stats.herokuapp.com/?user=${STORE?.getInfo('githubUserName')}&theme=radical&nocache=12345`} alt=""
                        className=''
                    />
                </>
            )}
        </div>
    )
}

export default Sidebar
