'use client';

import React from "react";
import BoxWrapper from "@/components/common/box-wrapper";
import { NextPage } from "next";
import { Suspense } from 'react'
import DashboardContainer from "@/components/modules/dashboard/container";

function DashboardFallback() {
  return <>...</>
}

const DashboardServer: NextPage<any> = async () => {
  return (
    <BoxWrapper>
      <Suspense fallback={<DashboardFallback />}>
        <div className="w-full h-screen flex justify-center items-center">
          <DashboardContainer />
        </div>
      </Suspense>
    </BoxWrapper>
  );
};

export default DashboardServer;
