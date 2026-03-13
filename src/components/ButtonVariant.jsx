import React from "react";
import { Button } from "./ui/button";

const ButtonVariant = ({ type, onClick, icon, text, disabled , style }) => {
  return (
    <Button
      disabled={disabled}
      variant={type}
      onClick={onClick}
      className={   ` disabled:bg-gray-400 font-bold md:text-base text-sm w-full justify-center mt-3 transition-colors  ${style ? style : "bg-green-300 hover:opacity-80 "} `}
    >
      {disabled ? (
        <div className="flex gap-2 items-center">
         
          <p>Tunggu Sebentar</p>
        </div>

      ) : (

      <div className="flex gap-2 items-center ">
        {icon}

        <p>{text}</p>
      </div>
      )}
    </Button>
  );
};

export default ButtonVariant;
