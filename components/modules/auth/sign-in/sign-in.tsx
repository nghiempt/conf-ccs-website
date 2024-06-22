"use client";

import { Checkbox, Divider, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import { SIGN_IN } from "@/fetch/fetch_data";
import Cookie from 'js-cookie';
import { ROUTE } from "@/constant/route";

export default function SignIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [openAlert, setOpenAlert] = useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const handleSubmit = async () => {
    const payload = {
      account_email: email,
      account_password: password
    }
    const fetchSignIn = await SIGN_IN(payload)
    if (fetchSignIn?.success) {
      Cookie.set('isSignedIn', 'true', { expires: 1 });
      Cookie.set('account', JSON.stringify(fetchSignIn?.account), { expires: 1 });
      window.location.href = ROUTE.DASHBOARD
    } else {
      setOpenAlert(true)
    }
  }

  useEffect(() => { }, [email, password, openAlert])

  return (
    <div className="flex justify-center items-center bg-gray-50 p-8 rounded-lg shadow-md">
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openAlert}
        onClose={handleCloseAlert}
        message="Username or password is not valid !"
      />
      <div className="items-center text-center">
        <div className="flex items-center text-center grid grid-cols-1 gap-0">
          <div className="text-center">
            <h1 className="text-[24px] font-bold mb-4">
              Welcome to USENIX Security
            </h1>
            <h1 className="text-[16px] text-gray-700 font-light mb-4">
              Sign-in to continue
            </h1>
            <div className="w-full flex items-start flex-col mt-4">
              <h1 className="text-[16px] mb-2">Email</h1>
              <div className="w-full bg-gray-100 flex rounded-lg border border-[#E1DEDB]">
                <span className="flex items-center pl-1">
                  <EmailOutlinedIcon className="px-2" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-2 w-full bg-gray-100 placeholder-gray-400 font-medium rounded-lg text-gray-500 outline-none border-transparent focus:border-transparent focus:ring-0"
                />
              </div>
            </div>
            <div className="w-full flex items-start flex-col mt-4 mb-6">
              <h1 className="text-[16px] mb-2">Password</h1>
              <div className="w-full bg-gray-100 flex rounded-lg border border-[#E1DEDB]">
                <span className="flex items-center pl-1">
                  <LockOpenOutlinedIcon className="px-2" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2 w-full bg-gray-100 placeholder-gray-400 font-medium rounded-lg text-gray-500 outline-none border-transparent focus:border-transparent focus:ring-0"
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="login-button my-4 w-full h-10 bg-blue-500 hover:bg-blue-700 rounded-lg font-bold text-[16px]"
              style={{ color: "white" }}
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
