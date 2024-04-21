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
import { limitString } from "@/utils/helper";

export default function Choose() {

  const isSignedIn = Cookie.get('isSignedIn') === 'true';
  const account = Cookie.get('account');

  const searchParams = useSearchParams()

  const [apps, setApps] = useState<any>([]);
  const [experts, setExperts] = useState<any>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isShowApps, setIsShowApps] = useState(false);
  const [categorySelected, setCategorySelected] = useState<any>(1)

  function signOut() {
    Cookie.remove('isSignedIn');
    Cookie.remove('account');
    window.location.href = ROUTE.DASHBOARD;
  }

  const loadApps = async () => {
    const fetchApps = await GET_ALL_APPS()
    setApps(fetchApps || []);

    const fetchExperts = await GET_ALL_EXPERTS()
    console.log(fetchExperts);
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

  const findAuthor = (appId: string) => {
    return experts?.filter((item: any) => item?.app_id === appId);
  }

  const filterAppByCategory = (apps: any[], categoryId: any): any[] => {
    let tmp = apps.filter(app => app.category_id === categoryId);
    tmp = tmp.sort((a: any, b: any) => {
      return a.app_id - b.app_id;
    });
    return tmp;
  }

  const renderAvatar = (index: any, authorEmail: string) => {
    switch (authorEmail) {
      case 'nhilt@gmail.com':
        return <div key={index} className="bg-blue-400 text-white rounded-full text-[10px] font-semibold w-6 h-6 flex justify-center items-center">Nh</div>
      case 'nghiempt@gmail.com':
        return <div key={index} className="bg-orange-400 text-white rounded-full text-[10px] font-semibold w-6 h-6 flex justify-center items-center">Ng</div>
      case 'sonhx@gmail.com':
        return <div key={index} className="bg-red-400 text-white rounded-full text-[10px] font-semibold w-6 h-6 flex justify-center items-center">So</div>
      default:
        return '';
    }
  }

  const init = async () => {
    loadApps()
    if (searchParams.get('back') === 'true') {
      setIsShowApps(true)
      setCategorySelected(parseInt(searchParams.get('category') || '1'))
    }
  };

  useEffect(() => {
    setIsMounted(true);
    init();
  }, []);

  useEffect(() => { }, [apps, experts, isShowApps, categorySelected]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-3/4 flex flex-col justify-center items-center pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-center w-full">
        <div className="flex justify-center items-center">
          <h1 className="text-[20px] lg:text-[24px] font-semibold">List of applications that need labeling</h1>
        </div>
        {
          isSignedIn ? <div className="flex justify-center items-center mt-2 lg:mt-0">
            <h1 className="text-[14px] lg:text-[18px] font-semibold">Hi, {JSON.parse(account || '')?.account_email} </h1>
            <div onClick={signOut} className="ml-4 cursor-pointer"><LogoutIcon /></div>
          </div> : <Link href={{
            pathname: ROUTE.SIGN_IN
          }}>
            <button className="bg-[rgb(var(--primary-rgb))] !text-white text-[14px] lg:text-[16px] py-2 px-6 rounded-lg font-semibold mt-4 lg:mt-0">
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
          <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-5 mt-10">
            {
              filterAppByCategory(apps, categorySelected)?.map((item: any, index: any) => {
                return (
                  <Link
                    href={{
                      pathname: !isSignedIn ? ROUTE.SIGN_IN : ROUTE.EXPERT,
                      query: { appId: item?.app_id || '0' },
                    }}
                    key={index}
                    className={`flex flex-col relative justify-center items-start border ${checkStatusAppLabled(item?.app_id) ? 'bg-green-200 border-2 border-green-500' : 'border-gray-300'} py-6 px-3 rounded-lg cursor pointer hover:opacity-60 gap-2`}
                  >
                    <div className="flex justify-start items-center gap-2">
                      <Avatar alt="avatar" src={item?.app_thumbnail} />
                      <div className="flex flex-col justify-center items-start">
                        <h1 className={`text-[14px] font-semibold`}>{limitString(item?.app_name, 16)}</h1>
                      </div>
                    </div>
                    <div className="flex gap-1 absolute bottom-1 right-1">
                      {
                        findAuthor(item?.app_id)?.map((item: any, index: any) => {
                          return (
                            renderAvatar(index, item?.account_email)
                          )
                        })
                      }
                    </div>
                    <div className="absolute top-1 right-1 text-gray-700 rounded-full text-[10px] font-semibold w-6 h-6 flex justify-center items-center">
                      {index + 1}
                    </div>
                  </Link>
                )
              })
            }
          </div>
          :
          <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-5 mt-10">
            {
              FAKE.CATEGORIES?.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCategorySelected(item?.id)
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
