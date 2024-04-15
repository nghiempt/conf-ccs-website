'use client';

import React from "react";
import BoxWrapper from "@/components/common/box-wrapper";
import { NextPage } from "next";
import { Suspense } from 'react'
import HomeContainer from "@/components/modules/home/container";

function HomeFallback() {
  return <>...</>
}

const PageServer: NextPage<any> = async () => {
  return (
    <BoxWrapper>
      <Suspense fallback={<HomeFallback />}>
        <div className="w-full h-screen flex justify-center items-center">
          <HomeContainer />
        </div>
      </Suspense>

    </BoxWrapper>
  );
};

export default PageServer;
