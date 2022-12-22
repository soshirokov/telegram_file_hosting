export const checkFileSizeLimit = (fileSize: number) =>
  fileSize / 1024 / 1024 < 50
