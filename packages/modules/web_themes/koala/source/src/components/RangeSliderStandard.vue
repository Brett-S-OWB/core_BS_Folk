<template>
  <div>
    <div class="text-subtitle2">{{ title }}</div>
    <div class="row items-center justify-between q-ml-sm" :class="pendingClass">
      <q-range
        v-model="delayedValue"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :markers="props.markers"
        label
        label-always
        color="primary"
        class="col"
        track-size="0.5em"
        thumb-size="1.7em"
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useDelayModel } from '../composables/useDelayModel';
import { RangeValue } from '../stores/mqtt-store-model';

const props = withDefaults(
  defineProps<{
    title?: string
    modelValue: RangeValue
    min: number
    max: number
    step?: number
    markers?: boolean | number
  }>(),
  {
    title: '',
    step: 1,
    markers: false,
  }
)

const emit = defineEmits<{
  'update:model-value': [value: RangeValue];
}>();

const { delayedValue, updatePending } = useDelayModel<RangeValue>(props, emit);

const pendingClass = computed(() => (updatePending.value ? 'pending' : ''));
</script>

<style scoped lang="scss">
.pending :deep(.q-slider__text) {
  color: rgb(159, 22, 22) !important;
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
