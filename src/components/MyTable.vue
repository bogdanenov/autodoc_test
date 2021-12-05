<template>
	<div class="wrapper">
		<div class="wrapper__panel">
			<div class="filter">
				<input 
					class="filter__input" 
					type="text" 
					placeholder="Write for filtering"
					:value="tableData(tId).filterInput"
					@input="setFilterInput({tId, value: $event.target.value})">
				<button class="filter__clear" @click.prevent="setFilterInput({tId, value: ''})">&times;</button>
			</div>
			<div class="description">
				<span class="description__growing"><span class="description__circle"></span>Sort by growing</span>
				<span class="description__descending"><span class="description__circle"></span>Sort by descending</span>
			</div>
		</div>
		<div class='warning' v-if="!tableData(tId).data.length"><strong>No matches found for "{{tableData(tId).filterInput}}"</strong></div>
		<table class="table" :class="{'opacity': !tableData(tId).data.length}">
			<caption>
				{{tableData(tId).tableName}}
			</caption>
			<thead>
				<tr>
					<th v-for="column in tableData(tId).columns" 
						:key="column"
						@click.prevent="setSort({column:column.value, type:column.type, tId})"
						:class="{up: tableData(tId).sort.column === column.value && tableData(tId).sort.direction, 
										 down: tableData(tId).sort.column === column.value && !tableData(tId).sort.direction}">
						{{column.text}}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(field) in tableData(tId).data" :key="field.id">
					<td v-for="column in tableData(tId).columns" 
							:key="column" 
							:data-label="column.value"
							@click.prevent="sortOnMobile($event, {column:column.value, type:column.type, tId})"
							:class="{up: tableData(tId).sort.column === column.value && tableData(tId).sort.direction, 
							down: tableData(tId).sort.column === column.value && !tableData(tId).sort.direction}">{{field[column.value]}}</td>
				</tr>
			</tbody>
		</table>
		<div class="pagination">
			<div class="pagination__select">
				<span>Rows per page: {{tableData(tId).limit}} </span>
				<select name="page" 
						v-bind:value="tableData(tId).limit" 
						@change="setLimit({tId, value: $event.target.value}); setStep({tId, value: 0})">
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="20">20</option>
				</select>
			</div>
			<div class="pagination__control">
				<span>{{tableData(tId).from + 1}}-{{tableData(tId).to}} of {{tableData(tId).count}}</span>
				<div class="pagination__buttons">
					<button @click.prevent="changeStep({tId, direction: false, currentStep: tableData(tId).currentStep, limit: tableData(tId).count})">&larr;</button>
					<button @click.prevent="changeStep({tId, direction: true, currentStep: tableData(tId).currentStep, limit: tableData(tId).count})">&rarr;</button>
				</div>
			</div>
		</div>
	</div>
</template>
	
<script>
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
export default defineComponent({
	name: 'my-table',
	props: {
		tId: Number,
		tableName: String,
		columns: Array,
		data: Object
	},
	computed: {
		...mapGetters({
			tableData: 'table/getTableData',
		})
	},
	methods: {
		...mapActions({
			setTables: 'table/setTables',
			setFilterInput: 'table/setFilterInput',
			setSort: 'table/setSort',
			setLimit: 'table/setLimit',
			setStep: 'table/setStep',
			changeStep: 'table/changeStep',
		}),
		sortOnMobile(event, sort) {
			if(event.view.innerWidth < 800) {
				this.setSort(sort);
			}
		}
	},
	created() {
		this.setTables({
			tId: this.tId,
			tableName: this.tableName,
			columns: this.columns,
			data: [...this.data],
			initialData: [...this.data]
		})
	},
})
</script>

<style scoped>
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		width: 100%;
	}
	.wrapper__panel {
		display: flex;
    justify-content: space-between;
    width: 100%;
	}
	.filter__input {
		background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: 0.2rem;
    color: #495057;
    display: block;
    font-size: .825rem;
    font-weight: 400;
    line-height: 1.625;
    padding: 0.25rem 0.7rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    width: 100%;
	}
	.filter {
		position: relative;
	}
	.filter__clear {
		position: absolute;
		top: 0%;
		right: -12%;
		background-color: transparent;
		border: none;
		font-size: 24px;
		cursor: pointer;
		transition: opacity .3s ease;
	}
	.filter__clear:hover {
		opacity: .5;
	}
	.up {
		background-color: #b1f0c8 !important;
	}
	.down {
		background-color: #f0c0b1 !important;
	}
	.description {
		display: flex;
		opacity: .5;
	}
	.description__growing, .description__descending {
		display: flex;
		align-items: center;
	}
	.description__circle {
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #b1f0c8;
		margin: 0 10px;
	}
	.description__descending .description__circle {
		background-color: #f0c0b1;
	}
	.table {
		width: 100%;
		vertical-align: top;
		color: #6c757d;
		border-collapse: separate;
		border-spacing: 0px;
		transition: opacity .3s ease;
	}
	.opacity {
		opacity: .5;
	}
	.table caption {
		padding: 10px;
		font-weight: bold;
		text-align: left;
	}
	.table thead {
    vertical-align: bottom;
	}
	.table thead th {
		padding: 5px;
		border-bottom: 1px solid #dee6ed;
		transition: background-color .3s ease;
	}
	.table thead th:hover { 
		cursor: pointer;
		background-color: #dee6ed;
	}
	.table thead tr {
		background-color: #fff;
	}
	.table tbody td {
		color: #6c757d;
		transition: background-color .3s ease;
		font-size: 18px;
	}
	.table tbody tr {
		background-color: #fff;
		transition: background-color .3s ease;
	}
	.table tbody tr:nth-of-type(odd) {
		background-color: #f4f7f9;
	}
	.table tbody tr:hover {
		background-color: rgba(0,0,0,0.075);
		color: #6c757d;
	}
	.warning {
		width: 100%;
	}
	.pagination {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		width: 100%;
		margin-top: 20px;
		padding-right: 20px;
	}
	.pagination__select {
		display: flex;
		align-items: center;
		margin-right: 30px;
	}
	.pagination__select select {
		margin-left: 10px;
		padding: 3px;
		background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: 0.2rem;
    color: #495057;
    display: block;
    font-size: .825rem;
    font-weight: 400;
    line-height: 1.625;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	}
	.pagination__control {
		display: flex;
		align-items: center;
	}
	.pagination__buttons {
		margin-left: 15px;
	}
	.pagination__buttons button {
		background-color: #495057;
    border-color: #495057;
		color: #fff;
		padding: 5px;
		text-transform: uppercase;
		font-size: 15px;
		/* border-radius: 5px; */
		cursor: pointer;
		transition: opacity .3s ease;
	}
	.pagination__buttons button:hover {
		opacity: .5;
	}
	.pagination__buttons button:first-child {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	.pagination__buttons button:last-child {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
	@media screen and (max-width: 800px) {
		.table thead {
			display: none;
		}
		.table tbody tr:nth-of-type(odd) {
			background-color: #fff;
		}
		table tr {
			border-bottom: 3px solid #ddd;
			display: block;
			margin-bottom: .625em;
		}
		.table tbody td {
			border-bottom: 1px solid #ddd;
			display: block;
			padding: 5px;
			padding-right: 20px;
			text-align: right;
		}
		.table tbody td::before {
			content: attr(data-label);
			float: left;
			font-weight: bold;
			text-transform: uppercase;
			padding-left: 20px;
		}
		table td:last-child {
			border-bottom: 0;
		}
	}
</style>