import React from 'react'
import LoaderHome from '../../comps/LoaderHome'
import { useQuery } from '@tanstack/react-query'
import PostCard from '../../comps/PostCard'
import { useParams } from 'react-router-dom'
import { fetchSinglePost } from '../../utils/Singlepost'


export default function Details() {
  const { id } = useParams()


  const { data, isError, isFetching } = useQuery({

    queryKey: ["getSinglePost"],
    queryFn: () => fetchSinglePost(id)
  })



  if (isFetching) return <LoaderHome from={"details"} />
  if (isError) return "Error"
  return (
    <div className='my-10'>

      <PostCard
        key={data?.data?.data.post.id}
        postData={data?.data?.data.post}
        isDetailsView={true}
      />

    </div>
  )
}
