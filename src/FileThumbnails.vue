<script>
import { formatSize } from "./composables"

export default {
  props: {
    files: {
      type: Array,
      required: true,
    },
    pending: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatSize,
  },
}
</script>

<template>
  <div v-if="files.length > 0">
    <h5>{{ pending ? "Pending" : "Uploaded" }}</h5>
    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
      <div
        v-for="(file, index) of files"
        :key="file.name + file.type + file.size"
        class="card m-0 px-6 flex flex-col border surface-border items-center gap-3"
      >
        <div>
          <img role="presentation" :alt="file.name" :src="file.objectURL || file.cdnUrl" width="100" />
        </div>
        <span class="font-semibold">{{ file.name }}</span>
        <div>{{ formatSize(file.size) }}</div>
        <PVBadge :value="pending ? 'Pending' : 'Complete'" :severity="pending ? 'warning' : 'success'" />
        <PVButton icon="pi pi-times" @click="$emit('remove', { file, index })" rounded severity="danger" />
      </div>
    </div>
  </div>
</template>
