import React from "react";
import Navigation from "./Navigation";

const Container = ({ children }) => {
  return (
    <>
      <div className=" bg-white ">
        <div className=" py-2 px-3 ">{children}</div>
      </div>
    </>
  );
};

export default Container;
