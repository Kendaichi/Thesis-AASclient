import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT':
      return { wallet: action.payload }
    case 'DISCONNECT':
      return { wallet: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { 
      wallet: null
    })

    // check if wallet is connected on page refresh based on local storage data
    useEffect(() => {
        const wallet = JSON.parse(localStorage.getItem('wallet'))

        if (wallet) {
          dispatch({ type: 'CONNECT', payload: wallet }) 
        }
    }, [])

    console.log('AuthContext state:', state)
    
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
        { children }
        </AuthContext.Provider>
    )

}