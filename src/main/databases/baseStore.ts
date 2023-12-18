import { app } from 'electron'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import Datastore from 'nedb-promises'
import {
  Auxiliary,
  Export,
  Publisher,
  Responsibility,
  ServiceMonth,
  ServiceGroup,
  Settings,
  CircuitOverseer,
  ServiceYear
} from './schemas'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default class BaseStore<
  T extends
    | Auxiliary
    | CircuitOverseer
    | Export
    | Publisher
    | Responsibility
    | ServiceMonth
    | ServiceGroup
    | ServiceYear
    | Settings
> {
  filePath: string = ''
  databaseInstance: Datastore<T>
  schema: JSONSchemaType<T>

  constructor(fileName: string, schema: JSONSchemaType<T>, index = '', autocompaction = false) {
    const userDataPath = isDevelopment ? './db' : app.getPath('userData') + '/db'
    this.filePath = `${userDataPath}/${fileName}`
    this.databaseInstance = Datastore.create({
      filename: this.filePath,
      timestampData: true,
      autoload: true
    })
    this.schema = schema

    if (autocompaction) {
      this.databaseInstance.persistence.setAutocompactionInterval(900000) // 15 minutes
    }

    if (index !== '') {
      this.databaseInstance.ensureIndex({ fieldName: index })
    }
  }

  validate(data: T): boolean {
    const ajv = new Ajv({
      allErrors: true,
      useDefaults: true
    })

    addFormats(ajv)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ajv.addFormat('custom-date-time', (dateTimeString: any) => {
      if (typeof dateTimeString === 'object') {
        dateTimeString = dateTimeString.toISOString()
      }
      return !isNaN(Date.parse(dateTimeString))
    })

    const schemaValidator = ajv.compile(this.schema)

    return schemaValidator(data)
  }

  create(data: T): Promise<T> | undefined {
    const isValid: boolean = this.validate(data)

    if (isValid) {
      return this.databaseInstance.insert(data)
    } else {
      return undefined
    }
  }

  async update(_id: string, data: T): Promise<number | undefined> {
    const isValid: boolean = this.validate(data)

    if (isValid) {
      return await this.databaseInstance.update({ _id }, data)
    } else {
      return undefined
    }
  }

  findOneById(_id: string): Promise<T | null> {
    return this.databaseInstance.findOne({ _id })
  }

  drop(): void {
    this.databaseInstance.remove({}, { multi: true })
  }
}
