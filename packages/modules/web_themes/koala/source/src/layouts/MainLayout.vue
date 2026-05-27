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

    <q-drawer v-model="drawer" side="left" overlay elevated :breakpoint="500">
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

          <q-item>
            <q-item-section avatar>
              <q-icon name="palette" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Farbschema</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn-group flat>
                <q-btn
                  flat
                  round
                  :color="colorScheme === 'white' ? 'primary' : ''"
                  icon="square"
                  @click="setColorScheme('white')"
                  size="sm"
                  :disable="colorScheme === 'white'"
                  aria-label="Weiß"
                >
                  <q-tooltip>Weiß</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  :color="colorScheme === 'grey' ? 'primary' : ''"
                  icon="gradient"
                  @click="setColorScheme('grey')"
                  size="sm"
                  :disable="colorScheme === 'grey'"
                  aria-label="Grau"
                >
                  <q-tooltip>Grau</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  :color="colorScheme === 'colour' ? 'primary' : ''"
                  icon="palette"
                  @click="setColorScheme('colour')"
                  size="sm"
                  :disable="colorScheme === 'colour'"
                  aria-label="Farbe"
                >
                  <q-tooltip>Farbe</q-tooltip>
                </q-btn>
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Page container that takes the remaining height -->
    <q-page-container class="column flex centered-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import UserIndicator from 'src/components/UserIndicator.vue';
import ConnectionIndicator from 'src/components/ConnectionIndicator.vue';
import { useMqttStore } from 'src/stores/mqtt-store';
const mqttStore = useMqttStore();

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

type ColorScheme = 'white' | 'grey' | 'colour';
const colorSchemes: ColorScheme[] = ['white', 'grey', 'colour'];
const colorScheme = ref<ColorScheme>('white');

const applyColorScheme = (scheme: ColorScheme) => {
  colorSchemes.forEach((s) => document.body.classList.remove(`theme-${s}`));
  document.body.classList.add(`theme-${scheme}`);
};

const setColorScheme = (scheme: ColorScheme) => {
  colorScheme.value = scheme;
  applyColorScheme(scheme);
  localStorage.setItem('colorScheme', scheme);
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

  const savedScheme = localStorage.getItem('colorScheme') as ColorScheme | null;
  const initialScheme =
    savedScheme && colorSchemes.includes(savedScheme) ? savedScheme : 'white';
  colorScheme.value = initialScheme;
  applyColorScheme(initialScheme);
});
</script>

<style scoped lang="scss">
.centered-container {
  max-width: $breakpoint-lg-min;
  margin-left: auto;
  margin-right: auto;
}
</style>
