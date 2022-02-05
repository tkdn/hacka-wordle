import "./App.css";
import { SyntheticEvent, useEffect, useState } from "react";
import { filterDictionariesWithEvals, getCurrentTab } from "./function";
import words from "./words.json";

function App() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | undefined>();
  const [currentPort, setCurrentPort] = useState<chrome.runtime.Port>();
  const [dictionaries, setDictionaries] = useState<string[]>([]);
  const [cheat, setCheat] = useState<string[]>(words);


  const sendingHandler = (word: string) => (event: SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (currentTab && currentPort) {
      currentPort.postMessage({
        type: "app:send-word",
        data: word,
      });
    }
  }

  useEffect(() => {
    getCurrentTab().then(tab => {
      const port = chrome.tabs.connect(tab.id!);
      setCurrentTab(tab);
      setCurrentPort(port);

      /** アプリ初回起動をタブに伝達 */
      port.postMessage({ event: "app:boot" });

      port.onMessage.addListener((message: { event: string, data: any }) => {
        /** メッセージログ */
        console.log(message);

        /** 単語がタブから到着 */
        if (message.event === "app:add-word") {
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
    return <p>no word.</p>
  }

  return (
    <>
      <h1>
        <span className="head-correct">H</span><span>A</span><span>C</span><span className="head-present">K</span><span>A</span>
        <span className="head-correct">W</span><span>O</span><span className="head-present">R</span><span className="head-present">D</span><span>L</span><span>E</span>
      </h1>
      <h2>Words you learned</h2>
      <ul className="App">
        {dictionaries.map((word) => {
          return <li key={word}><a href="#" onClick={sendingHandler(word)}>{ word.toUpperCase() }</a></li>
        })}
      </ul>
      <h2>Cheat</h2>
      <details>
        <summary>チラ見</summary>
        <ul>
          {cheat.map((cw) => {
            return <li key={cw}><a href="#" onClick={sendingHandler(cw)}>{ cw.toUpperCase() }</a></li>
          })}
        </ul>
      </details>
    </>
  );
}

export default App;
