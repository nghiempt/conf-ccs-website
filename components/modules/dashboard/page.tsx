"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import Link from "next/link";
import { GET_ALL_APPS, GET_ALL_EXPERTS } from "@/fetch/fetch_data";
import { ROUTE } from "@/constant/route";
import Cookie from 'js-cookie';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FAKE } from "@/constant/fake";
import { useSearchParams } from "next/navigation";

export default function Choose() {

  const isSignedIn = Cookie.get('isSignedIn') === 'true';
  const account = Cookie.get('account');

  const searchParams = useSearchParams()

  const [apps, setApps] = useState<any>([]);
  const [experts, setExperts] = useState<any>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isShowApps, setIsShowApps] = useState(false);

  function signOut() {
    Cookie.remove('isSignedIn');
    Cookie.remove('account');
    window.location.href = ROUTE.DASHBOARD;
  }

  const loadApps = async () => {
    const fetchApps = await GET_ALL_APPS()
    setApps(fetchApps || []);

    const fetchExperts = await GET_ALL_EXPERTS()
    setExperts(fetchExperts || []);
  }

  const checkStatusAppLabled = (appId: string) => {
    const isLabled = experts?.find((item: any) => item?.app_id === appId);
    if (isLabled) {
      return true;
    } else {
      return false;
    }
  }

  const init = async () => {
    loadApps()
    if (searchParams.get('back') === 'true') {
      setIsShowApps(true)
    }
  };

  useEffect(() => {
    setIsMounted(true);
    init();
  }, []);

  useEffect(() => { }, [apps, experts, isShowApps]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-3/4 flex flex-col justify-center items-center pb-20">
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center">
          <h1 className="text-[24px] font-semibold">List of applications that need labeling</h1>
        </div>
        {
          isSignedIn ? <div className="flex justify-center items-center">
            <h1 className="text-[18px] font-semibold">Hi, {JSON.parse(account || '')?.account_email} </h1>
            <div onClick={signOut} className="ml-4 cursor-pointer"><LogoutIcon /></div>
          </div> : <Link href={{
            pathname: ROUTE.SIGN_IN
          }}>
            <button className="bg-[rgb(var(--primary-rgb))] !text-white text-[16px] py-2 px-6 rounded-lg font-semibold">
              Sign In
            </button>
          </Link>
        }
      </div>
      {
        isShowApps && (
          <div className="w-full flex justify-start items-center mt-10">
            <button
              onClick={() => {
                setIsShowApps(false)
              }}
              className="flex justify-start items-center bg-gray-200 py-1 px-4 rounded-lg gap-2"
            >
              <ArrowBackIcon />
              <h1 className="text-[16px] font-medium">Back to category</h1>
            </button>
          </div>
        )
      }
      {
        isShowApps
          ?
          <div className="w-full grid grid-cols-6 gap-5 mt-10">
            {
              apps?.map((item: any, index: any) => {
                return (
                  <Link
                    href={{
                      pathname: ROUTE.EXPERT,
                      query: { appId: item?.app_id || '0' },
                    }}
                    key={index}
                    className={`flex justify-start items-center border ${checkStatusAppLabled(item?.app_id) ? 'bg-green-200 border-2 border-green-500' : 'border-gray-300'} py-2 px-3 rounded-lg cursor pointer hover:opacity-60 gap-2`}
                  >
                    <Avatar alt="avatar" src={item?.app_thumbnail} />
                    <div className="flex flex-col justify-center items-start">
                      <h1 className={`text-[16px] font-semibold`}>{item?.app_name}</h1>
                    </div>
                  </Link>
                )
              })
            }
          </div>
          :
          <div className="w-full grid grid-cols-5 gap-5 mt-10">
            {
              FAKE.CATEGORIES?.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setIsShowApps(true)
                    }}
                    className={`flex justify-center items-center ${index === 999 ? 'bg-green-300' : 'bg-gray-200'} border ${index === 999 ? 'border-green-800' : 'border-gray-400'} py-2 px-6 rounded-lg cursor-pointer hover:opacity-60`}
                  >
                    <div className="flex flex-col justify-center items-center gap-2">
                      <h1 className={`text-[18px] font-semibold`}>{item?.category}</h1>
                      <h1 className={`text-[18px] font-semibold`}>{item?.title}</h1>
                    </div>
                  </div>
                )
              })
            }
          </div>
      }
    </div>
  );
}
