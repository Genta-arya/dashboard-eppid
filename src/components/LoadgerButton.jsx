import React from "react";
import { BeatLoader, ScaleLoader } from "react-spinners";

const LoadgerButton = () => {
  return (
    <div className="flex items-center justify-center">
      {" "}
      <BeatLoader color="#fff" size={10}  />
    </div>
  );
};

export default LoadgerButton;
