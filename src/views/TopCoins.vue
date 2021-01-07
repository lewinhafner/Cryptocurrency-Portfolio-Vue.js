<template>
  <div class="about">

    <button @click="refresh()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4">
      Refresh data
    </button>

    <!-- This example requires Tailwind CSS v2.0+ -->
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
                    #
                  </th>
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
                    Price
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Change 24h
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Market Cap Change 24h
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(coin, index) in coins" :key="coin.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ coin.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ coin.current_price }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ coin.price_change_percentage_24h }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ coin.market_cap_change_percentage_24h }}%
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
import Shake from 'shake.js'
import CMCService from '../services/coingecko'

export default {
  name: 'TopCoins',
  data: function () {
    return {
      coins: []
    }
  },
  async mounted () {
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
  methods: {
    async refresh () {
      const response = await CMCService.getListings()
      this.coins = response.data
      alert('Updated!')
    },
    // Shake callback function
    async shakeEventDidOccur () {
      await this.refresh()
    }
  }
}
</script>
