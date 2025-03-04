import '@pages/newtab/Newtab.css';
import Sidebar from '@src/components/custom/sidebar';
import { StorageUtil } from '@src/utils/storageUtil';
import GitGraphComp from '@src/components/custom/gitGraph';

export default function Newtab() {
  const STORE = new StorageUtil();


  return (
    <div className="App w-[100vw] h-[100vh] bg-gray-950 flex md:flex-row flex-col ">
      <Sidebar />

      <div className="gitContainer"></div>
      <div
        className={`flex flex-col items-center justify-center ${(!STORE.getInfo('githubUserName') ? 'hidden' : '')} `}
      >
        <div
          className='flex flex-col w-full items-center justify-center'
        >
          <img
            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${STORE?.getInfo('githubUserName')}&exclude_repo=DJango&langs_count=10&layout=donut&theme=radical`} alt=""
          />
        </div>
        <GitGraphComp />

      </div>
    </div >
  );
}
