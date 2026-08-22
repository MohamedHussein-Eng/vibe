import axios from 'axios'
import { baseUrl } from '../../MainData'
import { useParams } from 'react-router-dom'
import ProfileHeader from '../../comps/Profile/ProfileHeader'
import { useQuery } from '@tanstack/react-query'
import ProfileLoading from '../../comps/Profile/ProfileLoading'
import MyPostsSaved from '../../comps/Profile/PostsSaved'
export default function Profile() {


  const { id } = useParams()



  function getUserData() {
    return axios.get(`${baseUrl}/users/${id}/profile`, {
      headers: {
        "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
      }
    })
  }

  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ["userData", id],
    queryFn: getUserData
  })
  // Fetch User Posts
  function getUserPost() {
    return axios.get(`${baseUrl}/users/${id}/posts`, {
      headers: {
        "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
      }
    })
  }

  const { data, isLoading: postsLoading, isFetching: postsFetching } = useQuery({
    queryKey: ['getuserpost', id],
    queryFn: getUserPost,
    enabled: Boolean(id)
  })




  if (postsFetching || postsLoading || userDataLoading) return <ProfileLoading />


  return (

    <div className='w-full overflow-hidden relative'>
      <ProfileHeader postsCount={data?.data?.data.posts?.length || 0} userData={userData?.data?.data.user} isFollowing={userData?.data?.data.isFollowing} profile={true} />
      <MyPostsSaved posts={data?.data?.data.posts} profile={true} />
    </div>
  )
}