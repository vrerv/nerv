


const MAX_OG_DESCRIPTION_LENGTH = 200

export const getOgDescription = (description, tags) => {
  const tagsString = [...new Set(tags)].join(',')
  const ogDesc = description + ", tags=" + tagsString
  if (ogDesc.length > MAX_OG_DESCRIPTION_LENGTH) {
    return ogDesc.slice(0, MAX_OG_DESCRIPTION_LENGTH)
  }
  return ogDesc
}