import { FetchUtil } from '@src/utils/fetch'
import { StorageUtil } from '@src/utils/storageUtil'
import { useEffect, useState } from 'react'
import { User } from '@src/global' // Ensure this imports from your global.d.ts or is available globally

export function useSidebarLogic() {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)

    const STORE = new StorageUtil()
    const FETCH = new FetchUtil()

    useEffect(() => {
        const userStr = STORE.getInfo('githubUserData')
        const timeStored = STORE.getInfo('githubUserDataTimestamp')
        const now = Date.now()
        const CACHE_DURATION = 60 * 60 * 1000; // 1hours
        // check if cached duration is over

        if (timeStored && (now - parseInt(String(timeStored))) < CACHE_DURATION) {
            console.log("Cache duration is not over , serving from the cache");

            if (userStr) {
                setUser(JSON.parse(String(userStr)))
                return
            }
        }

        loadUser()
    }, [])

    const loadUser = async () => {
        const un = STORE.getInfo('githubUserName')
        if (!un) return setError("No username is stored...")

        setError(`Fetching info of ${un}... Please wait`)

        try {
            // 1. Fetch Main User Info
            const data = await FETCH.fetchGithubUserInfo(un)

            if (data?.login) {

                try {
                    const socialRes = await fetch(`https://api.github.com/users/${un}/social_accounts`);
                    if (socialRes.ok) {
                        const socialData = await socialRes.json();
                        // Merge social data into the user object
                        data.social_accounts = socialData;
                    }
                } catch (socialErr) {
                    console.warn("Could not fetch social accounts", socialErr);
                    // Continue even if social fetch fails
                }

                // 3. Store and Set State
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

    const refreshUser = () => {
        STORE.removeInfo('githubUserData')
        loadUser()
    }

    const removeUser = () => {
        STORE.removeInfo('githubUserData')
        STORE.removeInfo('githubUserName')
        setError('User removed, please store username again')
        setUser(null)
    }

    return { user, error, loadUser, storeUsername, refreshUser, removeUser }
}