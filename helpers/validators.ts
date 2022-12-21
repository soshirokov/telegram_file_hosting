import { get } from 'firebase/database'

import { FilesServer } from 'types/File'

import { fileByMessageIdQuery } from 'utils/firebase'

export const checkFileSizeLimit = (fileSize: number) =>
  fileSize / 1024 / 1024 < 50

export const isfromTelegram = async (userId: string, messageId: number) => {
  const file: FilesServer = (
    await get(fileByMessageIdQuery(userId, messageId))
  ).val()

  return file[Object.keys(file)[0]].fromTelegram
}
