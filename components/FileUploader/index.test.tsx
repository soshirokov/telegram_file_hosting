import { render } from '@testing-library/react'

import { FileUploader, Props } from '.'

const defaultProps: Props = {
  action: '/test',
  data: {},
  disabled: false,
  onNewFile: () => {},
}

const RenderWithProps = (props?: Partial<Props>) => {
  return render(<FileUploader {...defaultProps} {...props} />)
}

describe('FileUploader component', () => {
  test('render with baseProps', () => {
    const { container } = RenderWithProps()

    expect(container.querySelector('.FileUploader')).toBeInTheDocument()
    expect(container.querySelector('.FileUploader__Icon')).toBeInTheDocument()
    expect(container.querySelector('.FileUploader__Text')).toBeInTheDocument()
    expect(container.querySelector('.FileUploader__Desc')).toBeInTheDocument()
  })
})
