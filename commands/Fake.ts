import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import TicketService from 'App/Services/TicketService'

export default class Fake extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'fake'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  @flags.number({ description: 'Number of tickets' })
  public count: number

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
    stayAlive: false,
  }

  public async run() {
    const arr = Array(this.count || 5).fill(0)

    try {
      for (const i of arr) {
        const positionInQueue = await TicketService.addToQueue({
          email: 'abc@abc.com',
          payload: i,
        })

        this.logger.success(`Ticket added to queue - ${positionInQueue}`)
      }
    } catch (e) {
      this.logger.error(e.message)
    }
  }
}
