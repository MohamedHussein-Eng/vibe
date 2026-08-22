import axios from "axios";
import { useState } from "react";
import { baseUrl } from "../MainData";
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';

export function AuthContextProvider({ children }) {
  // Convert token presence to a boolean
  const [isLogin, setIslogin] = useState(!!localStorage.getItem("token"));

  // 1. The fetcher function
  const fetchUserData = async () => {
    const response = await axios.get(`${baseUrl}/users/profile-data`, {
      headers: {
        "AUTHORIZATION": `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response?.data?.data?.user;
  };

  const { data: userData, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserData,
    enabled: !!isLogin,
  });

  return (
    <AuthContext.Provider value={{ isLogin, setIslogin, userData, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}