import { useContext } from 'react'

import { useRouter } from 'next/router'

import { User } from 'context/user'

import FolderPage from './folder/[folderId]'

const Home = () => {
  const router = useRouter()
  const { userUID } = useContext(User)

  if (!userUID) {
    router.push('/profile')
  }

  return <FolderPage />
}

export default Home
