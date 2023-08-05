import { schemaForgotPassword } from "@/utils/schemas";
import { useForm, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useStore from "@/store/useStore";
import BtnPrimary from "@/components/ui/buttons/BtnPrimary";
import InputField2 from "@/components/form/InputField2";
import { useForgotPassword } from "@/hooks/queries/useAuth";

const ForgotPassword = () => {
  const setOptions = useStore((state) => state.setOptions);
  const setUserEmail = useStore((state) => state.setUserEmail);
  const { mutate, isLoading } = useForgotPassword();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schemaForgotPassword),
  });

  const submitForm = (formData: FieldValues) => {
    setUserEmail(formData.email);

    mutate({ email: formData.email });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {/* Heading */}
      <div className="text-lg flex justify-center mb-6">
        <h3>Forgot Password</h3>
      </div>

      {/* input fields */}
      <div className="flex flex-col gap-4 mb-4">
        <InputField2
          errors={errors}
          labelText={"Email"}
          name={"email"}
          type={"text"}
          register={register}
        />
      </div>

      {/* Buttons group */}
      <div className="flex flex-col gap-4">
        <BtnPrimary
          isLoading={isLoading}
          name={"Submit"}
          className="text-colorBg font-medium rounded-md"
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

export default ForgotPassword;
