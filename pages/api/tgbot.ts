import { format } from 'date-fns'
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
  await saveFile(
    {
      chatId: ctx.update.message.chat.id.toString(),
      messageId: ctx.update.message.message_id,
    },
    {
      fileName: ctx.update.message.document.file_name ?? '',
      fileSize: ctx.update.message.document.file_size ?? 0,
      fileId: ctx.update.message.document.file_id,
      fileThumbId: ctx.update.message.document.thumb?.file_id ?? '',
    }
  )
})

bot.on(message('photo'), async (ctx) => {
  const photoThumb = ctx.update.message.photo.slice(1)[0]
  const photoFile = ctx.update.message.photo.slice(-1)[0]
  const photoFileName =
    format(new Date(ctx.update.message.date * 1000), 'HH.mm_dd.MM.yyyy') +
    '.jpg'

  await saveFile(
    {
      chatId: ctx.update.message.chat.id.toString(),
      messageId: ctx.update.message.message_id,
    },
    {
      fileName: photoFileName,
      fileSize: photoFile?.file_size ?? 0,
      fileId: photoFile.file_id,
      fileThumbId: photoThumb.file_id,
    }
  )
})

const saveFile = async (
  messageInfo: {
    chatId: string
    messageId: number
  },
  fileInfo: {
    fileName: string
    fileSize: number
    fileId: string
    fileThumbId: string
  }
) => {
  const userId = await getUserByChatId(messageInfo.chatId)

  const uploadFolderId = await getUserUploadFolderId(userId)
  const uploadFolder: FolderServer = await getFolder(userId, uploadFolderId)

  const message = await replyMessageToTelegram(
    messageInfo.chatId,
    messageInfo.messageId,
    'Uploaded in ',
    uploadFolder.name
  )

  const file: FileServer = {
    folderId: uploadFolderId,
    folderName: uploadFolder.name,
    name: fileInfo.fileName,
    size: fileInfo.fileSize,
    messageId: message.message_id ?? 0,
    thumbId: fileInfo.fileThumbId,
    fromTelegram: true,
    uploadMessageId: messageInfo.messageId,
  }

  await setFile(userId, fileInfo.fileId, file)
}

const tgBot = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.setWebhook === 'true') {
    await bot.telegram.setWebhook(`${process.env.URL}/api/tgbot`)

    return res.status(200).send('OK')
  }

  if (req.method === 'POST') {
    bot.handleUpdate(req.body, res.status(200))
  } else {
    return res.status(200).send('OK')
  }
}

export default tgBot
