const getServiceYear = (serviceMonthName: string): number => {
  const splitName = serviceMonthName.split('-')
  const control = parseInt(splitName[1]) - 9

  return control >= 0 ? parseInt(splitName[0]) + 1 : parseInt(splitName[0])
}

export default getServiceYear
