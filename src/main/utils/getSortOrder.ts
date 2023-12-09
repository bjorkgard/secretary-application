const getSortOrder = (serviceMonthName: string): number => {
  const splitName = serviceMonthName.split('-')
  const sort = parseInt(splitName[1]) - 9

  return sort < 0 ? sort + 12 : sort
}

export default getSortOrder
