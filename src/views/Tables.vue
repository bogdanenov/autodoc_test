<template>
  <div class="tables">
    <my-table v-if="counterParty.length > 0" :columns="columns" :data="counterParty" :tableName="'Counterparty'" :tId="0"></my-table>
		<div class="loading" v-else>Loading...</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
export default defineComponent({
  name: 'Tables',
	data() {
		return {
			columns: [{
					text: 'ID',
					value: 'id',
					type: 'number'
				},{
					text: 'Company name',
					value: 'company',
					type: 'string',
				},{
					text: 'Responsable name',
					value: 'responsable',
					type: 'string',
				},{
					text: 'Credit repayment',
					value: 'creditRepayment',
					type: 'number',
				},{
					text: 'Bills',
					value: 'bills',
					type: 'string',
				},{
					text: 'Repayment last date',
					value: 'lastDate',
					type: 'date',
				},{
					text: 'Repayment last amount',
					value: 'lastAmount',
					type: 'number'
				},
			],
		}
	},
	computed: {
		...mapGetters({
			counterParty: 'api/counterParty'
		})
	},
	methods: {
		...mapActions({
			fetchCounterParty: 'api/fetchCounterParty'
		})
	},
	async mounted() {
		await this.fetchCounterParty();
	},
});
</script>

<style scoped>
	.tables {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow-x: auto;
		padding: 15px;
	}
</style>
