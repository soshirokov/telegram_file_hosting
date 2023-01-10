import { useContext, useEffect, useMemo, useState } from 'react'

import { message } from 'antd'
import { get, set } from 'firebase/database'
import { useRouter } from 'next/router'

import { Header } from 'components/Header'

import { User } from 'context/user'

import { deleteFile, deleteFolder } from '../helpers'
import { generateUID } from 'helpers/generators'

import { FileServer } from 'types/File'
import { FolderServer } from 'types/Folder'

import { updateCaption } from 'utils/api/appAPI'
import { getUserFileRef, getUserFolderRef } from 'utils/firebase'
import url from 'utils/url'

import { FoldersContainer as Folders } from '../Folders'

type Props = {
  currentFolderId: string
  selectAll: boolean
  selected: { files: string[]; folders: string[] }
  changeSelectAll: () => void
  onToSelect: (onSelect: boolean) => void
}

export const HeaderContainer = ({
  currentFolderId,
  selectAll,
  selected,
  changeSelectAll,
  onToSelect,
}: Props) => {
  const { userUID, chatId } = useContext(User)
  const [currentFolder, setCurrentFolder] = useState<FolderServer>()
  const [moveFolderId, setMoveFolderId] = useState('')
  const [moveFolderName, setMoveFolderName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const isActive = useMemo(() => {
    return Boolean(selected.files.length + selected.folders.length)
  }, [selected])

  const addFolderHandler = (folderName: string) => {
    const folderId = generateUID()

    set(getUserFolderRef(userUID, folderId), {
      parent: currentFolderId,
      name: folderName,
    })
  }

  const deleteSelectedHandler = () => {
    selected.files.forEach((fileId) => deleteFile(fileId, userUID, chatId))
    selected.folders.forEach((folderId) =>
      deleteFolder(userUID, chatId, folderId)
    )
  }

  const moveSelectedHandler = () => {
    setIsModalOpen(true)
  }

  const changeMoveFolderHandler = (folderId: string) => {
    setMoveFolderId(folderId)
  }

  const modalCancelHandler = () => {
    clearModal()
  }

  const modalSubmitHandler = async () => {
    await Promise.all(selected.files.map(async (fileId) => moveFile(fileId)))
    await Promise.all(
      selected.folders.map(async (folderId) => moveFolder(folderId))
    )

    router.push(moveFolderId ? url.router.folders.url(moveFolderId) : '/')

    clearModal()
    onToSelect(false)
  }

  const moveFile = async (fileId: string) => {
    const fileQuery = getUserFileRef(userUID, fileId)
    const file: FileServer = (await get(fileQuery)).val()

    const response = await updateCaption(chatId, file.messageId, moveFolderName)

    if (response.status === 200) {
      await set(fileQuery, {
        ...file,
        folderId: moveFolderId,
        folderName: moveFolderName,
      })
    } else {
      message.error(`No such file in telegram ${file.name}`)
    }
  }

  const moveFolder = async (folderId: string) => {
    const folderQuery = getUserFolderRef(userUID, folderId)

    const folder: FolderServer = (await get(folderQuery)).val()
    await set(folderQuery, { ...folder, parent: moveFolderId })
  }

  const clearModal = () => {
    setIsModalOpen(false)
    setMoveFolderId('')
  }

  const getFilderById = async (userUID: string, folderId: string) =>
    (await get(getUserFolderRef(userUID, folderId))).val()

  useEffect(() => {
    if (userUID) {
      const fetchInitialData = async () => {
        const folder: FolderServer = await getFilderById(
          userUID,
          currentFolderId
        )

        setCurrentFolder(folder)
      }
      fetchInitialData()
    }
  }, [userUID, currentFolderId])

  useEffect(() => {
    if (userUID) {
      const updateMoveFolderName = async () => {
        const folder: FolderServer = await getFilderById(userUID, moveFolderId)

        if (folder) {
          setMoveFolderName(folder.name ?? '')
        }
      }
      updateMoveFolderName()
    }
  }, [userUID, moveFolderId])

  return (
    <>
      <Header
        currentFolderName={currentFolder?.name ?? ''}
        isActive={isActive}
        modalEntry={
          <Folders
            currentFolderId={moveFolderId}
            excludeFolders={selected.folders}
            selectFolderHandler={changeMoveFolderHandler}
            viewMode={true}
          />
        }
        modalIsOpen={isModalOpen}
        modalTitle={moveFolderName || 'Main folder'}
        prevFolder={currentFolder?.parent ?? ''}
        selectAll={selectAll}
        onAddFolder={addFolderHandler}
        onDeleteSelected={deleteSelectedHandler}
        onModalCancel={modalCancelHandler}
        onModalSubmit={modalSubmitHandler}
        onMoveSelected={moveSelectedHandler}
        onSelectAll={changeSelectAll}
        onToSelect={onToSelect}
      />
    </>
  )
}
