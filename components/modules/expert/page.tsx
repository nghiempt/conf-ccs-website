"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CREATE_EXPERT, GET_ALL_APPS, GET_ALL_EXPERTS } from "@/fetch/fetch_data";
import { Snackbar, Avatar } from "@mui/material";
import Cookie from 'js-cookie';
import { ROUTE } from "@/constant/route";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Expert() {

  const isSignedIn = Cookie.get('isSignedIn') === 'true';
  const account = Cookie.get('account');

  const searchParams = useSearchParams()
  const router = useRouter()

  const [app, setApp] = React.useState({} as any);
  const [apps, setApps] = React.useState([] as any);
  const [experts, setExperts] = useState<any>([]);

  const [isMounted, setIsMounted] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [labelOne, setLabelOne] = useState('');
  const [labelTwo, setLabelTwo] = useState('');
  const [relevantOne, setRelevantOne] = useState('');
  const [labelOneDesc, setLabelOneDesc] = useState('');
  const [labelTwoDesc, setLabelTwoDesc] = useState('');
  const [relevantTwo, setRelevantTwo] = useState('');

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const directToUrl = (url: string) => {
    window.open(url)
  }

  const nextApp = () => {
    window.location.href = ROUTE.EXPERT + '?appId=' + (parseInt(searchParams.get('appId') || '1') + 1)
  }

  const prevApp = () => {
    window.location.href = ROUTE.EXPERT + '?appId=' + (parseInt(searchParams.get('appId') || '1') - 1)
  }

  const handleDataSafety = (jsonString: string, status: string) => {
    if (!jsonString) {
      return [];
    }
    jsonString = jsonString.replace(/'/g, '"').replace(/False/g, 'false').replace(/True/g, 'true')
    let validJsonString = JSON.parse(jsonString) || {};
    let dataShared = validJsonString.data_shared;
    let dataCollected = validJsonString.data_collected;
    let result: any = [];
    if (status === 'shared') {
      for (let i = 0; i < dataShared.length; i++) {
        result.push(
          <button
            key={i}
            className="bg-gray-100 text-[14px] px-2 py-1 rounded-lg text-gray-700"
          >
            {dataShared[i]?.category}
            {dataShared[i]?.sub_info?.map((item: any, index: any) => {
              return (
                <div key={index} className="text-[11px] bg-blue-100 px-2 py-1 rounded-lg text-gray-700 mt-2">
                  <strong>Data Type:</strong> {item?.data_type}
                  <br />
                  <strong>Purpose:</strong> {item?.purpose}
                </div>
              )
            })}
          </button>
        )
      }
    } else {
      for (let i = 0; i < dataCollected.length; i++) {
        result.push(
          <button
            key={i}
            className="bg-gray-100 text-[14px] px-2 py-1 rounded-lg text-gray-700"
          >
            {dataCollected[i]?.category}
            {dataCollected[i]?.sub_info?.map((item: any, index: any) => {
              return (
                <div key={index} className="text-[11px] bg-blue-100 px-2 py-1 rounded-lg text-gray-700 mt-2">
                  <strong>Data Type:</strong> {item?.data_type}
                  <br />
                  <strong>Purpose:</strong> {item?.purpose}
                </div>
              )
            })}
          </button>
        )
      }
    }
    return result;
  }

  const getCategoryName = (category_id: number) => {
    switch (category_id) {
      case 1:
        return 'Art & Design';
      case 2:
        return 'Auto & Vehicles';
      case 3:
        return 'Beauty';
    }
  }

  const getLenghtOfAppInCategory = (category_id: number) => {
    return apps?.filter((item: any) => item?.category_id === category_id).length;
  }

  const getCurrentIndexApp = (category_id: number, app_id: any) => {
    apps?.filter((item: any) => item?.category_id === category_id);
    let index = 0;
    for (let i = 0; i < apps?.length; i++) {
      if (apps[i]?.app_id === app_id) {
        index = i;
        break;
      }
    }
    return index + 1;
  }

  const askGPT = async (text: string) => {
    try {
      const prompt = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.5
      }
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application  /json',
          'Authorization': 'Bearer sk-xxx'
        },
        body: JSON.stringify(prompt),
      }
      )
      const data = await response.json();
      console.log(data?.choices[0]?.message?.content);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  const splitDataSections = (data: any) => {
    const sections: any = {};

    // Find the index where "Data Collect:" starts
    const collectIndex = data?.indexOf("Data Collect:");

    // Extract the "Data Share" section using the starting index of "Data Collect:"
    sections.dataShare = data?.substring(0, collectIndex)?.trim();

    // Extract the "Data Collect" section from the starting point till the end of the string
    sections.dataCollect = data?.substring(collectIndex)?.trim();

    return sections;
  }

  const splitDataSectionsNull = (data: any) => {
    const sections: any = {};

    // Use a regular expression to find the start indices of each section
    const dataShareMatch = data?.match(/- Data Share:/);
    const dataCollectMatch = data?.match(/- Data Collect:/);

    if (dataShareMatch && dataCollectMatch) {
      // Extract the "Data Share" section using the index of "Data Collect"
      sections.dataShare = data?.substring(dataShareMatch.index, dataCollectMatch.index).trim();

      // Extract the "Data Collect" section from its start index to the end of the string
      sections.dataCollect = data?.substring(dataCollectMatch.index).trim();
    } else {
      // Handle the case where the expected headings aren't found
      console.error("Could not find the expected data sections.");
      return null;
    }

    return sections;
  }

  const handleSubmit = async () => {
    // console.log('------------------------------------');
    // askGPT('What is the data safety of this app?');
    // console.log('------------------------------------');
    // return;
    if (!isSignedIn) {
      window.location.href = ROUTE.SIGN_IN;
      return;
    }
    const payload = {
      account_id: JSON.parse(account || '')?.account_id,
      app_id: app?.app_id,
      category_id: app?.category_id,
      label_one: labelOne,
      label_two: labelTwo,
      relevant_one: relevantOne,
      label_one_desc: labelOneDesc,
      label_two_desc: labelTwoDesc,
      relevant_two: relevantTwo
    }
    const fetchCreateExpert = await CREATE_EXPERT(payload)
    router.push(ROUTE.DASHBOARD + '?back=true')
  };

  const init = async () => {
    const fetchApps = await GET_ALL_APPS()
    setApps(fetchApps || []);

    let foundItem: any = fetchApps?.find((item: any) => item?.app_id.toString() === (searchParams.get('appId') || '1'));
    setApp(foundItem)

    const fetchExperts = await GET_ALL_EXPERTS()
    setExperts(fetchExperts || []);

    let foundExperts = fetchExperts?.filter((item: any) => item?.app_id.toString() === (searchParams.get('appId') || '1'));
    if (foundExperts[foundExperts?.length - 1]) {
      setLabelOne(foundExperts[foundExperts?.length - 1]?.label_one)
      setLabelTwo(foundExperts[foundExperts?.length - 1]?.label_two)
      setRelevantOne(foundExperts[foundExperts?.length - 1]?.relevant_one)
      setLabelOneDesc(foundExperts[foundExperts?.length - 1]?.label_one_desc)
      setLabelTwoDesc(foundExperts[foundExperts?.length - 1]?.label_two_desc)
      setRelevantTwo(foundExperts[foundExperts?.length - 1]?.relevant_two)
    }
  };

  useEffect(() => {
    setIsMounted(true);
    init();
  }, []);

  useEffect(() => { }, [app, apps, experts, openAlert, labelOne, labelTwo, relevantOne, labelOneDesc, labelTwoDesc, relevantTwo]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-3/4 flex flex-col justify-center items-center">
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openAlert}
        onClose={handleCloseAlert}
        message="Please fill all input !"
      />
      <div className="w-full flex flex-col justify-center items-center pb-10">
        <div className="w-full text-center">
          <div className="flex flex justify-center items-center grid grid-cols-3">
            <div className="flex">
              <a
                href="/dashboard?back=true"
                className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-4 rounded-lg gap-2"
              >
                <ArrowBackIcon />
                <h1 className="text-[16px] font-medium">Back</h1>
              </a>
            </div>
            <div className="w-full flex justify-center items-center gap-x-4">
              <Avatar alt="avatar" src={app?.app_thumbnail} />
              <div className="flex flex-col justify-center items-start">
                <h1 className="text-[18px] font-semibold">{app?.app_name}</h1>
                <h1>{app?.app_developer}</h1>
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              <h1 className="text-[16px]">{getCategoryName(app?.category_id)}: <strong>{getCurrentIndexApp(app?.category_id, app?.app_id)}/{getLenghtOfAppInCategory(app?.category_id)}</strong></h1>
              <button
                onClick={prevApp}
                className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-2 rounded-lg gap-2"
              >
                <ArrowBackIcon />
              </button>
              <button
                onClick={nextApp}
                className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-2 rounded-lg gap-2"
              >
                <ArrowForwardIcon />
              </button>
            </div>
          </div>
          <div className="w-full flex justify-center items-center text-center mt-4">
            <h1
              onClick={() => directToUrl(`https://play.google.com/store/apps/details?id=${app?.app_pkg}&hl=vi&gl=US`)}
              className="text-blue-500 cursor-pointer"
            >
              https://play.google.com/store/apps/details?id={app?.app_pkg}&hl=vi&gl=US
            </h1>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 mt-10">
          <div className="border border-gray-300 flex flex-col justify-start items-center rounded-md px-2">
            <div className="w-full py-4 bg-green-500 flex justify-center items-center mt-2 rounded-md gap-2">
              <h1 className="text-[18px] text-white font-bold">Data Safety</h1>
              <div className="cursor-pointer" onClick={() => directToUrl(app?.data_safety_url)}><OpenInNewIcon color={"action"} /></div>
            </div>
            <div className="w-full mt-4 mb-2 flex justify-center items-center gap-4">
              <a
                href="https://support.google.com/googleplay/answer/11416267?hl=en&visit_id=638484374256740775-3972164913&p=data-safety&rd=1#zippy=%2Cdata-types"
                target="_blank"
                className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-2 rounded-lg gap-2"
              >
                Data Types Description <OpenInNewIcon fontSize="small" />
              </a>
              <a
                href="https://support.google.com/googleplay/answer/11416267?hl=en&visit_id=638484374256740775-3972164913&p=data-safety&rd=1#zippy=%2Cdata-purposes"
                target="_blank"
                className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-2 rounded-lg gap-2"
              >
                Data Purposes Description <OpenInNewIcon fontSize="small" />
              </a>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2">
              <h1 className="text-[16px] font-semibold">Data shared</h1>
              <div className="w-full grid grid-cols-4 gap-1">
                {handleDataSafety(app?.data_safety_content, 'shared')?.map((item: any, index: any) => {
                  return item
                })}
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2">
              <h1 className="text-[16px] font-semibold">Data collected</h1>
              <div className="w-full grid grid-cols-4 gap-1">
                {handleDataSafety(app?.data_safety_content, 'collected')?.map((item: any, index: any) => {
                  return item
                })}
              </div>
            </div>
          </div>
          <div className="border border-gray-300 flex flex-col justify-start items-center rounded-md px-2">
            <div className="w-full py-4 bg-purple-500 flex justify-center items-center mt-2 rounded-md gap-2">
              <h1 className="text-[18px] text-white font-bold">Privacy Policy</h1>
              <div className="cursor-pointer" onClick={() => directToUrl(app?.privacy_policy_url)}><OpenInNewIcon color={"action"} /></div>
            </div>
            <div className="w-full mt-4 mb-2 flex justify-center items-center gap-4">
              <a
                href="https://support.google.com/googleplay/answer/11416267?hl=en&visit_id=638484374256740775-3972164913&p=data-safety&rd=1#zippy=%2Cdata-collection"
                target="_blank"
                className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-2 rounded-lg gap-2"
              >
                Data Collecting Exception <OpenInNewIcon fontSize="small" />
              </a>
              <a
                href="https://support.google.com/googleplay/answer/11416267?hl=en&visit_id=638484374256740775-3972164913&p=data-safety&rd=1#zippy=%2Cdata-sharing"
                target="_blank"
                className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-2 rounded-lg gap-2"
              >
                Data Sharing Exception <OpenInNewIcon fontSize="small" />
              </a>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2 text-justify">
              <h1 className="text-[16px] font-semibold">Data shared</h1>
              <p className="text-[13px]">{splitDataSections(app?.privacy_policy_content)?.dataShare || splitDataSectionsNull(app?.privacy_policy_content)?.dataShare}</p>
            </div>
            <div className="w-full flex flex-col gap-y-1 py-2 text-justify">
              <h1 className="text-[16px] font-semibold">Data collected</h1>
              <p className="text-[13px]">{splitDataSections(app?.privacy_policy_content)?.dataCollect || splitDataSectionsNull(app?.privacy_policy_content)?.dataCollect}</p>
            </div>
          </div>
        </div>
        <div className="w-full mt-10 flex flex-col justify-center items-center gap-4">
          <div className="w-full flex items-center justify-center gap-4 border border-gray-300 rounded-lg">
            <div className="w-1/6 flex flex-row items-center justify-center pl-4 gap-4">
              <div className="w-full flex flex-col items-center justify-center">
                <button onClick={() => setLabelOne('')} className={`py-6 w-full bg-red-200 border border-red-400 rounded-md`}>Clear</button>
              </div>
              <div className="w-full flex flex-col items-center justify-center gap-4">
                <button onClick={() => setLabelOne('Correct')} className={`py-2 w-full ${labelOne === 'Correct' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-gray-200'} rounded-md`}>Correct</button>
                <button onClick={() => setLabelOne('Incorrect')} className={`py-2 w-full ${labelOne === 'Incorrect' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-gray-200'} rounded-md`}>Incorrect</button>
              </div>
            </div>
            <div className="w-5/6 pr-4 flex items-center justify-center grid grid-cols-2 gap-4">
              <div className="bg-gray-100 flex border border-[2px] border-gray-300 rounded-lg pr-10 pb-10 my-4 pl-2 pt-2">
                <input
                  type="text"
                  placeholder="Enter your the reason . . ."
                  onChange={(e: any) => {
                    setLabelOneDesc(e.target.value)
                  }}
                  value={labelOneDesc}
                  className="pl-2 py-2 w-full bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none border-transparent focus:border-transparent focus:ring-0"
                />
              </div>
              <div className="bg-gray-100 flex border border-[2px] border-gray-300 rounded-lg pr-10 pb-10 my-4 pl-2 pt-2">
                <input
                  type="text"
                  placeholder="Enter the relevant . . ."
                  onChange={(e: any) => {
                    setRelevantOne(e.target.value)
                  }}
                  value={relevantOne}
                  className="pl-2 py-2 w-full bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none border-transparent focus:border-transparent focus:ring-0"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-4 border border-gray-300 rounded-lg">
            <div className="w-1/6 flex flex-row items-center justify-center pl-4 gap-4">
              <div className="w-full flex flex-col items-center justify-center">
                <button onClick={() => setLabelTwo('')} className={`py-6 w-full bg-red-200 border border-red-400 rounded-md`}>Clear</button>
              </div>
              <div className="w-full flex flex-col items-center justify-center gap-4">
                <button onClick={() => setLabelTwo('Complete')} className={`py-2 w-full ${labelTwo === 'Complete' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-gray-200'} rounded-md`}>Complete</button>
                <button onClick={() => setLabelTwo('Incomplete')} className={`py-2 w-full ${labelTwo === 'Incomplete' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-gray-200'} rounded-md`}>Incomplete</button>
              </div>
            </div>
            <div className="w-5/6 pr-4 flex items-center justify-center grid grid-cols-2 gap-4">
              <div className="bg-gray-100 flex border border-[2px] border-gray-300 rounded-lg pr-10 pb-10 my-4 pl-2 pt-2">
                <input
                  type="text"
                  placeholder="Enter your the reason . . ."
                  onChange={(e: any) => {
                    setLabelTwoDesc(e.target.value)
                  }}
                  value={labelTwoDesc}
                  className="pl-2 py-2 w-full bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none border-transparent focus:border-transparent focus:ring-0"
                />
              </div>
              <div className="bg-gray-100 flex border border-[2px] border-gray-300 rounded-lg pr-10 pb-10 my-4 pl-2 pt-2">
                <input
                  type="text"
                  placeholder="Enter the relevant . . ."
                  onChange={(e: any) => {
                    setRelevantTwo(e.target.value)
                  }}
                  value={relevantTwo}
                  className="pl-2 py-2 w-full bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none border-transparent focus:border-transparent focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-6">
          <div onClick={handleSubmit} className="py-2 px-20 bg-blue-500 flex justify-center items-center mt-10 rounded-md cursor-pointer hover:opacity-70">
            <h1 className="text-[18px] text-white font-bold">Submit</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
