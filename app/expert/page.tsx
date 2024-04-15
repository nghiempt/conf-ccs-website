"use client";

import React from "react";
import BoxWrapper from "@/components/common/box-wrapper";
import { NextPage } from "next";
import { Suspense } from 'react'
import ExpertContainer from "@/components/modules/expert/container";

function ExpertFallback() {
  return <>...</>
}

const ExpertServer: NextPage<any> = async () => {
  return (
    <BoxWrapper>
      <Suspense fallback={<ExpertFallback />}>
        <div className="w-full h-screen flex justify-center items-center">
          <ExpertContainer />
        </div>
      </Suspense>

    </BoxWrapper>
  );
};

export default ExpertServer;
