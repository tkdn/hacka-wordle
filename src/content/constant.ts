type StorageState = {
  boardState: string[];
};

export type ExtensionStorage = {
  myDictionaries: string[];
};

export const $gameRows = document!
  .querySelector("game-app")!
  .shadowRoot!.querySelector("game-theme-manager")!
  .querySelectorAll("#board game-row[letters]");

const { boardState }: StorageState = JSON.parse(
  localStorage.getItem("gameState") as string
);

export const currentBoard = boardState;
