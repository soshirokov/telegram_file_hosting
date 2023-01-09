import { useEffect, useState } from 'react'

import { useAuthState } from 'react-firebase-hooks/auth'

import { off, onValue } from 'firebase/database'
import type { AppProps } from 'next/app'

import { User } from 'context/user'

import { auth, getUserChatIdRef } from 'utils/firebase'

import 'antd/dist/antd.css'
import 'theme/antd-custom.scss'

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth)
  const [chatId, setChatid] = useState('')

  useEffect(() => {
    if (user?.uid) {
      onValue(getUserChatIdRef(user.uid), (snapshot) => {
        const result = snapshot.val()

        const chat = result ? result : ''

        setChatid(chat)
      })

      return () => {
        off(getUserChatIdRef(user.uid))
      }
    }
  }, [user?.uid, chatId])

  return (
    <>
      {!loading && (
        <User.Provider value={{ userUID: user?.uid ?? '', chatId }}>
          <Component {...pageProps} />
        </User.Provider>
      )}
      <style global jsx>{`
        * {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  )
}
