<template>
  <section
    class="dashboard-chart"
    :class="`dashboard-${chart.name}`"
    :style="{
      '--history-chart-height': `${localDataStore.historyChartHeight}px`,
    }"
    :aria-label="chart.label"
    :data-chart="chart.name"
  >
    <div class="dashboard-chart-body">
      <component
        :is="chart.component"
        v-bind="
          ['flow_diagram', 'sankey_chart'].includes(chart.name)
            ? { dashboard: true }
            : {}
        "
        :show-legend="localDataStore.isLegendVisible(chart.name)"
      />
    </div>
    <div v-if="chart.name === 'history_chart'" class="row justify-end">
      <q-btn
        flat
        dense
        size="sm"
        color="primary"
        label="Legende"
        :aria-pressed="localDataStore.isLegendVisible(chart.name)"
        @click="localDataStore.toggleLegendVisibility(chart.name)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { topCharts } from './charts/topCharts';
import { useLocalDataStore } from 'src/stores/localData-store';

defineProps<{ chart: (typeof topCharts)[number] }>();
const localDataStore = useLocalDataStore();
</script>

<style scoped>
.dashboard-chart {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.dashboard-chart-body {
  min-width: 0;
  min-height: 0;
}
.dashboard-flow_diagram .dashboard-chart-body {
  height: clamp(200px, 26vh, 280px);
}
.dashboard-sankey_chart {
  height: var(--overview-live-height);
}
.dashboard-sankey_chart .dashboard-chart-body {
  flex: none;
  width: 100%;
  max-width: 900px;
  height: clamp(180px, 20vh, 240px);
  margin: auto;
  padding: 0.5rem;
  min-height: 0;
}
.dashboard-history_chart .dashboard-chart-body {
  height: var(--history-chart-height);
}
</style>
