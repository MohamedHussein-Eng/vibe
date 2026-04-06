import React from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { IoIosPersonAdd } from "react-icons/io";
import { TbWorldShare } from 'react-icons/tb';
import { BiSolidLike } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../MainData';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NotificationCard = ({data}) => {
const queryclient=useQueryClient()
  function makeAsRead()
  {
    //https://route-posts.routemisr.com/notifications//read
    return axios.patch(`${baseUrl}/notifications/${data._id}/read`,{},
      {
         headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
      }
    )
  }
  const {mutate:makeAsReading }=useMutation(
    {
      mutationFn:makeAsRead,
      onSuccess:()=>
      {
        queryclient.invalidateQueries(['GetAllNotification'])

        console.log("read");
        
      }
    }
  )
  return (
    <div className="flex items-start gap-4 p-5 bg-[#101622] border border-primary-500 rounded-2xl w-full max-w-5xl font-sans">
      
      {/* Left Column: Avatar & Context Icon */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={data.actor.photo}
          alt={data.actor.name}
          className="w-11 h-11 rounded-full object-cover shadow-sm"
        />
        <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm text-blue-500">
          {data.type === 'follow_user' ? <IoIosPersonAdd size={14} strokeWidth={2.5} />
 :
             data.type === 'share_post' ? <TbWorldShare size={14} strokeWidth={2.5} />
             :data.type==="like_post"? <BiSolidLike size={14} strokeWidth={2.5} />

 :           <MessageCircle size={14} strokeWidth={2.5} />

               }
        </div>
      </div>

      {/* Middle Column: Content */}
      <div className="flex-1 pt-1">
         <div className="flex gap-2  items-center">
          <p className='text-primary-500 font-bold'>{data.actor.name}</p>
                     <p className="text-sm text-slate-300 leading-snug">
                       {" "}
                      {data.type === 'follow_user' ? 'Started following you' :
                        data.type === 'share_post' ? 'Shared your post' 
                        :data.type==="like_post"?"Liked your post": 'Commented on your post'
                      }
                    </p>
                    {/* {!noti.isRead && <div className="size-2.5 rounded-full bg-primary mt-1 shadow-[0_0_8px_rgba(0,111,238,0.8)]" />} */}
                  </div>

        {/* Action Button */}
         {!data.isRead&&
        <button onClick={makeAsReading}  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-blue-600 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
          <Check size={16} strokeWidth={3} />
          Mark as read
        </button>
}
        {data.entityType==="post"&&
        <Link to={'/details/'+data.entity._id} className='text-primary-500 text-sm font-medium' >View Post</Link>
        }
        </div>

      {/* Right Column: Time & Unread Indicator */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-slate-500 text-sm font-medium">{new Date().getDay}</span>
        {!data.isRead&&
        <span class="relative flex size-3">
  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
  <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
</span>
}
      </div>
      
    </div>
  );
};

export default NotificationCard;
// <div key={noti.id} className="group transition-all">
            //   <div className={`flex items-start gap-4 p-4 hover:bg-slate-800/40 cursor-pointer transition-colors ${!noti.isRead ? 'bg-primary/5' : ''}`}>

            //     <div className="relative">
            //       <Link to={"/profile/" + noti.actor._id}>
            //         <Avatar
            //           src={noti.actor.photo}
            //           className="w-12 h-12 text-large border-2 border-slate-800"
            //         />
            //       </Link>
            //       <div className={`absolute -bottom-1 -right-1 size-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center`}>

            //       </div>
            //     </div>


            //     <div className="flex-grow">
            //      

            //       {noti.body && (
            //         <div className="mt-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/50">
            //           <p className="text-xs text-slate-500 line-clamp-2 italic">"{noti.body}"</p>
            //         </div>
            //       )}

            //       {noti.msg && (
            //         <p className="mt-1 text-xs text-red-400/70 italic font-medium">{noti.msg}</p>
            //       )}

            //       <p className="mt-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">{noti.time}</p>
            //     </div>
            //   </div>
            //   <Divider className="bg-slate-800/50 mx-4 w-auto" />
            // </div>