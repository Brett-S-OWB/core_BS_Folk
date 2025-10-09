<template>

  <div class="q-pa-md flex justify-center items-center div">
      <q-list bordered separator class="rounded-borders q-pa-none full-width" style="max-width: 900px">
        <q-expansion-item
          v-for="item in totalsData"
          :key="item.id"
          dense-toggle
          expand-separator
          :style="{ backgroundColor: item.bgColor }"
        >
          <!-- Header -->
          <template #header>
            <q-item-section avatar>
                <img :src="item.icon" :alt="item.title" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ item.title }}
              </q-item-label>
              <q-item-label caption>
                <span v-if="item.soc != null">SoC: {{ item.soc }}</span>
                <span v-if="item.currentW != null">{{ item.currentW.toLocaleString() }} W</span>
              </q-item-label>
            </q-item-section>
          </template>

          <!-- Body -->
          <q-card-section class="q-pt-sm">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs">Heute</div>
                <div class="text-body2">
                  <div v-if="item.today.geladen != null">
                    <b>Geladen:</b> {{ item.today.geladen.toLocaleString() }}
                  </div>
                  <div v-if="item.today.entladen != null">
                    <b>Entladen:</b> {{ item.today.entladen.toLocaleString() }}
                  </div>
                  <div v-if="item.today.ertrag != null">
                    <b>Ertrag:</b> {{ item.today.ertrag.toLocaleString() }}
                  </div>
                  <div v-if="item.today.bezug != null">
                    <b>Bezug:</b> {{ item.today.bezug.toLocaleString() }}
                  </div>
                  <div v-if="item.today.einspeisen != null">
                    <b>Einspeisung:</b> {{ item.today.einspeisen.toLocaleString() }}
                  </div>
                  <div v-if="item.today.energie != null">
                    <b>Energie:</b> {{ item.today.energie.toLocaleString() }}
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6" v-if="item.einstellungen">
                <div class="text-subtitle2 q-mb-xs">Einstellungen</div>
                <div class="q-gutter-sm">
                  <q-btn
                    size="sm"
                    outline
                    color="primary"
                    :label="item.einstellungen.ladeModus || 'Laden mit Überschuss'"
                    @click="$emit('click-settings', item)"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-expansion-item>
      </q-list>
  </div>
  <!-- <div style="display: flex; flex-direction: column; align-items: center;">
    <div>{{ batteryPower }}</div>
    <div>{{ batterySoC }}</div>
    <div>{{ batteryDailyImported }}</div>
    <div>{{ batteryDailyExported }}</div>
    <div>-------------------</div>
    <div>{{ pvPower }}</div>
    <div>{{ pvEnergyToday }}</div>
    <div>-------------------</div>
    <div>{{ gridPower }}</div>
    <div>{{ gridEnergyToday }}</div>
    <div>{{ gridEnergyExportedToday }}</div>
    <div>-------------------</div>
    <div>{{ homePower }}</div>
    <div>{{ homeDailyYield }}</div>
    <div>-------------------</div>
    <div>{{ chargePointPower }}</div>
    <div>{{ chargePointDailyImported }}</div>
    <div>-------------------</div>
    <div>{{ realTotalsData }}</div>


  </div> -->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMqttStore } from 'src/stores/mqtt-store';
const mqttStore = useMqttStore();

//import type { DailyTotalsItem } from './types';
//import { dailyTotalsData } from './mockData';

//battery ---------------------------------------------------

const batteryPower = computed(() => mqttStore.batteryTotalPower('textValue'));
const batterySoC = computed(() => mqttStore.batterySocTotal);
const batteryDailyExported = computed(() => mqttStore.batteryDailyExportedTotal('textValue'));
const batteryDailyImported = computed(() => mqttStore.batteryDailyImportedTotal('textValue'));

//PV ---------------------------------------------------

const pvPower = computed(() => mqttStore.getPvPower('textValue') );
const pvEnergyToday = computed(() => mqttStore.pvDailyExported('textValue') );

//grid ---------------------------------------------------

const gridPower = computed(() => mqttStore.getGridPower('textValue') );
const gridEnergyToday = computed(() => mqttStore.gridDailyImported('textValue') );
const gridEnergyExportedToday = computed(() => mqttStore.gridDailyExported('textValue') );

//Home ---------------------------------------------------

const homePower = computed(() => mqttStore.getHomePower('textValue') );
const homeDailyYield = computed(() => mqttStore.homeDailyYield('textValue') );

//ChargePoints ---------------------------------------------------
const chargePointPower = computed(() => mqttStore.chargePointSumPower('textValue') );
const chargePointDailyImported = computed(() => mqttStore.chargePointDailyImported('textValue') );
//const data = computed<DailyTotalsItem[]>(() => dailyTotalsData);

const totalsData = computed(() => [
  {
    id: 'battery',
    kind: 'battery',
    title: 'Speicher',
    icon: 'icons/owbBattery.svg',
    soc: batterySoC.value,
    currentW: batteryPower.value,
    today: {
      geladen: batteryDailyImported.value,
      entladen: batteryDailyExported.value
    },
    einstellungen: { ladeModus: 'Laden mit Überschuss' }, // ggf. dynamisch
    bgColor: 'rgba(199,163,136, 0.5)'
  },
  {
    id: 'pv',
    kind: 'pv',
    title: 'PV',
    icon: 'icons/owbPV.svg',
    currentW: pvPower.value,
    today: { ertrag: pvEnergyToday.value },
    bgColor: 'rgba(179,204,188, 0.5)'
  },
  {
    id: 'grid',
    kind: 'grid',
    title: 'Netz',
    icon: 'icons/owbGrid.svg',
    currentW: gridPower.value,
    today: {
      bezug: gridEnergyToday.value,
      einspeisen: gridEnergyExportedToday.value
    },
    bgColor: 'rgba(213,187,192,0.5)'
  },
  {
    id: 'house',
    kind: 'house',
    title: 'Haus',
    icon: 'icons/owbHouse.svg',
    currentW: homePower.value,
    today: { energie: homeDailyYield.value },
    bgColor: 'rgba(186,186,191,0.5)'
  },
  {
    id: 'charge',
    kind: 'charge',
    title: 'Ladepunkte',
    icon: 'icons/owbChargePoint.svg',
    currentW: chargePointPower.value,
    today: { geladen: chargePointDailyImported.value },
    bgColor: 'rgba(177,192,214,0.5)'
  }
]);
</script>

<style scoped>
.div {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.q-card {
  width: 300px;
  max-height: 100px;
  margin: 25px;
}

.card {
  max-width: 200px;
  height: 10px;
}

.custom-list-border {
  border: 2px solid #1976d2; /* Beispiel: Blau */
}

/* Für die Trennlinien zwischen den Items */
.q-list-bordered .q-separator {
  border-color: #1976d2 !important;
}

.q-list--bordered .q-list--separator {
  border-color: #1976d2 !important;
  border-width: 2px !important;
}
</style>
