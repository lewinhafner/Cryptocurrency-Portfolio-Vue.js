<template>
  <div class="about">
    <h1>{{ portfolio.name }}</h1>

    <button @click="addMode()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4">
      Add Asset
    </button>

    <div class="flex justify-center mx-5">
      <form v-if="mode === 'edit'" class="w-full max-w-xs bg-white flex flex-col py-5 px-8 rounded-lg shadow-lg">
        <label class="text-gray-700 font-bold py-2">Symbol</label>
        <input v-model="editAsset.symbol" class="text-gray-700 shadow border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-3" type="text" placeholder="btc">
        <label class="text-gray-700 font-bold py-2">Amount</label>
        <input v-model.number="editAsset.amount" class="text-gray-700 shadow border rounded border-gray-300 mb-3 py-1 px-3 focus:outline-none focus:shadow-outline" type="number">
        <label class="text-gray-700 font-bold py-2">Price</label>
        <input v-model.number="editAsset.entry" class="text-gray-700 shadow border rounded border-gray-300 mb-3 py-1 px-3 focus:outline-none focus:shadow-outline" type="number">
        <div class="flex justify-between items-center my-4">
          <button @click="save()" type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4">
            Save
          </button>
          <button @click="cancel()" type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold rounded py-2 px-4">
            Cancel
          </button>
        </div>
      </form>
      <form v-if="mode === 'add'" class="w-full max-w-xs bg-white flex flex-col py-5 px-8 rounded-lg shadow-lg">
        <label class="text-gray-700 font-bold py-2">Symbol</label>
        <input v-model="newAsset.symbol" class="text-gray-700 shadow border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-3" type="text" placeholder="btc">
        <label class="text-gray-700 font-bold py-2">Amount</label>
        <input v-model.number="newAsset.amount" class="text-gray-700 shadow border rounded border-gray-300 mb-3 py-1 px-3 focus:outline-none focus:shadow-outline" type="number">
        <label class="text-gray-700 font-bold py-2">Entry Price</label>
        <input v-model.number="newAsset.entry" class="text-gray-700 shadow border rounded border-gray-300 mb-3 py-1 px-3 focus:outline-none focus:shadow-outline" type="number">
        <div class="flex justify-between items-center my-4">
          <button @click="add()" type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4">
            Add
          </button>
          <button @click="cancel()" type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold rounded py-2 px-4">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div class="flex flex-col mt-10">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Open Price
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mark Price
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    PnL
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="asset in portfolio.assets" :key="asset.symbol">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ coinsByName[asset.symbol].name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ asset.amount }} {{ asset.symbol }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ asset.entry }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ coinsByName[asset.symbol].current_price }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ getPnl(asset) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button @click="edit(asset)">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CMCService from '@/services/coingecko'
import Shake from 'shake.js'

export default {
  name: 'Portfolio',
  data: function () {
    return {
      mode: null,
      newAsset: {
        symbol: null,
        amount: null,
        entry: null
      },
      editAsset: {
        symbol: null,
        amount: null,
        entry: null
      },
      portfolios: null,
      portfolio: {
        name: null
        // assets: []
      },
      coins: []
    }
  },
  async mounted () {
    if (localStorage.portfolios) {
      const portfolios = JSON.parse(localStorage.portfolios)
      this.portfolios = portfolios
      this.portfolio = portfolios.find(p => p.id === parseInt(this.$route.params.id))
    }
    const response = await CMCService.getListings()
    this.coins = response.data
    // create a new instance of shake.js.
    const myShakeEvent = new Shake({
      threshold: 15
    })
    // start listening to device motion
    myShakeEvent.start()
    // register a shake event
    window.addEventListener('shake', this.shakeEventDidOccur, false)
  },
  computed: {
    coinsByName: function () {
      const list = {}
      this.coins.forEach(coin => {
        list[coin.symbol] = coin
      })
      return list
    }
  },
  methods: {
    async refresh () {
      const response = await CMCService.getListings()
      this.coins = response.data
      alert('Updated!')
    },
    // Shake callback function
    async shakeEventDidOccur () {
      await this.refresh()
    },
    cancel () {
      this.mode = null
    },
    addMode () {
      this.mode = 'add'
    },
    add () {
      const asset = {
        symbol: this.newAsset.symbol,
        entry: this.newAsset.entry,
        amount: this.newAsset.amount
      }
      this.portfolio.assets.push(asset)
      const portfolios = JSON.parse(localStorage.portfolios)
      const otherPortfolios = portfolios.filter(p => p.id !== parseInt(this.$route.params.id))
      otherPortfolios.push(this.portfolio)
      localStorage.portfolios = JSON.stringify(otherPortfolios)
      this.mode = null
      this.newAsset.symbol = null
      this.newAsset.entry = null
      this.newAsset.amount = null
    },
    edit (asset) {
      this.mode = 'edit'
      this.editAsset.symbol = asset.symbol
      this.editAsset.entry = asset.entry
      this.editAsset.amount = asset.amount
    },
    save () {
      const index = this.portfolio.assets.findIndex(asset => asset.symbol === this.editAsset.symbol)
      this.portfolio.assets[index] = this.editAsset
      const portfolios = JSON.parse(localStorage.portfolios)
      const otherPortfolios = portfolios.filter(p => p.id !== parseInt(this.$route.params.id))
      otherPortfolios.push(this.portfolio)
      localStorage.portfolios = JSON.stringify(otherPortfolios)
      this.mode = null
      this.editAsset.symbol = null
      this.editAsset.entry = null
      this.editAsset.amount = null
    },
    getPnl: function (asset) {
      const notional = asset.entry * asset.amount
      const currentValue = this.coinsByName[asset.symbol].current_price * asset.amount
      return (currentValue - notional).toFixed(2)
    }
  }
}
</script>
