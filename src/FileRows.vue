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
    <table class="flex flex-col flex-wrap p-0 sm:p-5 gap-5">
      <tr
        v-for="(file, index) of files"
        :key="file.name + file.type + file.size"
        class="card m-0 px-6 flex border surface-border items-center gap-3"
      >
        <td>
          <img role="presentation" :alt="file.name" :src="file.objectURL || file.cdnUrl" width="50" />
        </td>
        <td class="font-semibold">{{ file.name }}</td>
        <td>{{ formatSize(file.size) }}</td>
        <td>
          <PVBadge :value="pending ? 'Pending' : 'Complete'" :severity="pending ? 'warning' : 'success'" />
        </td>
        <td>
          <PVButton icon="pi pi-times" @click="$emit('remove', { file, index })" rounded severity="danger" />
        </td>
      </tr>
    </table>
  </div>
</template>
