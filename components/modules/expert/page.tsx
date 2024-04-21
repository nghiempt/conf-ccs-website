"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CREATE_EXPERT, GET_ALL_APPS, GET_ALL_EXPERTS } from "@/fetch/fetch_data";
import { Snackbar, Avatar } from "@mui/material";
import Cookie from 'js-cookie';
import { ROUTE } from "@/constant/route";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
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

  const [labelOneS, setLabelOneS] = useState('');
  const [labelTwoS, setLabelTwoS] = useState('');
  const [relevantOneS, setRelevantOneS] = useState('');
  const [labelOneDescS, setLabelOneDescS] = useState('');
  const [labelTwoDescS, setLabelTwoDescS] = useState('');
  const [relevantTwoS, setRelevantTwoS] = useState('');

  const [labelOneC, setLabelOneC] = useState('');
  const [labelTwoC, setLabelTwoC] = useState('');
  const [relevantOneC, setRelevantOneC] = useState('');
  const [labelOneDescC, setLabelOneDescC] = useState('');
  const [labelTwoDescC, setLabelTwoDescC] = useState('');
  const [relevantTwoC, setRelevantTwoC] = useState('');

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
      console.log(dataShared);
      console.log(dataCollected);
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
                  <br />
                  <strong>Optional:</strong> {item?.optional?.toString()}
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
                  <br />
                  <strong>Optional:</strong> {item?.optional?.toString()}
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
        return 'Beauty';
    }
  }

  const getLenghtOfAppInCategory = (category_id: number) => {
    return apps?.filter((item: any) => item?.category_id === category_id).length;
  }

  const getCurrentIndexApp = (apps: any, category_id: any, app: any) => {
    let tmp = apps?.filter((item: any) => item?.category_id === category_id);
    tmp = tmp.sort((a: any, b: any) => {
      return a.app_id - b.app_id;
    });
    return tmp.indexOf(app) + 1;
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
    const collectIndex = data?.indexOf("Data Collect:");
    sections.dataShare = data?.substring(0, collectIndex)?.trim();
    sections.dataCollect = data?.substring(collectIndex)?.trim();
    return sections;
  }

  const splitDataSectionsNull = (data: any) => {
    const sections: any = {};
    const dataShareMatch = data?.match(/- Data Share:/);
    const dataCollectMatch = data?.match(/- Data Collect:/);
    if (dataShareMatch && dataCollectMatch) {
      sections.dataShare = data?.substring(dataShareMatch.index, dataCollectMatch.index)?.trim()?.replace(/-/g, '');
      sections.dataCollect = data?.substring(dataCollectMatch.index).trim()?.replace(/-/g, '');
    } else {
      return null;
    }
    return sections;
  }

  const handleSubmit = async () => {
    if (!isSignedIn) {
      window.location.href = ROUTE.SIGN_IN;
      return;
    }
    const payload = {
      account_id: JSON.parse(account || '')?.account_id,
      app_id: app?.app_id,
      category_id: app?.category_id,
      label_one_s: labelOneS,
      label_two_s: labelTwoS,
      relevant_one_s: relevantOneS,
      label_one_desc_s: labelOneDescS,
      label_two_desc_s: labelTwoDescS,
      relevant_two_s: relevantTwoS,
      label_one_c: labelOneC,
      label_two_c: labelTwoC,
      relevant_one_c: relevantOneC,
      label_one_desc_c: labelOneDescC,
      label_two_desc_c: labelTwoDescC,
      relevant_two_c: relevantTwoC
    }
    const fetchCreateExpert = await CREATE_EXPERT(payload)
    if (getCurrentIndexApp(apps, app?.category_id, app) === getLenghtOfAppInCategory(app?.category_id)) {
      router.push(ROUTE.DASHBOARD + '?back=true&category=' + app?.category_id)
    } else {
      nextApp()
    }
  };

  const init = async () => {
    const fetchApps = await GET_ALL_APPS()
    setApps(fetchApps || []);

    let foundItem: any = fetchApps?.find((item: any) => item?.app_id.toString() === (searchParams.get('appId') || '1'));
    setApp(foundItem)

    const fetchExperts = await GET_ALL_EXPERTS()
    setExperts(fetchExperts || []);

    let foundExperts: any = fetchExperts?.find((item: any) => {
      if (
        (item?.app_id.toString() === (searchParams.get('appId') || '1')
          &&
          item?.account_id.toString() === (JSON.parse(account || '')?.account_id.toString()))
      ) {
        return item
      }
    });
    if (foundExperts) {
      setLabelOneS(foundExperts?.label_one_s)
      setLabelTwoS(foundExperts?.label_two_s)
      setRelevantOneS(foundExperts?.relevant_one_s)
      setLabelOneDescS(foundExperts?.label_one_desc_s)
      setLabelTwoDescS(foundExperts?.label_two_desc_s)
      setRelevantTwoS(foundExperts?.relevant_two_s)
      setLabelOneC(foundExperts?.label_one_c)
      setLabelTwoC(foundExperts?.label_two_c)
      setRelevantOneC(foundExperts?.relevant_one_c)
      setLabelOneDescC(foundExperts?.label_one_desc_c)
      setLabelTwoDescC(foundExperts?.label_two_desc_c)
      setRelevantTwoC(foundExperts?.relevant_two_c)
    }
  };

  useEffect(() => {
    setIsMounted(true);
    init();
  }, []);

  useEffect(() => { }, [app, apps, experts, openAlert, labelOneS, labelTwoS, relevantOneS, labelOneDescS, labelTwoDescS, relevantTwoS, labelOneC, labelTwoC, relevantOneC, labelOneDescC, labelTwoDescC, relevantTwoC]);

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
          <div className="flex justify-center items-center grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0">
            <div className="flex">
              <a
                href={`/dashboard?back=true&category=${app?.category_id}`}
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
              <h1 className="text-[16px]">{getCategoryName(app?.category_id)}: <strong>{getCurrentIndexApp(apps, app?.category_id, app)}/{getLenghtOfAppInCategory(app?.category_id)}</strong></h1>
              {
                getCurrentIndexApp(apps, app?.category_id, app) !== 1 && (
                  <button
                    onClick={prevApp}
                    className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-2 rounded-lg gap-2"
                  >
                    <ArrowBackIcon />
                  </button>
                )
              }
              {
                getCurrentIndexApp(apps, app?.category_id, app) !== getLenghtOfAppInCategory(app?.category_id) && (
                  <button
                    onClick={nextApp}
                    className="cursor-pointer hover:opacity-80 flex justify-start items-center bg-gray-200 py-1 px-2 rounded-lg gap-2"
                  >
                    <ArrowForwardIcon />
                  </button>
                )
              }
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
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
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
        <div className="w-full flex justify-start items-center mt-8 mb-4">
          <h1 className="text-lg text-gray-700 font-bold">Let me know what you think about Data Shared.</h1>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 border border-gray-300 rounded-lg">
            <div className="w-5/6 lg:w-1/6 flex flex-row items-center justify-center lg:pl-4 gap-4 mt-4 lg:mt-0">
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="w-full flex items-center justify-center gap-2">
                  <button onClick={() => setLabelOneS('Correct')} className={`py-2 w-full ${labelOneS === 'Correct' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-2 border-[#eee]'} rounded-md`}>Correct</button>
                  <button onClick={() => setLabelOneS('')} className="py-2 w-1/5 bg-gray-100 border border-2 border-[#eee] rounded-md"><CloseIcon /></button>
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                  <button onClick={() => setLabelOneS('Incorrect')} className={`py-2 w-full ${labelOneS === 'Incorrect' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-2 border-[#eee]'} rounded-md`}>Incorrect</button>
                  <button onClick={() => setLabelOneS('')} className="py-2 w-1/5 bg-gray-100 border border-2 border-[#eee] rounded-md"><CloseIcon /></button>
                </div>
              </div>
            </div>
            <div className="w-5/6 lg:pr-8 flex items-center justify-center grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 pb-4 lg:py-4">
              <textarea
                rows={4}
                cols={50}
                placeholder="Enter your the reason . . ."
                onChange={(e: any) => {
                  setLabelOneDescS(e.target.value)
                }}
                value={labelOneDescS}
                className="lg:pl-3 pt-3 w-full rounded-md border border-2 border-[#eee] bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none focus:border-[#aaa] focus:ring-0"
              />
              <textarea
                rows={4}
                cols={50}
                placeholder="Enter your the relevant . . ."
                onChange={(e: any) => {
                  setRelevantOneS(e.target.value)
                }}
                value={relevantOneS}
                className="lg:pl-3 pt-3 w-full rounded-md border border-2 border-[#eee] bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none focus:border-[#aaa] focus:ring-0"
              />
            </div>
          </div>
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 border border-gray-300 rounded-lg">
            <div className="w-5/6 lg:w-1/6 flex flex-row items-center justify-center lg:pl-4 gap-4 mt-4 lg:mt-0">
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="w-full flex items-center justify-center gap-2">
                  <button onClick={() => setLabelTwoS('Complete')} className={`py-2 w-full ${labelTwoS === 'Complete' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-2 border-[#eee]'} rounded-md`}>Complete</button>
                  <button onClick={() => setLabelTwoS('')} className="py-2 w-1/5 bg-gray-100 border border-2 border-[#eee] rounded-md"><CloseIcon /></button>
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                  <button onClick={() => setLabelTwoS('Incomplete')} className={`py-2 w-full ${labelTwoS === 'Incomplete' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-2 border-[#eee]'} rounded-md`}>Incomplete</button>
                  <button onClick={() => setLabelTwoS('')} className="py-2 w-1/5 bg-gray-100 border border-2 border-[#eee] rounded-md"><CloseIcon /></button>
                </div>
              </div>
            </div>
            <div className="w-5/6 lg:pr-8 flex items-center justify-center grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 pb-4 lg:py-4">
              <textarea
                rows={4}
                cols={50}
                placeholder="Enter your the reason . . ."
                onChange={(e: any) => {
                  setLabelTwoDescS(e.target.value)
                }}
                value={labelTwoDescS}
                className="lg:pl-3 pt-3 w-full rounded-md border border-2 border-[#eee] bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none focus:border-[#aaa] focus:ring-0"
              />
              <textarea
                rows={4}
                cols={50}
                placeholder="Enter your the relevant . . ."
                onChange={(e: any) => {
                  setRelevantTwoS(e.target.value)
                }}
                value={relevantTwoS}
                className="lg:pl-3 pt-3 w-full rounded-md border border-2 border-[#eee] bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none focus:border-[#aaa] focus:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="w-full flex justify-start items-center mt-8 mb-4">
          <h1 className="text-lg text-gray-700 font-bold">Let me know what you think about Data Collected.</h1>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-4">
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 border border-gray-300 rounded-lg">
            <div className="w-5/6 lg:w-1/6 flex flex-row items-center justify-center lg:pl-4 gap-4 mt-4 lg:mt-0">
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="w-full flex items-center justify-center gap-2">
                  <button onClick={() => setLabelOneC('Correct')} className={`py-2 w-full ${labelOneC === 'Correct' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-2 border-[#eee]'} rounded-md`}>Correct</button>
                  <button onClick={() => setLabelOneC('')} className="py-2 w-1/5 bg-gray-100 border border-2 border-[#eee] rounded-md"><CloseIcon /></button>
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                  <button onClick={() => setLabelOneC('Incorrect')} className={`py-2 w-full ${labelOneC === 'Incorrect' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-2 border-[#eee]'} rounded-md`}>Incorrect</button>
                  <button onClick={() => setLabelOneC('')} className="py-2 w-1/5 bg-gray-100 border border-2 border-[#eee] rounded-md"><CloseIcon /></button>
                </div>
              </div>
            </div>
            <div className="w-5/6 lg:pr-8 flex items-center justify-center grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 pb-4 lg:py-4">
              <textarea
                rows={4}
                cols={50}
                placeholder="Enter your the reason . . ."
                onChange={(e: any) => {
                  setLabelOneDescC(e.target.value)
                }}
                value={labelOneDescC}
                className="lg:pl-3 pt-3 w-full rounded-md border border-2 border-[#eee] bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none focus:border-[#aaa] focus:ring-0"
              />
              <textarea
                rows={4}
                cols={50}
                placeholder="Enter your the relevant . . ."
                onChange={(e: any) => {
                  setRelevantOneC(e.target.value)
                }}
                value={relevantOneC}
                className="lg:pl-3 pt-3 w-full rounded-md border border-2 border-[#eee] bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none focus:border-[#aaa] focus:ring-0"
              />
            </div>
          </div>
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 border border-gray-300 rounded-lg">
            <div className="w-5/6 lg:w-1/6 flex flex-row items-center justify-center lg:pl-4 gap-4 mt-4 lg:mt-0">
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="w-full flex items-center justify-center gap-2">
                  <button onClick={() => setLabelTwoC('Complete')} className={`py-2 w-full ${labelTwoC === 'Complete' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-2 border-[#eee]'} rounded-md`}>Complete</button>
                  <button onClick={() => setLabelTwoC('')} className="py-2 w-1/5 bg-gray-100 border border-2 border-[#eee] rounded-md"><CloseIcon /></button>
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                  <button onClick={() => setLabelTwoC('Incomplete')} className={`py-2 w-full ${labelTwoC === 'Incomplete' ? 'bg-green-300 border border-green-500' : 'bg-gray-100 border border-2 border-[#eee]'} rounded-md`}>Incomplete</button>
                  <button onClick={() => setLabelTwoC('')} className="py-2 w-1/5 bg-gray-100 border border-2 border-[#eee] rounded-md"><CloseIcon /></button>
                </div>
              </div>
            </div>
            <div className="w-5/6 lg:pr-8 flex items-center justify-center grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 pb-4 lg:py-4">
              <textarea
                rows={4}
                cols={50}
                placeholder="Enter your the reason . . ."
                onChange={(e: any) => {
                  setLabelTwoDescC(e.target.value)
                }}
                value={labelTwoDescC}
                className="lg:pl-3 pt-3 w-full rounded-md border border-2 border-[#eee] bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none focus:border-[#aaa] focus:ring-0"
              />
              <textarea
                rows={4}
                cols={50}
                placeholder="Enter your the relevant . . ."
                onChange={(e: any) => {
                  setRelevantTwoC(e.target.value)
                }}
                value={relevantTwoC}
                className="lg:pl-3 pt-3 w-full rounded-md border border-2 border-[#eee] bg-gray-100 placeholder-gray-500 font-medium text-gray-700 outline-none focus:border-[#aaa] focus:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center gap-6">
          <div onClick={handleSubmit} className="py-2 px-20 bg-blue-500 flex justify-center items-center mt-10 rounded-md cursor-pointer hover:opacity-70">
            <h1 className="text-[18px] text-white font-bold">Save App</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
