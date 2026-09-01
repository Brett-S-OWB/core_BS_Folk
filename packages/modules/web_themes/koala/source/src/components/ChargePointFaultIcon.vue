<template>
  <q-icon
    v-if="faultState > 0"
    :name="props.dot ? 'circle' : iconName"
    :size="props.dot ? '10px' : 'sm'"
    :color="iconColor"
  >
    <q-tooltip v-if="faultMessage">{{ faultMessage }}</q-tooltip>
  </q-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMqttStore } from 'src/stores/mqtt-store';

const props = withDefaults(
  defineProps<{
    chargePointId: number;
    dot?: boolean;
  }>(),
  {
    dot: false,
  },
);

const mqttStore = useMqttStore();

const faultState = computed(() =>
  mqttStore.chargePointFaultState(props.chargePointId),
);

const faultMessage = computed(
  () => mqttStore.chargePointFaultMessage(props.chargePointId) ?? '',
);

const iconName = computed(() => (faultState.value === 2 ? 'error' : 'warning'));

const iconColor = computed(() =>
  faultState.value === 2 ? 'negative' : 'warning',
);
</script>
