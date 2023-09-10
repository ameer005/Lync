import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../useAxios";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
import { FieldValues } from "react-hook-form";
import { Login } from "@/types/api/user";

export const useSignup = () => {
  const api = useAxios();
  const setOptions = useStore((state) => state.setOptions);

  const setModalState = useStore((state) => state.setModalState);

  const queryFnc = (userData: FieldValues) => {
    return api.post("/users/signup", userData);
  };

  return useMutation(queryFnc, {
    onSuccess: () => {
      setModalState({
        showToastModal: true,
        toastProperties: {
          type: "success",
          message: "Otp has been sent to your registered email.",
          title: "",
        },
      });
      setOptions({ authScreen: "Verify" });
    },
    onError: (error: any) => {
      setModalState({
        showToastModal: true,
        toastProperties: {
          type: "error",
          message: error.response.data.message,
          title: "",
        },
      });
    },
  });
};

export const useActivateAccount = () => {
  const api = useAxios();

  const setModalState = useStore((state) => state.setModalState);
  const setOptions = useStore((state) => state.setOptions);

  const queryFnc = (userData: FieldValues) => {
    return api.post("/users/activate", userData);
  };

  return useMutation(queryFnc, {
    onSuccess: () => {
      setModalState({
        showToastModal: true,
        toastProperties: {
          type: "success",
          message: "Account activated successfully",
          title: "",
        },
      });
      setOptions({ authScreen: "Login" });
    },
    onError: (error: any) => {
      setModalState({
        showToastModal: true,
        toastProperties: {
          type: "error",
          message: error.response.data.message,
          title: "",
        },
      });
    },
  });
};

export const useResendActivatonCode = () => {
  const api = useAxios();
  const setModalState = useStore((state) => state.setModalState);

  const resendActivationCode = (userData: any) => {
    return api.post("/users/sendActivationCode", userData);
  };

  return useMutation(resendActivationCode, {
    onSuccess: () => {
      setModalState({
        showToastModal: true,
        toastProperties: {
          message: "check your registered email for activation code",
          type: "success",
          title: "",
        },
      });
    },
    onError: (error: any) => {
      setModalState({
        showToastModal: true,
        toastProperties: {
          message: error.response.data.message,
          type: "error",
          title: "",
        },
      });
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const api = useAxios();

  const setToken = useStore((state) => state.setToken);
  const setUser = useStore((state) => state.setUser);
  const setModalState = useStore((state) => state.setModalState);
  const setOptions = useStore((state) => state.setOptions);

  const queryFnc = async (userData: FieldValues) => {
    const { data } = await api.post<Login>("/auth/login", userData);
    return data;
  };

  return useMutation(queryFnc, {
    onError: (error: any) => {
      if (error.response.status === 403) {
        setOptions({ authScreen: "Verify" });
      }
      setModalState({
        showToastModal: true,
        toastProperties: {
          message: error.response.data.message,
          type: "error",
          title: "",
        },
      });
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setModalState({ showAuthModal: false });
      // TODO hard reload
      location.reload();
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const api = useAxios();
  const removeUser = useStore((state) => state.removeUser);

  const queryFnc = () => {
    return api.post("/auth/logout");
  };

  return useMutation(queryFnc, {
    onSuccess: () => {
      router.push("/");
      removeUser();
    },
  });
};

export const useForgotPassword = () => {
  const api = useAxios();
  const setOptions = useStore((state) => state.setOptions);
  const setModalState = useStore((state) => state.setModalState);

  const forgotPassword = (userData: { email: string }) => {
    return api.post("/users/forgotPassword", userData);
  };

  return useMutation(forgotPassword, {
    onSuccess: () => {
      setOptions({ authScreen: "Validate Forgot" });
      setModalState({
        showToastModal: true,
        toastProperties: {
          message: "Otp has been sent to your email",
          type: "success",
          title: "",
        },
      });
    },
  });
};

export const useValidateForgotPassword = () => {
  const api = useAxios();
  const setOptions = useStore((state) => state.setOptions);
  const setModalState = useStore((state) => state.setModalState);

  const validateForgotPassword = (userData: {
    email: string;
    code: string;
    newPassword: string;
  }) => {
    return api.post("/users/validateForgotPassword", userData);
  };

  return useMutation(validateForgotPassword, {
    onSuccess: () => {
      setOptions({ authScreen: "Login" });
      setModalState({
        showToastModal: true,
        toastProperties: {
          message: "passwrod changed successfully",
          type: "success",
          title: "",
        },
      });
    },
    onError: (error: any) => {
      setModalState({
        showToastModal: true,
        toastProperties: {
          message: error.response.data.message,
          type: "error",
          title: "",
        },
      });
    },
  });
};

export const useCheckAuth = () => {
  const api = useAxios();
  const setModalState = useStore((state) => state.setModalState);

  const queryFnc = async () => {
    const { data } = await api.post(`/auth/check`);
    return data;
  };

  return useMutation(queryFnc, {
    onError: () => {
      setModalState({ showAuthModal: true });
    },
  });
};
