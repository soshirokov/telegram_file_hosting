import { useEffect, useState } from 'react'

import { List } from 'antd'

import { Folder } from './components/Folder'

import { FolderClient } from 'types/Folder'

import styles from './styles.module.scss'

export type Props = {
  excludeFolders: string[]
  folders: FolderClient[]
  onSelect: boolean
  selectAll: boolean
  viewMode?: boolean
  onChangeFolderName?: (folderId: string, folderName: string) => void
  onClickFolder: (folderId: string) => void
  onDeleteFolder?: (folderId: string) => void
  onSelectedChange: (files: string[]) => void
}

export const Folders = ({
  excludeFolders,
  folders,
  onSelect,
  selectAll,
  viewMode = false,
  onChangeFolderName = () => {},
  onClickFolder,
  onDeleteFolder = () => {},
  onSelectedChange = () => {},
}: Props) => {
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [displayFolders, setDisplayFolders] = useState<FolderClient[]>([])

  const clickFolderHandler = (folderId: string) => {
    onClickFolder(folderId)
  }

  const deleteFolderHandler = (folderId: string) => {
    onDeleteFolder(folderId)
  }

  const addSelectedFolderHandler = (folderId: string) => {
    const selected = [...selectedFolders, folderId]
    setSelected(selected)
  }

  const removeSelectedFolderHandler = (folderId: string) => {
    const selected = selectedFolders.filter((id) => id !== folderId)
    setSelected(selected)
  }

  const setSelected = (folders: string[]) => {
    setSelectedFolders(folders)
    onSelectedChange(folders)
  }

  useEffect(() => {
    if (!onSelect) {
      setSelectedFolders([])
    }
  }, [onSelect])

  useEffect(() => {
    if (selectAll) {
      setSelected(
        folders
          .filter((folder) => !folder?.isUserUploadFolder)
          .map((folder) => folder.folderId)
      )
    } else {
      setSelected([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll, folders.length])

  useEffect(() => {
    if (!viewMode) {
      setDisplayFolders(folders)
    } else {
      const foldersToDisplay: FolderClient[] = excludeFolders
        ? folders.filter(
            (folder) =>
              !Boolean(
                excludeFolders.find((folderId) => folderId === folder.folderId)
              )
          )
        : folders

      setDisplayFolders(foldersToDisplay)
    }
  }, [folders, excludeFolders, viewMode])

  return (
    <>
      {folders.length > 0 ? (
        <List
          className={styles.Folders__List}
          dataSource={displayFolders}
          renderItem={(folder) => (
            <List.Item className={styles.Folders__ListItem}>
              <Folder
                folderId={folder.folderId}
                folderName={folder.folderName}
                isSelected={Boolean(
                  selectedFolders.find(
                    (folderId) => folderId === folder.folderId
                  )
                )}
                isUserUploadFolder={folder?.isUserUploadFolder}
                viewMode={viewMode}
                onAddSelectFolder={addSelectedFolderHandler}
                onChangeFolderName={onChangeFolderName}
                onClick={clickFolderHandler}
                onDelete={deleteFolderHandler}
                onRemoveSelectFolder={removeSelectedFolderHandler}
                onSelect={onSelect}
              />
            </List.Item>
          )}
        />
      ) : (
        viewMode && 'No child folders'
      )}
    </>
  )
}
