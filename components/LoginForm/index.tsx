import { useState } from 'react'

type Props = {
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
        <p>Email</p>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
      </div>
      <div>
        <p>Password</p>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>
      <div>
        <button onClick={submitHandler}>Submit</button>
      </div>
    </>
  )
}
