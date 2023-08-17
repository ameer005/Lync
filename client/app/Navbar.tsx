"use client";

import Logo from "@/components/ui/Logo";
import BtnPrimary from "@/components/ui/buttons/BtnPrimary";
import usePageLoaded from "@/hooks/usePageLoaded";
import useStore from "@/store/useStore";
import ProfileDropdown from "@/components/ui/dropdowns/ProfileDropdown";

const Navbar = () => {
  const isPageLoaded = usePageLoaded();
  const user = useStore((state) => state.user);
  const setModalState = useStore((state) => state.setModalState);

  return (
    <div className="flex items-center justify-between h-[4.5rem]">
      <div>
        <Logo />
      </div>
      <div>
        {isPageLoaded && user ? (
          <ProfileDropdown user={user} />
        ) : (
          <BtnPrimary
            onClick={() => setModalState({ showAuthModal: true })}
            className="py-2 px-8 sm:px-5  text-colorBg font-bold rounded-md"
            name="Login"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
