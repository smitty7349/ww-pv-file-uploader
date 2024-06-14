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
      scaleCropDimensionsX: 500,
      scaleCropDimensionsY: 500,
      rotateDegrees: 0,
      enableWatermark: false,
      watermarkUuid: "",
    }
  },

  computed: {
    smartScaleCropDimensions() {
      return `${this.scaleCropDimensionsX}x${this.scaleCropDimensionsY}`
    },
    smartScaleCrop: {
      get() {
        return !!this.editingFile?.cdnUrl.match(/-\/scale_crop\/.*x.*\/smart/)
      },
      set(value) {
        if (value) {
          this.$emit("update:editingFile", {
            ...this.editingFile,
            cdnUrl: this.editingFile.cdnUrl + `-/scale_crop/${this.smartScaleCropDimensions}/smart/`,
          })
        } else {
          this.$emit("update:editingFile", {
            ...this.editingFile,
            cdnUrl: this.editingFile.cdnUrl.replace(`-/scale_crop/${this.smartScaleCropDimensions}/smart/`, ""),
          })
        }
      },
    },
    watermarkData() {
      return this.enableWatermark ? `-/overlay/${this.watermarkUuid}/30px40p/90p,10p/20p/` : ""
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
    smartScaleCropDimensions() {
      if (this.smartScaleCrop) {
        this.$emit("update:editingFile", {
          ...this.editingFile,
          cdnUrl: this.editingFile.cdnUrl.replace(
            /-\/scale_crop\/.*x.*\/smart/,
            `-/scale_crop/${this.smartScaleCropDimensions}/smart`
          ),
        })
      }
    },
    watermarkData() {
      if (!this.watermarkUuid) return
      let url = this.editingFile.cdnUrl
      if (this.enableWatermark) {
        if (url.includes("-/overlay/")) url = url.replace(/-\/overlay\/.*\/30px40p\/90p,10p\/20p\//, this.watermarkData)
        else url += this.watermarkData
      } else {
        url = url.replace(/-\/overlay\/.*\/30px40p\/90p,10p\/20p\//, "")
      }
      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
  },

  methods: {
    async rotateImage() {
      let url = this.editingFile.cdnUrl
      let newDegrees = this.rotateDegrees - 90
      if (newDegrees < 0) newDegrees = 270
      if (newDegrees) {
        let newRotationString = `-/rotate/${newDegrees}/`
        if (url.includes("-/rotate/")) url = url.replace(/-\/rotate\/\d+\//, newRotationString)
        else url += newRotationString
      } else {
        url = url.replace(/-\/rotate\/\d+\//, "")
      }
      this.rotateDegrees = newDegrees

      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
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
          <PVInputText type="text" v-if="editingFile" v-model="editingFile.cdnUrl" class="w-full" />
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
    <div>
      <h4>
        <div class="flex items-center">
          <PVInputSwitch v-model="smartScaleCrop" />
          <span class="ml-3">Smart scale crop</span>
        </div>
      </h4>
      <p>Resize the image to fit the specified dimensions, cropping the image to keep the aspect ratio.</p>
      <p>
        <span>Dimensions: </span>
        <span>
          <PVInputText type="number" v-model="scaleCropDimensionsX" size="small" />
        </span>
        <span>x</span>
        <span>
          <PVInputText type="number" v-model="scaleCropDimensionsY" size="small" />
        </span>
      </p>
    </div>
    <div>
      <h4>
        <div class="flex items-center">
          <PVButton label="Rotate" icon="pi pi-refresh" @click="rotateImage" />
        </div>
      </h4>
    </div>
    <div>
      <h4>
        <div class="flex items-center">
          <PVInputSwitch v-model="enableWatermark" />
          <span class="ml-3">Watermark</span>
        </div>
      </h4>
      <p>Apply a watermark to the image, using another image's UUID</p>
      <p>
        <span>Watermark UUID: </span>
        <span>
          <PVInputText type="text" v-model="watermarkUuid" size="small" />
        </span>
      </p>
    </div>
  </PVDialog>
</template>
