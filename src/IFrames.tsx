import { ReactElement, useEffect, useState } from "react";
import { ChapterInfo } from "./App";
import WaitCircle from "./WaitCircle";
import { sleep } from "./utils";

enum IFrameStatus {
  Checking = "checking",
  Loading = "loading",
  Ready = "ready",
  Error = "error",
}

const SERVER_CHECK_TIMEOUT_MS = 10_000;

interface IsCancelledInfo {
  isCancelled: boolean;
}

const doCheckServer = async (
  url: string, 
  controller: AbortController, 
  attempt: number,
  timerId: number,
  isCancelledInfo: IsCancelledInfo, 
  setIFrameStatus: (status: IFrameStatus) => void
) => {
  try {
    setIFrameStatus(IFrameStatus.Checking);
    if (attempt > 0) await sleep(500);
    
    const result = await fetch(url, { mode: "no-cors", signal: controller.signal });
    if (!isCancelledInfo.isCancelled) setIFrameStatus(IFrameStatus.Loading);
    console.log(`iFrame, doCheckServer(), result:`, result);
  } catch {
    if (!isCancelledInfo.isCancelled) setIFrameStatus(IFrameStatus.Error);
  } finally {
    clearTimeout(timerId);
  }
};

const checkServer = (url: string, attempt: number, setIFrameStatus: (status: IFrameStatus) => void) => {
  const isCancelledInfo: IsCancelledInfo = { isCancelled: false };
  const controller = new AbortController();
  const timerId = window.setTimeout(() => controller.abort(), SERVER_CHECK_TIMEOUT_MS);

  doCheckServer(url, controller, attempt, timerId, isCancelledInfo, setIFrameStatus);

  // Return: cleanup function for useEffect()
  return () => {
    isCancelledInfo.isCancelled = true;
    clearTimeout(timerId);
    controller.abort();
  };
};

interface IFrameProps {
  title: string;
  url: string;
}

const IFrame = ({ title, url }: IFrameProps) => {
  const [iFrameStatus, setIFrameStatus] = useState(IFrameStatus.Checking);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => checkServer(url, attempt, setIFrameStatus),
    [url, attempt]);

  const isBusy = iFrameStatus === IFrameStatus.Checking || iFrameStatus === IFrameStatus.Loading;
  const showIFrame = iFrameStatus === IFrameStatus.Loading || iFrameStatus === IFrameStatus.Ready;

  return (
    <div className="w-full h-full relative overflow-hidden">
      {showIFrame && (
        <iframe title={title} src={url} onLoad={() => setIFrameStatus(IFrameStatus.Ready)}
                width="100%" height="100%" />
      )}
      {isBusy && <WaitCircle className="absolute top-[40%] left-[48%] w-10 h-10" />}
      {iFrameStatus === IFrameStatus.Error && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <span>Can't reach {url}</span>
          <button className="px-3 py-1 border rounded-2xl text-white bg-blue-900 active:bg-blue-500"
                  onClick={() => setAttempt(a => a + 1)}>Retry</button>
        </div>
      )}
    </div>
  );
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
