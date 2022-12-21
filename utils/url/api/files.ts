export const fileEntry = (fileId: string) => `/api/tgfiles?id=${fileId}`

export const files = () => '/api/tgfiles'

// eslint-disable-next-line import/no-anonymous-default-export
export default { fileEntry, files }
