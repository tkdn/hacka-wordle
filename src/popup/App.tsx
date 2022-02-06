import { SyntheticEvent, useEffect, useState } from "react";
import { filterDictionariesWithEvals, getCurrentTab } from "./function";
import words from "./words.json";

function App() {
  const [isSending, setSending] = useState(false);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | undefined>();
  const [currentPort, setCurrentPort] = useState<chrome.runtime.Port>();
  const [dictionaries, setDictionaries] = useState<string[]>([
    "choco",
    "foods",
    "boxes",
    "box11",
    "box22",
    "box33",
    "box44",
    "box55",
    "box66",
  ]);
  const [cheat, setCheat] = useState<string[]>(words);

  const sendingHandler =
    (word: string) => (event: SyntheticEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (currentTab && currentPort) {
        setSending(true);
        currentPort.postMessage({
          type: "app:send-word",
          data: word,
        });
      }
    };

  useEffect(() => {
    getCurrentTab().then((tab) => {
      const port = chrome.tabs.connect(tab.id!);
      setCurrentTab(tab);
      setCurrentPort(port);

      /** アプリ初回起動をタブに伝達 */
      port.postMessage({ event: "app:boot" });

      port.onMessage.addListener((message: { event: string; data: any }) => {
        /** メッセージログ */
        console.log(message);

        /** 単語がタブから到着 */
        if (message.event === "app:add-word") {
          setSending(false);
          if (message.data) {
            const { myDictionaries, evaluations } = message.data;
            setDictionaries(myDictionaries);
            setCheat(filterDictionariesWithEvals(cheat, evaluations));
          }
        }
      });
    });
  }, []);

  if (!dictionaries || dictionaries.length === 0) {
    return <p>no word.</p>;
  }

  return (
    <>
      {isSending ? (
        <div className="fixed top-0 left-0 h-screen w-screen bg-gray-400 opacity-50"></div>
      ) : null}
      <div className="p-4 m-2 bg-gray-300 h-100 overflow-y-auto rounded drop-shadow-lg">
        <h1 className="text-white mb-4">
          <span className="text-xl box-border inline-block bg-correct p-1 mr-1 text-center">
            H
          </span>
          <span className="text-xl box-border inline-block bg-present p-1 mr-1 text-center">
            A
          </span>
          <span className="text-xl box-border inline-block bg-gray-500 p-1 mr-1 text-center">
            C
          </span>
          <span className="text-xl box-border inline-block bg-gray-500 p-1 mr-1 text-center">
            K
          </span>
          <span className="text-xl box-border inline-block bg-present p-1 mr-1 text-center">
            A
          </span>
          <span className="text-xl box-border inline-block bg-gray-500 p-1 mr-1 text-center">
            W
          </span>
          <span className="text-xl box-border inline-block bg-gray-500 p-1 mr-1 text-center">
            O
          </span>
          <span className="text-xl box-border inline-block bg-gray-500 p-1 mr-1 text-center">
            R
          </span>
          <span className="text-xl box-border inline-block bg-correct p-1 mr-1 text-center">
            D
          </span>
          <span className="text-xl box-border inline-block bg-gray-500 p-1 mr-1 text-center">
            L
          </span>
          <span className="text-xl box-border inline-block bg-present p-1 mr-1 text-center">
            E
          </span>
        </h1>
        <h2 className="text-lg mb-3">📝 Words you learned</h2>
        <ul className="mb-4">
          {dictionaries.map((word) => {
            return (
              <li key={word} className="inline-block mr-1 mb-1">
                <a
                  href="#"
                  onClick={sendingHandler(word)}
                  className="block p-1 rounded border border-solid border-present bg-white text-present font-bold hover:bg-present hover:text-white"
                >
                  {word.toUpperCase()}
                </a>
              </li>
            );
          })}
        </ul>
        <h2 className="text-lg mb-3">🚫 Cheat</h2>
        <details>
          <summary className="mb-2 font-bold">チラ見</summary>
          <ul>
            {cheat.map((cw) => {
              return (
                <li key={cw} className="inline-block mr-1 mb-1">
                  <a
                    href="#"
                    onClick={sendingHandler(cw)}
                    className="block p-1 rounded border border-solid border-correct bg-white text-correct font-bold hover:bg-correct hover:text-white"
                  >
                    {cw.toUpperCase()}
                  </a>
                </li>
              );
            })}
          </ul>
        </details>
      </div>
    </>
  );
}

export default App;
