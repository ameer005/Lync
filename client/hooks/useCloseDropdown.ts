import React, { useEffect } from "react";

interface useCloseDownProps {
  ref: React.RefObject<HTMLElement>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customParam?: boolean;
}

const useCloseDropdown = ({
  ref,
  isOpen,
  setIsOpen,
  customParam,
}: useCloseDownProps) => {
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event?.target as Node)) {
        if (customParam) {
          setIsOpen(customParam);
        } else {
          setIsOpen(false);
        }
      }
    }
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  return null;
};

export default useCloseDropdown;
