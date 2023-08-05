import useStore from "@/store/useStore";

interface AvatarProps {
  className?: string;
  username: string;
}

const Avatar2 = ({ className = "h-10 w-10", username }: AvatarProps) => {
  const user = useStore((state) => state.user);

  return (
    <div
      className={`${className} rounded-full bg-colorPrimary overflow-hidden relative`}
    >
      <img
        alt="Avatar"
        src={`https://api.dicebear.com/5.x/pixel-art/svg?seed=${username}`}
        className="h-full absolute left-0 w-full"
      />
    </div>
  );
};

export default Avatar2;
