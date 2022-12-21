import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
} from 'firebase/database'

import { FilesServer } from 'types/File'

import firebaseConfig from '../../firebase-key.json'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Auth helpers
export const auth = getAuth()
export const signIn = (email: string, pass: string) =>
  signInWithEmailAndPassword(auth, email, pass)
export const logout = () => signOut(auth)
const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () => signInWithPopup(auth, provider)
export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

// DB helpers
const database = getDatabase(app)

// User Refs
export const getUsersRef = () => ref(database, '/users')
export const getUserChatIdRef = (userId: string) =>
  ref(database, `users/${userId}/chatId`)
export const getUserUploadFolderRef = (userId: string) =>
  ref(database, `users/${userId}/uploadFolderId`)
// File Refs
export const getAllUserFilesRef = (userId: string) =>
  ref(database, `users/${userId}/files`)
export const getUserFileRef = (userId: string, fileId: string) =>
  ref(database, `users/${userId}/files/${fileId}`)
export const getFileNameRef = (userId: string, fileId: string) =>
  ref(database, `users/${userId}/files/${fileId}/name`)
export const getFileFolderNameRef = (userId: string, fileId: string) =>
  ref(database, `users/${userId}/files/${fileId}/folderName`)
// Folder Refs
export const getAllUserFoldersRef = (userId: string) =>
  ref(database, `users/${userId}/folders/`)
export const getUserFolderRef = (userId: string, folderId: string) =>
  ref(database, `users/${userId}/folders/${folderId}`)
export const getFolderNameRef = (userId: string, folderId: string) =>
  ref(database, `users/${userId}/folders/${folderId}/name`)

// DB Query
// Child folders
export const foldersByParentQuery = (userId: string, parentFolder: string) =>
  query(
    getAllUserFoldersRef(userId),
    orderByChild('parent'),
    equalTo(parentFolder)
  )
// Folder's files
export const filesByParentFolderQuery = (userId: string, folder: string) =>
  query(getAllUserFilesRef(userId), orderByChild('folderId'), equalTo(folder))
// File by messageId
export const fileByMessageIdQuery = (userId: string, messageId: number) =>
  query(
    getAllUserFilesRef(userId),
    orderByChild('messageId'),
    equalTo(messageId)
  )

// DB Methods
export const uploadFileId = async (userId: string, messageId: number) => {
  const file: FilesServer = (
    await get(fileByMessageIdQuery(userId, messageId))
  ).val()

  return file[Object.keys(file)[0]].uploadMessageId ?? 0
}
