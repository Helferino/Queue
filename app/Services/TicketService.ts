import { UserStoreValidatorProps } from 'App/Validators/UserStoreValidator'
import Redis from '@ioc:Adonis/Addons/Redis'
import Config from '@ioc:Adonis/Core/Config'
import stationConfig from 'Config/station'

export interface Station {
  name: string
  queue: Ticket[]
}

export interface Ticket {
  user: UserStoreValidatorProps
  createdAt: number
}

class TicketService {
  constructor(private config: typeof stationConfig) {}

  public async initStations() {
    const stationValues: (number | string)[] = []

    Array(this.config.stationsCount)
      .fill(0)
      .forEach((_, index) => {
        const id = `station_${index + 1}`

        stationValues.push(0, id)
      })

    await Redis.zadd('stations', ...stationValues)
  }

  public async addToQueue(data: UserStoreValidatorProps) {
    const stationsCount = await Redis.zcard('stations')
    if (stationsCount === 0) {
      await this.initStations()
    }

    const [stationId, inQueue] = await Redis.zrange('stations', 0, 0, 'WITHSCORES')
    const stationKey = `stations:${stationId}`

    // No free station
    if (!stationId || parseInt(inQueue) >= this.config.queueLimit) {
      throw new Error('All stations are occupied')
    }

    const ticket: Ticket = {
      user: data,
      createdAt: new Date().getTime(),
    }

    await Redis.zincrby('stations', 1, stationId)
    const positionInQueue = await Redis.rpush(stationKey, JSON.stringify(ticket))

    return { positionInQueue, stationId }
  }
}

export default new TicketService(Config.get('station'))
