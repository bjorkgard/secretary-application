function getSortOrder(serviceMonthName: string): number {
  const splitName = serviceMonthName.split('-')
  const sort      = Number.parseInt(splitName[1]) - 9

  return sort < 0 ? sort + 12 : sort
}

export default getSortOrder
