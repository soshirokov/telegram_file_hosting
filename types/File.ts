export type FileClient = {
  name: string
  telegramFileId: string
  link?: string
  folderName: string
  messageId: number
  size: number
  thumbURL: string
}

export type FileServer = {
  name: string
  folderId: string
  folderName: string
  messageId: number
  size: number
  thumbId: string
  fromTelegram?: boolean
  uploadMessageId?: number
}

export type FilesServer = {
  [key: string]: FileServer
}
