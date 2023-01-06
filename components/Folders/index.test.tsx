import { render } from '@testing-library/react'

import { Folders, Props } from '.'
import user from '@testing-library/user-event'

import { FolderClient } from 'types/Folder'

const TEST_FOLDERS: FolderClient[] = [
  {
    folderId: '1111',
    folderName: 'Folder 1',
    parentFolderId: '',
    isUserUploadFolder: false,
  },
  {
    folderId: '2222',
    folderName: 'Folder 2',
    parentFolderId: '',
    isUserUploadFolder: false,
  },
  {
    folderId: '3333',
    folderName: 'Folder 3',
    parentFolderId: '',
    isUserUploadFolder: false,
  },
]

const defaultProps: Props = {
  folders: TEST_FOLDERS,
  onSelect: false,
  selectAll: false,
  viewMode: false,
  onChangeFolderName: () => {},
  onClickFolder: () => {},
  onDeleteFolder: () => {},
  onSelectedChange: () => {},
}

const RenderWithProps = (props?: Partial<Props>) => {
  return render(<Folders {...defaultProps} {...props} />)
}

describe('Folders component', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  test('render with baseProps', () => {
    const { container } = RenderWithProps()

    expect(container.querySelector('.Folders__List')).toBeInTheDocument()
    expect(container.querySelectorAll('.Folders__ListItem').length).toEqual(
      TEST_FOLDERS.length
    )
  })

  test('click folder', async () => {
    const onClickFolder = jest.fn()
    const { container } = RenderWithProps({
      onClickFolder,
    })

    const folderItem = container.querySelectorAll('.Folder')[0]

    await user.click(folderItem!)

    expect(onClickFolder).toBeCalled()
    expect(onClickFolder).toBeCalledTimes(1)
    expect(onClickFolder).toBeCalledWith(defaultProps.folders[0].folderId)
  })

  test('onSelect mode', async () => {
    const onClickFolder = jest.fn()
    const onSelectedChange = jest.fn()
    const { container } = RenderWithProps({
      onSelect: true,
      onClickFolder,
      onSelectedChange,
    })

    const checkbox = container.querySelectorAll('.Folder__Checkbox')[0]

    expect(checkbox).toBeInTheDocument()

    await user.click(checkbox!)

    expect(onSelectedChange).toBeCalled()
    expect(onSelectedChange).toBeCalledWith([defaultProps.folders[0].folderId])

    await user.click(checkbox!)

    expect(onSelectedChange).toBeCalled()
    expect(onSelectedChange).toBeCalledWith([])

    const folderItem = container.querySelectorAll('.Folder')[0]
    onSelectedChange.mockReset()

    await user.click(folderItem!)

    expect(onClickFolder).not.toBeCalled()
  })

  test('edit folder name', async () => {
    const onChangeFolderName = jest.fn()
    const { container } = RenderWithProps({ onChangeFolderName })

    const inputFolderName = '_test'

    const editBtn = container.querySelectorAll('.Folder__Icon_edit')[0]

    await user.click(editBtn!)

    const folderNameInput = container.querySelectorAll('.Folder__Name_input')[0]
    const saveFolderNameBtn =
      container.querySelectorAll('.Folder__Icon_save')[0]

    await user.type(folderNameInput!, inputFolderName)

    await user.click(saveFolderNameBtn!)

    expect(onChangeFolderName).toBeCalled()
    expect(onChangeFolderName).toBeCalledTimes(1)
    expect(onChangeFolderName).toBeCalledWith(
      defaultProps.folders[0].folderId,
      defaultProps.folders[0].folderName + inputFolderName
    )
  })

  test('delete folder', async () => {
    const onDeleteFolder = jest.fn()
    const { container, findByText } = RenderWithProps({ onDeleteFolder })

    const deleteBtn = container.querySelectorAll('.Folder__Delete')[0]

    await user.click(deleteBtn!)
    await user.click(await findByText(/yes/i)!)

    expect(onDeleteFolder).toBeCalled()
    expect(onDeleteFolder).toBeCalledTimes(1)
    expect(onDeleteFolder).toBeCalledWith(defaultProps.folders[0].folderId)
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
})
