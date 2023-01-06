import { render } from '@testing-library/react'

import { Files, Props } from '.'
import user from '@testing-library/user-event'

import { FileClient } from 'types/File'

const TEST_FILES: FileClient[] = [
  {
    folderName: 'Folder1',
    messageId: 1111,
    name: 'File1.pdf',
    size: 1000,
    telegramFileId: '11111',
    thumbURL: 'http://localhost/thumbURL1',
    link: 'http://localhost/link1',
  },
  {
    folderName: 'Folder2',
    messageId: 2222,
    name: 'File2.pdf',
    size: 2000,
    telegramFileId: '22222',
    thumbURL: 'http://localhost/thumbURL2',
    link: 'http://localhost/link2',
  },
  {
    folderName: 'Folder3',
    messageId: 3333,
    name: 'File3.pdf',
    size: 3000,
    telegramFileId: '33333',
    thumbURL: 'http://localhost/thumbURL3',
    link: 'http://localhost/link3',
  },
]

const defaultProps: Props = {
  files: TEST_FILES,
  selectAll: false,
  onSelect: false,
  onChangeFileName: () => {},
  onDeleteFile: () => {},
  onGetFile: () => {},
  onSelectedChange: () => {},
}

const RenderWithProps = (props?: Partial<Props>) => {
  return render(<Files {...defaultProps} {...props} />)
}

describe('Files component', () => {
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

    expect(container.querySelector('.Files')).toBeInTheDocument()
    expect(container.querySelector('.Files__List')).toBeInTheDocument()
    expect(container.querySelectorAll('.Files__ListItem').length).toEqual(
      TEST_FILES.length
    )
  })

  test('onSelect mode', async () => {
    const onSelectedChange = jest.fn()
    const { container } = RenderWithProps({ onSelect: true, onSelectedChange })

    const fileCheckboxes = container.querySelectorAll('.File__Checkbox')

    expect(fileCheckboxes.length).toEqual(TEST_FILES.length)

    await user.click(fileCheckboxes[0])

    expect(onSelectedChange).toBeCalled()
    expect(onSelectedChange).toBeCalledWith([TEST_FILES[0].telegramFileId])

    onSelectedChange.mockReset()

    await user.click(fileCheckboxes[0])

    expect(onSelectedChange).toBeCalled()
    expect(onSelectedChange).toBeCalledWith([])
  })

  test('edit file name', async () => {
    const onChangeFileName = jest.fn()
    const { container } = RenderWithProps({ onChangeFileName })

    const fileName = TEST_FILES[0].name.slice(0, -4)
    const fileExtention = TEST_FILES[0].name.split('.').reverse()[0]
    const inputFileName = '_test'

    const editBtn = container.querySelectorAll('.File__Icon_edit')[0]
    let fileNameInput
    let saveFileNameBtn

    await user.click(editBtn)

    fileNameInput = container.querySelectorAll('.File__Name_input')[0]
    saveFileNameBtn = container.querySelectorAll('.File__Icon_save')[0]

    const fileNameInputField = fileNameInput?.querySelector('input')

    await user.type(fileNameInputField!, inputFileName)

    await user.click(saveFileNameBtn)

    expect(onChangeFileName).toBeCalled()
    expect(onChangeFileName).toBeCalledTimes(1)
    expect(onChangeFileName).toBeCalledWith(
      TEST_FILES[0].telegramFileId,
      `${fileName}${inputFileName}.${fileExtention}`
    )
  })

  test('delete file', async () => {
    const onDeleteFile = jest.fn()
    const { container } = RenderWithProps({ onDeleteFile })

    const deleteBtn = container.querySelectorAll('.File__Delete')[0]

    await user.click(deleteBtn)

    expect(onDeleteFile).toBeCalled()
    expect(onDeleteFile).toBeCalledTimes(1)
    expect(onDeleteFile).toBeCalledWith(TEST_FILES[0].telegramFileId)
  })

  test('download file', async () => {
    const onGetFile = jest.fn()
    const { container } = RenderWithProps({ onGetFile })

    const downloadBtn = container.querySelectorAll('.File__Download')[0]

    await user.click(downloadBtn)

    expect(onGetFile).toBeCalled()
    expect(onGetFile).toBeCalledTimes(1)
    expect(onGetFile).toBeCalledWith(TEST_FILES[0].telegramFileId)
  })
})
