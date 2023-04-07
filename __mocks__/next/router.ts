// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479

const mockRouter = {
  basePath: '.',
  push: (path: string) => { console.log("push called. path=", path) },
  isMock: true
}
export const useRouter = () => {
  return mockRouter
};
