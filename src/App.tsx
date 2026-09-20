import { useState } from 'react';
import Home, { HOME } from './Home';
import IFrames from './IFrames';
import chapters from './chapters.json';
import Tabs from './Tabs';

export interface ChapterInfo {
  id: string;
  title: string;
  description: string;
  urlMetaEnvParam: string;
}

// Tabs: Home + Chapters
export interface TabInfo {
  id: string;
  title: string;
}

const tabInfos: TabInfo[] = [];
tabInfos.push({ id: HOME, title: HOME });
chapters.forEach(chapter => tabInfos.push({ id: chapter.id, title: chapter.title }) );

const App = () => {
  const [currentTabId, setCurrentTabId] = useState(tabInfos[0].id);

  const chapterInfo = chapters.find(chapter => chapter.id === currentTabId);

  return (
    <>
      <Tabs tabInfos={tabInfos} currentTabId={currentTabId} setCurrentTabId={setCurrentTabId} />
      {!chapterInfo && <Home setCurrentTabId={setCurrentTabId} />}
      <IFrames chapterInfo={chapterInfo} />
    </>
  );
};

export default App;
