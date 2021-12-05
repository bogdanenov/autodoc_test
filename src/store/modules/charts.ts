import { ApexOptions } from "apexcharts";

interface FielDescription {
	id: number;
	name: string;
}
interface Bill {
	id: number;
	number: string;
	date: string;
	amount: number
}
interface CounterParty {
	id: string;
	company: FielDescription;
	responsable: FielDescription;
	bills: Array<Bill>
}

interface StateChart {
	data: Array<CounterParty>
	bar: any,
	pie: any
}

function getChartData(data: Array<CounterParty>, field: 'company' | 'responsable') {
	const barData = data;
	const fieldMap = new Map();
	barData.forEach((data: CounterParty) => {
		const name = data[field].name;
		const previousAmount = fieldMap.get(name);
		const currentAmount = data.bills.reduce((acc: number, cur: Bill) => acc + cur.amount, 0);
		if(previousAmount) {
			fieldMap.set(name, +(previousAmount + currentAmount).toFixed(2))
			return;
		}
		fieldMap.set(name, +currentAmount.toFixed(2));
	})
	const arrayFieldMap = Array.from(fieldMap, ([name, value]) => ({ name, value }));
	const arrayName = arrayFieldMap.map((arr) => arr.name);
	const arrayAmount = arrayFieldMap.map((arr) => arr.value);

	return {arrayName, arrayAmount}
}

export default {
	state: {
		data: [],
		bar: {
			options: {
				chart: {
					id: 'responsableBar',
					zoom: {
						enabled: true
					}
				},
				xaxis: {
					categories: []
				},
				title: {
					text: "Responsable"
				},
				plotOptions: {
					bar: {
						columnWidth: '90%',
						dataLabels: {
							orientation: 'vertical'
						}
					}
				}
			},
			series: [{
				name: 'Amount',
        data: [],
			}],
		},
		donut: {
			options: {
				chart: {
					id: 'counterPartyDonut'
				},
				title: {
					text: "Counterparty"
				},
				labels: []
			},
			series: [],
		}
	},
	actions: {
		setData(ctx: any, data: Array<Object>) {
			ctx.commit('updateData', data);
		}
	},
	mutations: {
		updateData(state: any, data: Array<Object>) {
			state.data = data;
		},
		updateCategories(state: any, data: Array<string>) {
			state.bar.options.xaxis.categories = data
		}
	},
	getters: {
		getBar(state: StateChart) {
			const {arrayName, arrayAmount} = getChartData([...state.data], 'responsable')
			state.bar.options.xaxis.categories = arrayName;
			state.bar.series.data = arrayAmount;
			return state.bar;
		},
		getDonut(state: any) {
			const {arrayName, arrayAmount} = getChartData([...state.data], 'company')
			state.donut.options.labels = arrayName;
			state.donut.series = arrayAmount;
			return state.donut
		}
	},
	namespaced: true
};
