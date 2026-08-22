import axios from 'axios'
import { baseUrl } from '../MainData'
export function fetchSinglePost(id) {
  return axios.get(`${baseUrl}/posts/${id}`, {
    headers: {
      "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
    }
  })
}