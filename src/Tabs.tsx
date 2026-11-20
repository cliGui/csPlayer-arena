import { createContext, ReactNode, useContext, useState } from "react";

export interface TabInfo {
  id: string;
  title: string;
}

const CurrentTabIdContext = createContext<string | null>(null);

const useCurrentTabId = (): string => {
  const ctx = useContext(CurrentTabIdContext);
  if (!ctx) throw new Error("<Tab> must be used inside <Tabs>");
  return ctx;
};

export interface TabProps {
  tabId: string;
  children?: ReactNode;
}

export const Tab = ({ tabId, children }: TabProps) => {
  const currentTabId = useCurrentTabId();
  return <>{tabId === currentTabId && children}</>;
};

export interface TabsProps {
  tabInfos: TabInfo[];
  children: ReactNode;
  currentTabIdCB?: (tabId: string) => void;
  forceTabId?: string;
  className?: string;
}

const Tabs = ({ tabInfos, children, currentTabIdCB, forceTabId, className }: TabsProps) => {
  const [currentTabId, setCurrentTabId] = useState(tabInfos[0].id);
  const [forcedTabId, setForcedTabId] = useState(forceTabId);

  const doSetCurrentTabId = (tabId: string) => {
    setCurrentTabId(tabId);
    if (currentTabIdCB) {
      setTimeout(() => currentTabIdCB(tabId));
    }
  }

  if (forceTabId && forceTabId !== forcedTabId) {
    setForcedTabId(forceTabId);
    doSetCurrentTabId(forceTabId);
  }

  return (
    <CurrentTabIdContext.Provider value={currentTabId}>
      <div className="flex flex-col w-full h-[var(--tabs-height)] justify-end relative">
        {/* line separator between tab buttons and tabs */}
        <div className="absolute w-full bottom-0 border-b border-gray-300"/>

        <div className={`flex flex-row px-3 ${className}`}>
          {tabInfos.map(tabInfo => 
              <button 
                className={"z-1 min-w-30 h-[var(--tabs-button-height)] rounded-t-md px-4 cursor-pointer " + 
                              (tabInfo.id === currentTabId ? 
                                "border-3 border-b-white border-rose-300 text-rose-300 font-bold" : 
                                "border border-gray-300")}
                key={tabInfo.id}
                onClick={() => doSetCurrentTabId(tabInfo.id)}>
              {tabInfo.title}
            </button>
          )}
        </div>
      </div>

      <div className="h-[calc(100%-var(--tabs-height))]">
        {children}
      </div>
    </CurrentTabIdContext.Provider>
  );
};

export default Tabs;
