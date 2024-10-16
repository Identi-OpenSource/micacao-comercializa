export function searchInString(text: string, words: string[]) {
  return words.some(word => text.toLowerCase().includes(word.toLowerCase()))
}
