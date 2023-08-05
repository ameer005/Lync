import { Dispatch, SetStateAction } from "react";
interface ComponentProps {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
  label: string;
}

const Switch = ({ setState, state, label }: ComponentProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setState((prev) => !prev)}
        type="button"
        className="relative"
      >
        <div className="bg-gray-400 w-[2.2rem] h-4 rounded-full"></div>
        <div
          className={`h-[1.1rem] ut-animation w-4 left-0 rounded-full absolute  top-[50%] -translate-y-[50%]  ${
            state ? "bg-colorAccent1 translate-x-[1.3rem]" : "bg-gray-300 "
          }`}
        ></div>
      </button>
      <div>{label}</div>
    </div>
  );
};

export default Switch;
