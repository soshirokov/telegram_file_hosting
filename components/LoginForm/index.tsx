import { useState } from 'react'

import { Button, Input } from 'antd'
import cn from 'classnames'

import styles from './styles.module.scss'

export type Props = {
  onAuth: (email: string, password: string) => void
}

export const LoginForm = ({ onAuth }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = () => {
    onAuth(email, password)
  }

  return (
    <>
      <div>
        <Input
          className={cn(styles.LoginForm__Input, styles.LoginForm__Input_email)}
          data-testid="loginEmail"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
      </div>
      <div>
        <Input
          className={cn(
            styles.LoginForm__Input,
            styles.LoginForm__Input_password
          )}
          data-testid="loginPassword"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>
      <div>
        <Button
          className={styles.LoginForm__Submit}
          data-testid="loginSubmit"
          type="primary"
          onClick={submitHandler}
        >
          Submit
        </Button>
      </div>
    </>
  )
}
