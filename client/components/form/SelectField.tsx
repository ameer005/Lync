import { useRef } from "react";
import { BiChevronUp, BiChevronDown } from "react-icons/bi";
import { Dispatch, SetStateAction } from "react";
import useCloseDropdown from "../../hooks/useCloseDropdown";

interface SelectFieldProps {
  setSelectOpen: Dispatch<SetStateAction<boolean>>;
  selectText: string;
  isSelectOpen: boolean;
  list: () => JSX.Element[];
  optionalText?: string;
}

const SelectField = ({
  setSelectOpen,
  selectText,
  isSelectOpen,
  list,
  optionalText,
}: SelectFieldProps) => {
  const selectRef = useRef<HTMLDivElement>(null);

  useCloseDropdown({
    ref: selectRef,
    isOpen: isSelectOpen,
    setIsOpen: setSelectOpen,
  });

  return (
    <div ref={selectRef} className="relative w-full ">
      <div
        onClick={() => setSelectOpen((prev) => !prev)}
        className=" bg-colorTeriroty flex w-full cursor-pointer items-center justify-between rounded-md py-3 px-5"
      >
        <span className="font-medium">{selectText || optionalText}</span>
        {isSelectOpen ? (
          <BiChevronUp className="text-xl font-medium" />
        ) : (
          <BiChevronDown className="text-xl font-medium" />
        )}
      </div>

      <div
        className={`scrollbar-dropdown  bg-colorTeriroty absolute top-[115%] left-0 z-[200] flex max-h-48 w-full flex-col gap-1  overflow-y-scroll rounded-sm py-3 px-1 shadow-md ${
          !isSelectOpen && "hidden"
        }`}
      >
        {list()}
      </div>
    </div>
  );
};

export default SelectField;
