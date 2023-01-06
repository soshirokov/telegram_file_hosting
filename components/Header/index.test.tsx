import { render } from '@testing-library/react'

import { Header, Props } from '.'
import user from '@testing-library/user-event'

const defaultProps: Props = {
  currentFolderName: 'Folder 1',
  isActive: false,
  modalEntry: <></>,
  modalIsOpen: false,
  modalTitle: 'Modal Title',
  prevFolder: '1111',
  selectAll: false,
  onAddFolder: () => {},
  onClickFolder: () => {},
  onDeleteSelected: () => {},
  onModalCancel: () => {},
  onModalSubmit: () => {},
  onMoveSelected: () => {},
  onSelectAll: () => {},
  onToSelect: () => {},
}

const RenderWithProps = (props?: Partial<Props>) => {
  return render(<Header {...defaultProps} {...props} />)
}

describe('Header component', () => {
  test('render with baseProps', () => {
    const { container } = RenderWithProps()

    expect(container.querySelector('.Header')).toBeInTheDocument()
    expect(container.querySelector('.Header__SelectButton')).toBeInTheDocument()
    expect(
      container.querySelector('.Header__AddFolderInput')
    ).toBeInTheDocument()
    expect(
      container.querySelector('.Header__AddFolderButton')
    ).toBeInTheDocument()
    expect(container.querySelector('.Header__PageTitle')).toBeInTheDocument()
    expect(container.querySelector('.Header__PageTitle')).toHaveTextContent(
      defaultProps.currentFolderName
    )
    expect(container.querySelector('.Header__TitleIcon')).toBeInTheDocument()
    expect(container.querySelector('.Header__GoHomeButton')).toBeInTheDocument()
    expect(container.querySelector('.Header__Modal')).not.toBeInTheDocument()
  })

  test('without current folder name', () => {
    const { container } = RenderWithProps({ currentFolderName: undefined })

    expect(container.querySelector('.Header__PageTitle')).toBeInTheDocument()
    expect(container.querySelector('.Header__PageTitle')).toHaveTextContent(
      /my files/i
    )
  })

  test('select mode', async () => {
    const { container } = RenderWithProps()

    let selectBtn = container.querySelector('.Header__SelectButton')
    let addFolderInput = container.querySelector('.Header__AddFolderInput')
    let addFolderBtn = container.querySelector('.Header__AddFolderButton')
    let moveBtn = container.querySelector('.Header__MoveButton')
    let deleteBtn = container.querySelector('.Header__DeleteButton')
    let cancelBtn = container.querySelector('.Header__CancelButton')

    expect(selectBtn).toBeInTheDocument()
    expect(addFolderInput).toBeInTheDocument()
    expect(addFolderBtn).toBeInTheDocument()
    expect(moveBtn).not.toBeInTheDocument()
    expect(deleteBtn).not.toBeInTheDocument()
    expect(cancelBtn).not.toBeInTheDocument()

    await user.click(selectBtn!)

    selectBtn = container.querySelector('.Header__SelectButton')
    addFolderInput = container.querySelector('.Header__AddFolderInput')
    addFolderBtn = container.querySelector('.Header__AddFolderButton')
    moveBtn = container.querySelector('.Header__MoveButton')
    deleteBtn = container.querySelector('.Header__DeleteButton')
    cancelBtn = container.querySelector('.Header__CancelButton')

    expect(selectBtn).not.toBeInTheDocument()
    expect(addFolderInput).not.toBeInTheDocument()
    expect(addFolderBtn).not.toBeInTheDocument()
    expect(moveBtn).toBeInTheDocument()
    expect(deleteBtn).toBeInTheDocument()
    expect(cancelBtn).toBeInTheDocument()

    await user.click(cancelBtn!)

    selectBtn = container.querySelector('.Header__SelectButton')
    addFolderInput = container.querySelector('.Header__AddFolderInput')
    addFolderBtn = container.querySelector('.Header__AddFolderButton')
    moveBtn = container.querySelector('.Header__MoveButton')
    deleteBtn = container.querySelector('.Header__DeleteButton')
    cancelBtn = container.querySelector('.Header__CancelButton')

    expect(selectBtn).toBeInTheDocument()
    expect(addFolderInput).toBeInTheDocument()
    expect(addFolderBtn).toBeInTheDocument()
    expect(moveBtn).not.toBeInTheDocument()
    expect(deleteBtn).not.toBeInTheDocument()
    expect(cancelBtn).not.toBeInTheDocument()
  })

  test('move items function', async () => {
    const onModalSubmit = jest.fn()
    const onMoveSelected = jest.fn()

    const { container, rerender, findByText } = RenderWithProps()

    await user.click(container.querySelector('.Header__SelectButton')!)

    rerender(
      <Header
        {...defaultProps}
        isActive={true}
        onMoveSelected={onMoveSelected}
      />
    )

    await user.click(container.querySelector('.Header__MoveButton')!)

    expect(onMoveSelected).toBeCalled()
    expect(onMoveSelected).toBeCalledTimes(1)

    rerender(
      <Header
        {...defaultProps}
        modalIsOpen={true}
        onModalSubmit={onModalSubmit}
      />
    )

    expect(await findByText(defaultProps.modalTitle)).toBeDefined()

    await user.click(await findByText(/move here/i))

    expect(onModalSubmit).toBeCalled()
    expect(onModalSubmit).toBeCalledTimes(1)
  })

  test('delete items function', async () => {
    const onDeleteSelected = jest.fn()
    const { container, rerender } = RenderWithProps()

    await user.click(container.querySelector('.Header__SelectButton')!)

    rerender(
      <Header
        {...defaultProps}
        isActive={true}
        onDeleteSelected={onDeleteSelected}
      />
    )

    await user.click(container.querySelector('.Header__DeleteButton')!)

    expect(onDeleteSelected).toBeCalled()
    expect(onDeleteSelected).toBeCalledTimes(1)
  })

  test('back btn click', async () => {
    const onClickFolder = jest.fn()
    const { container } = RenderWithProps({ onClickFolder })

    expect(
      container.querySelector('.ant-page-header-back-button')
    ).toBeInTheDocument()

    await user.click(container.querySelector('.ant-page-header-back-button')!)

    expect(onClickFolder).toBeCalled()
    expect(onClickFolder).toBeCalledTimes(1)
    expect(onClickFolder).toBeCalledWith(defaultProps.prevFolder)
  })

  test('add new folder', async () => {
    const onAddFolder = jest.fn()
    const { container } = RenderWithProps({ onAddFolder })
    const newFolderName = 'Test'

    let addFolderBtn = container.querySelector('.Header__AddFolderButton')
    let addFolderInput = container.querySelector('.Header__AddFolderInput')

    expect(addFolderBtn).toBeInTheDocument()
    expect(addFolderInput).toBeInTheDocument()
    expect(addFolderBtn?.getAttribute('disabled')).not.toBeNull()

    await user.type(addFolderInput!, newFolderName)

    addFolderBtn = container.querySelector('.Header__AddFolderButton')
    addFolderInput = container.querySelector('.Header__AddFolderInput')

    expect(addFolderInput?.getAttribute('value')).toEqual(newFolderName)
    expect(addFolderBtn?.getAttribute('disabled')).toBeNull()

    await user.click(addFolderBtn!)

    addFolderBtn = container.querySelector('.Header__AddFolderButton')
    addFolderInput = container.querySelector('.Header__AddFolderInput')

    expect(addFolderInput?.getAttribute('value')).toEqual('')
    expect(addFolderBtn?.getAttribute('disabled')).not.toBeNull()

    expect(onAddFolder).toBeCalled()
    expect(onAddFolder).toBeCalledTimes(1)
    expect(onAddFolder).toBeCalledWith(newFolderName)
  })
})
