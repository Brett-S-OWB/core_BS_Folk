import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

export const historyChartHeights = Array.from(
  { length: 18 },
  (_, index) => 150 + index * 50,
);

export const useLocalDataStore = defineStore('localData', () => {
  const $q = useQuasar();

  // Display preferences belong to this browser, not the openWB configuration.
  const savedList = (key: string, fallback: string[]): string[] => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) || 'null');
      return Array.isArray(value) &&
        value.every((item) => typeof item === 'string')
        ? value
        : fallback;
    } catch {
      return fallback;
    }
  };
  const desktopOverview = ref(
    localStorage.getItem('koala-desktop-overview') === 'true',
  );
  const desktopSlides = ref(
    savedList('koala-desktop-slides', ['daily_totals', 'history_chart']),
  );
  const additionalChartsOpen = ref(false);
  const dashboardVisual = ref(
    localStorage.getItem('koala-dashboard-visual') || 'flow_diagram',
  );
  watch(dashboardVisual, (value) =>
    localStorage.setItem('koala-dashboard-visual', value),
  );
  const savedHistoryHeight = Number(
    localStorage.getItem('koala-history-height'),
  );
  const historyChartHeight = ref(
    historyChartHeights.includes(savedHistoryHeight) ? savedHistoryHeight : 300,
  );
  const expandedDailyTotals = ref(savedList('koala-expanded-daily-totals', []));
  watch(
    expandedDailyTotals,
    (value) =>
      localStorage.setItem(
        'koala-expanded-daily-totals',
        JSON.stringify(value),
      ),
    { deep: true },
  );
  const deviceOverview = ref(
    localStorage.getItem('koala-device-overview') === 'true',
  );
  const dashboardDeviceSections = ref(
    savedList('koala-device-sections', ['charge-points', 'consumers']),
  );
  const deviceLayout = ref<'grid' | 'sections'>(
    localStorage.getItem('koala-device-layout') === 'sections'
      ? 'sections'
      : 'grid',
  );
  watch(deviceLayout, (value) =>
    localStorage.setItem('koala-device-layout', value),
  );
  watch(historyChartHeight, (value) =>
    localStorage.setItem('koala-history-height', String(value)),
  );
  watch(deviceOverview, (value) =>
    localStorage.setItem('koala-device-overview', String(value)),
  );
  watch(
    dashboardDeviceSections,
    (value) =>
      localStorage.setItem('koala-device-sections', JSON.stringify(value)),
    { deep: true },
  );
  watch(desktopOverview, (value) =>
    localStorage.setItem('koala-desktop-overview', String(value)),
  );
  watch(
    desktopSlides,
    (value) =>
      localStorage.setItem('koala-desktop-slides', JSON.stringify(value)),
    { deep: true },
  );

  //////////////    Legend Visibility     ///////////////////////

  const legendVisibility = ref<Record<string, boolean>>({
    history_chart: !$q.platform.is.mobile,
    sankey_chart: !$q.platform.is.mobile,
  });
  const isLegendVisible = (chart: string) =>
    legendVisibility.value[chart] ?? !$q.platform.is.mobile;

  const toggleLegendVisibility = (chart: string) => {
    legendVisibility.value[chart] = !isLegendVisible(chart);
  };

  //////////////    Legend Item Visibility     ///////////////////////

  const hiddenDatasets = ref<string[]>([]);

  // Function to add a dataset to hidden list
  const hideDataset = (datasetKey: string) => {
    if (!hiddenDatasets.value.includes(datasetKey)) {
      hiddenDatasets.value.push(datasetKey);
    }
  };

  const showDataset = (datasetKey: string) => {
    hiddenDatasets.value = hiddenDatasets.value.filter(
      (item) => item !== datasetKey,
    );
  };

  const toggleDataset = (datasetKey: string) => {
    if (hiddenDatasets.value.includes(datasetKey)) {
      showDataset(datasetKey);
    } else {
      hideDataset(datasetKey);
    }
  };

  const isDatasetHidden = (datasetKey: string): boolean => {
    return hiddenDatasets.value.includes(datasetKey);
  };

  return {
    dashboardVisual,
    expandedDailyTotals,
    deviceLayout,
    historyChartHeight,
    deviceOverview,
    dashboardDeviceSections,
    desktopOverview,
    desktopSlides,
    additionalChartsOpen,
    hiddenDatasets,
    isDatasetHidden,
    toggleDataset,
    hideDataset,
    showDataset,
    isLegendVisible,
    toggleLegendVisibility,
  };
});
