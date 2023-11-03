import { atom } from "jotai";

type MemberProfile = {
  name: string;
}

type LoginUser = {
  profile: MemberProfile | null;
  accessToken: string | null;
  valid: boolean;
}

export const userAtom = atom<LoginUser>({
  profile: null,
  accessToken: null,
  valid: false,
});
