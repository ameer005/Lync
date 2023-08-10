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
      className={`rounded-full flex justify-center items-center h-10 w-10 ${twMerge(
        className
      )} `}
    >
      {state ? trueLogo : falseLogo}
    </button>
  );
};

export default VideoControlBtn;
