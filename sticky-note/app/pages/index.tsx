import { useMutation, invokeWithMiddleware } from "blitz"
import Layout from "app/core/layouts/Layout"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import useCurrentLocation from "app/core/hooks/useCurrentLocation"
import { Coords } from "app/core/helpers/distance"
import { Form, Field } from "react-final-form"
import createMessage from "app/messages/mutations/createMessage"
import getMessages from "app/messages/queries/getMessages"
import styles from "./home.module.css"

const containerStyle = {
  width: "600px",
  height: "600px",
  margin: "auto",
}

export const getServerSideProps = async ({ req, res }) => {
  const messages = await invokeWithMiddleware(getMessages, undefined, { req, res })
  return { props: { messages } }
}

const Home = ({ messages }) => {
  const { location, loading, error } = useCurrentLocation()
  const [createMessageMutation] = useMutation(createMessage)

  if (!location || loading) return <div>Loading...</div>
  if (error) return <div>{{ error }}</div>

  const onSubmit = async (values: { name: string; email: string; message: string }) => {
    try {
      await createMessageMutation({
        ...values,
        ...location,
      })
      alert("Submitted!")
      // eslint-disable-next-line no-self-assign
      window.location = window.location
    } catch (err) {
      alert("Failed to submit.")
    }
  }

  return (
    <main className={styles.main}>
      <header>
        <h1>Sticky Note</h1>
      </header>
      <Map location={location}>
        {messages.map((message) => (
          <Marker
            position={{ lng: message.lng, lat: message.lat }}
            onClick={() => alert(`${message.name} said: ${message.message}`)}
          ></Marker>
        ))}
      </Map>
      <div>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <h3>Post Message on Location</h3>
              <div className={styles.fieldSet}>
                <label>Your Name</label>
                <Field name="name" component="input" placeholder="Your Name" />
              </div>
              <div className={styles.fieldSet}>
                <label>Email Address</label>
                <Field name="email" component="input" placeholder="Email Address" />
              </div>
              <div className={styles.fieldSet}>
                <label>Message</label>
                <Field name="message" component="textarea" placeholder="Message" />
              </div>
              <button type="submit" onSubmit={handleSubmit}>
                Submit
              </button>
            </form>
          )}
        />
      </div>
    </main>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

const Map: React.FC<{ location: Coords }> = ({ children, location }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
  })

  if (!isLoaded) return <div>Loading...</div>
  if (loadError) return <div>{{ loadError }}</div>
  console.log(location)
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
      {children}
    </GoogleMap>
  )
}

export default Home
