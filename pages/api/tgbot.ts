import { NextApiRequest, NextApiResponse } from 'next'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

import { FileServer } from 'types/File'
import { FolderServer } from 'types/Folder'

import { replyMessageToTelegram } from 'utils/api/tgAPI'
import {
  getFolder,
  getUserByChatId,
  getUserUploadFolderId,
  setFile,
} from 'utils/firebase-admin'

const bot = new Telegraf(process.env.BOT_TOKEN ?? '')

bot.start((ctx) => ctx.reply(ctx.chat.id.toString()))

bot.on(message('document'), async (ctx) => {
  const chatId = ctx.update.message.chat.id.toString()

  const userId = await getUserByChatId(chatId)

  const uploadFolderId = await getUserUploadFolderId(userId)
  const uploadFolder: FolderServer = await getFolder(userId, uploadFolderId)

  const message = await replyMessageToTelegram(
    chatId,
    ctx.message.message_id,
    'Uploaded in ',
    uploadFolder.name
  )

  const file: FileServer = {
    folderId: uploadFolderId,
    folderName: uploadFolder.name,
    name: ctx.update.message.document.file_name ?? '',
    size: ctx.update.message.document.file_size ?? 0,
    messageId: message.message_id ?? 0,
    thumbId: ctx.update.message.document.thumb?.file_id ?? '',
    fromTelegram: true,
    uploadMessageId: ctx.message.message_id ?? 0,
  }

  const fileId = ctx.update.message.document.file_id

  await setFile(userId, fileId, file)
})

const tgBot = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.setWebhook === 'true') {
    await bot.telegram.setWebhook(`${process.env.URL}/api/tgbot`)

    return res.status(200).send('OK')
  }

  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(JSON.parse(req.body))
      return { statusCode: 200, body: '' }
    } catch (e) {
      console.error('error in handler:', e)
      return {
        statusCode: 400,
        body: 'This endpoint is meant for bot and telegram communication',
      }
    }
  }
}

export default tgBot
