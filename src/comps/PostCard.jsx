import React, { useContext, useState } from 'react';
import { Card, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { baseUrl } from '../MainData';
import { AuthContext } from '../Context/AuthContext';
import PostBody from './PostBody';
import PostFooter from './PostFooter';
import Comments from './Comments';
import PostHeader from './PostHedaer';

export default function PostCard({ postData, isDetailsView = false, isLiked: propIsLiked }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userData: { _id: myId } } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(postData.body || "");

  // Support both: isLiked from postData (Home/Details) or direct prop (Feed)
  const { _id, user, body, image, commentsCount, likesCount, sharesCount, isShare, sharedPost, isLiked = false } = postData;
  const finalIsLiked = propIsLiked ?? isLiked;

  // --- Mutations ---
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: () => axios.delete(`${baseUrl}/posts/${_id}`, {
      headers: { "token": localStorage.getItem("token") }
    }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["GetALLPosts"]);
      toast.success(res?.data?.message || "Post deleted");
      if (isDetailsView) navigate('/');
    },
  });

  const { mutate: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: (newText) => axios.put(`${baseUrl}/posts/${_id}`, { body: newText }, {
      headers: { "token": localStorage.getItem("token") }
    }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["GetALLPosts"]);
      setIsEditing(false);
      toast.success(res?.data?.message || "Post updated");
    },
  });


  return (
    <Card className="py-4 w-full md:w-3/4 mx-auto bg-[#101622] border border-slate-800 mb-5 shadow-xl">

      {isShare && (
        <div className="px-4 pb-2 text-slate-400 text-sm italic">
          Shared a post from <span className="text-blue-400">@{sharedPost?.user.name}</span>
        </div>
      )}

      <div className='flex justify-between items-start px-4'>
        <PostHeader
          name={user.name}
          userName={user.username}
          userPhoto={user.photo}
          id={user._id}
        />
        {/* check if this your Post */}
        {myId === user._id && !isEditing && (
          <Popover placement="bottom-end">
            <PopoverTrigger className='text-white '>
              <HiOutlineDotsVertical />
            </PopoverTrigger>
            <PopoverContent className="bg-slate-900 border border-slate-700">
              <div className="px-1 py-2 flex flex-col gap-2">
                <button onClick={() => setIsEditing(true)} className="text-blue-400 text-left font-semibold text-sm hover:bg-slate-800 p-2 rounded">
                  Edit Post
                </button>
                <button onClick={() => deletePost()} disabled={isDeleting} className="text-red-500 text-left font-semibold text-sm hover:bg-slate-800 p-2 rounded">
                  {isDeleting ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* 3. Body / Edit Mode */}
      <div className="mt-3">
        {isEditing ? (
          <div className="px-4">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full p-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
            />
            <div className="flex justify-end gap-3 mt-2">
              <button onClick={() => setIsEditing(false)} className="text-slate-400 text-sm">Cancel</button>
              <button
                onClick={() => updatePost(editBody)}
                disabled={isUpdating}
                className="bg-blue-600 px-4 py-1 rounded-full text-sm font-bold disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <PostBody body={body} image={image} isShare={isShare ?? null} postShareData={sharedPost ?? null} />
        )}
      </div>

      {/* 4. Footer & Interactions */}
      <PostFooter
        likesCount={likesCount}
        shareCount={sharesCount}
        commentCount={commentsCount}
        id={_id}
        isLiked={finalIsLiked}
      />

      {/* 5. Nested Comments for Details View */}
      {isDetailsView && <Comments id={_id} />}
    </Card>
  );
}