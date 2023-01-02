import { useContext, useEffect, useState } from 'react'

import { get, set } from 'firebase/database'
import { useRouter } from 'next/router'

import { FilesContainer as Files } from 'containers/Files'
import { FoldersContainer as Folders } from 'containers/Folders'
import { HeaderContainer as Header } from 'containers/Header'

import { User } from 'context/user'

import { generateUID } from 'helpers/generators'

import { Main } from 'layouts/Main'

import { getUserFolderRef, getUserUploadFolderRef } from 'utils/firebase'

const Home = () => {
  const [currentFolderId, setCurrentFolderId] = useState('')
  const [onSelect, setOnSelect] = useState(false)
  const [selected, setSelected] = useState<{
    files: string[]
    folders: string[]
  }>({
    files: [],
    folders: [],
  })
  const router = useRouter()
  const { userUID } = useContext(User)

  if (!userUID) {
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
      {userUID && (
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
      )}
    </>
  )
}

export default Home
