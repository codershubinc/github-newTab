import React from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/newtab/Newtab.css';
import Sidebar from '@src/components/custom/sidebar';

export default function Newtab() {
  return (
    <div className="App w-[100vw] h-[100vh] bg-gray-950 flex ">
      <Sidebar />
      <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=codershubinc&exclude_repo=DJango&langs_count=10&layout=donut&theme=radical" alt="" />
      <img src="https://github-readme-streak-stats.herokuapp.com/?user=codershubinc&theme=radical" />
    </div>
  );
}
