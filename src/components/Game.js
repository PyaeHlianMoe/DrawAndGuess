const wordlist = ["apple", "orange", "tree", "cloud", "car", "plane"];
let generatedwordlist = [];
let word;

export const randomWord = () => {
  word = wordlist[Math.floor(Math.random() * wordlist.length)];
  return word;
};

export const randomWord_v2 = () => {
  // Push the word to the list
  // This is to prevent from generating the similar words multiple times
  let word;

  // clear the generatedwordlist array
  if (generatedwordlist.length === wordlist.length) {
    generatedwordlist = [];
  }

  do {
    word = wordlist[Math.floor(Math.random() * wordlist.length)];
  } while (generatedwordlist.includes(word));
  generatedwordlist.push(word);

  return word;
};
