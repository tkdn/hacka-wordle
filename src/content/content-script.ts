import { currentBoard, SendWordAction } from "./constant";
import { addWordInformation, updateExtensionStorage } from "./function";

let currentRowIndex = currentBoard.findIndex((word) => word === "");
let revealedCount = 0;
let currentPort: chrome.runtime.Port | null = null;

/** Chrome Extension Event Listen */
chrome.runtime.onConnect.addListener((port) => {
  currentPort = port;
  port.onMessage.addListener((message) => {
    /** メッセージログ */
    console.log(message);

    /** アプリ起動:拡張初期化 */
    if (message.event === "app:boot") {
      port.postMessage(SendWordAction());
    }
  
    /** 拡張から単語が到着 */
    if (message.type === "app:send-word") {
      message.data.split("").forEach((letter: string) => {
        window.dispatchEvent(new KeyboardEvent("keydown", {
          key: letter,
        }));
      });
      window.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Enter",
      }));
    }
  });
});

/** Window CustomEvent Listen */
window.addEventListener("game-last-tile-revealed-in-row", () => {
  revealedCount++;
  if (revealedCount !== currentRowIndex + 1) {
    for (let i = 0; i < currentRowIndex; i++) {
      addWordInformation(i);
    }
  } else {
    addWordInformation(currentRowIndex).then((value) => {
      console.log(currentPort);
      updateExtensionStorage(value);
      try {
        currentPort!.postMessage(SendWordAction());
      } catch (error) {
        console.warn(error);
      }
    });
    currentRowIndex++;
  }
});

