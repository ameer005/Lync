import { twMerge } from "tailwind-merge";
import { IconType } from "react-icons";

interface ComponentProps {
  className?: string;
  state: boolean;
  onClick?: () => void;
  trueLogo: any;
  falseLogo: any;
  tooltip?: string;
}

const VideoControlBtn = ({
  className,
  falseLogo,
  state,
  trueLogo,
  onClick,
  tooltip,
}: ComponentProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full relative ut-animation py-2 px-2 flex justify-center items-center  ${twMerge(
        className
      )} `}
    >
      {state ? trueLogo : falseLogo}

      {/* {tooltip && (
        <div className="absolute -top-10 whitespace-nowrap bg-colorSecondary2 px-2 py-1 text-xs left-[50%] -translate-x-[50%]">
          {tooltip}
        </div>
      )} */}
    </button>
  );
};

export default VideoControlBtn;
