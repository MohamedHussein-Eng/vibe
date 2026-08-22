import React from 'react'
import axios from 'axios'
import { baseUrl } from '../../MainData'

import { Link, useParams } from 'react-router-dom'
import { Button } from '@heroui/react'

import MyPostsSaved from '../../comps/Profile/Posts_&Saved'
import ProfileHeader from '../../comps/Profile/ProfileHeader'
import { useQuery } from '@tanstack/react-query'
import ProfileLoading from '../../comps/Profile/ProfileLoading'
export default function Profile() {
 
  
  const{id}=useParams()



  function getUserData()

  {
    return axios.get(`${baseUrl}/users/${id}/profile`,{
      headers: {
        "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
      }
    })
  }

  const {data:userData,isLoading:userDataLoading}=useQuery({
    queryKey:["userData",id],
    queryFn:getUserData
  })
  // Fetch User Posts
  function getUserPost() {
    return axios.get(`${baseUrl}/users/${id}/posts`, {
      headers: {
        "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
      }
    })
  }

  const { data , isLoading:postsLoading , isFetching:postsFetching } = useQuery({
    queryKey: ['getuserpost'],
    queryFn: getUserPost
  })




if(postsFetching||postsLoading||userDataLoading) return<ProfileLoading/>


  return (
   
    <div className='w-full overflow-hidden relative'>
    <ProfileHeader postsCount={data?.data?.data.posts?.length || 0} userData={userData?.data?.data.user} isFollowing={userData?.data?.data.isFollowing}  profile={true}/>
   <MyPostsSaved posts={data?.data?.data.posts}  profile={true}/>
    </div>
  )
}