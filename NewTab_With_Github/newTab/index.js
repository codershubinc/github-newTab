import { StorageUtil } from "../utils/storageUtil.js"

const githubLogo = document.getElementById('githubLogo')

const STORE = new StorageUtil

githubLogo.addEventListener(
    'click',
    () => {

        const user = STORE.getInfo('githubUserData')
        const githubUserName = STORE.getInfo('githubUserName')

        console.log('clicked', user, githubUserName);

        if (user) {
            const userData = JSON.parse(user)
            githubLogo.src = userData.avatar_url
            console.log('user data => ', userData);

        }

    }
)