import type { NextApiRequest, NextApiResponse } from 'next'

import {
  changeMessage,
  changeMessageCaption,
  deleteMessageFromTelegram,
  replyMessageToTelegram,
} from 'utils/api/tgAPI'
import { uploadFileId } from 'utils/firebase'
import { getFileByMessageId, getUserByChatId } from 'utils/firebase-admin'

export const post = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body?.replyTo && req.body?.chatId) {
    const message = await replyMessageToTelegram(
      req.body.chatId,
      +req.body.replyTo
    )
    res.status(200).json(message)
  } else {
    res.status(422).send('Unprocessable Entity')
  }
}

export const put = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body?.chatId && req.body?.messageId) {
    const userId = await getUserByChatId(req.body.chatId)

    if ((await getFileByMessageId(userId, +req.body.messageId)).fromTelegram) {
      const message = await changeMessage(
        req.body.chatId,
        +req.body.messageId,
        req.body.caption || 'Main'
      )
      res.status(200).json(message)
    } else {
      const message = await changeMessageCaption(
        req.body.chatId,
        +req.body.messageId,
        req.body.caption || 'Main'
      )
      res.status(200).json(message)
    }
  } else {
    res.status(422).send('Unprocessable Entity')
  }
}

export const remove = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body?.messageId && req.body?.chatId) {
    const userId = await getUserByChatId(req.body.chatId)

    if ((await getFileByMessageId(userId, +req.body.messageId)).fromTelegram) {
      const uploadId = await uploadFileId(userId, +req.body.messageId)
      await deleteMessageFromTelegram(req.body?.chatId, +req.body?.messageId)
      const message = await deleteMessageFromTelegram(
        req.body?.chatId,
        uploadId
      )

      res.status(200).json(message)
    } else {
      const message = await deleteMessageFromTelegram(
        req.body?.chatId,
        +req.body?.messageId
      )
      res.status(200).json(message)
    }
  } else {
    res.status(422).send('Unprocessable Entity')
  }
}

export default function apiGandler(req: NextApiRequest, res: NextApiResponse) {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? put(req, res)
    : req.method === 'DELETE'
    ? remove(req, res)
    : req.method === 'GET'
    ? console.log('GET')
    : res.status(404).send('')
}
