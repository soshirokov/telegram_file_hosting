import React from 'react'

import { ProfileSettings } from '.'

const defaultProps = {
  chatId: '1111',
  setNewChatId: () => {},
}

export default {
  title: 'ProfileSettings',
  component: ProfileSettings,
}

const Template = (args) => <ProfileSettings {...args} />

export const Primary = Template.bind({})
Primary.args = defaultProps
