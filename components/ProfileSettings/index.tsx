import { useState } from 'react'

import { Button, Input, Typography } from 'antd'

import styles from './styles.module.scss'

const { Title } = Typography

type Props = {
  chatId: string
  setNewChatId: (chatId: string) => void
}

export const ProfileSettings = ({ chatId, setNewChatId }: Props) => {
  const [chat, setChat] = useState(chatId)

  const submitHandler = () => {
    setNewChatId(chat)
    setChat('')
  }

  return (
    <>
      <Title level={5}>Current Chat ID: {chatId}</Title>
      <Input value={chat} onChange={(e) => setChat(e.target.value)} />
      <Button
        className={styles.Profile__Button}
        type="primary"
        onClick={submitHandler}
      >
        Set chat ID
      </Button>
    </>
  )
}
