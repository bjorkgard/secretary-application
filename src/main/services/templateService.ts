import type { Template }                            from '../databases/schemas'
import { TemplateSchema }                           from '../databases/schemas'
import type { TemplateModel }                       from '../../types/models'
import type { TemplateService as ITemplateService } from '../../types/type'
import TemplateStore                                from '../databases/templateStore'

const templateStore = new TemplateStore('templates.db', TemplateSchema)

function parseTemplateModel(data: TemplateModel): Template {
  const template: Template = {
    code: '',
    name: '',
    date: '',
    path: '',
  }

  template.code = data.code
  template.name = data.name
  template.date = data.date
  template.path = data.path

  return template
}

function parseTemplate(data: Template): TemplateModel {
  const templateModel: TemplateModel = {
    code: '',
    name: '',
    date: '',
    path: '',
  }

  templateModel._id       = data._id
  templateModel.code      = data.code
  templateModel.name      = data.name
  templateModel.date      = data.date
  templateModel.path      = data.path
  templateModel.createdAt = data.createdAt?.toLocaleString('sv-SE')
  templateModel.updatedAt = data.updatedAt?.toLocaleString('sv-SE')

  return templateModel
}

export default class TemplateService implements ITemplateService {
  async findByCode(code: string): Promise<TemplateModel> {
    const template = (await templateStore.findByCode(code)) as Template
    return parseTemplate(template)
  }

  async find(): Promise<TemplateModel[]> {
    const templates = (await templateStore.find()) as Template[]

    return templates.map(t => parseTemplate(t))
  }

  async create(data: TemplateModel): Promise<TemplateModel> {
    const template    = parseTemplateModel(data)
    const newTemplate = (await templateStore.create(template)) as Template

    return parseTemplate(newTemplate)
  }

  async update(id: string, data: TemplateModel): Promise<number> {
    const template = parseTemplateModel(data)
    return (await templateStore.update(id, template)) as number
  }

  async upsert(data: TemplateModel): Promise<number> {
    const template = parseTemplateModel(data)
    return (await templateStore.upsert(template)) as number
  }

  async findOneById(id: string): Promise<TemplateModel> {
    const template = (await templateStore.findOneById(id)) as Template
    return parseTemplate(template)
  }

  async drop(): Promise<void> {
    templateStore.drop()
  }
}
