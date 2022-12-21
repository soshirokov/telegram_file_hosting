export type FolderClient = {
  folderName: string
  folderId: string
  parentFolderId: string
  isUserUploadFolder?: boolean
}

export type FolderServer = {
  name: string
  parent: string
  isUserUploadFolder: boolean
}

export type FoldersServer = {
  [key: string]: FolderServer
}
