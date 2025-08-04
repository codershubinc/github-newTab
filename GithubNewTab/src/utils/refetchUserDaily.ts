import { FetchUtil } from "./fetch";
import { StorageUtil } from "./storageUtil";

const storedDay = localStorage.getItem('userStoredDay');
const today = new Date();

const refetchUserDaily = async () => {
    try {

        const STORE = new StorageUtil();
        const FETCH = new FetchUtil();

        if (storedDay === today.getDate().toString() || storedDay != null) return


        localStorage.setItem('userStoredDay', today.getDate().toString());

        const res = await FETCH.fetchGithubUserInfo(String(STORE.getInfo('githubUserName') || 'UD'));


        STORE.storeInfo('githubUserData', JSON.stringify(res));
    } catch (error) {
        console.log('Error refetching user:', error);
    }
}

export default refetchUserDaily;