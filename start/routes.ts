/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Redis from '@ioc:Adonis/Addons/Redis'
import Config from '@ioc:Adonis/Core/Config'
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/tickets', 'TicketsController.add')
}).prefix('api')

Route.get('/', async ({ view }) => {
  return view.render('index')
})

Route.get('/stats', async ({ view }) => {
  const stationsData = await Redis.zrange('stations', 0, -1, 'WITHSCORES')
  const stations: {
    id: string
    inQueue: number
    free: number
    usage: string
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
    })
  }

  const totalSlots = stations.length * queueLimit
  const totalFree = totalSlots - totalQueue
  const totalUsage = ((totalQueue / totalSlots) * 100).toFixed(2)

  const data = {
    totalSlots,
    totalQueue,
    totalFree,
    totalUsage,
    stations,
  }

  return view.render('stats', data)
})
