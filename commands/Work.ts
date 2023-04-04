import { BaseCommand } from '@adonisjs/core/build/standalone'
import { randomInt } from 'crypto'
import Redis from '@ioc:Adonis/Addons/Redis'
import Config from '@ioc:Adonis/Core/Config'

export default class Work extends BaseCommand {
  public static commandName = 'work'

  public static description = ''

  public static settings = {
    loadApp: true,
    stayAlive: true,
  }

  public async run() {
    const config = Config.get('station')
    const inProgress: Record<string, boolean> = {}

    setInterval(async () => {
      // Find ALL stations that have ATLEAST one ticket in queue
      const stations = await Redis.zrangebyscore('stations', 0.1, '+inf')

      if (stations.length === 0) {
        this.logger.log('Station check - No tickets to process')
        return
      }

      this.logger.debug(`Station check - ${stations.length} stations working`)

      stations.forEach(async (stationId) => {
        // Already working
        if (inProgress[stationId]) {
          return
        }

        // Remove ticket from queue
        const ticketData = await Redis.lpop(`stations:${stationId}`)

        // No ticket to process
        if (!ticketData) {
          return
        }

        // Flag this station as "inProgress"
        inProgress[stationId] = true

        // Decrease total tickets count in this station
        // NOTE: This is unsafe and it can be synchronized wrongly, better approach would be making independent service for sync
        await Redis.zincrby('stations', -1, stationId)

        // Work simulation
        const offset = randomInt(-config.offsetDuration, config.offsetDuration)
        const duration = config.baseDuration + offset

        setTimeout(async () => {
          // Mark station as NOT "inProgress"
          inProgress[stationId] = false

          // Trigger event for finished ticket
          Redis.publish('ticket:ready', ticketData)

          this.logger.success('Completed ticket - ' + ticketData)
        }, duration * 1000)

        this.logger.info('Processing ticket - ' + ticketData)
      })
    }, config.checkDuration)
  }
}
