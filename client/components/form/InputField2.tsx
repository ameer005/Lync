import { UseFormRegister, FieldValues } from "react-hook-form";

interface inputFieldProps2 {
  name: string;
  errors: any;
  register: UseFormRegister<any>;
  placeholder?: string;
  type?: string;
  labelText?: string;
}

const InputField2 = ({
  name,
  register,
  placeholder,
  type,
  labelText,
  errors,
}: inputFieldProps2) => {
  return (
    <label>
      <div className=" text-colorText mb-2  text-xs font-medium">
        {labelText}
      </div>
      <input
        className={`input peer  ${
          errors[name] ? "border-error" : "border-normal"
        }`}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      <div className="mt-1  flex">
        {errors[name] && (
          <div className="text-xs font-medium text-red-500">
            {errors[name].message}
          </div>
        )}
      </div>
    </label>
  );
};

export default InputField2;
