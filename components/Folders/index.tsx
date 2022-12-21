import { useEffect, useState } from 'react'

import { List } from 'antd'

import { Folder } from './components/folder'

import { FolderClient } from 'types/Folder'

import styles from './styles.module.scss'

type Props = {
  folders: FolderClient[]
  onSelect: boolean
  viewMode?: boolean
  onChangeFolderName?: (folderId: string, folderName: string) => void
  onClickFolder: (folderId: string) => void
  onDeleteFolder?: (folderId: string) => void
  onSelectedChange: (files: string[]) => void
}

export const Folders = ({
  folders,
  onSelect,
  viewMode = false,
  onChangeFolderName = () => {},
  onClickFolder,
  onDeleteFolder = () => {},
  onSelectedChange = () => {},
}: Props) => {
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])

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

  return (
    <>
      {folders.length > 0 ? (
        <List
          className={styles.Folders__List}
          dataSource={folders}
          renderItem={(folder) => (
            <List.Item className={styles.Folders__ListItem}>
              <Folder
                folderId={folder.folderId}
                folderName={folder.folderName}
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
