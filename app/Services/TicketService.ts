import { UserStoreValidatorProps } from 'App/Validators/UserStoreValidator'
import Redis from '@ioc:Adonis/Addons/Redis'
import Config from '@ioc:Adonis/Core/Config'
import stationConfig from 'Config/station'

// Note: Interfaces can be moved to separated file
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

    // Create stations
    Array(this.config.stationsCount)
      .fill(0)
      .forEach((_, index) => {
        const id = `station_${index + 1}`

        stationValues.push(0, id)
      })

    await Redis.zadd('stations', ...stationValues)
  }

  public async addToQueue(data: UserStoreValidatorProps) {
    // Check if stations are initialized in Redis
    await this.checkStations()

    // Find station with least tickets in queue
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

    // Increase total tickets count in this station
    await Redis.zincrby('stations', 1, stationId)

    // Add ticket to queue
    const positionInQueue = await Redis.rpush(stationKey, JSON.stringify(ticket))

    return { positionInQueue, stationId }
  }

  public async checkStations() {
    const stationsCount = await Redis.zcard('stations')

    if (stationsCount === 0) {
      await this.initStations()
    }

    return stationsCount
  }

  public async getStats() {
    await this.checkStations()

    const stationsData = await Redis.zrange('stations', 0, -1, 'WITHSCORES')

    const stations: {
      id: string
      inQueue: number
      free: number
      usage: string
      total: number
    }[] = []

    let totalQueue = 0
    const queueLimit = Config.get('station').queueLimit

    for (let i = 0; i < stationsData.length; i += 2) {
      const inQueue = parseInt(stationsData[i + 1])
      const free = queueLimit - inQueue

      totalQueue += inQueue

      stations.push({
        id: stationsData[i],
        inQueue,
        free,
        usage: ((inQueue / queueLimit) * 100).toFixed(2),
        total: queueLimit,
      })
    }

    const totalSlots = stations.length * queueLimit
    const totalFree = totalSlots - totalQueue
    const totalUsage = ((totalQueue / totalSlots) * 100).toFixed(2)

    return {
      totalSlots,
      totalQueue,
      totalFree,
      totalUsage,
      stations,
    }
  }
}

export default new TicketService(Config.get('station'))
