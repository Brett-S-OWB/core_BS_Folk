import { computed } from 'vue';
import { useMqttStore } from 'src/stores/mqtt-store';
import EnergyFlowChart from './energyFlowChart/EnergyFlowChart.vue';
import HistoryChart from './historyChart/HistoryChart.vue';
import DailyTotals from './dailyTotals/DailyTotals.vue';
import SankeyChart from './sankeyChart/SankeyChart.vue';

export const topCharts = [
  { name: 'flow_diagram', label: 'Energiefluss', component: EnergyFlowChart },
  { name: 'history_chart', label: 'Verlauf', component: HistoryChart },
  {
    name: 'daily_totals',
    label: 'Leistung und Tageswerte',
    component: DailyTotals,
  },
  { name: 'sankey_chart', label: 'Sankey', component: SankeyChart },
];

export function useTopCharts() {
  const mqttStore = useMqttStore();
  return computed(() => {
    const order = mqttStore.themeConfiguration?.top_carousel_slide_order;
    if (!order?.length) return topCharts;
    return order.flatMap((name) =>
      topCharts.filter((chart) => chart.name === name),
    );
  });
}
