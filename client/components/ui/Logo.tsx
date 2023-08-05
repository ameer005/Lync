import Image from "next/image";
import logo from "../../public/images/logo.png";

interface LogoProps {
  width?: string;
}

const Logo = ({ width = "w-6" }: LogoProps) => {
  return (
    <div className="flex gap-3 items-center">
      <div className={`relative flex ${width} rotate-90`}>
        <Image src={logo} alt="logo" />
      </div>

      <div className="text-base">Lync</div>
    </div>
  );
};

export default Logo;
