import useStore from "@/store/useStore";

interface AvatarProps {
  className?: string;
  username: string;
}

const PeerAvatar = ({ className = "h-10 w-10", username }: AvatarProps) => {
  return (
    <div
      className={`${className} rounded-full bg-transparent overflow-hidden relative`}
    >
      <img
        alt="Avatar"
        src={`https://api.dicebear.com/6.x/initials/svg?seed=${username}&scale=90&radius=50&backgroundType=gradientLinear`}
        className="h-full absolute left-0 w-full"
      />
    </div>
  );
};

export default PeerAvatar;
