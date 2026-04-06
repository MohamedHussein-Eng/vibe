import axios from 'axios'
import { baseUrl } from '../MainData'

export function notiUnreadCount() {
    return axios.get(`${baseUrl}/notifications/unread-count`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
}

export function getAllNotification() {
    return axios.get(`${baseUrl}/notifications`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )
}

export function makeAllAsRead() {
    return axios.patch(`${baseUrl}/notifications/read-all`, {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )
}
