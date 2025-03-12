import { FetchUtil } from "./fetch";
import { StorageUtil } from "./storageUtil";

const storedDay = localStorage.getItem('userStoredDay');
const today = new Date();

const refetchUserDaily = async () => {
    try {

        const STORE = new StorageUtil();
        const FETCH = new FetchUtil();
        console.log('user stored date ', storedDay);

        if (storedDay === today.getDate().toString() || storedDay != null) return console.log('User already fetched today.');

        console.log('Refetching user...');

        localStorage.setItem('userStoredDay', today.getDate().toString());

        const res = await FETCH.fetchGithubUserInfo(String(STORE.getInfo('githubUserName') || 'UD'));
        console.log('res', res);
        STORE.storeInfo('githubUserData', JSON.stringify(res));
    } catch (error) {
        console.log('Error refetching user:', error);
    }
}

export default refetchUserDaily;