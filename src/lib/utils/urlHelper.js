/**
 * Vercel provides an environment variable for the URL of the deployment called NEXT_PUBLIC_VERCEL_URL.
 * See the Vercel docs for more details. You can use this variable to dynamically redirect depending on the environment.
 * You should also set the value of the environment variable called NEXT_PUBLIC_SITE_URL,
 * this should be set to your site URL in production environment to ensure that redirects function correctly.
 *
 * @returns {string|string|string}
 */
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

export default getURL