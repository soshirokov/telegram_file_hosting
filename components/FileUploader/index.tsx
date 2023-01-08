import { FileAddOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { UploadProps } from 'antd/lib/upload'
import Dragger from 'antd/lib/upload/Dragger'

import { generateCaption } from 'helpers/generators'

import { sendFileResponse, tgDocument } from 'types/TG'

import styles from './styles.module.scss'

export type Props = {
  action: string
  data: { [key: string]: string }
  disabled: boolean
  onNewFile: (document: tgDocument, messageId: number) => void
}

export const FileUploader = ({ action, data, disabled, onNewFile }: Props) => {
  const props: UploadProps = {
    name: 'document',
    multiple: true,
    action,
    data: {
      chat_id: data.chatId,
      caption: generateCaption(data.folderName ?? ''),
    },
    itemRender(origin, file) {
      if (file.status === 'done') {
        return false
      }
      return origin
    },
    onChange(info) {
      const { status } = info.file
      const response = info.file.response
      if (status !== 'uploading') {
        if (status === 'done') {
          message.success(`File ${info.file.name} uploaded successfully.`)

          const result: sendFileResponse = response.result

          console.log(result)

          if (result.document) {
            onNewFile(result.document, result.message_id)
          }
          if (result.video) {
            onNewFile(result.video, result.message_id)
          }
        } else if (status === 'error') {
          if (response.error_code === 413) {
            message.error(
              `${info.file.name} is too large, upload it via Telegram`
            )
          } else {
            message.error(`${info.file.name} upload failed.`)
          }
        }
      }
    },
  }

  return (
    <Dragger
      {...props}
      className={styles.FileUploader}
      data-testid="fileUploader"
      disabled={disabled}
    >
      <FileAddOutlined className={styles.FileUploader__Icon} />
      <div className={styles.FileUploader__Text}>
        Click or drag file to this area to upload
      </div>
      <div className={styles.FileUploader__Desc}>
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </div>
    </Dragger>
  )
}
