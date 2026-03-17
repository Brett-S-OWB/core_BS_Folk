<template>
  <div>
    <div class="text-subtitle2">{{ props.title }}</div>
    <div class="row items-center justify-between q-ml-sm" :class="myClass">
      <q-range
        v-model="value"
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
import { computed, ref, watch, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'RangeSliderStandard'
})

interface RangeValue {
  min: number
  max: number
}

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Object as () => RangeValue,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  step: {
    type: Number,
    default: 1
  },
  markers: {
    type: [Boolean, Number],
    default: false
  },
})

const emit = defineEmits<{
  'update:model-value': [value: RangeValue]
}>()

const tempValue = ref<RangeValue>({ ...props.modelValue })
const updateTimeout = ref<NodeJS.Timeout | null>(null)

const updatePending = computed(() => {
  return (
    tempValue.value.min !== props.modelValue.min ||
    tempValue.value.max !== props.modelValue.max
  )
})

const value = computed({
  get: () => tempValue.value,
  set: (newValue: RangeValue) => {
    if (updateTimeout.value) {
      clearTimeout(updateTimeout.value)
    }
    tempValue.value = { ...newValue }
  }
})

watch(
  value,
  (newValue) => {
    if (!updatePending.value) return

    if (updateTimeout.value) {
      clearTimeout(updateTimeout.value)
    }
    updateTimeout.value = setTimeout(() => {
      emit('update:model-value', { ...newValue })
    }, 800)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (newValue) => {
    tempValue.value = { ...newValue }
  }
)

onBeforeUnmount(() => {
  if (updateTimeout.value) {
    clearTimeout(updateTimeout.value)
    emit('update:model-value', { ...tempValue.value })
  }
})

const myClass = computed(() => {
  return updatePending.value ? 'pending' : ''
})
</script>

<style lang="scss" scoped>
.pending :deep(.q-slider__text) {
  color: rgb(159, 22, 22);
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
