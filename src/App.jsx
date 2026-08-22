
import './App.css'
import { Login } from './pages/LoginPage/Login'
import {HeroUIProvider} from '@heroui/react'
import Signup from './pages/SignUpPage/Signup'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home/Home'
import MainLayout from './pages/MainLayout/MainLayout'
import { AuthContextProvider } from './Context/AuthProvider'
import ProtectedAuth from './comps/ProtectedRoutes/ProtectedAuth'
import Protectedpages from './comps/ProtectedRoutes/Protectedpages'
import {  QueryClient, QueryClientProvider} from '@tanstack/react-query'
import Profile from './pages/Profile/Profile'
import Notification from './pages/Notification/Notification'
import Detalies from './pages/Detalies/Details'
import Settings from './pages/Settings/Settings'
import MyProfile from './pages/MyProfile/MyProfile'
import FollowSuggestions from './pages/Follow Suggestions/FollowSuggestions'
import Feed from './pages/Feed/Feed'
import SharePost from './pages/SharePosts/SharePost'

const queryClient = new QueryClient()
function App() {


const routers = createBrowserRouter([
  {
    path: "/", 
    element: <MainLayout />,
    children: [
      { 
        path:'login',
        index: true, 
        element: <ProtectedAuth><Login /></ProtectedAuth>  
      },
      {
        path: "signup", 
        element: <ProtectedAuth><Signup /></ProtectedAuth>  
      },
      { 
        path: "/", 
        element: <Protectedpages><Home/></Protectedpages>
      },
       { 
        path: "/feed", 
        element: <Protectedpages><Feed/></Protectedpages>
      },
      {
        path:"/myprofile",
        
        element: <Protectedpages><MyProfile/></Protectedpages>
      },
       {
        path:"/profile/:id",
        
        element: <Protectedpages><Profile/></Protectedpages>
      },
      {
         path: "/notification", 
        element: <Protectedpages><Notification/></Protectedpages>
      },
        {
         path: "/details/:id", 
        element: <Protectedpages><Detalies/></Protectedpages>
      },

      {
        path:"/settings",
        element:<Protectedpages><Settings/></Protectedpages>
      },
      {
        path:"/share/:id",
        element:<Protectedpages><SharePost/></Protectedpages>
      },
      {
        path:"/suggestions",
         element:<Protectedpages><FollowSuggestions/></Protectedpages>

      }
    
     
    ]
  }
]);

  return (
    <>
     <QueryClientProvider client={queryClient}>
       <HeroUIProvider>
        <Toaster />
        <AuthContextProvider>

        
      <RouterProvider router={routers}>
        
      
      </RouterProvider>
      </AuthContextProvider>
    </HeroUIProvider>
     </QueryClientProvider>
    </>
  )
}

export default App

