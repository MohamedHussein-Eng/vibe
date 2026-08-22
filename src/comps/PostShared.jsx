import { Card } from '@heroui/react'
import React from 'react'
import PostHeader from './PostHedaer'
import PostBody from './PostBody'
import { Link } from 'react-router-dom'
import { FaArrowRightArrowLeft } from "react-icons/fa6";


export default function PostSharedCard({ postShareData: { user, body, image, _id } }) {
    return (
        <Card className="py-4 w-full h-auto bg-[#101622] border border-slate-800 mb-5 shadow-xl">
            <div className='flex justify-between items-start px-4'>
                <PostHeader
                    name={user.name}
                    userName={user.username}
                    userPhoto={user.photo}
                    id={user._id}
                />
                <div >
                    <Link to={'/details/' + _id}><p className='flex items-center gap-2 text-primary-600 text-sm font-bold'>View Original Post
                        <FaArrowRightArrowLeft /> </p></Link>

                </div>
            </div>
            <PostBody body={body} image={image} />
        </Card>
    )
}
