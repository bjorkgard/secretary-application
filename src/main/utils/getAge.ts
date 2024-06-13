const yearInMs = 3.15576e+10 // Using a year of 365.25 days (because leap years)

const getAge = (birthDate: string) => Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / yearInMs)

export default getAge
