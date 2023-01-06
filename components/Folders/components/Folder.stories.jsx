import React from 'react'

import { Folder } from './Folder'

const defaultProps = {
  folderName: 'Folder',
  folderId: '1111',
  isSelected: false,
  isUserUploadFolder: false,
  onSelect: false,
  viewMode: false,
  onAddSelectFolder: () => {},
  onChangeFolderName: () => {},
  onClick: () => {},
  onDelete: () => {},
  onRemoveSelectFolder: () => {},
}

export default {
  title: 'Folder',
  component: Folder,
}

const Template = (args) => <Folder {...args} />

export const Primary = Template.bind({})
Primary.args = defaultProps

export const onSelectMode = Template.bind({})
onSelectMode.args = { ...defaultProps, onSelect: true }

export const viewMode = Template.bind({})
viewMode.args = { ...defaultProps, viewMode: true }

export const userUploadFolder = Template.bind({})
userUploadFolder.args = { ...defaultProps, isUserUploadFolder: true }
