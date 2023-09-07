"use client";
import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import useStore from "@/store/useStore";

const ToastNotification = () => {
  const showToastModal = useStore((state) => state.showToastModal);
  const { message, title, type } = useStore((state) => state.toastProperties);
  const setModalState = useStore((state) => state.setModalState);

  return (
    <Toast.Provider duration={3000} swipeDirection="right">
      {/* <button
        className="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
        onClick={() => {
          setModalState({ showToastModal: true });
          setModalState({
            toastProperties: {
              title: "We fucked up",
              type: "error",
              message: "we liteldjfklsjflkjd sdk jkls fsdjs lk jzdfl",
            },
          });
        }}
      >
        Add to calendar
      </button> */}

      <Toast.Root
        className={` rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut ${
          (type === "info" && "bg-colorDark1") ||
          (type === "success" && "bg-green-400") ||
          (type === "error" && "bg-colorError")
        }`}
        open={showToastModal}
        onOpenChange={(open) => {
          setModalState({ showToastModal: open });
        }}
      >
        <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
          {title}
        </Toast.Title>
        <Toast.Description asChild>
          <p>{message}</p>
        </Toast.Description>
        <Toast.Action
          className="[grid-area:_action]"
          asChild
          altText="Goto schedule to undo"
        >
          <button className="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] ">
            close
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
};

export default ToastNotification;
