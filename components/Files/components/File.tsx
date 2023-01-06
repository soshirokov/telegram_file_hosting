import { ChangeEvent, useEffect, useState } from 'react'

import {
  CheckOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
} from '@ant-design/icons'
import { Button, Checkbox, Input, Tooltip } from 'antd'
import cn from 'classnames'

import { converFromBToMb } from 'helpers/converters'

import styles from './styles.module.scss'

export type Props = {
  name: string
  isSelected: boolean
  onSelect: boolean
  size: number
  telegramFileId: string
  thumbURL: string
  onAddSelectFile: (fileId: string) => void
  onChangeFileName: (fileId: string, newFileName: string) => void
  onDeleteFile: (fileId: string) => void
  onGetFile: (fileId: string) => void
  onRemoveSelectFile: (fileId: string) => void
}

export const BIG_FILE_SIZE = 50

export const File = ({
  name,
  isSelected,
  onSelect,
  size,
  telegramFileId,
  thumbURL,
  onAddSelectFile,
  onChangeFileName,
  onDeleteFile,
  onGetFile,
  onRemoveSelectFile,
}: Props) => {
  const extension = name.split('.').reverse()[0]
  const [fileName, setFileName] = useState(name.slice(0, -4))
  const [edit, setEdit] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const fileSizeMb = converFromBToMb(size)
  const isBigFile = fileSizeMb >= BIG_FILE_SIZE

  const selectHandler = () => {
    onGetFile(telegramFileId)
  }

  const deleteHandler = () => {
    onDeleteFile(telegramFileId)
  }

  const changeNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value)
  }

  const submitHandler = () => {
    onChangeFileName(telegramFileId, `${fileName}.${extension}`)

    setEdit(false)
  }

  const checkHandler = () => {
    changeCheckState()
  }

  const clickHandler = () => {
    if (onSelect) {
      changeCheckState()
    }
  }

  const changeCheckState = () => {
    if (!isChecked) {
      onAddSelectFile(telegramFileId)
    } else {
      onRemoveSelectFile(telegramFileId)
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
      className={cn(styles.File, { [styles.File_select]: onSelect })}
      data-testid="fileItem"
      onClick={clickHandler}
    >
      <div className={styles.File__Desc}>
        {onSelect && (
          <Checkbox
            checked={isChecked}
            className={styles.File__Checkbox}
            data-testid="fileSelectCheckbox"
            onChange={checkHandler}
          />
        )}
        {thumbURL.length > 0 ? (
          <div
            className={styles.File__Thumb}
            style={{ backgroundImage: `url(${thumbURL})` }}
          ></div>
        ) : (
          <FileOutlined className={styles.File__Icon} />
        )}
        {!edit ? (
          <>
            <div className={styles.File__Name} data-testid="fileName">
              {name}
            </div>
            {!onSelect &&
              (isBigFile ? (
                <Tooltip title={"Files more 50Mb can't be renamed"}>
                  <Button
                    className={styles.File__Icon_edit}
                    disabled={isBigFile}
                    icon={<EditOutlined />}
                    size={'middle'}
                    type="text"
                    onClick={() => {
                      setEdit(true)
                    }}
                  />
                </Tooltip>
              ) : (
                <Button
                  className={styles.File__Icon_edit}
                  data-testid="renameFile"
                  disabled={isBigFile}
                  icon={<EditOutlined />}
                  size={'middle'}
                  type="text"
                  onClick={() => {
                    setEdit(true)
                  }}
                />
              ))}
          </>
        ) : (
          <>
            <Input
              addonAfter={edit ? extension : false}
              className={cn(styles.File__Name, styles.File__Name_input)}
              data-testid="newFileNameInput"
              value={fileName}
              onChange={changeNameHandler}
              onPressEnter={submitHandler}
            />
            <Button
              className={styles.File__Icon_save}
              data-testid="newFileNameSubmit"
              icon={<CheckOutlined />}
              size={'middle'}
              type="text"
              onClick={submitHandler}
            />
          </>
        )}
        <div className={styles.File__Size}>{`${fileSizeMb}Mb`}</div>
      </div>
      {!onSelect && (
        <div className={styles.File__Actions}>
          <Button
            className={styles.File__Download}
            icon={<DownloadOutlined />}
            size={'middle'}
            type="text"
            onClick={selectHandler}
          />
          <Button
            className={styles.File__Delete}
            data-testid="deteleFile"
            icon={<DeleteOutlined />}
            size={'middle'}
            type="text"
            onClick={deleteHandler}
          />
        </div>
      )}
    </div>
  )
}
