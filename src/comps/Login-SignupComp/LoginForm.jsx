import React, { useContext, useState } from 'react'
import { User, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../MainData';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { Tooltip } from '@heroui/react';
import { AuthContext } from '../../Context/AuthContext';







export default function LoginForm() {

  const { setIslogin } = useContext(AuthContext)
  const [loading, setLoding] = useState(false)
  const navigate = useNavigate()
  // 1. Define the schema
  const schema = zod.object({
    email: zod
      .string()
      .min(1, "Email or UserName is required"),
    password: zod
      .string()
      .min(1, "Password is required")
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "This Invalid Formate for Password"),
  });
  //  Hooh Form ToHadle Form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  // Handle Login(CallApi + Navigate To Home)
  function handleLogin(data) {
    setLoding(true)
    axios.post(`${baseUrl}/users/signin`, data)
      .then((req) => {


        localStorage.setItem("token", req.data?.data.token)
        setIslogin(localStorage.getItem("token"))

        navigate('/');
      })
      .catch((err) => {

        toast.error(err?.response?.data.message)
      })
      .finally(() => {
        setLoding(false)

      })



  }
  // Ul
  return (
    <section className="order-1 w-full max-w-[430px] lg:order-2 mx-auto py-11 h-full ">
      <div className="rounded-2xl bg-[#192233] p-4 sm:p-6 shadow-sm space-y-5 ">

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="mb-4 text-center lg:hidden  border-b-3 py-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-600">
            VIBE
          </h1>
          <p className="mt-1 text-base font-medium leading-snug text-slate-300">
            Connect with friends and the world around you on VIBE
          </p>
        </div>



        <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">Log in and continue your social journey.</p>

        {/* Form Container */}
        <form className="mt-5 space-y-2  h-56" onSubmit={handleSubmit(handleLogin)}>

          {/* Email/Username Input */}
          <div className="relative " >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={18} />
            </span>
            <input
              placeholder="Email or username"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              type="text"
              name="login"
              {...register("email")}
            />
          </div>
          {errors.email &&
            <p className=' text-sm text-red-600'>{errors.email?.message}</p>
          }
          <button type="button" className=" mb-2 block text-sm font-semibold text-primary transition hover:underline">
            Forgot password?
          </button>
          {/* Password Input */}
          <div className="relative ">

            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <KeyRound size={18} />
            </span>
            <input
              placeholder="Password"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              type="password"
              name="password"
              {...register("password")}
            />
          </div>
          {errors.password &&
            <p className='text-sm text-red-600'>{errors.password?.message}</p>
          }


          {/* Action Buttons */}
          {loading ?
            <Tooltip content="wait I Send Your Request!!" color="primary">
              <button type='submit' className='my-3 w-full rounded-xl py-3 text-base font-extrabold text-white transition bg-primary hover:bg-primary-300 cursor-not-allowed'>
                Log In
              </button>
            </Tooltip>

            :
            <button type='submit' className='my-3 w-full rounded-xl py-3 text-base font-extrabold text-white transition bg-primary hover:bg-primary-300'>
              Log In
            </button>


          }



        </form>
        {/* Login With */}
        <div class="relative my-8">
          <div aria-hidden="true" class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[#cfd7e7] dark:border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-[#192233] dark:bg-background-dark px-4 text-[#4c669a] font-medium uppercase tracking-wider">Or continue with</span>
          </div>
        </div>
        {/* Buttons To login */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#cfd7e7]  bg-white  px-4 py-2.5 text-sm font-semibold text-[#0d121b] hover:bg-gray-200 transition-colors cursor-pointer">
            <FcGoogle />
            <span>Google</span>
          </button>
          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#cfd7e7]  bg-white  px-4 py-2.5 text-sm font-semibold text-[#0d121b] hover:bg-gray-200  transition-colors cursor-pointer">
            <FaApple />
            <span>Apple</span>
          </button>
        </div>
        {/* Don't Have an Account */}
        <p class="text-center text-sm text-[#4c669a] dark:text-gray-400 mt-8">
          Don't have an account?
          <Link class="font-bold text-primary hover:text-primary/80 ml-1" to={"/signup"}>Create one for free</Link>
        </p>

      </div>
    </section>

  )
}
