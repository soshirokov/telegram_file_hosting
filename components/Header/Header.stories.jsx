import React from 'react'

import { Header } from '.'

const defaultProps = {
  currentFolderName: 'Folder 1',
  isActive: false,
  modalEntry: <></>,
  modalIsOpen: false,
  modalTitle: 'Modal Title',
  prevFolder: '1111',
  onAddFolder: () => {},
  onClickFolder: () => {},
  onDeleteSelected: () => {},
  onModalCancel: () => {},
  onModalSubmit: () => {},
  onMoveSelected: () => {},
  onToSelect: () => {},
}

export default {
  title: 'Header',
  component: Header,
}

const Template = (args) => <Header {...args} />

export const Primary = Template.bind({})
Primary.args = defaultProps

export const noCurrentFolder = Template.bind({})
noCurrentFolder.args = { ...defaultProps, currentFolderName: '' }

export const openModal = Template.bind({})
openModal.args = { ...defaultProps, modalIsOpen: true }
