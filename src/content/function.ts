import { $gameRows, ExtensionStorage } from "./constant";

export function addWordInformation(insertIndex: number): Promise<string> {
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

export function updateExtensionStorage(word: string) {
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
