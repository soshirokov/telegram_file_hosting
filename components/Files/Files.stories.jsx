import React from 'react'

import { Files } from '.'

const TEST_FILES = [
  {
    folderName: 'Folder1',
    messageId: 1111,
    name: 'File1.pdf',
    size: 1000,
    telegramFileId: '11111',
    thumbURL: 'https://picsum.photos/200?id=1',
    link: 'https://picsum.photos/200?id=1',
  },
  {
    folderName: 'Folder2',
    messageId: 2222,
    name: 'File2.pdf',
    size: 2000,
    telegramFileId: '22222',
    thumbURL: 'https://picsum.photos/200?id=2',
    link: 'https://picsum.photos/200?id=2',
  },
  {
    folderName: 'Folder3',
    messageId: 3333,
    name: 'File3.pdf',
    size: 3000,
    telegramFileId: '33333',
    thumbURL: 'https://picsum.photos/200?id=3',
    link: 'https://picsum.photos/200?id=3',
  },
]

const defaultProps = {
  files: TEST_FILES,
  selectAll: false,
  onSelect: false,
  onChangeFileName: () => {},
  onDeleteFile: () => {},
  onGetFile: () => {},
  onSelectedChange: () => {},
}

export default {
  title: 'Files',
  component: Files,
}

const Template = (args) => <Files {...args} />

export const Primary = Template.bind({})
Primary.args = defaultProps

export const onSelectMode = Template.bind({})
onSelectMode.args = { ...defaultProps, onSelect: true }
