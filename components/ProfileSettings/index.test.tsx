import { render } from '@testing-library/react'

import { ProfileSettings, Props } from '.'
import user from '@testing-library/user-event'

const defaultProps: Props = {
  chatId: '1111',
  setNewChatId: () => {},
}

const RenderWithProps = (props?: Partial<Props>) => {
  return render(<ProfileSettings {...defaultProps} {...props} />)
}

describe('LoginForm component', () => {
  test('render with baseProps', () => {
    const { container } = RenderWithProps()

    expect(
      container.querySelector('.ProfileSettings__Title')
    ).toBeInTheDocument()
    expect(
      container.querySelector('.ProfileSettings__Title')
    ).toHaveTextContent('Current Chat ID: ' + defaultProps.chatId)
    expect(
      container.querySelector('.ProfileSettings__ChatIdInput')
    ).toBeInTheDocument()
    expect(
      container.querySelector('.ProfileSettings__Submit')
    ).toBeInTheDocument()
  })

  test('set new chat id function', async () => {
    const setNewChatId = jest.fn()
    const { container } = RenderWithProps({ setNewChatId })
    const newChatId = 'test'

    await user.type(
      container.querySelector('.ProfileSettings__ChatIdInput')!,
      newChatId
    )

    await user.click(container.querySelector('.ProfileSettings__Submit')!)

    expect(setNewChatId).toBeCalled()
    expect(setNewChatId).toBeCalledTimes(1)
    expect(setNewChatId).toBeCalledWith(newChatId)
  })
})
