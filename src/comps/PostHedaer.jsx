import { Avatar, CardHeader } from '@heroui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function PostHeader(props) {
    const { userPhoto, userName, name, id } = props
    return (
        <CardHeader className="justify-between w-auto">
            <div className="flex gap-3">
                <Link to={"/profile/" + id}>
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={userPhoto}
                    />
                </Link>
                <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-white">{name}</h4>
                    <h5 className="text-small tracking-tight text-gray-500">{userName}</h5>
                </div>
            </div>


        </CardHeader>
    )
}
