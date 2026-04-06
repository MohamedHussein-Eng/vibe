import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Divider, ScrollShadow } from '@heroui/react'
import NotificationCard from '../../comps/NotficationCard'
import LoaderHome from '../../comps/LoaderHome'
import { notiUnreadCount, getAllNotification, makeAllAsRead } from '../../utils/notificationAPI'

export default function Notfication() {
  const queryclient = useQueryClient();
  const { data: unread } = useQuery(
    {
      queryFn: notiUnreadCount,
      queryKey: ['getNotiUnreadCount']
    }
  )
  const { data, isLoading } = useQuery({
    queryKey: ['GetAllNotification'],
    queryFn: getAllNotification
  })

  const { mutate: makeAllRead } = useMutation(
    {
      mutationFn: makeAllAsRead,
      onSuccess: () => {
        queryclient.invalidateQueries(['GetAllNotification'])
      }
    }
  )
  if (isLoading) return <LoaderHome />
  return (


    <div className="flex justify-center p-6 bg-[#0a0f1d] min-h-screen">
      <div className="scrollbar-hide w-full max-w-lg bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden px-4 py-2">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Notifications</h2>
          <div className='flex gap-2 items-center'>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              {unread?.data?.data.unreadCount} New
            </span>
            <Button color='primary' onPress={makeAllRead} disabled={unread?.data?.data.unreadCount === 0}>Read All</Button>
          </div>
        </div>

        <Divider className="bg-slate-800 my-2 " />
        <ScrollShadow className="max-h-screen space-y-2 scrollbar-hide">
          {data?.data?.data.notifications.map((noti) => (


            <NotificationCard key={noti._id} data={noti} />
          ))}

        </ScrollShadow>


      </div>
    </div>
  )
}

