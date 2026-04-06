import axios from 'axios';
import React, { useContext, useState } from 'react'
import { BiSolidImageAdd } from "react-icons/bi";
import { baseUrl } from '../MainData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MdCancel } from "react-icons/md";
import { AuthContext } from '../Context/AuthContext';
import toast from 'react-hot-toast';


export default function CreatePost() {
  const { userData } = useContext(AuthContext)
  const queryClient = useQueryClient();
  const [postbody, setPostBody] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [image, setImage] = useState(null)
  function handleImage(e) {
    if (e.target.files && e.target.files[0]) {
      setPostImage(e.target.files[0]);
      const img = URL.createObjectURL(e.target.files[0])
      setImage(img)
    }
  }
  function handleXBtn() {

    setImage(null)
    setPostImage(null)
  }

  function addPost() {
    const form = new FormData();
    form.append('body', postbody);

    if (postImage) {
      form.append('image', postImage);
    }

    return axios.post(`${baseUrl}/posts`, form, {
      headers: {
        "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data"
      }
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: addPost,
    onSuccess: (req) => {
      queryClient.invalidateQueries({ queryKey: ["GetALLPosts"] });
      setPostBody('');
      setPostImage(null);
      toast.success(req?.data?.message)
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  return (
    <div className="p-6 border-b border-slate-200 dark:border-border-dark">
      <div className="flex gap-4">
        <div className="size-12 rounded-full bg-cover bg-center shrink-0" data-alt="User profile picture" style={{ backgroundImage: `url(${userData.photo})` }} />

        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={postbody}
            onChange={(e) => setPostBody(e.target.value)}
            className="w-full bg-transparent text-white border-none focus:ring-0 text-lg placeholder:text-slate-500 resize-none min-h-[80px]"
            placeholder="What's happening?"
          />

          {postImage && (
            <>
              <div className="text-sm text-primary bg-primary/10 p-2 rounded-lg w-fit">
                Attached: {postImage.name}
              </div>
              <div className='relative h-80  '>
                <img src={image} alt={postImage.name} className='h-full w-full object-cover' />
                <MdCancel onClick={handleXBtn} className='  absolute top-3  right-3' />
              </div>
            </>
          )}


          <div className="flex items-center justify-between border-t border-slate-100 dark:border-border-dark pt-4">
            <div className="flex items-center gap-1">
              <label className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
                <BiSolidImageAdd />
              </label>

            

            </div>
          
            <button
              className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors disabled:opacity-50"
              onClick={() => mutate()}
              disabled={isPending || (!postbody.trim() && !postImage)} // Disable if uploading OR if post is entirely empty
            >
              {isPending ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}