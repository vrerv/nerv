
import { atomWithStorage, createJSONStorage } from "jotai/utils";

type MemberProfile = {
  name: string;
  routines: Routine[];
}

type LoginUser = {
  profile: MemberProfile | null;
  accessToken: string | null;
  valid: boolean;
}

export const EMPTY_USER = {
  profile: null,
  accessToken: null,
  valid: false,
};

export const userAtom = atomWithStorage<LoginUser>(
  'user',
  typeof window === 'undefined'
    ? EMPTY_USER
    : (JSON.parse(
      localStorage.getItem('user') ?? JSON.stringify(EMPTY_USER)
    ) as LoginUser),
  createJSONStorage(() => localStorage),
  { unstable_getOnInit: false }
);

type AckOption = 'system' | 'user' | 'supporter' | 'none'
export const PUBLIC = 'public' as OpenType
export const PRIVATE = 'private' as OpenType
type OpenType = 'public' | 'private'
type AvailableHour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
export const Night = [23, 0, 1, 2, 3, 4] as AvailableHour[];
export const Morning = [5, 6, 7, 8, 9 , 10] as AvailableHour[];
export const Noon = [11, 12, 13, 14, 15, 16] as AvailableHour[];
export const Evening = [17, 18, 19, 20, 21, 22] as AvailableHour[];
export const AllDay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ,10 ,11 ,12, 13, 14, 15, 16, 17, 18, 19, 20 ,21 ,22 ,23] as AvailableHour[];

export type Challenge = {
  id: number;
  code: string;
  name: string;
  description: string;
  contentUrl: string;
  ackOptions: AckOption[];
  openType: OpenType;
  playMinutes: number;
  availableHours: AvailableHour[];
  prompt?: string | undefined;
  verification: string;
}

export type Period = {
  id: number;
  name: string;
  weeks: number[]
  onHoliday: boolean
}

export type Routine = {
  id: number;
  name: string;
  period: Period;
  challenges: string[];
}

export const routinesAtom = atomWithStorage<Routine[]>('routines', [])
export const periodsAtom = atomWithStorage<Period[]>('periods', [])

export const challengesAtom = atomWithStorage<Challenge[]>('challenges', [])

export const DEFAULT_RECORDs: Record<string, UserChallenge> = {};

export type UserChallenge = {
  date: number;
  challenge_code: string;
  records: ChallengeRecord[];
  completed: boolean;
}

export type verificationFn = (records: ChallengeRecord[]) => boolean
// @ts-ignore
export const getVerificationFn: (verification: string | undefined) => verificationFn = (verification: string | undefined) => eval(verification || '(records) => false')

export type ChallengeRecord = {
  action?: string;
  recordedAt: string;
  value?: string;
}
export const challengeRecordsAtom = atomWithStorage<Record<string, UserChallenge>>('challenge_records', DEFAULT_RECORDs)

export const recordKey = (challengeId: string, date: Date = new Date()) => {
  return `${challengeId}/${date.toLocaleDateString('en-CA')}`
}