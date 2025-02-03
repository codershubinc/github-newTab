"use strict";
import { StorageUtil } from "../utils/storageUtil.js"

const userCard = document.getElementById('userCard')

const STORE = new StorageUtil
const userData = STORE.getInfo('githubUserData')
const user = JSON.parse(userData)
userCard.innerHTML = `
<div id="userCardInf">
        <h1>${user.login}</h1>
        <img src="${user.avatar_url}" id="userAvatar" alt="avatar">
        <p>${user.bio}</p>
        <p>${user.blog}</p>
        <p>${user.location}</p>
        <p>${user.email}</p>
        <p> Joined Github At  ${(user.created_at).split('T')[0]}</p>
</div>
` +
    userCard.innerHTML