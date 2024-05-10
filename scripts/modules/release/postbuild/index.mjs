import { writeFile } from 'node:fs/promises'
import { resolve }   from 'node:path'
import packageJSON   from '../../../package.json'
import getDevFolder  from '../../utils/getDevFolder.mjs'

async function createPackageJSONDistVersion() {
  const { main, scripts, resources, devDependencies, ...rest } = packageJSON

  const packageJSONDistVersion = {
    main: './main/index.js',
    ...rest,
  }

  try {
    await writeFile(
      resolve(getDevFolder(main), 'package.json'),
      JSON.stringify(packageJSONDistVersion, null, 2),
    )
  }
  catch ({ message }) {
    console.log(`
    🛑 Something went wrong!\n
      🧐 There was a problem creating the package.json dist version...\n
      👀 Error: ${message}
    `)
  }
}

createPackageJSONDistVersion()
