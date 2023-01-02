import React from 'react'

import { Folders } from '.'

const TEST_FOLDERS = [
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

const defaultProps = {
  folders: TEST_FOLDERS,
  onSelect: false,
  viewMode: false,
  onChangeFolderName: () => {},
  onClickFolder: () => {},
  onDeleteFolder: () => {},
  onSelectedChange: () => {},
}

export default {
  title: 'Folders',
  component: Folders,
}

const Template = (args) => <Folders {...args} />

export const Primary = Template.bind({})
Primary.args = defaultProps

export const onSelectMode = Template.bind({})
onSelectMode.args = { ...defaultProps, onSelect: true }

export const viewMode = Template.bind({})
viewMode.args = { ...defaultProps, viewMode: true }
