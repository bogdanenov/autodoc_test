interface StateCounterParty {
	counterPartyData: Array<Object>
	counterPartyDataWithoutParse: Array<Object>
}
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
export default {
	state: {
		counterPartyData: [],
		counterPartyDataWithoutParse: []
	},
	actions: {
		async fetchCounterParty(ctx: any) {
			const res = await fetch('https://61a8992033e9df0017ea39dc.mockapi.io/api/counterparties');
			const inputData = await res.json();
			ctx.commit('updateCounterPartyWithoutParse', inputData)
			const counterParty = inputData.map((data: CounterParty) => {
				const billsArray = data.bills;
				const creditRepayment = billsArray.reduce((acc, cur) => acc + cur.amount, 0).toFixed(2);
				const billsNumber = billsArray.reduce((acc, cur) => acc + cur.number + ', ', '');
				const sortBills = billsArray.sort((a, b) => {
					return +new Date(a.date) - +new Date(b.date)
				});
				return {
					id: data.id,
					company: data.company.name,
					responsable: data.responsable.name,
					creditRepayment,
					bills: billsNumber.slice(0, billsNumber.length - 2),
					lastDate: sortBills[sortBills.length - 1].date,
					lastAmount: sortBills[sortBills.length - 1].amount,
				}
			})
			ctx.commit('updateCounterParty', counterParty)
		}
	},
	mutations: {
		updateCounterParty(state: StateCounterParty, counterParty: any) {
			state.counterPartyData = counterParty;
		},
		updateCounterPartyWithoutParse(state: StateCounterParty, counterParty: any) {
			state.counterPartyDataWithoutParse = counterParty;
		}
	},
	getters: {
		counterParty(state: StateCounterParty) {
			return state.counterPartyData
		},
		counterPartyWihtoutParse(state: StateCounterParty) {
			return state.counterPartyDataWithoutParse;
		}
	},
	namespaced: true
};
