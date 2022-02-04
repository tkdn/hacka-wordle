import { $gameRows, currentBoard, ExtensionStorage } from "./constant";

let currentRowIndex = currentBoard.findIndex((word) => word === "");
let revealedCount = 0;

window.addEventListener("game-last-tile-revealed-in-row", () => {
  revealedCount++;
  if (revealedCount !== currentRowIndex + 1) {
    for (let i = 0; i < currentRowIndex; i++) {
      addWordInformation(i);
    }
  } else {
    addWordInformation(currentRowIndex).then((value) => {
      updateExtensionStorage(value);
    });
    currentRowIndex++;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "boot-hacka-wordle":
      console.log("boot-hacka-wordle");
      chrome.runtime.sendMessage(localStorage.getItem("hacka-wordle"));
      break;
    default:
      console.log("no.");
  }
});

function addWordInformation(insertIndex: number): Promise<string> {
  const $currentRow = $gameRows[insertIndex] as HTMLElement;
  const lettersValue = $currentRow.getAttribute("letters") as string;
  const clickHandler = () =>
    window.open(
      `https://www.ldoceonline.com/jp/search/english/direct/?q=${lettersValue}`
    );
  if ($currentRow.getAttribute("listener") !== "true") {
    $currentRow.setAttribute("listener", "true");
    $currentRow.addEventListener("click", clickHandler);
    $currentRow.title = `ロングマン現代英英辞典より:${lettersValue.toUpperCase()}`;
    $currentRow.style.cursor = "pointer";
  }
  return new Promise((resolve) => {
    resolve(lettersValue);
  });
}

function updateExtensionStorage(word: string) {
  const storage: ExtensionStorage = JSON.parse(
    localStorage.getItem("hacka-wordle") as string
  ) || {
    myDictionaries: [],
  };
  storage.myDictionaries.push(word);
  localStorage.setItem(
    "hacka-wordle",
    JSON.stringify({
      ...storage,
      myDictionaries: [...new Set(storage.myDictionaries)],
    } as ExtensionStorage)
  );
}
