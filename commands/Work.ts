import { BaseCommand } from '@adonisjs/core/build/standalone'
import { randomInt } from 'crypto'
import Redis from '@ioc:Adonis/Addons/Redis'
import Config from '@ioc:Adonis/Core/Config'

export default class Work extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'work'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: true,
  }

  public async run() {
    const inProgress: Record<string, boolean> = {}

    setInterval(async () => {
      const stations = await Redis.zrangebyscore('stations', 0.1, '+inf')

      this.logger.debug(`Station check - ${stations.length} stations working`)

      stations.forEach(async (stationId) => {
        // Already working
        if (inProgress[stationId]) {
          return
        }

        const ticketData = await Redis.lpop(`stations:${stationId}`)

        // No ticket to process
        if (!ticketData) {
          return
        }

        inProgress[stationId] = true

        await Redis.zincrby('stations', -1, stationId)

        // Work simulation
        const duration = 10 + randomInt(-5, 5)

        setTimeout(async () => {
          inProgress[stationId] = false

          Redis.publish('ticket:ready', ticketData)

          this.logger.success('Completed ticket - ' + ticketData)
        }, duration * 1000)

        this.logger.info('Processing ticket - ' + ticketData)
      })
    }, Config.get('station').checkDuration)
  }
}
