import { FetchUtil } from '@src/utils/fetch'
import { StorageUtil } from '@src/utils/storageUtil'
import { useEffect, useState } from 'react'

export function useSidebarLogic() {
    const [user, setUser] = useState<any>()
    const [error, setError] = useState<string | null>(null)

    const STORE = new StorageUtil()
    const FETCH = new FetchUtil()

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

    const refreshUser = () => {
        STORE.removeInfo('githubUserData')
        loadUser()
    }
    const removeUser = () => {
        STORE.removeInfo('githubUserData')
        STORE.removeInfo('githubUserName')
        setError('User removed , please store username again')
        setUser(null)
    }

    return { user, error, loadUser, storeUsername, refreshUser, removeUser }
}