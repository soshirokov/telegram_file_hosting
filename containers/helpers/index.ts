import { message } from 'antd'
import { get, remove } from 'firebase/database'

import { FileServer, FilesServer } from 'types/File'

import { deleteMessage } from 'utils/api/appAPI'
import {
  filesByParentFolderQuery,
  foldersByParentQuery,
  getUserFileRef,
  getUserFolderRef,
} from 'utils/firebase'

export const deleteFile = async (
  fileId: string,
  userUID: string,
  chatId: string
) => {
  const response = await get(getUserFileRef(userUID, fileId))
  const file: FileServer | null = response.val()

  if (file) {
    const response = await deleteMessage(chatId, file.messageId)

    if (response.status === 200) {
      remove(getUserFileRef(userUID, fileId))
    } else {
      message.error('File is lost')
    }
  }
}

export const deleteFolder = async (
  userUID: string,
  chatId: string,
  folderId: string
) => {
  const allFolders = await getAllChildFolders(userUID, folderId)

  allFolders.forEach(async (folderId) => {
    const files: FilesServer | null = await getFilesFromServer(
      userUID,
      folderId
    )

    if (files) {
      await Promise.all(
        Object.keys(files).map(async (fileId) => {
          await deleteFile(fileId, userUID, chatId)
        })
      )

      const checkFiles: FilesServer = await getFilesFromServer(
        userUID,
        folderId
      )

      if (checkFiles) {
        message.error('An error on deleting files')
      } else {
        remove(getUserFolderRef(userUID, folderId))
      }
    } else {
      remove(getUserFolderRef(userUID, folderId))
    }
  })
}

const getChildFolders = async (userUID: string, folderId: string) => {
  const childs = (await get(foldersByParentQuery(userUID, folderId))).val()

  if (!childs) {
    return []
  }

  return Object.keys(childs)
}

const getAllChildFolders = async (
  userUID: string,
  folderId: string,
  allFolders: string[] = []
) => {
  allFolders.push(folderId)

  const childs = await getChildFolders(userUID, folderId)
  if (childs.length === 0) {
    return allFolders
  }

  await Promise.all(
    childs.map(
      async (childId) => await getAllChildFolders(userUID, childId, allFolders)
    )
  )

  return allFolders
}

export const getFilesFromServer = async (
  userUID: string,
  folderId: string
): Promise<FilesServer> => {
  return (await get(filesByParentFolderQuery(userUID, folderId))).val()
}
