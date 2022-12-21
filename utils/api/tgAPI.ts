import fs from 'fs'
import { Telegraf } from 'telegraf'

import { generateCaption } from 'helpers/generators'

const bot = new Telegraf(process.env.BOT_TOKEN ?? '')

bot.telegram.setWebhook(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/tgbot`)

export const sendFileToTeleram = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
  chatId: string,
  folderName: string
) => {
  const document = fs.readFileSync(file.filepath)

  const caption = generateCaption(folderName)

  const sended = await bot.telegram.sendDocument(
    chatId,
    {
      source: document,
      filename: file.originalFilename,
    },
    { caption }
  )

  return sended
}

export const updateFileInTelegram = async (
  file: Response,
  chatId: string,
  newFileName: string,
  messageId: string,
  folderName: string
) => {
  const b = await file.arrayBuffer()
  const buffer = Buffer.from(b)

  const caption = generateCaption(folderName)

  try {
    await bot.telegram.deleteMessage(chatId, +messageId)

    const response = await bot.telegram.sendDocument(
      chatId,
      {
        source: buffer,
        filename: newFileName,
      },
      { caption }
    )

    return response
  } catch {
    return null
  }
}

export const changeMessageCaption = (
  chatId: string,
  messageId: number,
  caption: string
) =>
  bot.telegram.editMessageCaption(
    chatId,
    messageId,
    '',
    generateCaption(caption)
  )

export const changeMessage = (
  chatId: string,
  messageId: number,
  folderName: string
) => {
  const caption = generateCaption(folderName)

  return bot.telegram.editMessageText(chatId, messageId, '', caption)
}

export const getFileLinkFromTelegram = (fileId: string | undefined) =>
  bot.telegram.getFileLink(fileId ?? '')

export const replyMessageToTelegram = (
  chatId: string,
  replyTo: number,
  text = '',
  folderName = ''
) => {
  const caption = generateCaption(folderName)
  const message = `${text} ${caption}`

  return bot.telegram.sendMessage(chatId, message, {
    reply_to_message_id: replyTo,
  })
}

export const deleteMessageFromTelegram = (
  chatId: string,
  messageId: number
) => {
  bot.telegram.deleteMessage(chatId, messageId)
}
