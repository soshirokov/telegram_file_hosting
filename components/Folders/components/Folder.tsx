import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import { Button, Checkbox, Input, Popconfirm, Tooltip } from 'antd'
import cn from 'classnames'

import styles from './styles.module.scss'

export type Props = {
  folderName: string
  folderId: string
  isUserUploadFolder?: boolean
  onSelect: boolean
  viewMode?: boolean
  onAddSelectFolder: (fileId: string) => void
  onChangeFolderName?: (folderId: string, newFolderName: string) => void
  onClick: (folderId: string) => void
  onDelete?: (folderId: string) => void
  onRemoveSelectFolder: (fileId: string) => void
}

export const Folder = ({
  folderName,
  folderId,
  isUserUploadFolder,
  onSelect,
  viewMode = false,
  onAddSelectFolder = () => {},
  onChangeFolderName = () => {},
  onClick,
  onDelete = () => {},
  onRemoveSelectFolder = () => {},
}: Props) => {
  const [edit, setEdit] = useState(false)
  const [newName, setNewName] = useState(folderName)
  const [isChecked, setIsChecked] = useState(false)

  const clickHandler = () => {
    if (!onSelect) {
      onClick(folderId)
    } else {
      changeCheckState()
    }
  }

  const changeNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value)
  }

  const submitHandler = (e?: MouseEvent<HTMLElement>) => {
    e?.stopPropagation()
    onChangeFolderName(folderId, newName)
    setEdit(false)
  }

  const deleteHandler = () => {
    onDelete(folderId)
  }

  const actionClickHandler = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
  }

  const checkHandler = () => {
    changeCheckState()
  }

  const changeCheckState = () => {
    if (!isChecked) {
      onAddSelectFolder(folderId)
    } else {
      onRemoveSelectFolder(folderId)
    }
    setIsChecked(!isChecked)
  }

  useEffect(() => {
    setIsChecked(false)
  }, [onSelect])

  return (
    <div
      className={styles.Folder}
      data-testId={isUserUploadFolder ? 'UserUploadFolder' : 'FolderItem'}
      onClick={clickHandler}
    >
      <div className={styles.Folder__Desc}>
        {onSelect && !isUserUploadFolder && (
          <Checkbox
            checked={isChecked}
            className={styles.Folder__Checkbox}
            data-testId="folderSelectCheckbox"
            disabled={isUserUploadFolder}
            onChange={checkHandler}
            onClick={actionClickHandler}
          />
        )}
        <FolderOutlined className={styles.Folder__Icon} />
        {!edit ? (
          <>
            <div className={styles.Folder__Name} data-testId="folderName">
              {folderName}
            </div>
            {!onSelect && !viewMode && (
              <Button
                className={styles.Folder__Icon_edit}
                data-testId="folderRenameButton"
                icon={<EditOutlined />}
                size={'middle'}
                type="text"
                onClick={(e) => {
                  e.stopPropagation()
                  setEdit(true)
                }}
              />
            )}
          </>
        ) : (
          <>
            <Input
              className={cn(styles.Folder__Name, styles.Folder__Name_input)}
              data-testId="folderRenameInput"
              value={newName}
              onChange={changeNameHandler}
              onClick={(e) => {
                e.stopPropagation()
              }}
              onPressEnter={() => {
                submitHandler()
              }}
            />
            <Button
              className={styles.Folder__Icon_save}
              data-testId="folderRenameSubmit"
              disabled={onSelect}
              icon={<CheckOutlined />}
              size={'middle'}
              type="text"
              onClick={submitHandler}
            />
          </>
        )}
      </div>
      {!onSelect && !viewMode && (
        <div className={styles.Folder__Actions} onClick={actionClickHandler}>
          {!isUserUploadFolder ? (
            <Popconfirm
              cancelText="No"
              className={styles.Folder__Confirm}
              okText={<span data-testId="confirmYesAction">Yes</span>}
              placement="top"
              title={'Delete the folder and all files?'}
              onConfirm={deleteHandler}
            >
              <Button
                className={styles.Folder__Delete}
                data-testId="deleteFolderButton"
                disabled={onSelect}
                icon={<DeleteOutlined />}
                size={'middle'}
                type="text"
              />
            </Popconfirm>
          ) : (
            <Tooltip title={"It's folder for Telegram upload files"}>
              <Button
                className={styles.Folder__Delete}
                disabled={isUserUploadFolder || onSelect}
                icon={<DeleteOutlined />}
                size={'middle'}
                type="text"
              />
            </Tooltip>
          )}
        </div>
      )}
    </div>
  )
}
