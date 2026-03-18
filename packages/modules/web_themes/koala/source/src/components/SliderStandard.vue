<template>
  <div>
    <div class="text-subtitle2">{{ title }}</div>
    <div class="row items-center justify-between q-ml-sm">
      <q-slider
        v-model="sliderValue"
        :min="props.discreteValues ? 0 : props.min"
        :max="
          props.discreteValues ? props.discreteValues.length - 1 : props.max
        "
        :step="props.step"
        :color="props.color"
        class="col"
        :track-size="props.trackSize"
        :thumb-size="props.thumbSize"
        :thumb-color="props.thumbColor"
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
      />
      <div
        class="q-ml-sm no-wrap"
        :class="['col-2', 'text-right', pendingClass]"
      >
        {{ displayValue }} {{ displayUnit }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDelayModel } from '../composables/useDelayModel';

defineOptions({
  name: 'SliderStandard',
});

const props = defineProps({
  title: {
    type: String,
    default: 'title',
  },
  modelValue: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  unit: {
    type: String,
    default: '',
  },
  offValueRight: {
    type: Number,
    default: 105,
  },
  offValueLeft: {
    type: Number,
    default: -1,
  },
  discreteValues: {
    type: Array as () => number[] | undefined,
    default: undefined,
  },
  color: {
    type: String,
    default: 'primary',
  },
  trackSize: {
    type: String,
    default: '0.5em',
  },
  thumbSize: {
    type: String,
    default: '1.5em',
  },
  thumbColor: {
    type: String,
    default: 'primary',
  },
});

const emit = defineEmits<{
  'update:model-value': [value: number];
}>();

const { value, updatePending } = useDelayModel<number>(props, emit);

const sliderValue = computed({
  get: () => {
    if (props.discreteValues) {
      const index = props.discreteValues.indexOf(value.value);
      return index >= 0 ? index : 0;
    }
    return value.value;
  },
  set: (newValue: number) => {
    if (props.discreteValues) {
      value.value = props.discreteValues[newValue];
    } else {
      value.value = newValue;
    }
  },
});

const currentValue = computed(() => {
  return props.discreteValues && sliderValue.value !== undefined
    ? (props.discreteValues[sliderValue.value] ?? props.discreteValues[0])
    : value.value;
});

const displayValue = computed(() => {
  if (
    currentValue.value === props.offValueLeft ||
    currentValue.value === props.offValueRight
  ) {
    return 'Aus';
  }
  return currentValue.value;
});

const displayUnit = computed(() => {
  if (
    currentValue.value === props.offValueLeft ||
    currentValue.value === props.offValueRight
  ) {
    return '';
  }
  return props.unit;
});

const pendingClass = computed(() => (updatePending.value ? 'pending' : ''));
</script>

<style scoped lang="scss">
.pending {
  color: $red;
}
</style>
