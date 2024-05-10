import Readline from 'node:readline'
import process  from 'node:process'

export default function question(question) {
  const readline = Readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close()
      resolve(answer)
    })
  })
}
