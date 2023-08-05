"use client";
import useStore from "@/store/useStore";
import AuthModal from "./auth/AuthModal";

const Global = () => {
  const showAuthModal = useStore((state) => state.showAuthModal);

  return <div>{showAuthModal && <AuthModal />}</div>;
};

export default Global;
