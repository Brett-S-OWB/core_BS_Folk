<template>
  <section class="device-dashboard" aria-label="Geräte-Dashboard">
    <article
      v-for="device in devices"
      :key="`${device.section}:${device.id}`"
      :data-device-type="device.section"
      :data-device-id="device.id"
      class="dashboard-device"
    >
      <div class="device-heading text-subtitle1 text-weight-medium">
        <q-icon :name="device.icon" size="24px" />{{ device.label }}
      </div>
      <ChargePointCard
        v-if="device.section === 'charge-points'"
        :charge-point-id="device.id"
      />
      <VehicleCard
        v-else-if="device.section === 'vehicles'"
        :vehicle-id="device.id"
      />
      <BatteryCard
        v-else-if="device.section === 'batteries'"
        :battery-id="device.id"
      />
      <ConsumerCard v-else :consumer-id="device.id" />
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMqttStore } from 'src/stores/mqtt-store';
import { useLocalDataStore } from 'src/stores/localData-store';
import { useDeviceSections } from './deviceSections';
import ChargePointCard from './ChargePointCard.vue';
import VehicleCard from './VehicleCard.vue';
import BatteryCard from './BatteryCard.vue';
import ConsumerCard from './ConsumerCard.vue';

const mqttStore = useMqttStore();
const localDataStore = useLocalDataStore();
const availableSections = useDeviceSections();
const devices = computed(() => {
  const ids = {
    'charge-points': mqttStore.chargePointIds,
    vehicles: mqttStore.vehicleList.map((vehicle) => vehicle.id),
    batteries: mqttStore.batteryIds,
    consumers: mqttStore.consumerIds,
  };
  const labels = {
    'charge-points': 'Ladepunkt',
    vehicles: 'Fahrzeug',
    batteries: 'Speicher',
    consumers: 'Verbraucher',
  };
  return availableSections.value
    .filter((section) =>
      localDataStore.dashboardDeviceSections.includes(section.name),
    )
    .flatMap((section) =>
      ids[section.name].map((id) => ({
        id,
        section: section.name,
        label: labels[section.name],
        icon: section.icon,
      })),
    );
});
</script>

<style scoped>
.device-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, min(100%, 22em));
  align-items: stretch;
  gap: var(--dashboard-gap, 12px);
  width: 100%;
  min-width: 0;
}
.dashboard-device {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.device-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.dashboard-device > :deep(.q-card) {
  flex: 1;
  width: 100%;
  max-width: 100%;
}
</style>
