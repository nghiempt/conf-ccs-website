"use client";

import React from "react";
import BoxWrapper from "@/components/common/box-wrapper";
import { NextPage } from "next";
import Home from "./page";

const HomeContainer: NextPage<any> = async () => {
  return (
    <BoxWrapper>
      <div className="w-full flex justify-center items-center">
        <div className="w-full flex flex-col justify-start items-center">
          <Home />
        </div>
      </div>
    </BoxWrapper>
  );
};

export default HomeContainer;
