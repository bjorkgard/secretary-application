function getServiceYear(serviceMonthName: string): number {
  const splitName = serviceMonthName.split('-')
  const control   = Number.parseInt(splitName[1]) - 9

  return control >= 0 ? Number.parseInt(splitName[0]) + 1 : Number.parseInt(splitName[0])
}

export default getServiceYear
