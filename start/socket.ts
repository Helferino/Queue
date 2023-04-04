import Redis from '@ioc:Adonis/Addons/Redis'
import { Ticket } from 'App/Services/TicketService'
import Ws from 'App/Services/Ws'

Ws.boot()

Ws.io.on('connection', (socket) => {
  socket.emit('init', { version: '1' })
})

Redis.subscribe('ticket:ready', (data: string) => {
  const ticket: Ticket = JSON.parse(data)

  // Notify user when their ticket is ready
  Ws.io.emit(`ready:${ticket.user.email}`, ticket)
})
