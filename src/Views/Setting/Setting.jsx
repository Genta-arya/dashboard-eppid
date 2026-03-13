import React from "react";
import { Helmet } from "react-helmet-async";
import MenuSetting from "./MenuSetting";

const Setting = () => {
  return (
    <>
      <Helmet>
        <title>Setting - e-PPID Kabupaten Sekadau</title>
      </Helmet>
      <MenuSetting />

      <div className="border rounded-lg overflow-hidden shadow mt-8">
        <p className="text-center font-bold border-8">
            Preview Web e-PPID
        </p>
        <iframe
          src="https://beta-ppid-kab-sekadau.vercel.app/"
          title="Preview Web e-PPID"
          width="100%"
          height="600px"
          className="w-full border-none"
        ></iframe>
      </div>
    </>
  );
};

export default Setting;
