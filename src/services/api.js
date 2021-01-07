import axios from 'axios'

const API_URL = 'https://api.coingecko.com/api/v3'

export default () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
