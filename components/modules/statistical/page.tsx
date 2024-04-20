"use client";

import React, { useEffect, useState } from "react";
import Cookie from 'js-cookie';

export default function Statistical() {

  const isSignedIn = Cookie.get('isSignedIn') === 'true';

  return (
    <div className="w-3/4 flex flex-col justify-center items-center">
      Statistical
    </div>
  );
}
