import React from 'react'

import { LoginForm } from '.'

const defaultProps = {
  onAuth: () => {},
}

export default {
  title: 'LoginForm',
  component: LoginForm,
}

const Template = (args) => <LoginForm {...args} />

export const Primary = Template.bind({})
Primary.args = defaultProps
