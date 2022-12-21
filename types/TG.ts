export type sendFileResponse = {
  message_id: number
  from: {
    id: string
    is_bot: boolean
    first_name: string
    username: string
  }
  chat: {
    id: string
    first_name: string
    last_name: string
    username: string
    type: string
  }
  date: string
  document: tgDocument
}

export type tgDocument = {
  file_name: string
  mime_type: string
  thumb: {
    file_id?: string
    file_unique_id?: string
    file_size?: number
    width?: string
    height?: string
  }
  file_id: string
  file_unique_id: string
  file_size: number
}
