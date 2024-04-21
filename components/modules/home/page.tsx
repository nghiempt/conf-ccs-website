"use client";

import React from "react";
import Link from "next/link";
import { ROUTE } from "@/constant/route";

export default function Home() {
  return (
    <div className="w-3/4 flex flex-col justify-center items-center py-10">
      <div className="w-full text-justify bg-gray-100 p-4 border border-gray-400 rounded-md">
        <h1 className="text-[18px] font-semibold">Welcome to our project. The main purpose of the project is to provide an analyzed dataset on the consistency between Data Safety and Privacy Policy information, then explore user behavior before and after they have understood the privacy policy of the app they are using.</h1>
        <h1 className="text-[18px] font-semibold mt-2">I will introduce the related concepts: Note: we are targeting Android applications on the Google Play Store</h1>
        <div className="px-6 lg:px-20">
          <h1 className="text-[18px] font-medium mt-2"><span className="text-red-500 font-semibold">* Data Safety</span>: The developer will provide this information when they release their app. Google will check and display detailed information in the Data Safety section on the Store. The purpose of Data Safety is to inform users about what information the app is collecting, sharing, for what purpose, and whether it is provided to third parties or not.<br/><span className="text-[10px] lg:text-[16px] text-blue-500">(ex: https://play.google.com/store/apps/datasafety?id=com.cross.stitch.color.by.number)</span></h1>
          <h1 className="text-[18px] font-medium mt-2"><span className="text-red-500 font-semibold">* Privacy Policy</span>: This is the detailed privacy policy content provided by the app's own website. In this section, they also specify the types of data they collect, share with users, for what purpose, and to whom? <br/><span className="text-[10px] lg:text-[16px] text-blue-500">(ex: https://sites.google.com/view/colorappsforfree)</span></h1>
        </div>
      </div>
      <div className="w-full mt-6 text-justify bg-gray-100 p-4 border border-gray-400 rounded-md">
        <h1 className="text-[18px] font-semibold">Based on these two pieces of information, we find that many apps are falsifying information to Google and are collecting and sharing a lot of user information when they use the app. It is noted that users rarely pay attention to reading the privacy policy before installing the app. We want to explore user behavior after they have fully understood the privacy policy, whether they continue to use the app or not.</h1>
        <h1 className="text-[18px] font-semibold mt-2">We analyze the content of Data Safety (The developer has provided this information about how this app collects, shares, and handles your data) with Privacy Policy (provided by the app via link) based on two levels of measurement:</h1>
      </div>
      <div className="w-full border border-gray-400 rounded-lg mt-6 p-4">
        <h1 className="text-[22px] font-bold w-full text-center py-4">INCORRECT</h1>
        <div className="w-full flex justify-center items-center gap-2">
          <div className="w-full h-[200px] border border-gray-300 flex flex-col justify-start items-center px-2 rounded-md ml-2">
            <div className="w-full py-2 bg-green-500 flex justify-center items-center mt-2 rounded-md">
              <h1 className="text-[18px] text-white font-bold">Data Safety</h1>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2">
              <h1 className="text-[18px] font-semibold">Data shared</h1>
              <h1>No data shared with third parties</h1>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2">
              <h1 className="text-[18px] font-semibold">Data collected</h1>
              <h1>No data collected</h1>
            </div>
          </div>
          <div className="w-full h-[200px] border border-gray-300 flex flex-col justify-start items-center mr-2 rounded-md px-2">
            <div className="w-full py-2 bg-purple-500 flex justify-center items-center mt-2 rounded-md">
              <h1 className="text-[18px] text-white font-bold">Privacy Policy</h1>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2 text-justify">
              <h1 className="text-[18px] font-semibold">Data shared</h1>
              <p className="text-[14px]">No mention anything</p>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2 text-justify">
              <h1 className="text-[18px] font-semibold">Data collected</h1>
              <p className="text-[14px]">We will collect Audio, Mircophone and Contact</p>
            </div>
          </div>
        </div>
        <div className="py-4 px-4">
          <div className="w-full text-center">
            <h1 className="text-[18px] font-medium"><span className="text-red-500 font-semibold">Incorrect</span>: Because Data Safety doesn't mention collecting anything, but Privacy Policy also mentions Audio, Mircophone and Contact.</h1>
          </div>
        </div>
      </div>
      <div className="w-full border border-gray-400 rounded-lg mt-6 p-4">
        <h1 className="text-[22px] font-bold w-full text-center py-4">INCOMPLETE</h1>
        <div className="w-full h-[220px] flex justify-center items-center gap-x-2">
          <div className="w-full h-[220px] border border-gray-300 flex flex-col justify-start items-center ml-2 rounded-md px-2">
            <div className="w-full py-2 bg-green-500 flex justify-center items-center mt-2 rounded-md">
              <h1 className="text-[18px] text-white font-bold">Data Safety</h1>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2">
              <h1 className="text-[18px] font-semibold">Data shared</h1>
              <div className="w-full grid grid-cols-4 gap-1">
                {
                  ['Personal Info (Name)']?.map((item: any, index: any) => {
                    return (
                      <button
                        key={index}
                        className="bg-gray-100 text-[13px] px-2 py-1 rounded-lg text-gray-700"
                      >
                        {item}
                      </button>
                    );
                  })
                }
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2">
              <h1 className="text-[18px] font-semibold">Data collected</h1>
              <h1>No data collected</h1>
            </div>
          </div>
          <div className="w-full h-[220px] border border-gray-300 flex flex-col justify-start items-center rounded-md mr-2 px-2">
            <div className="w-full py-2 bg-purple-500 flex justify-center items-center mt-2 rounded-md">
              <h1 className="text-[18px] text-white font-bold">Privacy Policy</h1>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2 text-justify">
              <h1 className="text-[18px] font-semibold">Data shared</h1>
              <p className="text-[14px]">We will share your personal info as Name, Email, Phone, ...</p>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2 text-justify">
              <h1 className="text-[18px] font-semibold">Data collected</h1>
              <p className="text-[14px]">No mention anything</p>
            </div>
          </div>
        </div>
        <div className="py-4 px-4">
          <div className="w-full text-center">
            <h1 className="text-[18px] font-medium mt-2"><span className="text-red-500 font-semibold">Incomplete</span>: Because Data Safety mentions sharing Name in Personal Info, but Privacy Policy mentions sharing Email and Phone in Personal Info as well.</h1>
          </div>
        </div>
      </div>

      <div className="w-2/3 lg:w-1/3 py-4 bg-blue-500 flex justify-center items-center mt-10 rounded-md cursor-pointer hover:opacity-70">
        <Link href={{
          pathname: ROUTE.DASHBOARD
        }}>
          <h1 className="text-[14px] lg:text-[18px] text-white font-bold">I Understand - Start Survey</h1>
        </Link>
      </div>
    </div>
  );
}
