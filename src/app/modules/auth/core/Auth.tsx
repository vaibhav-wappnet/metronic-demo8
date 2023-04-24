import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {login, getUserByToken} from './_requests'
import {WithChildren} from '../../../../_metronic/helpers'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  email: UserModel | string
  password: UserModel | string
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  email: 'admin@demo.com',
  password: 'demo',
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const password = initAuthContextPropsState.password
const email = initAuthContextPropsState.email

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider
      value={{auth, email, password, saveAuth, currentUser, setCurrentUser, logout}}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({children}) => {
  const {auth, logout, setCurrentUser} = useAuth()
  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async (apiToken: string) => {
      try {
        if (!didRequest.current) {
          // ------------------LOGIN BUT TWO API CALLS--------------------
          // const {data} = await getUserByToken(apiToken)
          // console.log(apiToken)
          // if (data) {
          //   setCurrentUser(data)
          // }

          // ------------------LOGIN BUT LOGOUT ON REFRESH--------------------
          const auth = await login(email, password)
          console.log('Auth data:', auth)
          if (auth) {
            const {api_token} = auth.data
            const {data} = await getUserByToken(api_token)
            console.log(data)
            console.log(auth)
            setCurrentUser(data)
            return auth
          }

          // ----------------- CHAT-GPT SOLUTOIN ---------------------
          // const result = await login(email, password)
          // if (result && result.data) {
          //   // check if 'result' and 'auth' are defined
          //   const userResult = await getUserByToken(apiToken)
          //   console.log(userResult)
          //   if (userResult && userResult.data) {
          //     // check if 'userResult' and 'data' are defined
          //     const user = userResult.data
          //     setCurrentUser(user)
          //   }
          // }
        }
      } catch (error) {
        console.error(error)
        if (!didRequest.current) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (auth && auth.api_token) {
      requestUser(auth.api_token)
    } else {
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
