"use client";

import { MdOutlineMoreVert, MdRemove } from "react-icons/md";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useStore from "@/store/useStore";

interface ComponentProps {
  user: {
    name: string;
    id: string;
    socketId: string;
  };
}

const PeerHoverCtrs = ({ user }: ComponentProps) => {
  const isRoomAdmin = useStore((state) => state.isRoomAdmin);
  const socket = useStore((state) => state.socket);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="outline-none ">
        <MdOutlineMoreVert className="h-6 w-6" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={20}
        className="absolute left-0  bg-zinc-700  shadow-lg z-20 rounded-md py-1 w-[14rem]   md:px-6"
      >
        <ul className="flex flex-col">
          <li className="w-full">
            <button
              disabled={!isRoomAdmin}
              onClick={() => {
                socket.emit("remove-user", user.socketId);
              }}
              className={`py-3 px-3 w-full flex items-center gap-2 font-medium  text-sm ut-animation  ${
                isRoomAdmin
                  ? "bg-zinc-700 hover:bg-zinc-600 cursor-pointer"
                  : "bg-zinc-700 text-zinc-400"
              } `}
            >
              <MdRemove className="h-5 w-5" />
              <div className="text-zinc-400">
                {isRoomAdmin ? "Remove this user" : "You can't remove it"}
              </div>
            </button>
          </li>
        </ul>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default PeerHoverCtrs;
