"use strict"
import { FetchUtil } from '../utils/fetch.js';
import { StorageUtil } from '../utils/storageUtil.js';

const input = document.getElementById('userName')
const storeUsername = document.getElementById('storeUsername')
const githubUserName = document.getElementById('githubUserName')
const getGithubUserName = document.getElementById('getGithubUserName')
const alert = document.getElementById('alert')

// Function to get information from local storage
const STORE = new StorageUtil
const FETCH = new FetchUtil

storeUsername.addEventListener(
    'click',
    () => {
        console.log(input.value);
        STORE.storeInfo('githubUserName', input.value)
        githubUserName.innerHTML = input.value + '  => stored'

    }
)

getGithubUserName.addEventListener(
    'click',
    async () => {
        const un = STORE.getInfo('githubUserName')
        githubUserName.innerHTML = 'getting info of  ' + un + ' ... please wait'

        if (un) {
            await FETCH.fetchGithubUserInfo(un)
                .then(data => {
                    if (data['login']) {
                        console.log(data);
                        STORE.storeInfo('githubUserData', JSON.stringify(data))
                        githubUserName.innerHTML = data.login + '  =>  ' + data.name
                    } else {
                        console.log('no data found');
                        githubUserName.innerHTML = 'no data found check username or store it again '
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    githubUserName.innerHTML = 'error getting info'
                })
                .finally(() => {
                    console.log('github user stored data => ' + STORE.getInfo('githubUserData'));

                    console.log('finally');
                })

            return;
        }
        console.log('no username found');
        githubUserName.innerHTML = 'no username found'

    }
)

window.onload = () => {
    const un = STORE.getInfo('githubUserName')
    if (un) {
        alert.innerHTML = 'Welcome back ' + un
        githubUserName.innerHTML = un + '  => info is already stored'
    }
}