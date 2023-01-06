import React from 'react'

import { File } from './File'

const defaultProps = {
  name: 'File1.pdf',
  isSelected: false,
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

export default {
  title: 'File',
  component: File,
}

const Template = (args) => <File {...args} />

export const Primary = Template.bind({})
Primary.args = defaultProps

export const onSelectMode = Template.bind({})
onSelectMode.args = { ...defaultProps, onSelect: true }

export const bigSize = Template.bind({})
bigSize.args = { ...defaultProps, size: 51 * 1024 * 1024 }

export const noThumb = Template.bind({})
noThumb.args = { ...defaultProps, thumbURL: '' }
