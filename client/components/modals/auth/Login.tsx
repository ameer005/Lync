import { schemaLogin } from "@/utils/schemas";
import { useForm, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useStore from "@/store/useStore";
import BtnPrimary from "@/components/ui/buttons/BtnPrimary";
import InputField2 from "@/components/form/InputField2";
import { useLogin } from "@/hooks/queries/useAuth";

const Login = () => {
  const setOptions = useStore((state) => state.setOptions);
  const setUserEmail = useStore((state) => state.setUserEmail);
  const { mutate, isLoading } = useLogin();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schemaLogin),
  });

  const submitForm = (formData: FieldValues) => {
    setUserEmail(formData.email);

    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div>
        {/* Heading */}
        <div className="text-lg flex justify-center mb-6">
          <h3>Welcome back</h3>
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
          <InputField2
            errors={errors}
            labelText={"Password"}
            name={"password"}
            type={"password"}
            register={register}
          />
        </div>

        {/* remember me and forgot password */}
        <div className="flex justify-between mb-6">
          <div></div>
          <button
            onClick={() => setOptions({ authScreen: "Forgot Password" })}
            type={"button"}
            className="text-xs text-gray-300 hover:text-colorPrimary2 ut-animation"
          >
            Forgot Password?
          </button>
        </div>

        {/* Buttons group */}
        <div className="flex flex-col gap-4 y2">
          <BtnPrimary
            name={"Login"}
            className="text-colorBg font-medium rounded-md"
            isLoading={isLoading}
            type="submit"
          />

          <div className="flex items-center justify-center gap-2 ">
            <span>Don't have an account?</span>
            <button
              onClick={() => setOptions({ authScreen: "Sign Up" })}
              className="text-colorAccent2"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default Login;
