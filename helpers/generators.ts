export const generateUID = () =>
  Date.now().toString(16) + Math.ceil(Math.random() * 10000)

export const generateCaption = (folderName: string) =>
  folderName.length > 0 ? `#${folderName}` : ''
