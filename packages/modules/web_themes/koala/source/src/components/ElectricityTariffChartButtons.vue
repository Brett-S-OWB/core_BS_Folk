<template>
  <div class="row no-wrap items-center justify-between q-mb-xs q-gutter-x-xs">
    <div class="col-auto">
      <q-btn
        v-if="props.modelValue"
        class="col-auto q-mr-xs"
        label="-1,00"
        color="grey"
        size="sm"
        dense
        @click="emit('update:modelValue', props.modelValue - 1)"
      />
      <q-btn
        v-if="props.modelValue"
        class="col-auto q-mr-xs"
        label="-0,10"
        color="grey"
        size="sm"
        dense
        @click="emit('update:modelValue', props.modelValue - 0.1)"
      />
      <q-btn
        v-if="props.modelValue"
        class="col-auto"
        label="-0,01"
        color="grey"
        size="sm"
        dense
        @click="emit('update:modelValue', props.modelValue - 0.01)"
      />
    </div>
    <div class="col-auto q-mx-sm">
      {{
        props.modelValue?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + ' ct/kWh'
      }}
    </div>
    <div class="col-auto">
      <q-btn
        v-if="props.modelValue"
        class="col-auto q-mr-xs"
        label="+0,01"
        color="grey"
        size="sm"
        dense
        @click="emit('update:modelValue', props.modelValue + 0.01)"
      />
      <q-btn
        v-if="props.modelValue"
        class="col-auto q-mr-xs"
        label="+0,10"
        color="grey"
        size="sm"
        dense
        @click="emit('update:modelValue', props.modelValue + 0.1)"
      />
      <q-btn
        v-if="props.modelValue"
        class="col-auto"
        label="+1,00"
        color="grey"
        size="sm"
        dense
        @click="emit('update:modelValue', props.modelValue + 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Number,
    required: false,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>
