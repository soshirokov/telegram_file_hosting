import admin, { ServiceAccount } from 'firebase-admin'
import { Database } from 'firebase-admin/lib/database/database'

import { FileServer, FilesServer } from 'types/File'

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDITS as string)

if (admin.apps.length === 0) {
  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL:
        'https://tg-cloud-storage-default-rtdb.europe-west1.firebasedatabase.app',
    },
    'AdminSDK'
  )
}

const database = admin.apps[0] ? admin.apps[0].database() : ({} as Database)

// User Refs
const getUsers = database.ref('/users')
const getUserUploadFolderRef = (userId: string) =>
  database.ref(`users/${userId}/uploadFolderId`)

// Folder Refs
const getUserFolderRef = (userId: string, folderId: string) =>
  database.ref(`users/${userId}/folders/${folderId}`)

// File Refs
const getUserFileRef = (userId: string, fileId: string) =>
  database.ref(`users/${userId}/files/${fileId}`)
const getAllUserFilesRef = (userId: string) =>
  database.ref(`users/${userId}/files`)

// Queries
const userQuery = (chatId: string) =>
  getUsers.orderByChild('chatId').equalTo(chatId)
const fileByMessageIdQuery = (userId: string, messageId: number) =>
  getAllUserFilesRef(userId).orderByChild('messageId').equalTo(messageId)

//DB Methods
export const getUserByChatId = async (chatId: string) => {
  const users = (await userQuery(chatId).get()).val()

  return Object.keys(users)[0]
}
export const getUserUploadFolderId = async (userId: string) =>
  (await getUserUploadFolderRef(userId).get()).val()

export const getFolder = async (userId: string, folderId: string) =>
  (await getUserFolderRef(userId, folderId).get()).val()

export const getFileByMessageId = async (
  userId: string,
  messageId: number
): Promise<FileServer> => {
  const files: FilesServer = (
    await fileByMessageIdQuery(userId, messageId).get()
  ).val()

  return files[Object.keys(files)[0]]
}

export const setFile = async (
  userId: string,
  fileId: string,
  payload: FileServer
) => getUserFileRef(userId, fileId).set(payload)
