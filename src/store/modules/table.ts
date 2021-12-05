interface SortColumn {
	enabled: boolean;
	direction: boolean;
	column: string;
	type: string;
}

interface StepInfo {
	currentStep: number;
	limit: number;
	direction: boolean;
	tId: number;
}

interface Field {
	tId: number;
	value: number | string;
}

interface StateTable {
	tId: number,
	filterInput: string;
	tableName: string;
	columns: Array<any>;
	data: Array<any>;
	sort: SortColumn;
	initialData: Array<any>;
	limit: number;
	currentStep: number;
}

interface StateTables {
	tables: Array<StateTable>
}

interface Operations {
	string: Function;
	number: Function;
	date: Function;
}

const sortOperations: Operations | any = {
	'string': (a: string, b: string, sortDirection: boolean) => {
		return sortDirection ? ('' + a).localeCompare(b) : ('' + b).localeCompare(a);
	},
	'number': (a: number, b: number, sortDirection: boolean) => {
		return sortDirection ? a - b : b - a
	},
	'date': (a: string, b: string, sortDirection: boolean) => {
		return sortDirection ? +new Date(a) - +new Date(b) : +new Date(b) - +new Date(a)
	}
}

export default {
	state: {
		tables: [],
	},
	actions: {
		setTables(ctx: any, table: StateTable) {
			ctx.commit('updateTables', table)
		},
		setFilterInput(ctx: any, input: Field) {
			ctx.commit('updateFilterInput', input)
		},
		setLimit(ctx: any, limit: Field) {
			ctx.commit('updateLimit', limit);
		},
		setStep(ctx: any, step: Field) {
			ctx.commit('updateCurrentStep', step);
		},
		changeStep(ctx: any, stepInfo: StepInfo) {
			let nextStep = stepInfo.direction ? ++stepInfo.currentStep : --stepInfo.currentStep
			if(nextStep < 0) {
				nextStep = 0;
				ctx.commit('updateCurrentStep', {tId: stepInfo.tId, value: nextStep});
				return;
			}
			const table = ctx.state.tables.find((table: StateTable) => table.tId === stepInfo.tId);
			const lastStep = Math.ceil(stepInfo.limit / +table.limit);
			if(lastStep === nextStep) {
				ctx.commit('updateCurrentStep', {tId: stepInfo.tId, value: --nextStep});
				return;
			}
			ctx.commit('updateCurrentStep', {tId: stepInfo.tId, value: nextStep});
		},
		setSort(ctx: any, sortInfo: any) {
			const tId = sortInfo.tId;
			const table = ctx.state.tables.find((table: StateTable) => table.tId === tId);
			const sort = table.sort;
			const column = sortInfo.column;
			const type = sortInfo.type;
			if(!sort.enabled) {
				return ctx.commit('updateSort', {
					tId,
					enabled: true,
					direction: true,
					column,
					type
				})
			}
			if(sort.column !== column) {
				return ctx.commit('updateSort', {
					tId,
					enabled: true,
					direction: true,
					column,
					type
				})
			}
			if(sort.direction) {
				return ctx.commit('updateSort', {
					tId,
					enabled: true,
					direction: false,
					column,
					type
				})
			}
			ctx.commit('updateData', {
				tId,
				data: [...table.initialData]
			});
			return ctx.commit('updateSort', {
				tId,
				enabled: false,
				direction: true,
				column: '',
				type: ''
			})
		}
	},
	mutations: {
		updateTables(state: StateTables, table: StateTable) {
			const tableIdx = state.tables.findIndex((findTable: StateTable) => 
				findTable.tId === table.tId)
			state.tables.push({
				tId: table.tId,
				tableName: table.tableName,
				columns: table.columns,
				data: table.data,
				initialData: table.initialData,
				filterInput: '',
				limit: 10,
				currentStep: 0,
				sort: {
					enabled: false,
					direction: true,
					column: '',
					type: '',
				}
			})
		},
		updateData(state: StateTables, updateData: any) {
			const tableIdx = state.tables.findIndex((findTable: StateTable) => 
				findTable.tId === updateData.tId)
			state.tables[tableIdx].data = updateData.data
		},
		updateFilterInput(state: StateTables, input: Field) {
			const tableIdx = state.tables.findIndex((findTable: StateTable) => 
				findTable.tId === input.tId)
			state.tables[tableIdx].filterInput = (input.value as string)
		},
		updateSort(state: StateTables, sort: any) {
			const tableIndex = state.tables.findIndex((table: StateTable) => table.tId === sort.tId);
			state.tables[tableIndex].sort = sort;
		},
		updateLimit(state: StateTables, limit: any) {
			const tableIndex = state.tables.findIndex((table: StateTable) => table.tId === limit.tId);
			state.tables[tableIndex].limit = limit.value;
		},
		updateCurrentStep(state: StateTables, currentStep: any) {
			const tableIndex = state.tables.findIndex((table: StateTable) => table.tId === currentStep.tId);
			state.tables[tableIndex].currentStep = +currentStep.value;
		}
	},
	getters: {
		getTableData: (state: StateTables) => (tId: number) => {
			const tableIdx = state.tables.findIndex((table: StateTable) => table.tId === tId);
			const dataTable = state.tables[tableIdx].sort.enabled 
				? state.tables[tableIdx].data.sort((a, b) => 
					sortOperations[state.tables[tableIdx].sort.type]
						(a[state.tables[tableIdx].sort.column], 
					 	b[state.tables[tableIdx].sort.column], 
						state.tables[tableIdx].sort.direction)) 
				: state.tables[tableIdx].data;
			const from = +state.tables[tableIdx].limit + +state.tables[tableIdx].limit * (+state.tables[tableIdx].currentStep - 1);
			const to = +state.tables[tableIdx].limit + +state.tables[tableIdx].limit * (+state.tables[tableIdx].currentStep);
			if(!state.tables[tableIdx].filterInput.length) {
				return {
					tableName: state.tables[tableIdx].tableName,
					columns: state.tables[tableIdx].columns,
					filterInput: state.tables[tableIdx].filterInput,
					limit: state.tables[tableIdx].limit,
					currentStep: state.tables[tableIdx].currentStep,
					sort: state.tables[tableIdx].sort,
					data:	dataTable.filter((_, index) => index > from - 1 && index < to),
					count: dataTable.length,
					from,
					to
				}
			}
			const filteredDataTable = dataTable.filter((element: any) => {
				let wasFounded = false;
				for(let column = 0; column < state.tables[tableIdx].columns.length; column++) {
					if(element[state.tables[tableIdx].columns[column].value]
							.toString()
							.toUpperCase()
							.includes(state.tables[tableIdx].filterInput.toUpperCase())) {
						wasFounded = true;
						break
					}
				}
				return wasFounded;
			})
			
			return {
				tableName: state.tables[tableIdx].tableName,
				columns: state.tables[tableIdx].columns,
				filterInput: state.tables[tableIdx].filterInput,
				limit: state.tables[tableIdx].limit,
				currentStep: state.tables[tableIdx].currentStep,
				sort: state.tables[tableIdx].sort,
				data: filteredDataTable.filter((_, index) => index > from - 1 && index < to),
				count: filteredDataTable.length,
				from,
				to
			}
		},
	},
	namespaced: true,
}