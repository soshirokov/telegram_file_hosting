import { useContext, useEffect, useState } from 'react'

import { message } from 'antd'
import { saveAs } from 'file-saver'
import { get, off, onValue, set } from 'firebase/database'

import { Files } from 'components/Files'
import { FileUploader } from 'components/FileUploader'

import { User } from 'context/user'

import { deleteFile } from '../helpers'
import { checkFileSizeLimit } from 'helpers/validators'

import { FileClient, FileServer, FilesServer } from 'types/File'
import { FolderServer } from 'types/Folder'
import { tgDocument } from 'types/TG'

import {
  downloadFileFromTelegram,
  replyMessage,
  updateDocument,
} from 'utils/api/appAPI'
import {
  filesByParentFolderQuery,
  getFileNameRef,
  getUserFileRef,
  getUserFolderRef,
} from 'utils/firebase'
import url from 'utils/url'

type Props = {
  currentFolderId: string
  onSelect: boolean
  selectAll: boolean
  onSelectedChange: (files: string[]) => void
}

export const FilesContainer = ({
  currentFolderId,
  onSelect,
  selectAll,
  onSelectedChange,
}: Props) => {
  const [currentFolder, setCurrentFolder] = useState<FolderServer>()
  const [fileList, setFileList] = useState<FileClient[]>([])
  const { userUID, chatId } = useContext(User)

  const getFileHandler = async (fileId: string) => {
    const file = fileList.find((file) => file.telegramFileId === fileId)
    if (file) {
      if (checkFileSizeLimit(file.size)) {
        const response = await downloadFileFromTelegram(fileId)

        const blob = await response.blob()

        saveAs(blob, file?.name)
      } else {
        const response = await replyMessage(chatId, file.messageId)

        if (response.status !== 200) {
          message.error('File is lost')
        }
      }
    }
  }

  const deleteFileHandler = (fileId: string) => {
    deleteFile(fileId, userUID, chatId)
  }

  const changeFileNameHandler = async (fileId: string, newFileName: string) => {
    const fileFromServer = await get(getUserFileRef(userUID, fileId))
    const file: FileServer | null = fileFromServer.val()

    if (!file) {
      message.error('File is lost')
      return null
    }

    const response = await updateDocument(
      chatId,
      fileId,
      newFileName,
      file.messageId,
      file.folderName
    )

    if (response.status === 200) {
      const result = await response.json()

      set(getUserFileRef(userUID, fileId), {
        ...file,
        name: newFileName,
        messageId: result.message_id,
        uploadMessageId: '',
        fromTelegram: false,
      })
    } else {
      set(getFileNameRef(userUID, fileId), file.name)
      message.error('Telegram error')
    }
  }

  const onAddFile = (document: tgDocument, messageId: number) => {
    const newFile: FileServer = {
      name: document.file_name,
      folderId: currentFolderId,
      folderName: currentFolder?.name ?? '',
      messageId,
      size: document.file_size,
      thumbId: document?.thumb?.file_id ?? '',
    }

    set(getUserFileRef(userUID, document.file_id), newFile)
  }

  useEffect(() => {
    if (userUID) {
      const fetchCurrentFolder = async () => {
        const folder = (
          await get(getUserFolderRef(userUID, currentFolderId))
        ).val()
        setCurrentFolder(folder)

        onValue(
          filesByParentFolderQuery(userUID, currentFolderId),
          async (snapshot) => {
            const result: FilesServer = snapshot.val()

            const files: FileClient[] = result
              ? await Promise.all(
                  Object.keys(result).map(async (fileId) => ({
                    name: result[fileId].name,
                    telegramFileId: fileId,
                    folderName: result[fileId].folderName,
                    messageId: result[fileId].messageId,
                    size: result[fileId].size,
                    thumbURL: result[fileId].thumbId
                      ? url.api.files.fileEntry(result[fileId].thumbId)
                      : '',
                  }))
                )
              : []

            setFileList(files)
          }
        )
      }
      fetchCurrentFolder()

      return () => {
        off(filesByParentFolderQuery(userUID, currentFolderId))
      }
    }
  }, [userUID, currentFolderId, onSelect])

  return (
    <>
      <Files
        files={fileList}
        selectAll={selectAll}
        onChangeFileName={changeFileNameHandler}
        onDeleteFile={deleteFileHandler}
        onGetFile={getFileHandler}
        onSelect={onSelect}
        onSelectedChange={onSelectedChange}
      />
      <FileUploader
        action={'/api/tgfiles'}
        data={{ chatId, folderName: currentFolder?.name ?? '' }}
        disabled={onSelect}
        onNewFile={onAddFile}
      />
    </>
  )
}
