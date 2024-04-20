"use client";

import React from "react";
import BoxWrapper from "@/components/common/box-wrapper";
import { NextPage } from "next";
import { Suspense } from 'react'
import StatisticalContainer from "@/components/modules/statistical/container";

function StatisticalFallback() {
  return <>...</>
}

const StatisticalServer: NextPage<any> = async () => {
  return (
    <BoxWrapper>
      <Suspense fallback={<StatisticalFallback />}>
        <div className="w-full h-screen flex justify-center items-center">
          <StatisticalContainer />
        </div>
      </Suspense>

    </BoxWrapper>
  );
};

export default StatisticalServer;
