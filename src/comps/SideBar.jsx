import React, { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RiHomeSmileLine } from "react-icons/ri";
import { FaUserSecret } from "react-icons/fa6";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { SlUserFollow } from "react-icons/sl";
import { BsFillPostcardHeartFill } from "react-icons/bs";

import { AuthContext } from '../Context/AuthContext';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { notiUnreadCount } from '../utils/notificationAPI';

import logo from '../../public/Logo.png'

export default function Navbar() {
  const navigate = useNavigate()
  const { userData, setIslogin, isLoading } = useContext(AuthContext)

  // Fetch unread notification count with auto-refresh every 30 seconds
  const { data: unreadData } = useQuery({
    queryKey: ['getNotiUnreadCount'],
    queryFn: notiUnreadCount,
    refetchInterval: 30000, // Poll every 30 seconds
    refetchOnWindowFocus: true, // Refresh when user switches back to tab
    staleTime: 10000, // Consider data fresh for 10 seconds
  })

  const unreadCount = unreadData?.data?.data?.unreadCount ?? 0

  function logOut() {
    localStorage.removeItem("token");
    setIslogin(null)
    navigate('/login', { replace: true });
  }
  return (
    <aside className="bg-[#101622] text-white font-bold w-1/4 flex-col hidden lg:flex sticky top-0 h-screen border-r border-slate-200  px-4 py-6">
      <div className="flex items-center gap-3 mb-10 px-4">
        <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white overflow-hidden">
          <img src={logo} alt="Vibe Logo" className='w-full h-full object-cover' />
        </div>
        <h2 className="text-xl font-bold tracking-tight">VIBE</h2>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        <NavLink to={'/'} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 hover:text-primary  transition-colors group font-bold">
          <RiHomeSmileLine className=' text-2xl' />
          <span>Home</span>
        </NavLink>
        <NavLink to={'/feed'} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 hover:text-primary  transition-colors group font-bold">
          <BsFillPostcardHeartFill className=' text-2xl' />
          <span>Feed</span>
        </NavLink>
        <NavLink to={"/myprofile"} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 hover:text-primary  transition-colors group">
          <FaUserSecret className=' text-2xl' />
          <span>Profile</span>
        </NavLink>
        <NavLink to={"/notification"} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 hover:text-primary  transition-colors group relative">
          <MdOutlineNotificationAdd className=' text-2xl' />
          <span >Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute right-4 bg-primary text-white text-[10px] min-w-5 h-5 flex items-center justify-center rounded-full font-bold px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </NavLink>
        <NavLink to={"/suggestions"} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 hover:text-primary  transition-colors group relative">
          <SlUserFollow className=' text-2xl' />
          <span > Follow Suggestions</span>
        </NavLink>



      </nav>



      {!isLoading ?
        <div className="mt-auto p-4 border-t border-slate-200  flex items-center gap-3">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="size-10 rounded-full bg-cover bg-center" data-alt="Avatar of current logged in user" style={{ backgroundImage: `url("${userData.photo}")` }} />


            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">


              <DropdownItem key="settings"><Link to={"/settings"}>My Settings</Link> </DropdownItem>

              <DropdownItem key="logout" color="danger" onPress={logOut}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-sm truncate">{userData.name}</p>
            <p className="text-xs text-slate-500 truncate">@{userData.username}</p>
          </div>
        </div> :
        <Spinner color="primary" />
      }
    </aside>

  )

}


