import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TicketService from 'App/Services/TicketService'
import UserStoreValidator from 'App/Validators/UserStoreValidator'

export default class TicketsController {
  public async add({ request, response }: HttpContextContract) {
    const payload = await request.validate(UserStoreValidator)

    const data = await TicketService.addToQueue(payload)

    response.json(data)
  }

  public async stats({ view }: HttpContextContract) {
    const payload = await TicketService.getStats()

    return view.render('stats', payload)
  }
}
