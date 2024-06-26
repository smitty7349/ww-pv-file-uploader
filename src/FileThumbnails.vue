<script>
import { formatSize, limitFileName } from "./composables"

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
    editingFile: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:editingFile"],
  methods: {
    formatSize,
    limitFileName,
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
        class="card m-0 px-6 py-4 flex flex-col border surface-border items-center gap-3"
        @click="$emit('update:editingFile', file)"
      >
        <div class="flex h-24">
          <img role="presentation" :alt="file.name" :src="file.objectURL || file.cdnUrl" class="w-24 my-auto" />
        </div>
        <span class="font-semibold flex-1">{{ limitFileName(file.name) }}</span>
        <div class="flex-1">{{ formatSize(file.size) }}</div>
        <PVBadge :value="pending ? 'Pending' : 'Complete'" :severity="pending ? 'warning' : 'success'" class="flex-1" />
      </div>
    </div>
  </div>
</template>
