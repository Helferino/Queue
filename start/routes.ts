import Route from '@ioc:Adonis/Core/Route'

// API
Route.group(() => {
  Route.post('/tickets', 'TicketsController.add')
}).prefix('api')

// Views
Route.on('/').render('index')
Route.get('/stats', 'TicketsController.stats')
