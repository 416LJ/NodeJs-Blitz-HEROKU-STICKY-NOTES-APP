import { useState, useEffect } from "react"
import { Coords } from "../helpers/distance"

type State = {
  location: Coords | null
  error: string | null
  loading: boolean
}

export default function useCurrentLocation() {
  const [{ location, loading, error }, setState] = useState<State>({
    location: null,
    error: null,
    loading: true,
  })

  const handleSuccess = ({ coords: { latitude, longitude } }) => {
    setState({
      location: { lat: latitude, lng: longitude },
      error: null,
      loading: false,
    })
  }

  const handleError = (error: { message: string }) =>
    setState({
      error: error.message,
      loading: false,
      location: null,
    })

  useEffect(() => {
    const { geolocation, permissions } = navigator

    if (!geolocation) {
      return handleError(new Error("Geolocation not supported by browser."))
    }

    const get = async () => {
      const res = await permissions.query({ name: "geolocation" })
      geolocation.getCurrentPosition(handleSuccess, handleError, {})
    }

    get()
  }, [])

  return { location, loading, error }
}
