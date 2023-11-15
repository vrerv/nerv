import Image from "next/image";

import googleLightSignIn from "@/public/assets/google/web_light_sq_SI.svg";
import googleLightSignUp from "@/public/assets/google/web_light_sq_SU.svg";
import googleDarkSignIn from "@/public/assets/google/web_dark_sq_SI.svg";
import googleDarkSignUp from "@/public/assets/google/web_dark_sq_SU.svg";
import { useTheme } from "next-themes";

type GoogleAuthButtonProps = {
  authType: "login" | "signup";
  className?: string;
  alt?: string;
  handleGoogleLogin: () => void;
}

/**
 * Google auth button in developer guide
 *
 * https://developers.google.com/identity/branding-guidelines
 *
 * @param authType
 * @param className
 * @param alt
 * @param handleGoogleLogin
 * @constructor
 */
// better to use this - https://developers.google.com/identity/gsi/web/guides/personalized-button
export const GoogleAuthButton = ({ authType, className, alt, handleGoogleLogin }: GoogleAuthButtonProps) => {

  const theme = useTheme();
  const defaultAlt = `${authType === "login" ? "Sign in " : "Sign up"} with Google`;

  return <button type={"button"} onClick={handleGoogleLogin}>
    <Image className={className}
           src={authType === "login" ? (theme.resolvedTheme === "dark" ? googleDarkSignIn : googleLightSignIn) : (theme.resolvedTheme === "dark" ? googleDarkSignUp : googleLightSignUp)}
           alt={alt == null ? defaultAlt : alt} />
  </button>;
};
