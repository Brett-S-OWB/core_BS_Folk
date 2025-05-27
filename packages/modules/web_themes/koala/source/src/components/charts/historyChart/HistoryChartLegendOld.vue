<template>
  <div class="custom-legend-container" v-if="chart">
    <div
      v-for="(dataset, index) in legendItems"
      :key="dataset.text || index"
      class="legend-item"
      :class="{ 'legend-item-hidden': dataset.hidden }"
      @click="toggleDataset(dataset.text, dataset.datasetIndex)"
    >
      <span
        class="legend-color-box"
        :style="{ backgroundColor: getItemColor(dataset) }"
      ></span>
      <span class="legend-label">{{ dataset.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLocalDataStore } from 'src/stores/localData-store';
import { Chart, LegendItem } from 'chart.js';

const props = defineProps<{
  chart: Chart | null;
}>();

const localDataStore = useLocalDataStore();
const legendItems = ref<LegendItem[]>([]);

// Update legend items from chart
const updateLegendItems = () => {
  if (!props.chart) return;

  // Use Chart.js's built-in legend item generation
  const items =
    props.chart.options.plugins?.legend?.labels?.generateLabels?.(
      props.chart,
    ) || [];

  // Apply hidden state from store
  items.forEach((item) => {
    if (item.text && localDataStore.isDatasetHidden(item.text)) {
      item.hidden = true;
    }
  });

  legendItems.value = items;
};

// Get the actual color for a legend item
const getItemColor = (item: LegendItem): string => {
  if (!props.chart || item.datasetIndex === undefined) return '#ccc';

  const dataset = props.chart.data.datasets[item.datasetIndex];
  // Use borderColor as the primary color source
  return (dataset.borderColor as string) || '#ccc';
};
// Toggle dataset visibility
const toggleDataset = (datasetName?: string, datasetIndex?: number) => {
  if (!props.chart || !datasetName || datasetIndex === undefined) return;

  // Toggle in store
  localDataStore.toggleDataset(datasetName);

  // Update chart visibility
  if (localDataStore.isDatasetHidden(datasetName)) {
    props.chart.hide(datasetIndex);
  } else {
    props.chart.show(datasetIndex);
  }

  // Update legend items
  updateLegendItems();

  // Update chart
  props.chart.update();
};

// Watch for changes in the chart and update the legend
watch(
  () => props.chart,
  (newChart) => {
    if (newChart) {
      // Apply hidden datasets from store
      newChart.data.datasets.forEach((dataset, index) => {
        if (
          typeof dataset.label === 'string' &&
          localDataStore.isDatasetHidden(dataset.label)
        ) {
          newChart.getDatasetMeta(index).hidden = true;
        }
      });
      newChart.update();

      // Update legend items
      updateLegendItems();
    }
  },
  { immediate: true },
);

// Watch for changes in the chart data
watch(
  () => props.chart?.data,
  () => {
    updateLegendItems();
  },
  { deep: true },
);
</script>

<style scoped>
.custom-legend-container {
  max-height: 80px;
  margin-bottom: 5px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 4px 8px;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  margin: 3px;
  cursor: pointer;
  user-select: none;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.65);
}

.legend-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.legend-color-box {
  display: inline-block;
  width: 20px;
  height: 3px;
  margin-right: 4px;
}

.legend-item-hidden {
  opacity: 0.6 !important;
  text-decoration: line-through !important;
}

/* Make the container responsive */
@media (max-width: 768px) {
  .custom-legend-container {
    max-height: 120px;
  }

  .legend-item {
    font-size: 0.8em;
    margin-right: 5px;
    margin-bottom: 3px;
  }

  .legend-color-box {
    width: 12px;
    height: 3px;
    margin-right: 4px;
  }
}

/* For very small screens */
@media (max-width: 576px) {
  .custom-legend-container {
    max-height: 80px;
  }

  .legend-color-box {
    width: 10px;
    height: 2px;
    margin-right: 4px;
  }
}

/* Dark mode support */
:deep(.q-dark) .legend-item {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.q-dark) .legend-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
