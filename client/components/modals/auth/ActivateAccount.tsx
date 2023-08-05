import { schemaActivateAccount } from "@/utils/schemas";
import { useForm, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useStore from "@/store/useStore";
import BtnPrimary from "@/components/ui/buttons/BtnPrimary";
import InputField2 from "@/components/form/InputField2";
import LoadingCircle from "@/components/ui/LoadingSpinners/LoadingCircle";
import {
  useActivateAccount,
  useResendActivatonCode,
} from "@/hooks/queries/useAuth";

const ActivateAccount = () => {
  const setOptions = useStore((state) => state.setOptions);
  const email = useStore((state) => state.email);
  const { mutate: activateAccount, isLoading: activateAccountLoading } =
    useActivateAccount();
  const { mutate: resendCode, isLoading: resendCodeLoading } =
    useResendActivatonCode();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schemaActivateAccount),
  });

  const submitForm = (formData: FieldValues) => {
    activateAccount({ ...formData, email });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {/* Heading */}
      {/* Heading */}
      <div className="text-lg flex justify-center mb-6">
        <h3>Activate Account</h3>
      </div>

      {/* input fields */}
      <div className="flex flex-col gap-4 mb-4">
        <InputField2
          errors={errors}
          labelText={"Code"}
          name={"code"}
          type={"text"}
          register={register}
        />
      </div>

      <div className="flex flex-col gap-1 justify-center text-sm mb-8 text-center text-colorText">
        <div>We have sent you an Email with verification code</div>
        <div>
          Did'nt recieve code?{" "}
          <button
            type="button"
            onClick={() => resendCode({ email: email })}
            className="text-colorAccent2"
          >
            {resendCodeLoading ? <LoadingCircle /> : "Resend"}
          </button>
        </div>
      </div>

      {/* Buttons group */}
      <div className="flex flex-col gap-4">
        <BtnPrimary
          isLoading={activateAccountLoading}
          name={"Confirm"}
          className="text-colorBg font-medium rounded-lg "
          type={"submit"}
        />

        <div className="flex items-center justify-center gap-2 ">
          <span>Already have an account?</span>
          <button
            onClick={() => setOptions({ authScreen: "Login" })}
            className="text-colorAccent2"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default ActivateAccount;
