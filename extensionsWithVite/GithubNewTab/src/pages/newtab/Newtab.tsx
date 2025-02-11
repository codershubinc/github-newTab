import React from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/newtab/Newtab.css';
import Sidebar from '@src/components/custom/sidebar';
import { StorageUtil } from '@src/utils/storageUtil';

export default function Newtab() {
  const STORE = new StorageUtil()

  return (
    <div className="App w-[100vw] h-[100vh] bg-gray-950 flex ">
      <Sidebar />
      <div
        className={`flex flex-col items-center justify-center ${(!STORE.getInfo('githubUserName') ? 'hidden' : '')} `}
      >
        <img
          src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${STORE?.getInfo('githubUserName')}&exclude_repo=DJango&langs_count=10&layout=donut&theme=radical`} alt=""

        />
        <img
          src={`https://github-readme-streak-stats.herokuapp.com/?user=${STORE?.getInfo('githubUserName')}&theme=radical`} alt=""
          className='w-[50vw] h-[100vh]'
        />
      </div>
    </div>
  );
}
