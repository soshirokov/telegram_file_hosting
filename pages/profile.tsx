import { useEffect, useState } from 'react'

import { useAuthState } from 'react-firebase-hooks/auth'

import { off, onValue, set } from 'firebase/database'

import { LoginForm } from 'components/LoginForm'
import { ProfileSettings } from 'components/ProfileSettings'

import { Main } from 'layouts/Main'

import { getUserChatIdRef, signIn } from 'utils/firebase'
import { auth } from 'utils/firebase'

const Profile = () => {
  const [user, loading] = useAuthState(auth)
  const [chat, setChat] = useState('')

  const authHandler = (email: string, password: string) => {
    signIn(email, password)
  }

  const changeChatIdHandler = (chatId: string) => {
    if (user?.uid) {
      set(getUserChatIdRef(user.uid), chatId)
    }
  }

  useEffect(() => {
    if (user?.uid) {
      onValue(getUserChatIdRef(user.uid), (snapshot) => {
        const result = snapshot.val()
        const newChatId = result ? result : ''
        setChat(newChatId)
      })

      return () => {
        off(getUserChatIdRef(user.uid))
      }
    }
  }, [user])

  return (
    <>
      {!loading && (
        <Main>
          {!user ? (
            <LoginForm onAuth={authHandler} />
          ) : (
            <ProfileSettings chatId={chat} setNewChatId={changeChatIdHandler} />
          )}
        </Main>
      )}
    </>
  )
}

export default Profile
