<template>
  <q-icon
    v-if="props.readonly"
    :name="locked ? 'lock' : 'lock_open'"
    size="sm"
    :color="locked ? 'negative' : 'positive'"
  />
  <q-toggle
    v-else
    v-model="locked"
    :color="locked ? 'primary' : 'positive'"
    checked-icon="lock"
    unchecked-icon="lock_open"
    size="lg"
    :dense="props.dense"
  >
    <q-tooltip>
      {{ locked ? 'Ladepunkt gesperrt' : 'Ladepunkt entsperrt' }}
    </q-tooltip>
  </q-toggle>
</template>

<script setup lang="ts">
import { useMqttStore } from 'src/stores/mqtt-store';

const props = defineProps({
  chargePointId: {
    type: Number,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
});

const mqttStore = useMqttStore();

const locked = mqttStore.chargePointManualLock(props.chargePointId);
</script>
