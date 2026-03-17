<template>
  <q-dialog
    v-model="isOpen"
    :maximized="isSmallScreen"
    :backdrop-filter="isSmallScreen ? '' : 'blur(4px)'"
  >
    <q-card class="card-width">
      <q-card-section>
        <!-- {{ batteryRange }} -->
        <div class="row no-wrap">
          <div>
            <div class="text-h6 q-pr-sm">Speicher-Beachtung:</div>
            <div class="text-h6 ellipsis" :title="name">{{ name }}</div>
          </div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            class="close-btn"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-subtitle2">Überschuss primär für:</div>
        <BatteryModeButtons />
      </q-card-section>
      <q-card-section v-if="batteryMode === 'min_soc_bat_mode'">
        <div class="text-subtitle2">SoC-Bereich des Speichers % :</div>
        <q-range
          v-model="batteryRange"
          :min="0"
          :max="100"
          :step="1"
          :markers="10"
          label
          label-always
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Screen } from 'quasar';
import BatteryModeButtons from './BatteryModeButtons.vue';
import { useMqttStore } from 'src/stores/mqtt-store';

const isOpen = ref(false);

const props = defineProps<{
  batteryId: number | undefined;
}>();

const mqttStore = useMqttStore();

const isSmallScreen = computed(() => Screen.lt.sm);

const name = computed(() => {
  if (props.batteryId === undefined || props.batteryId === -1) {
    return 'Übergreifend';
  }
  return mqttStore.batteryName(props.batteryId);
});

defineExpose({
  open: () => (isOpen.value = true),
});

const batteryMode = computed(() => mqttStore.batteryMode().value);

const batteryRange = computed({
  get: () => mqttStore.batteryChargePriorityRange,
  set: (value) => {
    mqttStore.batteryChargePriorityRange = value;
  },
});
</script>
<style lang="scss" scoped>
.card-width {
  max-width: 26em;
}
.close-btn {
  height: 2.5em;
  width: 2.5em;
}
:deep(.q-slider__pin) {
  top: 100%;
  transform: scaleY(-1);
}
:deep(.q-slider__text-container) {
  transform: scaleY(-1) !important;
}
:deep(.q-range) {
  padding-bottom: 24px;
}
</style>
