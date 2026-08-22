
// Frontmatter dates are calendar dates ('2024-07-01'), which Date parses as UTC
// midnight. Formatting in the viewer's local zone would render the previous day
// for anyone west of UTC, so format in UTC to preserve the authored date.
const formatDate = (date, locale) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }
  return new Date(date).toLocaleDateString(locale, options)
}

export default formatDate
