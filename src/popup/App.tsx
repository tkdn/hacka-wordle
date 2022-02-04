import { useEffect, useState } from "react";

const getCurrentTab = async () => {
  const queryOptions = { url: ["https://www.powerlanguage.co.uk/wordle/*"] };
  const tabs = await chrome.tabs.query(queryOptions);
  const activeTabs = tabs.filter((t) => t.active === true);
  return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
};

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((d) => {
      console.log(d);
      setCount((count) => count + 1000);
    });
    getCurrentTab().then((tab) => {
      console.log(tab);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "boot-hacka-wordle" },
          () => {}
        );
      });
    });
  }, []);

  return (
    <div className="App">
      <button type="button" onClick={() => setCount((count) => count + 1)}>
        count is: {count}
      </button>
    </div>
  );
}

export default App;
