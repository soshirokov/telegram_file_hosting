import api from '../url/api'

export const downloadFileFromTelegram = async (fileId: string) =>
  await fetch(api.files.fileEntry(fileId), {
    method: 'GET',
  })

export const replyMessage = async (chatId: string, messageId: number) =>
  await fetch(api.messages.messages(), {
    method: 'POST',
    body: JSON.stringify({ chatId, replyTo: messageId }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const deleteMessage = async (chatId: string, messageId: number) =>
  await fetch(api.messages.messages(), {
    method: 'DELETE',
    body: JSON.stringify({ chatId, messageId }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const updateDocument = async (
  chatId: string,
  fileId: string,
  newFileName: string,
  messageId: number,
  folderName: string
) =>
  await fetch(api.files.files(), {
    method: 'PUT',
    body: JSON.stringify({
      chatId,
      fileId,
      newFileName,
      messageId,
      folderName,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const updateCaption = async (
  chatId: string,
  messageId: number,
  newFolderName: string
) =>
  await fetch(api.messages.messages(), {
    method: 'PUT',
    body: JSON.stringify({
      chatId,
      messageId,
      caption: newFolderName,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
