import { useState } from 'react'

import { Button, Input, Typography } from 'antd'

import styles from './styles.module.scss'

const { Title } = Typography

export type Props = {
  chatId: string
  setNewChatId: (chatId: string) => void
}

export const ProfileSettings = ({ chatId, setNewChatId }: Props) => {
  const [chat, setChat] = useState('')

  const submitHandler = () => {
    setNewChatId(chat)
    setChat('')
  }

  return (
    <>
      <Title className={styles.ProfileSettings__Title} level={5}>
        Current Chat ID: {chatId}
      </Title>
      <Input
        className={styles.ProfileSettings__ChatIdInput}
        value={chat}
        onChange={(e) => setChat(e.target.value)}
      />
      <Button
        className={styles.ProfileSettings__Submit}
        type="primary"
        onClick={submitHandler}
      >
        Set chat ID
      </Button>
    </>
  )
}
