import React from "react";
import { ClipLoader } from "react-spinners"; // Import spinner dari react-spinners

const Loading = () => {
  return (
    <div className="flex flex-col items-center    justify-center min-h-screen bg-gray-100 animate-pulse">
      <ClipLoader color="#ef4444" loading={true} size={50} />
    </div>
  );
};

export default Loading;
