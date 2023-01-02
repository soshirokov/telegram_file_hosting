import React from 'react'

import { FileUploader } from '.'

const defaultProps = {
  action: '/test',
  data: {},
  disabled: false,
  onNewFile: () => {},
}

export default {
  title: 'FileUploader',
  component: FileUploader,
}

const Template = (args) => <FileUploader {...args} />

export const Primary = Template.bind({})
Primary.args = defaultProps

export const Disabled = Template.bind({})
Disabled.args = { ...defaultProps, disabled: true }
