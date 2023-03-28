import Env from '@ioc:Adonis/Core/Env'

const stationConfig = {
  stationsCount: Env.get('STATIONS_COUNT', 3),
  queueLimit: Env.get('STATIONS_QUEUE_LIMIT', 3),
  baseDuration: Env.get('STATIONS_BASE_DURATION', 10),
  offsetDuration: Env.get('STATIONS_OFFSET_DURATION', 10),
  checkDuration: Env.get('STATIONS_CHECK_DURATION', 1000),
}

export default stationConfig
