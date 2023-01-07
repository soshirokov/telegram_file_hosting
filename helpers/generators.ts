export const generateUID = () =>
  Date.now().toString(16) + Math.ceil(Math.random() * 10000)

export const generateCaption = (folderName: string) => {
  if (folderName.length === 0) {
    return ''
  }
  const cashtag = folderName
    .replace(/[^a-zA-Zа-яА-Я\d]/gi, '_')
    .replaceAll('__', '_')

  return `#${cashtag}`
}
