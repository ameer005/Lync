import LoadingCircle from "../LoadingSpinners/LoadingCircle";
import { twMerge } from "tailwind-merge";

interface ComponentProps {
  type?: "submit" | "button";
  className?: string;
  name: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const BtnPrimary = ({
  type,
  className,
  name,
  isLoading,
  onClick,
}: ComponentProps) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`${twMerge(
        "w-full py-[14px] bg-colorPrimary hover:bg-colorPrimaryLight px-4 text-sm font-medium ut-animation",
        className
      )} `}
    >
      {isLoading ? <LoadingCircle /> : name}
    </button>
  );
};

export default BtnPrimary;
