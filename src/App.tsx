import { useState } from 'react';
import Home, { HOME } from './Home';
import IFrames from './IFrames';
import chapters from './chapters.json';
import Tabs, { TabInfo, Tab } from './Tabs';

export interface ChapterInfo {
  id: string;
  title: string;
  description: string;
  urlMetaEnvParam: string;
}

const tabInfos: TabInfo[] = [];
tabInfos.push({ id: HOME, title: HOME });
chapters.forEach(chapter => tabInfos.push({ id: chapter.id, title: chapter.title }) );

const App = () => {
  const [currentTabId, setCurrentTabId] = useState(tabInfos[0].id);
  const [forceTabId, setForceTabId] = useState<string | undefined>(undefined);

  const currentTabIdCB = (tabId: string) => {
    if (tabId !== currentTabId) {
      setCurrentTabId(tabId);
    }
  };

  const chapterInfo = chapters.find(chapter => chapter.id === currentTabId);

  return (
    <>
      <Tabs tabInfos={tabInfos} currentTabIdCB={currentTabIdCB} forceTabId={forceTabId}>
        <Tab tabId={tabInfos[0].id}>
          <Home setCurrentTabId={setForceTabId} />
        </Tab>
        <IFrames chapterInfo={chapterInfo} />
      </Tabs>
    </>
  );
};

export default App;
