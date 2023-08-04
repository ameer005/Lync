// import useStore from "../store/useStore";
// import { ComponentType, useEffect, useState } from "react";
// import { useRouter } from "next/router";

// export const withProtected = (Component: any) => {
//   return function WithPublic(props: any) {
//     const [isUserLoggedIn, setUserLoggedIn] = useState<null | boolean>(null);
//     const user = useStore((state) => state.user);
//     const router = useRouter();

//     useEffect(() => {
//       setUserLoggedIn(user ? true : false);
//     }, []);

//     if (isUserLoggedIn === false && typeof window !== "undefined") {
//       router.replace("/auth/login");
//       return null;
//     }

//     return <Component {...props} />;
//   };
// };

// export const withPublic = (Component: ComponentType) => {
//   return function WithPublic(props: any) {
//     const [isUserLoggedIn, setUserLoggedIn] = useState(false);
//     const user = useStore((state) => state.user);
//     const router = useRouter();

//     useEffect(() => {
//       setUserLoggedIn(user ? true : false);
//     }, []);

//     if (isUserLoggedIn) {
//       router.replace("/");
//       return null;
//     }

//     return <Component {...props} />;
//   };
// };
