import formatDate from './formatDate'

// Frontmatter dates are stored as UTC-midnight ISO strings. Formatting them in
// the viewer's local zone renders the previous day west of UTC, so formatDate
// must pin the formatter to UTC. Jest inherits the runner's zone and cannot
// change it mid-process, so assert on the options handed to the formatter.
describe('formatDate', () => {
  it('formats in UTC so the authored calendar date is preserved', () => {
    const spy = jest.spyOn(Date.prototype, 'toLocaleDateString')
    formatDate('2024-07-01T00:00:00.000Z', 'en')
    expect(spy).toHaveBeenCalledWith('en', expect.objectContaining({ timeZone: 'UTC' }))
    spy.mockRestore()
  })

  it('renders the authored calendar date', () => {
    expect(formatDate('2024-07-01T00:00:00.000Z', 'en')).toBe('July 1, 2024')
  })
})
