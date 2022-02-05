import { SyntheticEvent, useEffect, useState } from "react";

const getCurrentTab = async () => {
  const queryOptions = { url: ["https://www.powerlanguage.co.uk/wordle/*"] };
  const tabs = await chrome.tabs.query(queryOptions);
  const activeTabs = tabs.filter((t) => t.active);
  return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
};

function App() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | undefined>();
  const [currentPort, setCurrentPort] = useState<chrome.runtime.Port>();
  const [dictionaries, setDictionaries] = useState<string[]>(["foods", "totem"]);


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

      /** アプリ初回起動をタブにでんタウ */
      port.postMessage({ event: "app:boot" });

      port.onMessage.addListener((message) => {
        /** メッセージログ */
        console.log(message);

        /** 単語がタブから到着 */
        if (message.event === "app:add-word") {
          if (message.data?.myDictionaries) {
            setDictionaries((dict) => [...new Set([...dict, ...message.data?.myDictionaries])]);
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
      <h1>Words you learned</h1>
      <ul className="App">
        {dictionaries.map((word) => {
          return <li key={word}><a href="#" onClick={sendingHandler(word)}>{ word.toUpperCase() }</a></li>
        })}
      </ul>
    </>
  );
}

export default App;
