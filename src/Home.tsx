import { Fragment } from 'react/jsx-runtime';
import { ChapterInfo } from './App';
import chapters from './chapters.json';

export const HOME = 'home';

interface ChapterBinProps {
  chapter: ChapterInfo;
  setCurrentTabId: (id: string) => void;
}

const ChapterBin = ({ chapter, setCurrentTabId }: ChapterBinProps) => (
  <div className={"flex flex-col border border-blue-500 rounded-md " + 
                  "m-8 p-5 h-50 gap-3 justify-between bg-blue-100"}>
    <div className="flex flex-col">
      <div className="text-[25px] font-bold">{chapter.title}</div>
      <div className="text-[17px]">{chapter.description}</div>
    </div>

    <button className={"border rounded-sm p-3 w-40 cursor-pointer " + 
                        "text-white font-bold bg-teal-500 active:bg-teal-300"}
            onClick={() => setCurrentTabId(chapter.id)}>
      View Service
    </button>
  </div>
);

export interface HomeProps {
  setCurrentTabId: (id: string) => void;
}

const Home = ({ setCurrentTabId }: HomeProps) => (
  <div 
    className="flex flex-col w-full h-[calc(100%-var(--tabs-height))] overflow-auto">
    <div className="flex flex-col w-full items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-5xl w-[90%]" >
        {chapters.map(chapter =>
          <Fragment key={chapter.id}>
            <ChapterBin chapter={chapter} setCurrentTabId={setCurrentTabId} />
          </Fragment>
        )}
      </div>
    </div>
  </div>
);

export default Home;
