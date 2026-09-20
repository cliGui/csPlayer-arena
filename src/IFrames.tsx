import { ReactElement, useEffect, useState } from "react";
import { ChapterInfo } from "./App";
import WaitCircle from "./WaitCircle";

interface IFrameProps {
  title: string;
  url: string;
}

const IFrame = ({ title, url}: IFrameProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-[calc(100%-50px)] relative overflow-hidden">
      <iframe title={title} src={url} onLoad={() => setIsLoading(false)} width="100%" height="100%" />
      {isLoading && <WaitCircle className="absolute top-[40%] left-[48%] w-10 h-10"/>}
    </div>
  )
};

export interface IFramesProps {
  chapterInfo: ChapterInfo | undefined;
}

/**
 * Keep the set of iframes alive so that when the user decides to get back to it
 * there is no startup delay and the application can keep on running.
 */
const IFrames = ({ chapterInfo }: IFramesProps) => {
  const [iFrames, setIFrames] = useState(() => new Map<string, ReactElement>());

  let iFrame: ReactElement | undefined;
  
  if (chapterInfo) {
    iFrame = iFrames.get(chapterInfo.id);
    if (!iFrame) { // No iFrame yet? Create it
      const url = import.meta.env[chapterInfo.urlMetaEnvParam];
      iFrame = <IFrame title={chapterInfo.title} url={url} />
      const newIframes = new Map(iFrames);
      newIframes.set(chapterInfo.id, iFrame);
      setIFrames(newIframes);
    }
  }

  const FULL_SIZE = "w-full h-full";
  const NO_SIZE = "w-0 h-0 hidden";

  return (
    <>
      {[...iFrames.entries()].map(([key, value]) => 
        <div className={key === chapterInfo?.id ? FULL_SIZE : NO_SIZE}
              key={key}>
          {value}
        </div>
      )}
    </>
  );
};

export default IFrames;
