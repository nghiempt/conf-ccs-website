"use client";

import React from "react";
import BoxWrapper from "@/components/common/box-wrapper";
import { NextPage } from "next";
import SignIn from "./sign-in";

const SignInContainer: NextPage<any> = async () => {
  return (
    <BoxWrapper>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <SignIn />
        </div>
      </div>
    </BoxWrapper>
  );
};

export default SignInContainer;
