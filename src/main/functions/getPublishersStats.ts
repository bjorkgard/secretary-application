import type { PublisherService } from '../../types/type'

export default async function GetPublisherStats(
  publisherService: PublisherService,
): Promise<{ active: number, irregular: number, inactive: number }> {
  const stats      = {
    active:    0,
    irregular: 0,
    inactive:  0,
  }
  const publishers = await publisherService.find('lastname', '')

  publishers.forEach((publisher) => {
    switch (publisher.status) {
      case 'ACTIVE':
        stats.active++
        break
      case 'IRREGULAR':
        stats.irregular++
        break
      case 'INACTIVE':
        stats.inactive++
        break
    }
  })

  return stats
}
