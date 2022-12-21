import { useState } from 'react'

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  DragOutlined,
  FolderOpenOutlined,
  SelectOutlined,
} from '@ant-design/icons'
import { Button, Input, Modal, PageHeader } from 'antd'

import styles from './styles.module.scss'

type Props = {
  currentFolderName: string
  isActive: boolean
  modalEntry: React.ReactNode
  modalIsOpen: boolean
  modalTitle: string
  prevFolder: string
  onAddFolder?: (folderName: string) => void
  onClickFolder: (folderId: string) => void
  onDeleteSelected: () => void
  onModalCancel: () => void
  onModalSubmit: () => void
  onMoveSelected: () => void
  onToSelect: (onSelect: boolean) => void
}

export const Header = ({
  currentFolderName,
  isActive,
  modalEntry,
  modalTitle,
  modalIsOpen = false,
  prevFolder,
  onAddFolder = () => {},
  onClickFolder,
  onDeleteSelected = () => {},
  onModalCancel = () => {},
  onModalSubmit = () => {},
  onMoveSelected = () => {},
  onToSelect = () => {},
}: Props) => {
  const [newFolder, setNewFolder] = useState('')
  const [onSelect, setOnSelect] = useState(false)

  const addFolderHandler = () => {
    onAddFolder(newFolder)
    setNewFolder('')
  }

  const clickFolderHandler = (folderId: string) => {
    onClickFolder(folderId)
  }

  const onSelectHandler = () => {
    changeOnSelect(true)
  }

  const onCancelSelectHandler = () => {
    changeOnSelect(false)
  }

  const changeOnSelect = (state: boolean) => {
    setOnSelect(state)
    onToSelect(state)
  }

  const deleteClickHandler = () => {
    changeOnSelect(false)
    onDeleteSelected()
  }

  const moveClickHandler = () => {
    onMoveSelected()
  }

  const modalCancelHandler = () => {
    onModalCancel()
  }

  const modalSubmitHandler = () => {
    onModalSubmit()
    changeOnSelect(false)
  }

  return (
    <>
      <PageHeader
        backIcon={!!currentFolderName && <ArrowLeftOutlined />}
        className={styles.Header}
        extra={
          <>
            {!onSelect ? (
              <>
                <Button icon={<SelectOutlined />} onClick={onSelectHandler}>
                  Select
                </Button>
                <Input
                  type="text"
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                />
                <Button disabled={!newFolder} onClick={addFolderHandler}>
                  Add Folder
                </Button>
              </>
            ) : (
              <>
                <Button
                  disabled={!isActive}
                  icon={<DragOutlined />}
                  type="primary"
                  onClick={moveClickHandler}
                >
                  Move selected
                </Button>
                <Button
                  disabled={!isActive}
                  icon={<DeleteOutlined />}
                  onClick={deleteClickHandler}
                >
                  Remove selected
                </Button>
                <Button type="text" onClick={onCancelSelectHandler}>
                  Cancel
                </Button>
              </>
            )}
          </>
        }
        title={
          <div className={styles.Header__PageTitle}>
            {!onSelect ? (
              currentFolderName ? (
                <>
                  <FolderOpenOutlined className={styles.Header__TitleIcon} />
                  {currentFolderName}
                  <Button
                    className={styles.Header__GoHomeButton}
                    type="link"
                    onClick={() => clickFolderHandler('')}
                  >
                    Go to Main
                  </Button>
                </>
              ) : (
                'My files'
              )
            ) : (
              'Select Folders and Files'
            )}
          </div>
        }
        onBack={() => clickFolderHandler(prevFolder)}
      />
      <Modal
        cancelText="Cancel"
        okText="Move here"
        open={modalIsOpen}
        title={modalTitle}
        onCancel={modalCancelHandler}
        onOk={modalSubmitHandler}
      >
        {modalEntry}
      </Modal>
    </>
  )
}
