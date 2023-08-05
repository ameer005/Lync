"use client";

import Logo from "@/components/ui/Logo";
import BtnPrimary from "@/components/ui/buttons/BtnPrimary";
import useStore from "@/store/useStore";

const Navbar = () => {
  const setModalState = useStore((state) => state.setModalState);
  return (
    <div className="flex items-center justify-between h-[4.5rem]">
      <div>
        <Logo />
      </div>
      <div>
        <BtnPrimary
          onClick={() => setModalState({ showAuthModal: true })}
          className="py-2 px-8 sm:px-5  text-colorBg font-bold rounded-md"
          name="Login"
        />
      </div>
    </div>
  );
};

export default Navbar;
