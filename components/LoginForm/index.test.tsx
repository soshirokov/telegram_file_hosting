import { render } from '@testing-library/react'

import { LoginForm, Props } from '.'
import user from '@testing-library/user-event'

const defaultProps: Props = {
  onAuth: () => {},
}

const RenderWithProps = (props?: Partial<Props>) => {
  return render(<LoginForm {...defaultProps} {...props} />)
}

describe('LoginForm component', () => {
  test('render with baseProps', () => {
    const { container } = RenderWithProps()

    expect(
      container.querySelector('.LoginForm__Input_email')
    ).toBeInTheDocument()
    expect(
      container.querySelector('.LoginForm__Input_password')
    ).toBeInTheDocument()
    expect(container.querySelector('.LoginForm__Submit')).toBeInTheDocument()
  })

  test('auth function', async () => {
    const onAuth = jest.fn()
    const { container } = RenderWithProps({ onAuth })
    const email = 'email@example.com'
    const password = 'password'

    await user.type(container.querySelector('.LoginForm__Input_email')!, email)
    await user.type(
      container.querySelector('.LoginForm__Input_password')!,
      password
    )
    await user.click(container.querySelector('.LoginForm__Submit')!)

    expect(onAuth).toBeCalled()
    expect(onAuth).toBeCalledTimes(1)
    expect(onAuth).toBeCalledWith(email, password)
  })
})
