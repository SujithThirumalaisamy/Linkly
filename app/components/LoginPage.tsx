"use client";

import React, { useState } from "react";
// import { signIn } from "next-auth/react";
import { Eye, Github, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // login Logic

      const response = await axios.post("http://localhost:3000/api/login", formData);
      if (response.status === 201) {
        toast.error("Login Successfully");
      }
      console.log("Response data", response.data);
      console.log("FormData from LoginPage", formData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || "Something went wrong");
      } else {
        setError("Failed to Login. Please try again");
      }
      console.log("Error During Login", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-[rgba(255,255,255,0.025)] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.04)] 
                    ring-1 ring-[rgba(255,255,255,0.025)] flex flex-col max-w-[460px] p-5 gap-4 w-full mx-auto mt-10 justify-center"
    >
      <ToastContainer />
      <h2 className="text-white text-xl font-semibold text-center">Login</h2>

      {/* Email & Password Form */}
      <form onSubmit={onFormSubmit} className="flex flex-col gap-3 ">
        <div className="relative flex items-center">
          <Mail className="absolute left-3 text-gray-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            // {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="bg-transparent border border-gray-500 text-white pl-10 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        <div className="relative flex items-center">
          <Eye className="absolute left-3 text-gray-400 w-5 h-5" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-transparent border border-gray-500 text-white pl-10 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>

        {/* error */}
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Logiinn..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <hr className="flex-grow border-gray-600" />
        <span className="text-gray-400">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>

      {/* Social Logins */}
      <button
        // onClick={() => signIn("google")}
        className="flex items-center justify-center gap-2 border border-gray-700 bg-gray-800 text-white p-2 rounded-md transition"
      >
        <Image src={"/GoogleIcon.svg"} alt="icons" width={35} height={35} />
        Sign Up with Google
      </button>

      <button
        // onClick={() => signIn("github")}
        className="flex items-center justify-center gap-2 bg-gray-800 text-white p-2 rounded-md hover:bg-gray-900 transition"
      >
        <Github />
        Sign Up with GitHub
      </button>

      <p className="text-center  text-sm mt-1">
        Don't have an account{" "}
        <Link href={"/auth/signup"} className="underline ">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
