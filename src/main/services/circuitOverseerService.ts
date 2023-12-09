import { CircuitOverseerModel } from '../../types/models'
import { CircuitOverseer, CircuitOverseerSchema } from '../databases/schemas'
import { CircuitOverseerService as ICircuitOverseerService } from '../../types/type'
import CircuitOverseerStore from '../databases/circuitOverseerStore'

const circuitOverseerStore = new CircuitOverseerStore('circuitOverseer.db', CircuitOverseerSchema)

const parseCircuitOverseerModel = (data: CircuitOverseerModel): CircuitOverseer => {
  const circuitOverseer: CircuitOverseer = {
    firstname: '',
    lastname: '',
    address: '',
    zip: '',
    city: ''
  }

  circuitOverseer.firstname = data.firstname
  circuitOverseer.lastname = data.lastname
  circuitOverseer.email = data.email
  circuitOverseer.phone = data.phone
  circuitOverseer.mobile = data.mobile
  circuitOverseer.address = data.address
  circuitOverseer.zip = data.zip
  circuitOverseer.city = data.city

  return circuitOverseer
}

const parseCircuitOverseer = (data: CircuitOverseer): CircuitOverseerModel => {
  const circuitOverseerModel: CircuitOverseerModel = {
    firstname: '',
    lastname: '',
    address: '',
    zip: '',
    city: ''
  }

  circuitOverseerModel._id = data._id
  circuitOverseerModel.firstname = data.firstname
  circuitOverseerModel.lastname = data.lastname
  circuitOverseerModel.email = data.email
  circuitOverseerModel.phone = data.phone
  circuitOverseerModel.mobile = data.mobile
  circuitOverseerModel.address = data.address
  circuitOverseerModel.zip = data.zip
  circuitOverseerModel.city = data.city
  circuitOverseerModel.createdAt = data.createdAt?.toLocaleString('sv-SE')
  circuitOverseerModel.updatedAt = data.updatedAt?.toLocaleString('sv-SE')

  return circuitOverseerModel
}

export default class CircuitOverseerService implements ICircuitOverseerService {
  async find(): Promise<CircuitOverseerModel | undefined> {
    const circuitOverseer = (await circuitOverseerStore.find()) as CircuitOverseer[]
    if (circuitOverseer.length > 0) {
      return parseCircuitOverseer(circuitOverseer[0])
    }

    return undefined
  }

  async create(data: CircuitOverseerModel): Promise<CircuitOverseerModel> {
    const circuitOverseer = parseCircuitOverseerModel(data)
    const newCircuitOverseer = (await circuitOverseerStore.create(
      circuitOverseer
    )) as CircuitOverseer
    return parseCircuitOverseer(newCircuitOverseer)
  }

  async upsert(data: CircuitOverseerModel): Promise<number> {
    const circuitOverseer = parseCircuitOverseerModel(data)
    return (await circuitOverseerStore.upsert(circuitOverseer, data._id)) as number
  }

  async update(id: string, data: CircuitOverseerModel): Promise<number> {
    const circuitOverseer = parseCircuitOverseerModel(data)
    return (await circuitOverseerStore.update(id, circuitOverseer)) as number
  }

  async findOneById(id: string): Promise<CircuitOverseerModel> {
    const circuitOverseer = (await circuitOverseerStore.findOneById(id)) as CircuitOverseer
    return parseCircuitOverseer(circuitOverseer)
  }

  async drop(): Promise<void> {
    circuitOverseerStore.drop()
  }
}
