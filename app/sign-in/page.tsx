'use client';

import React from "react";
import BoxWrapper from "@/components/common/box-wrapper";
import { NextPage } from "next";
import SignInContainer from "@/components/modules/auth/sign-in/container";
import { Suspense } from 'react'

function SignInFallback() {
  return <>...</>
}

const SignInServer: NextPage<any> = async () => {
  return (
    <BoxWrapper>
      <Suspense fallback={<SignInFallback />}>
        <div className="w-full h-screen flex justify-center items-center">
          <SignInContainer />
        </div>
      </Suspense>
    </BoxWrapper>
  );
};

export default SignInServer;
