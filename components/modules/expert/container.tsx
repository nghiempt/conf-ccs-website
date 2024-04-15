"use client";

import React from "react";
import BoxWrapper from "@/components/common/box-wrapper";
import { NextPage } from "next";
import Header from "@/components/common/_header";
import Expert from "./page";

const ExpertContainer: NextPage<any> = async () => {
  return (
    <BoxWrapper>
      <div className="w-full flex justify-center items-center">
        <div className="w-full flex flex-col justify-start items-center">
          <Header />
          <Expert />
        </div>
      </div>
    </BoxWrapper>
  );
};

export default ExpertContainer;
