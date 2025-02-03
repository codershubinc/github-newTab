import React from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/newtab/Newtab.css';
import Sidebar from '@src/components/custom/sidebar';

export default function Newtab() {
  return (
    <div className="App w-[100vw] h-[100vh] bg-gray-950 ">
      <Sidebar />
    </div>
  );
}
