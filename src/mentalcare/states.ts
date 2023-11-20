
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
  id: string;
  name: string;
  description: string;
  contentUrl: string;
  ackOptions: AckOption[];
  openType: OpenType;
  playMinutes: number;
  availableHours: AvailableHour[];
  prompt?: string | undefined;
  complete: string;
}

export type Period = {
  name: string;
  weeks: number[]
  onHoliday: boolean
}

export type Routine = {
  id: number;
  name: string;
  period: Period;
  challenges: Challenge[];
}


export const periodsAtom = atomWithStorage<Period[]>('periods', [
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

export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'cold-shower-1',
    name: '아침 찬물 샤워',
    description: '아침에 일어나서 찬물 샤워하기',
    prompt: '물로 샤워하는 이미지',
    contentUrl: '',
    ackOptions: ['user', 'supporter'],
    openType: PUBLIC,
    playMinutes: 10,
    availableHours: Morning,
    complete: '(records) => records.length > 0'
  },
  {
    id: 'push-up-1',
    name: '아침 팔굽혀펴기 운동',
    prompt: '팔굽혀펴기 이미지',
    description: '팔굽혀 펴기 운동을 합니다',
    contentUrl: '',
    ackOptions: ['system', 'user', 'supporter'],
    openType: PUBLIC,
    playMinutes: 10,
    availableHours: Morning,
    complete: '(records) => records.length > 0'
  },
  {
    id: 'drink-water-1',
    name: '물 많이 마시기',
    prompt: undefined,
    description: '대략 1.5L 이상의 권장량의 물 마시기',
    contentUrl: '',
    ackOptions: ['user', 'supporter'],
    openType: PUBLIC,
    playMinutes: 5,
    availableHours: Morning.concat(Noon).concat(Evening),
    complete: '(records) => records.map(r => Number(r.value)).reduce((a, b) => (a + b)) >= 1600'
  },
  {
    id: 'remind-todo-1',
    name: '오늘 할일 확인/설정',
    prompt: undefined,
    description: '오늘 하루를 계획한다.\n오늘 하루에 할일을 적어주세요. 반드시 오늘 할 수 있는 일만 기록해 보세요!',
    contentUrl: '',
    ackOptions: ['system', 'user', 'supporter'],
    openType: PUBLIC,
    playMinutes: 10,
    availableHours: Morning,
    complete: "(records) => { const todos = JSON.parse(records[records.length - 1]?.value || '[]'); return todos.length > 0 && todos.every(todo => todo.done) === true }"
  },
];

export const challengesAtom = atomWithStorage<Challenge[]>('challenges', DEFAULT_CHALLENGES)

export const DEFAULT_RECORDs: Record<string, UserChallenge> = {};

export type UserChallenge = {
  challengeId: string;
  records: ChallengeRecord[];
  completed: boolean;
}

export type ChallengeRecord = {
  challengeId: string;
  action?: string;
  recordedAt: string;
  value?: string;
}
export const challengeRecordsAtom = atomWithStorage<Record<string, UserChallenge>>('challenge_records', DEFAULT_RECORDs)

export const recordKey = (challengeId: string, date: Date = new Date()) => {
  return `${challengeId}/${date.toLocaleDateString('en-CA')}`
}