// --- 1. React & Core ---
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- 2. Third-Party Libraries ---
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';

// --- 3. Icons ---
import { User, AtSign, Users, Calendar, KeyRound } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa6';

// --- 4. Local Data ---
import { baseUrl } from '../../MainData';
import { AuthContext } from '../../Context/AuthContext';

// --- 5. Validation Schema ---
const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a gender." })
  }),
  dateOfBirth: z.string()
    .min(1, { message: "Date of birth is required." })
    .refine((data) => new Date(data) < new Date(), {
      message: "Date of birth must be in the past"
    }),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "This Invalid Formate for Password Should Contain At Least 8 Characters, One Uppercase, One Lowercase, One Number and One Special Character"),
  rePassword: z.string().min(1, { message: "Please confirm your password." })
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match.",
  path: ["rePassword"],
});


// --- 6. Main Component ---
const SignupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoding] = useState(false)
  const { setIslogin } = useContext(AuthContext)



  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: ""
    }
  });

  // Handle Form Submission
  const onSubmit = (data) => {
    setLoding(true)
    axios.post(`${baseUrl}/users/signup`, data)
      .then((req) => {
        console.log(req.data);
        localStorage.setItem("token", req.data?.data.token);
        setIslogin(req.data?.data.token)
        toast.success(req.data?.message);
        navigate('/', { relative: true });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong.");
      })
      .finally(() => { setLoding(false) });

  };

  return (
    <section className="order-1 w-full max-w-[430px] pt-28">
      <div className="rounded-2xl bg-[#192233] p-4 sm:p-6 shadow-sm">

        {/* Mobile Header */}
        <div className="mb-4 text-center lg:hidden border-b border-b-3 py-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-600">
            VIBE
          </h1>
          <p className="mt-1 text-base font-medium leading-snug text-slate-300">
            Connect with friends and the world around you on VIBE
          </p>
        </div>

        <h2 className="text-2xl font-extrabold text-white text-center">Create a new account</h2>
        <p className="mt-1 text-sm text-slate-400 text-center">It is quick and easy.</p>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-3.5">

          {/* Full Name */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </span>
              <input
                {...register("name")}
                placeholder="Full name"
                className={`w-full rounded-xl border-2 border-slate-500 bg-slate-700 py-3 pl-11 pr-4 text-sm text-white outline-none transition ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#00298d]'
                  }`}
                type="text"
              />
            </div>
            {errors.name && <p className="mt-1 ml-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Username */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <AtSign size={18} />
              </span>
              <input
                {...register("username")}
                placeholder="Username (optional)"
                className="w-full rounded-xl border-2 border-slate-500 bg-slate-700 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#00298d]"
                type="text"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <AtSign size={18} />
              </span>
              <input
                {...register("email")}
                placeholder="Email address"
                className={`w-full rounded-xl border-2 border-slate-500 bg-slate-700 py-3 pl-11 pr-4 text-sm text-white outline-none transition ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#00298d]'
                  }`}
                type="email"
              />
            </div>
            {errors.email && <p className="mt-1 ml-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Gender Select */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Users size={18} />
              </span>
              <select
                {...register("gender")}
                className={`w-full appearance-none rounded-xl border-2 border-slate-500 bg-slate-700 py-3 pl-11 pr-4 text-sm text-white outline-none transition ${errors.gender ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#00298d]'
                  }`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            {errors.gender && <p className="mt-1 ml-1 text-xs text-red-500">{errors.gender.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar size={18} />
              </span>
              <input
                {...register("dateOfBirth")}
                placeholder="Date of birth"
                className={`w-full rounded-xl border-2 border-slate-500 bg-slate-700 py-3 pl-11 pr-4 text-sm text-white outline-none transition ${errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#00298d]'
                  }`}
                type="date"
              />
            </div>
            {errors.dateOfBirth && <p className="mt-1 ml-1 text-xs text-red-500">{errors.dateOfBirth.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <KeyRound size={18} />
              </span>
              <input
                {...register("password")}
                placeholder="Password"
                className={`w-full rounded-xl border-2 border-slate-500 bg-slate-700 py-3 pl-11 pr-4 text-sm text-white outline-none transition ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#00298d]'
                  }`}
                type="password"
              />
            </div>
            {errors.password && <p className="mt-1 ml-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <KeyRound size={18} />
              </span>
              <input
                {...register("rePassword")}
                placeholder="Confirm password"
                className={`w-full rounded-xl border-2 border-slate-500 bg-slate-700 py-3 pl-11 pr-4 text-sm text-white outline-none transition ${errors.rePassword ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#00298d]'
                  }`}
                type="password"
              />
            </div>
            {errors.rePassword && <p className="mt-1 ml-1 text-xs text-red-500">{errors.rePassword.message}</p>}
          </div>

          {/* Submit Button */}
          {loading ?
            <button type='submit' className='my-3 w-full rounded-xl py-3 text-base font-extrabold text-white transition bg-primary hover:bg-primary-300 cursor-not-allowed'>
              Creating New Account....
            </button>
            :
            <button type='submit' className='my-3 w-full rounded-xl py-3 text-base font-extrabold text-white transition bg-primary hover:bg-primary-300'>
              Create New Account
            </button>
          }
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#192233] px-4 text-slate-500">Or sign up with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#cfd7e7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0d121b] transition-colors hover:bg-gray-200">
            <FcGoogle />
            <span>Google</span>
          </button>
          <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#cfd7e7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0d121b] transition-colors hover:bg-gray-200">
            <FaApple />
            <span>Apple</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default SignupForm;