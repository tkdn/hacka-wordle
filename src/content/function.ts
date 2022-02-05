import { $gameRows, $gameTiles, ExtensionStorage } from "./constant";

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
    localStorage.getItem("hackaWordle") as string
  ) || {
    myDictionaries: [],
    evaluations: {
      correct: ["", "", "", "", ""],
      absent: [],
      present: [],
    }
  };
  storage.myDictionaries.push(word);
  localStorage.setItem(
    "hackaWordle",
    JSON.stringify({
      ...storage,
      myDictionaries: [...new Set(storage.myDictionaries)],
      evaluations: getEvaluationsFromScreen(),
    } as ExtensionStorage),
  );
}

export function getEvaluationsFromScreen() {
  const correct: string[] = ["", "", "", "", ""];
  const present: string[] = [];
  const absent: string[] = [];
  $gameTiles.forEach(tiles => {
      [...tiles].forEach((tile, index) => {
          const letter = tile.getAttribute("letter");
          const evaluation = tile.getAttribute("evaluation");
          if (letter) {
              if (evaluation === "correct") correct[index] = letter;
              if (evaluation === "present") present.push(letter);
              if (evaluation === "absent") absent.push(letter);
          }
      });
  });
  return {
    correct,
    present: [...new Set(present)],
    absent: [...new Set(absent)],
  }
}
