import { useEffect, useState } from 'react'

import { List } from 'antd'

import { File } from './components/File'

import { FileClient } from 'types/File'

import styles from './styles.module.scss'

type Props = {
  files: FileClient[]
  onSelect: boolean
  onChangeFileName: (fileId: string, newFileName: string) => void
  onDeleteFile: (fileId: string) => void
  onGetFile: (fileId: string) => void
  onSelectedChange: (files: string[]) => void
}

export const Files = ({
  files,
  onSelect,
  onChangeFileName,
  onDeleteFile,
  onGetFile,
  onSelectedChange,
}: Props) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const getFileHandler = (fileId: string) => {
    onGetFile(fileId)
  }

  const deleteFileHandler = (fileId: string) => {
    onDeleteFile(fileId)
  }

  const changeFileNameHandler = (fileId: string, newFileName: string) => {
    onChangeFileName(fileId, newFileName)
  }

  const addSelectedFileHandler = (fileId: string) => {
    const selected = [...selectedFiles, fileId]
    setSelected(selected)
  }

  const removeSelectedFileHandler = (fileId: string) => {
    const selected = selectedFiles.filter((id) => id !== fileId)
    setSelected(selected)
  }

  const setSelected = (files: string[]) => {
    setSelectedFiles(files)
    onSelectedChange(files)
  }

  useEffect(() => {
    if (!onSelect) {
      setSelectedFiles([])
    }
  }, [onSelect])

  return (
    <div className={styles.Files}>
      {files.length > 0 && (
        <List
          className={styles.Files__List}
          dataSource={files}
          renderItem={(file) => (
            <List.Item className={styles.Files__ListItem}>
              <File
                key={file.telegramFileId}
                name={file.name}
                size={file.size}
                telegramFileId={file.telegramFileId}
                thumbURL={file.thumbURL}
                onAddSelectFile={addSelectedFileHandler}
                onChangeFileName={changeFileNameHandler}
                onDeleteFile={deleteFileHandler}
                onGetFile={getFileHandler}
                onRemoveSelectFile={removeSelectedFileHandler}
                onSelect={onSelect}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  )
}
