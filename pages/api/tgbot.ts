import { NextApiRequest, NextApiResponse } from 'next'
import { Telegraf } from 'telegraf'

import { FileServer } from 'types/File'
import { FolderServer } from 'types/Folder'

import { replyMessageToTelegram } from 'utils/api/tgAPI'
import { getFolder, getUserUploadFolderId, setFile } from 'utils/firebase-admin'

const bot = new Telegraf(process.env.BOT_TOKEN ?? '')

const onDocumentHandler = async (ctx: any) => {
  console.log('Doc handler start')

  const chatId = ctx.update.message.chat.id.toString()

  console.log('Doc handler chatID: ', chatId)

  // const userId = await getUserByChatId(chatId)

  const userId = 'efQqal5ESCWYIwu3I7otyNVMFSj2'

  console.log('Doc handler get params')

  const uploadFolderId = await getUserUploadFolderId(userId)
  const uploadFolder: FolderServer = await getFolder(userId, uploadFolderId)

  console.log('Doc handler get reply message')

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

  console.log('Doc handler save file')

  const fileId = ctx.update.message.document.file_id

  await setFile(userId, fileId, file)

  console.log('Doc handler comleted')
}

bot.start((ctx) => ctx.reply(ctx.chat.id.toString()))

bot.on('document', async (ctx) => {
  await onDocumentHandler(ctx)
})

const tgBot = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.setWebhook === 'true') {
    await bot.telegram.setWebhook(`${process.env.URL}/api/tgbot`)
  }

  if (req.method === 'POST') {
    bot.handleUpdate(req.body)
  }

  return res.status(200).send('OK')
}

export default tgBot
