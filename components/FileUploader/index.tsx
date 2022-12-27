import { FileAddOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { UploadProps } from 'antd/lib/upload'
import Dragger from 'antd/lib/upload/Dragger'

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
    name: 'file',
    multiple: true,
    action,
    data,
    itemRender(origin, file) {
      if (file.status === 'done') {
        return false
      }
      return origin
    },
    onChange(info) {
      const { status } = info.file
      const response: sendFileResponse = info.file.response
      if (status !== 'uploading') {
        if (status === 'done') {
          message.success(`File ${info.file.name} uploaded successfully.`)

          onNewFile(response.document, response.message_id)
        } else if (status === 'error') {
          message.error(`${info.file.name} upload failed.`)
        }
      }
    },
  }

  return (
    <Dragger {...props} className={styles.FileUploader} disabled={disabled}>
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
