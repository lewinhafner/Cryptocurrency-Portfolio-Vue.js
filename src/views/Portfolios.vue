<template>
  <div class="about">

    <button @click="addMode()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4">
      Add Portfolio
    </button>

    <div class="mx-5 flex justify-center">
      <div v-if="mode === 'edit'" class="max-w-xs bg-white flex flex-col py-5 px-8 rounded-lg shadow-lg">
        <label class="text-gray-700 font-bold py-2">Name</label>
        <input v-model="editPortfolio.name" class="text-gray-700 shadow border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-3" type="text">
        <div class="flex justify-between items-center my-4">
          <button @click="save()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4">
            Save
          </button>
          <button @click="cancel()" class="bg-red-500 hover:bg-red-700 text-white font-bold rounded py-2 px-4">
            Cancel
          </button>
        </div>
      </div>

      <div v-if="mode === 'add'" class="w-full max-w-xs bg-white flex flex-col py-5 px-8 rounded-lg shadow-lg">
        <label class="text-gray-700 font-bold py-2">Name</label>
        <input v-model="newPortfolio.name" class="text-gray-700 shadow border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-3" type="text">
        <div class="flex justify-between items-center my-4">
          <button @click="add()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4">
            Add
          </button>
          <button @click="cancel()" class="bg-red-500 hover:bg-red-700 text-white font-bold rounded py-2 px-4">
            Cancel
          </button>
        </div>
      </div>
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
                    View
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="portfolio in portfolios" :key="portfolio.id">
                  <td v-if="portfolio.name" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ portfolio.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button @click="view(portfolio)">View</button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button @click="edit(portfolio)">Edit</button>
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
export default {
  name: 'Portfolios',
  data: function () {
    return {
      mode: null,
      newPortfolio: {
        name: null
      },
      editPortfolio: {
        id: null,
        name: null
      },
      portfolios: []
    }
  },
  mounted () {
    if (localStorage.portfolios) {
      this.portfolios = JSON.parse(localStorage.portfolios)
    }
  },
  methods: {
    view (portfolio) {
      this.$router.push({ name: 'Portfolio', params: { id: portfolio.id } })
    },
    addMode () {
      this.mode = 'add'
    },
    cancel () {
      this.mode = null
    },
    add () {
      const portfolio = {
        id: Date.now(),
        name: this.newPortfolio.name,
        assets: []
      }
      this.portfolios.push(portfolio)
      localStorage.portfolios = JSON.stringify(this.portfolios)
      this.mode = null
      this.newPortfolio.name = null
    },
    edit (portfolio) {
      this.mode = 'edit'
      this.editPortfolio.id = portfolio.id
      this.editPortfolio.name = portfolio.name
    },
    save () {
      const index = this.portfolios.findIndex(portfolio => portfolio.id === this.editPortfolio.id)
      this.portfolios[index] = this.editPortfolio
      localStorage.portfolios = JSON.stringify(this.portfolios)
      this.mode = null
      this.editPortfolio.name = null
    }
  }
}
</script>
