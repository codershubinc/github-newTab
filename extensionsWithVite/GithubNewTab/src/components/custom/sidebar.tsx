import { FetchUtil } from '@src/utils/fetch'
import { StorageUtil } from '@src/utils/storageUtil'
import getYearsFromDate from '@src/utils/yrs'
import React, { useEffect, useState } from 'react'

function Sidebar() {
    const [user, setUser] = useState<any>()
    const [error, setError] = useState<string | null>(null)

    const STORE = new StorageUtil
    const FETCH = new FetchUtil

    useEffect(() => {
        const userStr = STORE.getInfo('githubUserData')
        const user = JSON.parse(String(userStr))

        if (user && userStr) setUser(user)
        else setError("Something went wrong. Can't find user")
    }, [])

    const loadUser = async () => {
        const un = STORE.getInfo('githubUserName')
        if (!un) return setError("No username is stored...")

        setError(`Fetching info of ${un}... Please wait`)

        try {
            const data = await FETCH.fetchGithubUserInfo(un)
            if (data?.login) {
                STORE.storeInfo('githubUserData', JSON.stringify(data))
                setUser(data)
                setError(null)
            } else {
                setError("No data found. Check username or store it again.")
            }
        } catch (error) {
            setError("Error fetching user info")
        }
    }

    const storeUsername = () => {
        const userName = (document.getElementById('userName') as HTMLInputElement)?.value
        STORE.storeInfo('githubUserName', userName)
        if (STORE.getInfo('githubUserName')) return loadUser()
        setError('Something went wrong while storing the username.')
    }

    return (
        <div className="w-[30vw] h-screen border border-solid border-slate-800 p-5 bg-slate-900 text-white">
            {error ? (
                <div className="flex flex-col gap-4">
                    <p className="text-red-500 text-xl font-semibold">{error}</p>
                    <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition"
                        onClick={loadUser}
                    >
                        Fetch User
                    </button>
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium">Store Username</p>
                        <input
                            type="text"
                            id="userName"
                            className="p-2 text-black border border-white rounded-md"
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
                    <div className="flex flex-col items-center text-center border border-solid border-slate-800 bg-[#141321] rounded-4xl hover:rounded-[40px] shadow-sm hover:shadow-lg shadow-gray-500 transition-all duration-700 hover:transform-3d ">
                        <h1 className="text-3xl font-bold text-slate-300">{user?.login}</h1>
                        <p className="text-xl font-semibold">
                            <span className="text-white font-serif">Welcome</span> {user?.name}
                        </p>
                        <img
                            className="border border-white rounded-full w-32 h-32 mt-3"
                            src={user?.avatar_url}
                            alt=""
                        />
                        <hr className="  mx-auto bg-slate-700 my-4" />
                        <p className="text-lg">
                            Github Joined: <span className="font-bold">{(user?.created_at)?.split('T')[0]}</span>
                            (<span className="text-green-400">{getYearsFromDate(user?.created_at)}</span> yrs ago )
                        </p>
                        <p className="text-lg">
                            Total Public Repos: <span className="font-bold">{user?.public_repos}</span>
                        </p>
                    </div>
                    <img className='mt-1 w-full' src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical" alt="" />

                </>
            )}
        </div>
    )
}

export default Sidebar
