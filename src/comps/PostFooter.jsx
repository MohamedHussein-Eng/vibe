import { CardFooter, Spinner
} from "@heroui/react";
import axios from 'axios'
import React from 'react'
import { AiFillLike } from 'react-icons/ai'
import { BiCommentAdd } from 'react-icons/bi'
import { FaRegBookmark } from 'react-icons/fa'
import { TbMessage2Share } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { baseUrl } from '../MainData'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Details from "../pages/Detalies/Details";

export default function PostFooter(props) {
  const { likesCount, shareCount, commentCount, id } = props;
  const queryClient = useQueryClient()
  function like_un() {
    return axios.put(`${baseUrl}/posts/${id}/like`, {},
      {
        headers:
        {
          "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
  }
  const { mutate:like,isPending:isLiking} = useMutation(
    {
      mutationFn: like_un,
      onSuccess: (req) => {
        console.log(req);
        
        queryClient.invalidateQueries({ queryKey: ["GetALLPosts"] });
        queryClient.invalidateQueries({ queryKey: ["feedHome"] });
        queryClient.invalidateQueries({ queryKey: ['getSinglePost'] })

      }

    }
  )
  
   function save_un() {
    return axios.put(`${baseUrl}/posts/${id}/bookmark`, {},
      {
        headers:
        {
          "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
  }
  const { mutate:save,isPending:isSaving} = useMutation(
    {
      mutationFn: save_un,
      onSuccess: (req) => {
      
        
        queryClient.invalidateQueries({ queryKey: ["GetALLPosts"] });
        queryClient.invalidateQueries({ queryKey: ["feedHome"] });
        queryClient.invalidateQueries({ queryKey: ['getSinglePost'] })

      }

    }
  )

  
  
  return (
    <>

    <CardFooter>
      <div className="w-full flex justify-center items-center gap-10  text-slate-500">
        <button className="flex items-center gap-2 group hover:text-primary transition-colors">
          <div className="p-2 group-hover:bg-primary/10 rounded-full">
          {isLiking?<Spinner color='primary' size="sm"></Spinner>:
            <AiFillLike onClick={like} />
          }
          </div>
          <span className="text-xs font-medium">{likesCount}</span>
        </button>
        <Link to={`/details/${id}`} className="flex items-center gap-2 group hover:text-green-500 transition-colors">
          <div className="p-2 group-hover:bg-green-500/10 rounded-full">
         
            <BiCommentAdd />
          </div>
          <span className="text-xs font-medium">{commentCount}</span>
        </Link>
        <button className="flex items-center gap-2 group hover:text-primary transition-colors">
          <div className="p-2 group-hover:bg-pink-500/10 rounded-full">
           <Link to={"/share/"+id}><TbMessage2Share /></Link> 
          </div>
          <span className="text-xs font-medium">{shareCount}</span>
        </button>
        <button className="flex items-center gap-2 group hover:text-yellow-500 transition-colors">
          <div className="p-2 group-hover:bg-green-500/10 rounded-full">
           {isSaving? <Spinner color="primary"></Spinner>
          :

          <FaRegBookmark onClick={save} />
          }
            
          </div>

        </button>

      </div>
    </CardFooter>
    </>
  )
}
