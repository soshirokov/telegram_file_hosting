import { useEffect, useState } from 'react'

import { useAuthState } from 'react-firebase-hooks/auth'

import { get, off, onValue, set } from 'firebase/database'
import { useRouter } from 'next/router'

import { FilesContainer as Files } from 'containers/Files'
import { FoldersContainer as Folders } from 'containers/Folders'
import { HeaderContainer as Header } from 'containers/Header'

import { User } from 'context/user'

import { generateUID } from 'helpers/generators'

import { Main } from 'layouts/Main'

import {
  auth,
  getUserChatIdRef,
  getUserFolderRef,
  getUserUploadFolderRef,
} from 'utils/firebase'

const Home = () => {
  const [user, loading] = useAuthState(auth)
  const [currentFolderId, setCurrentFolderId] = useState('')
  const [chatId, setChatid] = useState('')
  const [onSelect, setOnSelect] = useState(false)
  const [selected, setSelected] = useState<{
    files: string[]
    folders: string[]
  }>({
    files: [],
    folders: [],
  })
  const router = useRouter()
  const userUID = user?.uid ?? ''

  if (!loading && !user?.uid) {
    router.push('/profile')
  }

  const changeFolderHandler = (folderId: string) => {
    setCurrentFolderId(folderId)
  }

  const onToSelectHandler = (onSelect: boolean) => {
    if (!onSelect) {
      clearSelected()
    }

    setOnSelect(onSelect)
  }

  const clearSelected = () => {
    setSelected((prevState) => ({ ...prevState, files: [], folders: [] }))
  }

  const selectFilesChangeHandler = (files: string[]) => {
    setSelected((prevState) => ({ ...prevState, files: files }))
  }

  const selectFoldersChangeHandler = (folders: string[]) => {
    setSelected((prevState) => ({ ...prevState, folders: folders }))
  }

  useEffect(() => {
    if (userUID) {
      onValue(getUserChatIdRef(userUID), (snapshot) => {
        const result = snapshot.val()

        const chat = result ? result : ''

        setChatid(chat)
      })

      return () => {
        off(getUserChatIdRef(userUID))
      }
    }
  }, [userUID, chatId, currentFolderId])

  useEffect(() => {
    if (userUID) {
      get(getUserUploadFolderRef(userUID)).then((snapshot) => {
        const result = snapshot.val()

        if (!result) {
          const folderId = generateUID()
          set(getUserFolderRef(userUID, folderId), {
            parent: '',
            name: 'Uploads',
            isUserUploadFolder: true,
          }).then(() => {
            set(getUserUploadFolderRef(userUID), folderId)
          })
        }
      })
    }
  }, [userUID])

  return (
    <>
      {!loading && (
        <User.Provider value={{ userUID, chatId }}>
          <Main>
            <Header
              changeFolderHandler={changeFolderHandler}
              currentFolderId={currentFolderId}
              selected={selected}
              onToSelect={onToSelectHandler}
            />
            <Folders
              changeFolderHandler={changeFolderHandler}
              currentFolderId={currentFolderId}
              onSelect={onSelect}
              onSelectedChange={selectFoldersChangeHandler}
            />
            <Files
              currentFolderId={currentFolderId}
              onSelect={onSelect}
              onSelectedChange={selectFilesChangeHandler}
            />
          </Main>
        </User.Provider>
      )}
    </>
  )
}

export default Home
