import { AuthContext } from "../Context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
  // useContext is a hook that allows us to access the context
  const context = useContext(AuthContext)

  if(!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }

  return context
}