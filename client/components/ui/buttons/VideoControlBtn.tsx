import { twMerge } from "tailwind-merge";
import { IconType } from "react-icons";

interface ComponentProps {
  className?: string;
  state: boolean;
  onClick?: () => void;
  trueLogo: any;
  falseLogo: any;
}

const VideoControlBtn = ({
  className,
  falseLogo,
  state,
  trueLogo,
  onClick,
}: ComponentProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full ut-animation py-2 px-2 flex justify-center items-center  ${twMerge(
        className
      )} `}
    >
      {state ? trueLogo : falseLogo}
    </button>
  );
};

export default VideoControlBtn;
