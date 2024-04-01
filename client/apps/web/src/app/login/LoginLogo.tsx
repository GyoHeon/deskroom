"use client";

import { useThemeContext } from "@radix-ui/themes";
import Image from "next/image";

const LoginLogo = () => {
  const theme = useThemeContext();
  const isDark = theme.appearance === "dark";

  return (
    <h1 className="text-2xl font-medium text-primary mt-4 mb-8 text-center flex justify-center">
      {/* image from logo next js */}
      <Image
        src={isDark ? `/deskroom-logo-white.png` : `/deskroom-logo.png`}
        alt={`closer logo`}
        width={100}
        height={100}
      />
    </h1>
  );
};

export default LoginLogo;
