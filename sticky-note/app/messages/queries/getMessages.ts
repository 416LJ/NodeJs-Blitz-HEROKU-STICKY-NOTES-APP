import db from "db"

export default async function getMessages(args: undefined) {
  const messages = await db.message.findMany()
  return messages
}
