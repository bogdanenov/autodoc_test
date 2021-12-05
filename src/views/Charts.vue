<template>
  <div class="charts">
		<div class="chart__bar">
			<apexchart ref="chartBar" width="100%" type="bar" :options="barChart.options" :series="barChart.series"></apexchart>
		</div>
		<div class="chart__donut">
			<div class="donut">
			<apexchart ref="chartDonut" width="100%" type="donut" :options="donutChart.options" :series="donutChart.series"></apexchart>
			</div>
			<div class="donut">
				Second donut chart...
			</div>
		</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'Charts',
	computed: {
		...mapGetters({
			bar: 'charts/getBar',
			donut: 'charts/getDonut',
			counterParty: 'api/counterPartyWihtoutParse'
		}),
		barChart() {
			if(this.$refs.chartBar) {
				this.$refs.chartBar.updateOptions({
					xaxis: {
						categories: this.bar.options.xaxis.categories
					}
				});
				this.$refs.chartBar.updateSeries([{
					data: this.bar.series.data
				}])
			}
			return this.bar
		},
		donutChart() {
			if(this.$refs.chartDonut) {
				this.$refs.chartDonut.updateOptions({
					labels: this.donut.options.labels,
					series: this.donut.series
				})
			}
			return this.donut
		}
	},
	methods: {
		...mapActions({
			fetchCounterParty: 'api/fetchCounterParty',
			setData: 'charts/setData'
		})
	},
	async mounted() {
		await this.fetchCounterParty();
		this.setData([...this.counterParty]);
	},
}
</script>

<style scoped>
	.charts {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-direction: column;
		padding: 30px 0;
		width: 100%;
	}

	.chart__bar, .chart__donut {
		width: 100%;
	}

	.chart__donut {
		display: flex;
		width: 100%;
	}
	.donut {
		width: 50%;
	}

	@media screen and (max-width: 800px) {
		.chart__donut {
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
		}
	}
	
</style>
