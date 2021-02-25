import db from "db"
import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

type Params = {
  name: string
  email: string
  lng: number
  lat: number
  message: string
}
export default async function createMessage(data: Params) {
  const message = await db.message.create({ data })
  const mail = {
    to: data.email,
    from: "ladchumeharan.jeyasingsm@uoit.net",
    subject: "Message Posted!",
    text: `Hello ${message.name}, your message "${message.message}" has been posted at Longitude: ${message.lng} and Latitude: ${message.lat}. Thanks!`,
  }
  await sgMail.send(mail)
  return message
}
