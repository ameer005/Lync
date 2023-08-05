import ReactDom from "react-dom";
import useStore from "@/store/useStore";
import { MdOutlineClose } from "react-icons/md";
import Login from "./Login";
import Signup from "./Signup";
import ActivateAccount from "./ActivateAccount";
import ForgotPassword from "./ForgotPassword";
import ValidateForgotPassword from "./ValidateForgotPassword";
const AuthModal = () => {
  const setModalState = useStore((state) => state.setModalState);
  const authScreen = useStore((state) => state.authScreen);

  return ReactDom.createPortal(
    <div
      onClick={() => setModalState({ showAuthModal: false })}
      className="fixed top-0 bottom-0 right-0 left-0 bg-black/40 flex items-center justify-center z-[99]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-colorSecondary w-full max-w-[30rem] relative py-10 px-6  text-colorBlack rounded-lg overflow-hidden m-8 sm:m-4"
      >
        {/* right box */}
        {authScreen === "Login" && <Login />}
        {authScreen === "Sign Up" && <Signup />}
        {authScreen === "Verify" && <ActivateAccount />}
        {authScreen === "Forgot Password" && <ForgotPassword />}
        {authScreen === "Validate Forgot" && <ValidateForgotPassword />}
        {/* close button */}
        <MdOutlineClose
          onClick={() => setModalState({ showAuthModal: false })}
          className="text-xl absolute top-4 right-4 text-colorText cursor-pointer"
        />
      </div>
    </div>,
    document.getElementById("modal-auth")!
  );
};

export default AuthModal;
