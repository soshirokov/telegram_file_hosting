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
  getDatabase,
  orderByChild,
  query,
  ref,
} from 'firebase/database'

const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CREDITS as string
)

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
export const getUserChatIdRef = (userId: string) =>
  ref(database, `users/${userId}/chatId`)
export const getUserUploadFolderRef = (userId: string) =>
  ref(database, `users/${userId}/uploadFolderId`)
// File Refs
export const getAllUserFilesRef = (userId: string) =>
  ref(database, `files/${userId}`)
export const getUserFileRef = (userId: string, fileId: string) =>
  ref(database, `files/${userId}/${fileId}`)
export const getFileNameRef = (userId: string, fileId: string) =>
  ref(database, `files/${userId}/${fileId}/name`)
export const getFileFolderNameRef = (userId: string, fileId: string) =>
  ref(database, `files/${userId}/${fileId}/folderName`)
// Folder Refs
export const getAllUserFoldersRef = (userId: string) =>
  ref(database, `folders/${userId}/`)
export const getUserFolderRef = (userId: string, folderId: string) =>
  ref(database, `folders/${userId}/${folderId}`)
export const getFolderNameRef = (userId: string, folderId: string) =>
  ref(database, `folders/${userId}/${folderId}/name`)

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
