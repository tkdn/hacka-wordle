import { ExtensionStorage } from "../content/constant";

export function filterDictionariesWithEvals(dicts: string[], evals: ExtensionStorage["evaluations"]) {
  const { absent, present, correct } = evals;
  return dicts
    .filter(word => {
      if (!absent.length) return true;
      return word.split("")
        .filter(letter => absent.includes(letter))
        .length < 1;
    })
    .filter(word => {
      if (!present.length) return true;
      return word.split("")
        .filter(letter => present.includes(letter))
        .length > 0;
    })
    .filter(word => {
      return word.split("")
        .every((letter, index) => {
          if (correct[index] === "") return true;
          return letter === correct[index];
        });
    })
}

export async function getCurrentTab() {
  const queryOptions = { url: ["https://www.powerlanguage.co.uk/wordle/*"] };
  const tabs = await chrome.tabs.query(queryOptions);
  const activeTabs = tabs.filter((t) => t.active);
  return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
};
