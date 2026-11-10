<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>openWB</q-toolbar-title>
        <q-space />
        <connection-indicator />
        <user-indicator />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      side="left"
      :overlay="!localDataStore.desktopOverview || $q.screen.width < 1024"
      elevated
      :breakpoint="localDataStore.desktopOverview ? 1023 : 500"
    >
      <!-- drawer content -->
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
        <q-list padding>
          <div v-if="accessStatusAllowed">
            <q-item clickable v-ripple href="/openWB/web/settings/#/Status">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section> Status </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <div v-if="accessChargeLogAllowed || accessChartAllowed">
            <q-item-label header>Auswertungen</q-item-label>

            <q-item
              v-if="accessChargeLogAllowed"
              clickable
              v-ripple
              href="/openWB/web/settings/#/Logging/ChargeLog"
            >
              <q-item-section avatar>
                <q-icon name="table_chart" />
              </q-item-section>

              <q-item-section> Ladeprotokoll </q-item-section>
            </q-item>

            <q-item
              v-if="accessChartAllowed"
              clickable
              v-ripple
              href="/openWB/web/settings/#/Logging/Chart"
            >
              <q-item-section avatar>
                <q-icon name="area_chart" />
              </q-item-section>

              <q-item-section> Diagramme </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <div v-if="accessSettingsAllowed">
            <q-item clickable v-ripple href="/openWB/web/settings/">
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>

              <q-item-section> Einstellungen </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <q-item-label header>Anzeigeeinstellungen</q-item-label>

          <q-item>
            <q-item-section avatar>
              <q-icon name="light_mode" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Darstellungsmodus</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn-group flat>
                <q-btn
                  flat
                  round
                  :color="themeMode === 'light' ? 'primary' : ''"
                  icon="light_mode"
                  @click="setTheme('light')"
                  size="sm"
                  :disable="themeMode === 'light'"
                  aria-label="Light Mode"
                >
                  <q-tooltip>Hell</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  :color="themeMode === 'dark' ? 'primary' : ''"
                  icon="dark_mode"
                  @click="setTheme('dark')"
                  size="sm"
                  :disable="themeMode === 'dark'"
                  aria-label="Dark Mode"
                >
                  <q-tooltip>Dunkel</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  :color="themeMode === 'auto' ? 'primary' : ''"
                  icon="devices"
                  @click="setTheme('auto')"
                  size="sm"
                  :disable="themeMode === 'auto'"
                  aria-label="System Mode"
                >
                  <q-tooltip>Systemeinstellung</q-tooltip>
                </q-btn>
              </q-btn-group>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-toggle
                v-model="localDataStore.desktopOverview"
                label="Desktop-Übersicht"
              />
            </q-item-section>
          </q-item>
          <div v-if="localDataStore.desktopOverview" class="q-px-md q-pb-md">
            <q-item-label caption class="q-mb-sm"
              >Gemeinsam anzeigen</q-item-label
            >
            <div v-for="chart in availableCharts" :key="chart.name">
              <q-checkbox
                v-model="localDataStore.desktopSlides"
                :val="chart.name"
                :label="chart.label"
                class="full-width"
              />
              <q-select
                v-if="
                  chart.name === 'history_chart' &&
                  localDataStore.desktopSlides.includes(chart.name)
                "
                v-model="localDataStore.historyChartHeight"
                :options="historyChartHeights"
                :display-value="`${localDataStore.historyChartHeight} px`"
                label="Verlaufshöhe"
                dense
                outlined
                class="q-ml-sm q-mb-sm"
              />
            </div>
            <q-btn
              v-if="
                availableCharts.some(
                  (chart) => !localDataStore.desktopSlides.includes(chart.name),
                )
              "
              flat
              dense
              color="primary"
              icon="view_carousel"
              label="Weitere Ansichten"
              class="q-mt-sm"
              @click="openAdditionalCharts"
            />
            <q-toggle
              v-model="localDataStore.deviceOverview"
              label="Geräte-Dashboard"
              class="q-mt-sm"
            />
            <div v-if="localDataStore.deviceOverview">
              <q-select
                v-model="localDataStore.deviceLayout"
                :options="[
                  { label: 'Kachelraster', value: 'grid' },
                  { label: 'Bereiche untereinander', value: 'sections' },
                ]"
                emit-value
                map-options
                label="Anordnung"
                dense
                outlined
                class="q-my-sm"
              />
              <q-checkbox
                v-for="section in availableDeviceSections"
                :key="section.name"
                v-model="localDataStore.dashboardDeviceSections"
                :val="section.name"
                :label="section.label"
                class="full-width"
              />
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Page container that takes the remaining height -->
    <q-page-container class="column flex">
      <div
        class="centered-container"
        :class="{ 'dashboard-wide': localDataStore.desktopOverview }"
      >
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import UserIndicator from 'src/components/UserIndicator.vue';
import ConnectionIndicator from 'src/components/ConnectionIndicator.vue';
import { useMqttStore } from 'src/stores/mqtt-store';
import {
  useLocalDataStore,
  historyChartHeights,
} from 'src/stores/localData-store';
import { useTopCharts } from 'src/components/charts/topCharts';
import { useDeviceSections } from 'src/components/deviceSections';
const mqttStore = useMqttStore();
const localDataStore = useLocalDataStore();
const availableCharts = useTopCharts();
const availableDeviceSections = useDeviceSections();

import { useQuasar } from 'quasar';
const $q = useQuasar();

defineOptions({
  name: 'MainLayout',
});

const accessSettingsAllowed = computed(() => mqttStore.accessSettingsAllowed);
const accessStatusAllowed = computed(() => mqttStore.accessStatusAllowed);
const accessChargeLogAllowed = computed(() => mqttStore.accessChargeLogAllowed);
const accessChartAllowed = computed(() => mqttStore.accessChartAllowed);

const drawer = ref(false);
const openAdditionalCharts = () => {
  drawer.value = false;
  localDataStore.additionalChartsOpen = true;
};
const themeMode = ref('auto');

const setTheme = (mode: 'light' | 'dark' | 'auto') => {
  themeMode.value = mode;
  if (mode === 'auto') {
    localStorage.removeItem('theme');
    $q.dark.set('auto');
  } else {
    $q.dark.set(mode === 'dark');
    localStorage.setItem('theme', mode);
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    themeMode.value = savedTheme as 'light' | 'dark';
    $q.dark.set(savedTheme === 'dark');
  } else {
    themeMode.value = 'auto';
    $q.dark.set('auto');
  }
});
</script>

<style scoped lang="scss">
.centered-container {
  width: 100%;
  min-width: 0;
  max-width: $breakpoint-lg-min;
  margin-left: auto;
  margin-right: auto;
}
.dashboard-wide {
  max-width: none;
}
</style>
