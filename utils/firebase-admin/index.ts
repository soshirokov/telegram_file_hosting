import admin, { ServiceAccount } from 'firebase-admin'
import { Database } from 'firebase-admin/lib/database/database'

import { FileServer } from 'types/File'

import serviceAccount from '../../firebase-admin-key.json'

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

// Queries
const userQuery = (chatId: string) =>
  getUsers.orderByChild('chatId').equalTo(chatId)

//DB Methods
export const getUserByChatId = async (chatId: string) => {
  const userRef = userQuery(chatId)
  const result = await userRef.get()
  const user = result.val()

  return Object.keys(user)[0]
}
export const getUserUploadFolderId = async (userId: string) =>
  (await getUserUploadFolderRef(userId).get()).val()

export const getFolder = async (userId: string, folderId: string) =>
  (await getUserFolderRef(userId, folderId).get()).val()

export const setFile = async (
  userId: string,
  fileId: string,
  payload: FileServer
) => getUserFileRef(userId, fileId).set(payload)
