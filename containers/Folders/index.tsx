import { useContext, useEffect, useState } from 'react'

import { message } from 'antd'
import { off, onValue, set } from 'firebase/database'

import { Folders } from 'components/Folders'

import { User } from 'context/user'

import { deleteFolder, getFilesFromServer } from '../helpers'

import { FilesServer } from 'types/File'
import { FolderClient, FoldersServer } from 'types/Folder'

import { updateCaption } from 'utils/api/appAPI'
import {
  foldersByParentQuery,
  getFileFolderNameRef,
  getFolderNameRef,
} from 'utils/firebase'

type Props = {
  currentFolderId: string
  excludeFolders?: string[]
  onSelect?: boolean
  selectAll?: boolean
  viewMode?: boolean
  onSelectedChange?: (folders: string[]) => void
  selectFolderHandler?: (folderId: string) => void
}

export const FoldersContainer = ({
  currentFolderId,
  excludeFolders = [],
  onSelect = false,
  selectAll = false,
  viewMode = false,
  onSelectedChange = () => {},
  selectFolderHandler = () => {},
}: Props) => {
  const [folderList, setFolderList] = useState<FolderClient[]>([])
  const { userUID, chatId } = useContext(User)

  const deleteFolderHandler = async (folderId: string) => {
    deleteFolder(userUID, chatId, folderId)
  }

  const changeFolerNameHandler = async (
    folderId: string,
    newFolderName: string
  ) => {
    set(getFolderNameRef(userUID, folderId), newFolderName)

    const files: FilesServer | null = await getFilesFromServer(
      userUID,
      folderId
    )

    if (files) {
      Object.keys(files).forEach(async (fileId) => {
        const response = await updateCaption(
          chatId,
          files[fileId].messageId,
          newFolderName
        )

        if (response.status === 200) {
          set(getFileFolderNameRef(userUID, fileId), newFolderName)
        } else {
          message.error(`No such file in telegram ${files[fileId].name}`)
        }
      })
    }
  }

  useEffect(() => {
    if (userUID) {
      const fetchInitialData = async () => {
        onValue(foldersByParentQuery(userUID, currentFolderId), (snapshot) => {
          const result: FoldersServer = snapshot.val()

          const folders: FolderClient[] = result
            ? Object.keys(result).map((folderId) => ({
                folderName: result[folderId].name,
                folderId,
                parentFolderId: result[folderId].parent,
                isUserUploadFolder: result[folderId].isUserUploadFolder,
              }))
            : []

          setFolderList(folders)
        })
      }
      fetchInitialData()

      return () => {
        off(foldersByParentQuery(userUID, currentFolderId))
      }
    }
  }, [userUID, currentFolderId, onSelect, excludeFolders])

  return (
    <Folders
      excludeFolders={excludeFolders}
      folders={folderList}
      selectAll={selectAll}
      selectFolderHandler={selectFolderHandler}
      viewMode={viewMode}
      onChangeFolderName={changeFolerNameHandler}
      onDeleteFolder={deleteFolderHandler}
      onSelect={onSelect}
      onSelectedChange={onSelectedChange}
    />
  )
}
