<script>
import { defineProps, ref, watch, toRef } from "vue"
import { formatSize } from "./composables"

export default {
  props: {
    editingFile: {
      type: Object,
      default: null,
    },
    showEditFileModal: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:showEditFileModal", "update:editingFile"],

  data() {
    return {
      copiedLink: false,
    }
  },

  watch: {
    editingFile() {
      this.$emit("update:showEditFileModal", !!this.editingFile)
    },
    showEditFileModal() {
      if (!this.showEditFileModal) {
        this.$emit("update:editingFile", null)
      }
    },
  },

  methods: {
    async downloadFile() {
      const link = document.createElement("a")
      link.href = this.editingFile.cdnUrl
      link.download = this.editingFile.name
      link.click()
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.editingFile.cdnUrl)
      } catch (error) {
        console.error("Failed to copy: ", error)
        // Try another way
        let x = window.scrollX
        let y = window.scrollY
        const textArea = document.createElement("textarea")
        textArea.value = this.editingFile.cdnUrl
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        window.scrollTo(x, y)
      }
      this.copiedLink = true
      setTimeout(() => {
        this.copiedLink = false
      }, 2000)
    },
    formatSize,
  },
}
</script>

<template>
  <PVDialog
    :header="editingFile?.name"
    :visible="showEditFileModal"
    @update:visible="emit('update:showEditFileModal', $event)"
    modal
  >
    <div class="flex">
      <img :src="editingFile?.cdnUrl" alt="file" width="300" style="border-radius: 24px" />
      <div class="flex flex-col gap-3 p-3">
        <!-- Download -->
        <PVButton label="Download" icon="pi pi-download" class="mt-3" @click="downloadFile" />
        <!-- Copy link -->
        <PVButton
          :label="copiedLink ? 'Copied' : 'Copy link'"
          :icon="copiedLink ? 'pi pi-check' : 'pi pi-link'"
          class="mt-3"
          @click="copyLink"
        />
      </div>
    </div>
    <p>{{ formatSize(editingFile?.size) }}</p>
    <h3>Transformations</h3>
    <h4>Smart scale crop</h4>
    <p>Resize the image to fit the specified dimensions, cropping the image to keep the aspect ratio.</p>
  </PVDialog>
</template>
