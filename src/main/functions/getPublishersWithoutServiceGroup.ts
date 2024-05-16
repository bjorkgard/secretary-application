import type { PublisherModel }  from '../../types/models'
import type PublisherService    from '../services/publisherService'
import type ServiceGroupService from '../services/serviceGroupService'

export default async function GetPublishersWithoutServiceGroup(
  serviceGroupService: ServiceGroupService,
  publisherService: PublisherService,
): Promise<PublisherModel[]> {
  let publishers: PublisherModel[] = []
  const sg                         = await serviceGroupService.findOneByName('TEMPORARY')
  if (sg)
    publishers = await publisherService.find('lastname', sg._id)

  return publishers
}
