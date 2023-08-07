"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useStore from "../../../store/useStore";

import { BiUpload } from "react-icons/bi";
import { useLogout } from "@/hooks/queries/useAuth";
import Avatar2 from "../Avatar2";
import { UserDocument } from "@/types/api/user";

interface ComponentProps {
  user: UserDocument;
}

const ProfileDropdown = ({ user }: ComponentProps) => {
  const removeUser = useStore((state) => state.removeUser);
  const { mutate } = useLogout();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="outline-none ">
        <Avatar2 username={user.username} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={20}
        className="absolute -left-[16rem] sm:-left-[15rem] w-[17rem] sm:w-[15.5rem] min-h-[8rem] bg-colorDark1  shadow-lg z-20 rounded-md py-4 px-8 md:px-6"
      >
        {/* profile section */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center py-4 border-b border-zinc-600">
            <div className="mb-3 sm:mb-2">
              <Avatar2
                username={user.username}
                className="h-11 w-11 sm:h-10 sm:w-10"
              />
            </div>
            <div className="text-lg sm:text-base font-bold">
              {user?.username}
            </div>
          </div>

          {/* list 1 */}

          {/* list secong */}
          <ul className="flex flex-col pb-3">
            <li
              onClick={() => mutate()}
              className="py-2 px-1 font-medium text-sm ut-animation cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BiUpload className="text-lg rotate-90" />
                <div>Logout</div>
              </div>
            </li>
          </ul>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ProfileDropdown;
