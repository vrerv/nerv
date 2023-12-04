

export const dateNumber = (date: Date) => {
  return Number(date.toJSON().slice(0,10).split('-').join(''))
}