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
  const persistedRef = <T>(
    key: string,
    fallback: T,
    parse: (value: string) => T | undefined,
  ) => {
    let initialValue = fallback;
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        initialValue = parse(saved) ?? fallback;
      }
    } catch {
      // Keep the default when browser storage is unavailable or invalid.
    }
    const preference = ref(initialValue);
    watch(
      preference,
      (value) => {
        try {
          localStorage.setItem(
            key,
            Array.isArray(value) ? JSON.stringify(value) : String(value),
          );
        } catch {
          // Keep changes in memory when browser storage is unavailable.
        }
      },
      { deep: true },
    );
    return preference;
  };
  const parseList = (saved: string): string[] | undefined => {
    const value: unknown = JSON.parse(saved);
    return Array.isArray(value) &&
      value.every((item) => typeof item === 'string')
      ? value
      : undefined;
  };
  const desktopOverview = persistedRef(
    'koala-desktop-overview',
    false,
    (value) => value === 'true',
  );
  const desktopSlides = persistedRef(
    'koala-desktop-slides',
    ['daily_totals', 'history_chart'],
    parseList,
  );
  const additionalChartsOpen = ref(false);
  const dashboardVisual = persistedRef(
    'koala-dashboard-visual',
    'flow_diagram',
    (value) => value || 'flow_diagram',
  );
  const historyChartHeight = persistedRef(
    'koala-history-height',
    300,
    (value) => {
      const height = Number(value);
      return historyChartHeights.includes(height) ? height : undefined;
    },
  );
  const expandedDailyTotals = persistedRef<string[]>(
    'koala-expanded-daily-totals',
    [],
    parseList,
  );
  const deviceOverview = persistedRef(
    'koala-device-overview',
    false,
    (value) => value === 'true',
  );
  const dashboardDeviceSections = persistedRef(
    'koala-device-sections',
    ['charge-points', 'consumers'],
    parseList,
  );
  const deviceLayout = persistedRef<'grid' | 'sections'>(
    'koala-device-layout',
    'grid',
    (value) => (value === 'sections' ? 'sections' : 'grid'),
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
