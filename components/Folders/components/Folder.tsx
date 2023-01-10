import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import { Button, Checkbox, Input, Popconfirm, Tooltip } from 'antd'
import cn from 'classnames'
import { useRouter } from 'next/router'

import url from 'utils/url'

import styles from './styles.module.scss'

export type Props = {
  folderName: string
  folderId: string
  isSelected: boolean
  isUserUploadFolder?: boolean
  onSelect: boolean
  viewMode?: boolean
  onAddSelectFolder: (fileId: string) => void
  onChangeFolderName?: (folderId: string, newFolderName: string) => void
  onDelete?: (folderId: string) => void
  onRemoveSelectFolder: (fileId: string) => void
  selectFolderHandler?: (folderId: string) => void
}

export const Folder = ({
  folderName,
  folderId,
  isSelected,
  isUserUploadFolder,
  onSelect,
  viewMode = false,
  onAddSelectFolder = () => {},
  onChangeFolderName = () => {},
  onDelete = () => {},
  onRemoveSelectFolder = () => {},
  selectFolderHandler = () => {},
}: Props) => {
  const [edit, setEdit] = useState(false)
  const [newName, setNewName] = useState(folderName)
  const [isChecked, setIsChecked] = useState(false)
  const router = useRouter()

  const clickHandler = () => {
    if (!onSelect && !viewMode) {
      router.push(url.router.folders.url(folderId))
    }

    if (onSelect && !isUserUploadFolder) {
      changeCheckState()
    }

    if (viewMode) {
      selectFolderHandler(folderId)
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

  useEffect(() => {
    setIsChecked(isSelected)
  }, [isSelected])

  return (
    <div
      className={styles.Folder}
      data-testid={isUserUploadFolder ? 'UserUploadFolder' : 'FolderItem'}
      onClick={clickHandler}
    >
      <div className={styles.Folder__Desc}>
        {onSelect && !isUserUploadFolder && (
          <Checkbox
            checked={isChecked}
            className={styles.Folder__Checkbox}
            data-testid="folderSelectCheckbox"
            disabled={isUserUploadFolder}
            onChange={checkHandler}
            onClick={actionClickHandler}
          />
        )}
        <FolderOutlined className={styles.Folder__Icon} />
        {!edit ? (
          <>
            <div className={styles.Folder__Name} data-testid="folderName">
              {folderName}
            </div>
            {!onSelect && !viewMode && (
              <Button
                className={styles.Folder__Icon_edit}
                data-testid="folderRenameButton"
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
              data-testid="folderRenameInput"
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
              data-testid="folderRenameSubmit"
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
              okText={<span data-testid="confirmYesAction">Yes</span>}
              placement="top"
              title={'Delete the folder and all files?'}
              onConfirm={deleteHandler}
            >
              <Button
                className={styles.Folder__Delete}
                data-testid="deleteFolderButton"
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
