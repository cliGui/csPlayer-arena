import { TabInfo } from "./App";

export interface TabsProps {
  tabInfos: TabInfo[];
  currentTabId: string;
  setCurrentTabId: (id: string) => void;
}

const Tabs = ({ tabInfos, currentTabId, setCurrentTabId }: TabsProps) => (
  <div 
    className="flex flex-col w-full h-[var(--tabs-height)] justify-end relative">
    <div className="absolute w-full bottom-0 border-b border-gray-400"/>
    <div className="flex flex-row px-3">
      {tabInfos.map(tabInfo => 
          <button 
            className={"z-1 h-[var(--tabs-button-height)] rounded-t-md px-4 " + 
                          (tabInfo.id === currentTabId ? 
                            "border-3 border-b-white border-gray-700 font-bold" : 
                            "border-2 border-b border-gray-400")}
            key={tabInfo.id}
            onClick={() => setCurrentTabId(tabInfo.id)}>
          {tabInfo.title}
        </button>
      )}
    </div>
  </div>
);

export default Tabs;
