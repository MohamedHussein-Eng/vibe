import React, { useContext, useState } from 'react' // 1. Added useState
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { baseUrl } from '../../MainData'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@heroui/react'
import { fetchSinglePost } from '../Detalies/Details'
import SharePostBody from '../../comps/SharePostBody'
import LoaderHome from '../../comps/LoaderHome'
import { AuthContext } from '../../Context/AuthContext'
import toast from 'react-hot-toast'

export default function SharePost() {
    const { id } = useParams()
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {userData:me}=useContext(AuthContext)
    // 2. State to hold the user's input
    const [comment, setComment] = useState("");

    const { data } = useQuery({
        queryKey: ["getSinglePost", id],
        queryFn: () => fetchSinglePost(id),
    });

    // 3. Updated Mutation to send the 'body'
    const { mutate, isPending } = useMutation({
    mutationFn: (content) => {
        const requestData = content.trim() ? { body: content } : {};

        return axios.post(`${baseUrl}/posts/${id}/share`, 
            requestData, 
            { headers: { "token": localStorage.getItem("token") } }
        );
    },
        onSuccess: (req) => {
            
            toast.success(req?.data.message)
            queryClient.invalidateQueries({ queryKey: ["GetALLPosts"] });
            queryClient.invalidateQueries({ queryKey: ["feedHome"] });

             navigate('/'); 
        },
        onError:(error)=>{console.log(error.name);
        }
    });


    const post = data?.data?.data.post;
    const contentToShow = post?.isShare ? post.sharedPost : post;
   
    
    return (
        <div className="flex justify-center my-10 px-4">
            <div className="relative w-full max-w-2xl bg-[#192233] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800">
                <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-primary">Re-post</h2>
                </header>

                <div className="p-6">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-shrink-0">
                            <div className="size-10 rounded-full" style={{ backgroundImage: `url(${me.photo})` }} />
                        </div>
                        <div className="flex-grow">
                            {/* 4. Controlled Textarea */}
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-slate-400 resize-none min-h-[80px]" 
                                placeholder="What's on your mind? (Optional)" 
                            />
                        </div>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden pointer-events-none opacity-80">
                         <SharePostBody 
                            userData={contentToShow?.user} 
                            body={contentToShow?.body} 
                            image={contentToShow?.image} 
                        />
                    </div>
                </div>

                <footer className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
                    <Button 
                        onPress={() => mutate(comment||"")} // 5. Pass state to mutate
                        isLoading={isPending}
                        color="primary"
                        className="rounded-full font-bold px-8"
                    >
                        Post Share
                    </Button>
                </footer>
            </div>
        </div>
    )
}