import { render } from '@testing-library/react'

import user from '@testing-library/user-event'
import { useRouter } from 'next/router'

import { Folder, Props } from './Folder'

// mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const defaultProps: Props = {
  folderName: 'Folder',
  folderId: '1111',
  isSelected: false,
  isUserUploadFolder: false,
  onSelect: false,
  viewMode: false,
  onAddSelectFolder: () => {},
  onChangeFolderName: () => {},
  onDelete: () => {},
  onRemoveSelectFolder: () => {},
  selectFolderHandler: () => {},
}

const RenderWithProps = (props?: Partial<Props>) => {
  return render(<Folder {...defaultProps} {...props} />)
}

describe('Folder component', () => {
  test('render with baseProps', () => {
    const { container } = RenderWithProps()

    expect(container.querySelector('.Folder')).toBeInTheDocument()
    expect(container.querySelector('.Folder__Desc')).toBeInTheDocument()
    expect(container.querySelector('.Folder__Icon')).toBeInTheDocument()
    expect(container.querySelector('.Folder__Icon_edit')).toBeInTheDocument()
    expect(container.querySelector('.Folder__Name')).toBeInTheDocument()
    expect(container.querySelector('.Folder__Actions')).toBeInTheDocument()
    expect(container.querySelector('.Folder__Delete')).toBeInTheDocument()
  })

  test('click folder', async () => {
    const pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    })

    const { container } = RenderWithProps()

    const folderItem = container.querySelector('.Folder')

    await user.click(folderItem!)

    expect(pushMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  test('onSelect mode', async () => {
    const onAddSelectFolder = jest.fn()
    const onRemoveSelectFolder = jest.fn()
    const pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    })

    const { container } = RenderWithProps({
      onSelect: true,
      onAddSelectFolder,
      onRemoveSelectFolder,
    })

    const checkbox = container.querySelector('.Folder__Checkbox')

    expect(checkbox).toBeInTheDocument()
    expect(
      container.querySelector('.Folder__Icon_edit')
    ).not.toBeInTheDocument()
    expect(container.querySelector('.Folder__Actions')).not.toBeInTheDocument()
    expect(container.querySelector('.Folder__Delete')).not.toBeInTheDocument()

    await user.click(checkbox!)

    expect(onAddSelectFolder).toBeCalled()
    expect(onAddSelectFolder).toBeCalledWith(defaultProps.folderId)

    await user.click(checkbox!)

    expect(onRemoveSelectFolder).toBeCalled()
    expect(onRemoveSelectFolder).toBeCalledWith(defaultProps.folderId)

    const folderItem = container.querySelector('.Folder')
    onAddSelectFolder.mockReset()
    onRemoveSelectFolder.mockReset()

    await user.click(folderItem!)

    expect(pushMock).not.toHaveBeenCalled()
    expect(onAddSelectFolder).toBeCalled()
    expect(onAddSelectFolder).toBeCalledWith(defaultProps.folderId)

    await user.click(folderItem!)

    expect(pushMock).not.toHaveBeenCalled()
    expect(onRemoveSelectFolder).toBeCalled()
    expect(onRemoveSelectFolder).toBeCalledWith(defaultProps.folderId)
  })

  test('onSelect mode and isSelected = true', () => {
    const { container } = RenderWithProps({
      onSelect: true,
      isSelected: true,
    })

    expect(container.querySelector('.ant-checkbox-checked')).toBeInTheDocument()
  })

  test('edit folder name', async () => {
    const onChangeFolderName = jest.fn()
    const { container } = RenderWithProps({ onChangeFolderName })

    const inputFolderName = '_test'

    let editBtn = container.querySelector('.Folder__Icon_edit')
    let folderNameInput = container.querySelector('.Folder__Name_input')
    let saveFolderNameBtn = container.querySelector('.Folder__Icon_save')

    expect(editBtn).toBeInTheDocument()
    expect(folderNameInput).not.toBeInTheDocument()
    expect(saveFolderNameBtn).not.toBeInTheDocument()

    await user.click(editBtn!)

    editBtn = container.querySelector('.Folder__Icon_edit')
    folderNameInput = container.querySelector('.Folder__Name_input')
    saveFolderNameBtn = container.querySelector('.Folder__Icon_save')

    expect(editBtn).not.toBeInTheDocument()
    expect(folderNameInput).toBeInTheDocument()
    expect(saveFolderNameBtn).toBeInTheDocument()

    await user.type(folderNameInput!, inputFolderName)

    expect(folderNameInput?.getAttribute('value')).toEqual(
      defaultProps.folderName + inputFolderName
    )

    await user.click(saveFolderNameBtn!)

    editBtn = container.querySelector('.Folder__Icon_edit')
    folderNameInput = container.querySelector('.Folder__Name_input')
    saveFolderNameBtn = container.querySelector('.Folder__Icon_save')

    expect(editBtn).toBeInTheDocument()
    expect(folderNameInput).not.toBeInTheDocument()
    expect(saveFolderNameBtn).not.toBeInTheDocument()
    expect(onChangeFolderName).toBeCalled()
    expect(onChangeFolderName).toBeCalledTimes(1)
    expect(onChangeFolderName).toBeCalledWith(
      defaultProps.folderId,
      defaultProps.folderName + inputFolderName
    )
  })

  test('delete folder', async () => {
    const onDelete = jest.fn()
    const { container, findByText } = RenderWithProps({ onDelete })

    const deleteBtn = container.querySelector('.Folder__Delete')

    await user.click(deleteBtn!)
    await user.click(await findByText(/no/i)!)

    expect(onDelete).not.toBeCalled()

    await user.click(deleteBtn!)
    await user.click(await findByText(/yes/i)!)

    expect(onDelete).toBeCalled()
    expect(onDelete).toBeCalledTimes(1)
    expect(onDelete).toBeCalledWith(defaultProps.folderId)
  })

  test('user upload folder should not be available to delete', async () => {
    const onDelete = jest.fn()
    const { container } = RenderWithProps({
      isUserUploadFolder: true,
      onDelete,
    })

    const deleteBtn = container.querySelector('.Folder__Delete')

    await user.click(deleteBtn!)

    expect(container.querySelector('.Folder__Confirm')).not.toBeInTheDocument()
    expect(onDelete).not.toBeCalled()
  })

  test('viewMode cant be rename or delete', async () => {
    const { container } = RenderWithProps({
      viewMode: true,
    })

    expect(
      container.querySelector('.Folder__Icon_edit')
    ).not.toBeInTheDocument()
    expect(container.querySelector('.Folder__Actions')).not.toBeInTheDocument()
    expect(container.querySelector('.Folder__Delete')).not.toBeInTheDocument()
  })

  test('viewMode click folder call selectFolderHandler', async () => {
    const selectFolderHandler = jest.fn()
    const { container } = RenderWithProps({
      viewMode: true,
      selectFolderHandler,
    })

    const folderItem = container.querySelector('.Folder')

    await user.click(folderItem!)

    expect(selectFolderHandler).toBeCalled()
    expect(selectFolderHandler).toBeCalledTimes(1)
    expect(selectFolderHandler).toBeCalledWith(defaultProps.folderId)
  })
})
