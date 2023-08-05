import { schemaValidateForgotPassword } from "@/utils/schemas";
import { useForm, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useStore from "@/store/useStore";
import BtnPrimary from "@/components/ui/buttons/BtnPrimary";
import InputField2 from "@/components/form/InputField2";
import { useValidateForgotPassword } from "@/hooks/queries/useAuth";

const ValidateForgotPassword = () => {
  const setOptions = useStore((state) => state.setOptions);
  const email = useStore((state) => state.email);
  const { mutate, isLoading } = useValidateForgotPassword();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schemaValidateForgotPassword),
  });

  const submitForm = (formData: FieldValues) => {
    mutate({
      email: email!,
      code: formData.code,
      newPassword: formData.newPassword,
    });
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
          labelText={"code"}
          name={"code"}
          type={"text"}
          register={register}
        />
        <InputField2
          errors={errors}
          labelText={"New Password"}
          name={"newPassword"}
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

export default ValidateForgotPassword;
