<script>
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

  computed: {
    smartScaleCrop: {
      get() {
        return this.editingFile?.cdnUrl.includes("-/scale_crop/500x500/smart")
      },
      set(value) {
        if (value) {
          this.$emit("update:editingFile", {
            ...this.editingFile,
            cdnUrl: this.editingFile.cdnUrl + "-/scale_crop/500x500/smart",
          })
        } else {
          this.$emit("update:editingFile", {
            ...this.editingFile,
            cdnUrl: this.editingFile.cdnUrl.replace("-/scale_crop/500x500/smart", ""),
          })
        }
      },
    },
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
        console.warn("Failed to copy: ", error)
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
    <div>
      <div class="flex">
        <img :src="editingFile?.cdnUrl" alt="file" style="border-radius: 24px; max-height: 300px" class="mx-auto" />
      </div>
      <div class="flex flex-col p-3 flex-grow">
        <!-- Download -->
        <PVButton
          :label="`Download (${formatSize(editingFile?.size)})`"
          icon="pi pi-download"
          class="my-3"
          @click="downloadFile"
        />
        <div class="flex flex-col">
          <PVInputText type="text" readonly :value="editingFile?.cdnUrl" class="w-full" />
          <!-- Copy link -->
          <PVButton
            :label="copiedLink ? 'Copied' : 'Copy link'"
            :icon="copiedLink ? 'pi pi-check' : 'pi pi-link'"
            class="mt-3"
            @click="copyLink"
          />
        </div>
      </div>
    </div>
    <h3>Transformations</h3>
    <h4>
      <div class="flex items-center">
        <PVInputSwitch v-model="smartScaleCrop" />
        <span class="ml-3">Smart scale crop</span>
      </div>
    </h4>
    <p>Resize the image to fit the specified dimensions, cropping the image to keep the aspect ratio.</p>
    <div></div>
  </PVDialog>
</template>
