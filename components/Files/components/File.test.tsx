import { render } from '@testing-library/react'

import user from '@testing-library/user-event'

import { converFromBToMb } from 'helpers/converters'

import { BIG_FILE_SIZE, File, Props } from './File'

const defaultProps: Props = {
  name: 'File1.pdf',
  onSelect: false,
  size: 1000,
  telegramFileId: '1111',
  thumbURL: 'http://localhost',
  onAddSelectFile: () => {},
  onChangeFileName: () => {},
  onDeleteFile: () => {},
  onGetFile: () => {},
  onRemoveSelectFile: () => {},
}

const RenderWithProps = (props?: Partial<Props>) => {
  return render(<File {...defaultProps} {...props} />)
}

describe('File component', () => {
  test('render with baseProps', () => {
    const { container } = RenderWithProps()

    // Render all base elements
    expect(container.querySelector('.File')).toBeInTheDocument()
    expect(container.querySelector('.File__Desc')).toBeInTheDocument()
    expect(container.querySelector('.File__Thumb')).toBeInTheDocument()
    expect(container.querySelector('.File__Name')).toBeInTheDocument()
    expect(container.querySelector('.File__Icon_edit')).toBeInTheDocument()
    expect(container.querySelector('.File__Size')).toBeInTheDocument()
    expect(container.querySelector('.File__Actions')).toBeInTheDocument()
    expect(container.querySelector('.File__Download')).toBeInTheDocument()
    expect(container.querySelector('.File__Delete')).toBeInTheDocument()

    // Render props
    expect(
      container.querySelector('.File__Thumb')?.getAttribute('style')
    ).toEqual(`background-image: url(${defaultProps.thumbURL});`)
    expect(container.querySelector('.File__Name')?.innerHTML).toEqual(
      defaultProps.name
    )
    expect(container.querySelector('.File__Size')?.innerHTML).toEqual(
      `${converFromBToMb(defaultProps.size)}Mb`
    )
  })

  test('render file icon, if no thumb', () => {
    const { container } = RenderWithProps({ thumbURL: '' })

    expect(container.querySelector('.File__Thumb')).not.toBeInTheDocument()
    expect(container.querySelector('.File__Icon')).toBeInTheDocument()
  })

  test('onSelect mode', async () => {
    const onAddSelectFile = jest.fn()
    const onRemoveSelectFile = jest.fn()

    const { container } = RenderWithProps({
      onSelect: true,
      onAddSelectFile,
      onRemoveSelectFile,
    })

    let checkbox = container.querySelector('.File__Checkbox')

    expect(container.querySelector('.File_select')).toBeInTheDocument()
    expect(container.querySelector('.File__Icon_edit')).not.toBeInTheDocument()
    expect(container.querySelector('.File__Actions')).not.toBeInTheDocument()
    expect(container.querySelector('.File__Download')).not.toBeInTheDocument()
    expect(container.querySelector('.File__Delete')).not.toBeInTheDocument()
    expect(checkbox).toBeInTheDocument()

    await user.click(checkbox!)

    checkbox = container.querySelector('.File__Checkbox')

    expect(onAddSelectFile).toBeCalled()
    expect(onAddSelectFile).toBeCalledWith(defaultProps.telegramFileId)

    await user.click(checkbox!)

    checkbox = container.querySelector('.File__Checkbox')

    expect(onRemoveSelectFile).toBeCalled()
    expect(onRemoveSelectFile).toBeCalledWith(defaultProps.telegramFileId)
  })

  test('edit file name', async () => {
    const onChangeFileName = jest.fn()
    const { container } = RenderWithProps({ onChangeFileName })

    const fileName = defaultProps.name.slice(0, -4)
    const fileExtention = defaultProps.name.split('.').reverse()[0]
    const inputFileName = '_test'

    const editBtn = container.querySelector('.File__Icon_edit')
    let fileNameInput = container.querySelector('.File__Name_input')
    let saveFileNameBtn = container.querySelector('.File__Icon_save')

    expect(fileNameInput).not.toBeInTheDocument()
    expect(saveFileNameBtn).not.toBeInTheDocument()

    await user.click(editBtn!)

    fileNameInput = container.querySelector('.File__Name_input')
    saveFileNameBtn = container.querySelector('.File__Icon_save')

    expect(fileNameInput).toBeInTheDocument()
    expect(saveFileNameBtn).toBeInTheDocument()

    const fileNameInputField = fileNameInput?.querySelector('input')

    await user.type(fileNameInputField!, inputFileName)

    expect(fileNameInputField?.value).toEqual(fileName + inputFileName)

    await user.click(saveFileNameBtn!)

    fileNameInput = container.querySelector('.File__Name_input')
    saveFileNameBtn = container.querySelector('.File__Icon_save')

    expect(fileNameInput).not.toBeInTheDocument()
    expect(saveFileNameBtn).not.toBeInTheDocument()
    expect(onChangeFileName).toBeCalled()
    expect(onChangeFileName).toBeCalledTimes(1)
    expect(onChangeFileName).toBeCalledWith(
      defaultProps.telegramFileId,
      `${fileName}${inputFileName}.${fileExtention}`
    )
  })

  test('delete file', async () => {
    const onDeleteFile = jest.fn()
    const { container } = RenderWithProps({ onDeleteFile })

    const deleteBtn = container.querySelector('.File__Delete')

    await user.click(deleteBtn!)

    expect(onDeleteFile).toBeCalled()
    expect(onDeleteFile).toBeCalledTimes(1)
    expect(onDeleteFile).toBeCalledWith(defaultProps.telegramFileId)
  })

  test('download file', async () => {
    const onGetFile = jest.fn()
    const { container } = RenderWithProps({ onGetFile })

    const downloadBtn = container.querySelector('.File__Download')

    await user.click(downloadBtn!)

    expect(onGetFile).toBeCalled()
    expect(onGetFile).toBeCalledTimes(1)
    expect(onGetFile).toBeCalledWith(defaultProps.telegramFileId)
  })

  test('big file should not be available to rename', async () => {
    const { container } = RenderWithProps({
      size: (BIG_FILE_SIZE + 1) * 1024 * 1024,
    })

    const editBtn = container.querySelector('.File__Icon_edit')
    let fileNameInput = container.querySelector('.File__Name_input')
    let saveFileNameBtn = container.querySelector('.File__Icon_save')

    expect(fileNameInput).not.toBeInTheDocument()
    expect(saveFileNameBtn).not.toBeInTheDocument()

    await user.click(editBtn!)

    fileNameInput = container.querySelector('.File__Name_input')
    saveFileNameBtn = container.querySelector('.File__Icon_save')

    expect(fileNameInput).not.toBeInTheDocument()
    expect(saveFileNameBtn).not.toBeInTheDocument()
  })
})
