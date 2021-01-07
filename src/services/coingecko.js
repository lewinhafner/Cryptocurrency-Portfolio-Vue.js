
import Api from '@/services/api'

export default {
  getListings () {
    return Api().get('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false')
  }
}
