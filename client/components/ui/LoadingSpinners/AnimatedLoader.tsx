import Image from "next/image";
import React from "react";
import LoadingImg from "../../../public/images/loading.gif";

interface Props {
  width?: string;
}

const AnimatedLoader = ({ width = "w-20" }: Props) => {
  return (
    <div className={`relative flex ${width}`}>
      <Image src={LoadingImg} alt="logo" />
    </div>
  );
};

export default AnimatedLoader;
