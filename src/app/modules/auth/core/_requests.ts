import axios from 'axios'
import {AuthModel, UserModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
// export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}`

export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  })
}

// export async function login(email: string, password: string) {
//   try {
//     const response = await axios.post<AuthModel>(LOGIN_URL, {
//       email,
//       password,
//     })
//     const {api_token} = response.data
//     console.log('Response : ', response.data)
//     await axios.post<AuthModel>(`${API_URL}/verify_token`, {
//       // logged_user: user,
//       api_token: response.data.api_token,
//     })
//     console.log('user api_key:', response.data.api_token)
//     console.log('user data:', response.data)
//     return response.data
//   } catch (error) {
//     console.log('Error:', error)
//   }
// }

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}
// export function getUserByToken(token: string) {
//   return axios.post<UserModel>(LOGIN_URL, {
//     api_token: token,
//   })
// }
