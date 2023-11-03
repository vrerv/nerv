
import { atomWithStorage } from "jotai/utils";

type MemberProfile = {
  name: string;
}

type LoginUser = {
  profile: MemberProfile | null;
  accessToken: string | null;
  valid: boolean;
}

export const userAtom = atomWithStorage<LoginUser>('user', {
  profile: null,
  accessToken: null,
  valid: false,
});

type AckOption = 'system' | 'user' | 'supporter' | 'none'

type Challenge = {
  name: string;
  description: string;
  contentUrl: string;
  ackOptions: AckOption[]
}

type Period = {
  name: string;
  weeks: number[]
  onHoliday: boolean
}


export const periods = atomWithStorage<Period[]>('periods', [
  {
    name: '평일',
    weeks: [1,2,3,4,5],
    onHoliday: false
  },
  {
    name: '휴일',
    weeks: [6,0],
    onHoliday: true
  }
])

export const challenges = atomWithStorage<Challenge[]>('challenges', [
  {
    name: '아침 찬물 샤워',
    description: '아침에 일어나서 찬물 샤워하기',
    contentUrl: '',
    ackOptions: ['user', 'supporter']
  }
])