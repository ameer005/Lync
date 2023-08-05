import { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { useSendMessage } from "@/hooks/queries/useMessage";
import { IoIosSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import useStore from "@/store/useStore";
import useCloseDropdown from "@/hooks/useCloseDropdown";

interface ComponentProps {
  roomId: string;
}

const MessageForm = ({ roomId }: ComponentProps) => {
  const user = useStore((state) => state.user);
  const setModalState = useStore((state) => state.setModalState);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [value, setValue] = useState("");
  let emojiRef = useRef(null);
  useCloseDropdown({
    isOpen: showEmojiPicker,
    setIsOpen: setShowEmojiPicker,
    ref: emojiRef,
  });

  const { mutate: sendMessage, isSuccess: sendMessageSuccess } =
    useSendMessage(roomId);

  const submitForm = (e: any) => {
    if (!user) {
      setModalState({
        showToastModal: true,
        toastProperties: { message: "You're not logged in", type: "error" },
      });
    }
    e?.preventDefault();
    if (!value) return;

    sendMessage({
      roomId: roomId,
      payload: {
        text: value,
      },
    });

    setValue("");
  };

  return (
    <form
      onSubmit={submitForm}
      className="bg-colorTeriroty relative flex items-center gap-3 rounded-md px-4 mx-2 "
    >
      <label className="bg-colorBg flex flex-1 items-center gap-3 rounded-full  sm:gap-2 ">
        <button type="button">
          <BsEmojiSmile
            onClick={(e) => {
              e.stopPropagation();
              setShowEmojiPicker((prev) => !prev);
            }}
            className="h-6 sm:h-5 sm:w-5 w-6 cursor-pointer"
          />
        </button>
        <textarea
          maxLength={200}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submitForm(e);
            }
          }}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="h-[3.5rem] hide-scrollbar flex-1 resize-none bg-transparent py-4 text-sm font-medium outline-none"
        />
      </label>

      <button type="submit" className=" flex items-center justify-center ">
        <IoIosSend className="text-colorWhite h-6 w-6" />
      </button>

      <div ref={emojiRef}>
        {showEmojiPicker && (
          <div className="absolute -top-[100%] left-7 -translate-y-[80%]">
            <EmojiPicker
              onEmojiClick={(data) => setValue((prev) => prev + data.emoji)}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default MessageForm;
