import formidable from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  deleteMessageFromTelegram,
  getFileLinkFromTelegram,
  sendFileToTeleram,
  updateFileInTelegram,
} from 'utils/api/tgAPI'
import { getFileByMessageId, getUserByChatId } from 'utils/firebase-admin'

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
}

export const post = (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    const chatId = Array.isArray(fields.chatId)
      ? fields.chatId[0]
      : fields.chatId
    const folderName = Array.isArray(fields.folderName)
      ? fields.folderName[0]
      : fields.folderName

    const message = await sendFileToTeleram(files.file, chatId, folderName)

    res.status(200).json({ ...message })
  })
}

export const put = (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields) {
    const chatId = Array.isArray(fields.chatId)
      ? fields.chatId[0]
      : fields.chatId
    const fileId = Array.isArray(fields.fileId)
      ? fields.fileId[0]
      : fields.fileId
    const newFileName = Array.isArray(fields.newFileName)
      ? fields.newFileName[0]
      : fields.newFileName
    const messageId = Array.isArray(fields.messageId)
      ? fields.messageId[0]
      : fields.messageId
    const folderName = Array.isArray(fields.folderName)
      ? fields.folderName[0]
      : fields.folderName

    const userId = await getUserByChatId(chatId)
    const file = await getFileLinkFromTelegram(fileId)
    const download = await fetch(file)

    if ((await getFileByMessageId(userId, +messageId)).fromTelegram) {
      const uploadId =
        (await getFileByMessageId(userId, +messageId))?.uploadMessageId ?? 0
      await deleteMessageFromTelegram(chatId, uploadId)
    }

    const response = await updateFileInTelegram(
      download,
      chatId,
      newFileName,
      messageId,
      folderName
    )

    if (response) {
      res.status(200).json(response)
    } else {
      res.status(422).send('Unprocessable Entity')
    }
  })
}

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const fileID = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id

  const file = await getFileLinkFromTelegram(fileID)

  const download = await fetch(file)

  res.status(200).send(download.body)
}

export default function apiGandler(req: NextApiRequest, res: NextApiResponse) {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? put(req, res)
    : req.method === 'DELETE'
    ? console.log('DELETE')
    : req.method === 'GET'
    ? get(req, res)
    : res.status(404).send('')
}
