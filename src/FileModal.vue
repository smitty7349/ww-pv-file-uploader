<script>
import Dialog from "primevue/dialog"
import { formatSize } from "./composables"

export default {
  props: {
    content: { type: Object, required: true },
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
      watermarkOpacity: 30,
      enableAutoFormat: false,
      enableAutoQuality: false,
      enableAutoProfilePicture: false,
      enablePreview: false,
      previewDimensionsX: 100,
      previewDimensionsY: 100,
      enableGrayscale: false,
      enableSmartResize: false,
      smartResizeDimensionsX: 500,
      smartResizeDimensionsY: 500,
      enableOverlayText: false,
      overlayText: "",
      overlayTextOpacity: 30,
      enableBlur: false,
      blurRadius: 5,
    }
  },

  computed: {
    anyTransformationsEnabled() {
      return (
        this.content.enableScaleCrop ||
        this.content.enableRotate ||
        this.content.enableWatermark ||
        this.content.enableAutoFormat ||
        this.content.enableAutoQuality ||
        this.content.enableAutoProfilePicture ||
        this.content.enablePreview ||
        this.content.enableGrayscale ||
        this.content.enableSmartResize ||
        this.content.enableOverlayText ||
        this.content.enableBlur
      )
    },
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
      return this.enableWatermark ? `-/overlay/${this.watermarkUuid}/30px40p/90p,10p/${this.watermarkOpacity}p/` : ""
    },
    previewDimensions() {
      return this.enablePreview ? `${this.previewDimensionsX}x${this.previewDimensionsY}` : ""
    },
    smartResizeDimensions() {
      return this.enableSmartResize ? `${this.smartResizeDimensionsX}x${this.smartResizeDimensionsY}` : ""
    },
    overlayTextData() {
      return this.enableOverlayText
        ? `-/overlay_text/${this.overlayText}/30px40p/90p,10p/${this.overlayTextOpacity}p/`
        : ""
    },
    blurData() {
      return this.enableBlur ? `-/blur/${this.blurRadius}/` : ""
    },
    rootStyle() {
      return this.content.style === "inline" ? { display: this.showEditFileModal ? "block" : "none" } : {}
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
        if (url.includes("-/overlay/"))
          url = url.replace(/-\/overlay\/.*\/30px40p\/90p,10p\/\d{1,3}p\//, this.watermarkData)
        else url += this.watermarkData
      } else {
        url = url.replace(/-\/overlay\/.*\/30px40p\/90p,10p\/\d{1,3}p\//, "")
      }
      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
    enableAutoFormat() {
      let url = this.editingFile.cdnUrl
      if (this.enableAutoFormat) {
        if (url.includes("-/format/auto/")) url = url.replace(/-\/format\/auto\//, "")
        else url += "-/format/auto/"
      } else {
        url = url.replace(/-\/format\/auto\//, "")
      }
      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
    enableAutoQuality() {
      let url = this.editingFile.cdnUrl
      if (this.enableAutoQuality) {
        if (url.includes("-/quality/smart/")) url = url.replace(/-\/quality\/smart\//, "")
        else url += "-/quality/smart/"
      } else {
        url = url.replace(/-\/quality\/smart\//, "")
      }
      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
    enableAutoProfilePicture() {
      let presetString = "-/crop/face/200px200p/-/scale_crop/550x550/center/"
      let presetRegex = /-\/crop\/face\/200px200p\/-\/scale_crop\/550x550\/center\//
      let url = this.editingFile.cdnUrl
      if (this.enableAutoProfilePicture) {
        if (url.includes(presetString)) url = url.replace(presetRegex, "")
        else url += presetString
      } else {
        url = url.replace(presetRegex, "")
      }
      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
    previewDimensions() {
      let url = this.editingFile.cdnUrl
      if (this.enablePreview) {
        if (url.includes("-/preview/"))
          url = url.replace(/-\/preview\/\d{1,5}x\d{1,5}\//, "-/preview/" + this.previewDimensions + "/")
        else url += "-/preview/" + this.previewDimensions + "/"
      } else {
        url = url.replace(/-\/preview\/\d{1,5}x\d{1,5}\//, "")
      }
      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
    enableGrayscale() {
      let url = this.editingFile.cdnUrl
      if (this.enableGrayscale) {
        if (!url.includes("-/grayscale/")) url += "-/grayscale/"
      } else {
        url = url.replace(/-\/grayscale\//, "")
      }
      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
    smartResizeDimensions() {
      let url = this.editingFile.cdnUrl
      if (this.enableSmartResize) {
        if (url.includes("-/smart_resize/")) url = url.replace(/-\/smart_resize\/\d{1,5}x\d{1,5}\//, "")
        url += "-/smart_resize/" + this.smartResizeDimensions + "/"
      } else {
        url = url.replace(/-\/smart_resize\/\d{1,5}x\d{1,5}\//, "")
      }
      this.$emit("update:editingFile", {
        ...this.editingFile,
        cdnUrl: url,
      })
    },
    blurData() {
      let url = this.editingFile.cdnUrl
      if (this.enableBlur) {
        if (url.includes("-/blur/")) url = url.replace(/-\/blur\/\d{1,2}\//, "")
        url += this.blurData
      } else {
        url = url.replace(/-\/blur\/\d{1,2}\//, "")
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
  <Component
    :is="content.style === 'inline' ? 'div' : Dialog"
    :header="editingFile?.name"
    :visible="showEditFileModal"
    @update:visible="$emit('update:showEditFileModal', $event)"
    modal
    :style="rootStyle"
  >
    <div v-if="content.style === 'inline'" class="flex justify-between">
      <h2>{{ editingFile?.name }}</h2>
      <PVButton label="Close" @click="$emit('update:showEditFileModal', false)" />
    </div>
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
    <div class="flex gap-5 flex-col">
      <h3 v-if="anyTransformationsEnabled">Transformations</h3>
      <div v-if="content.enableScaleCrop">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="smartScaleCrop" />
            <span class="ml-3">Smart scale crop</span>
          </div>
        </h4>
        <p>Resize the image to fit the specified dimensions, cropping the image to keep the aspect ratio.</p>
        <p class="mt-3">
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
      <div v-if="content.enableRotate">
        <h4>
          <div class="flex items-center">
            <PVButton label="Rotate" icon="pi pi-refresh" @click="rotateImage" />
          </div>
        </h4>
      </div>
      <div v-if="content.enableWatermark">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="enableWatermark" />
            <span class="ml-3">Watermark</span>
          </div>
        </h4>
        <p>Apply a watermark to the image, using another image's UUID</p>
        <p class="mt-3">
          <span>Watermark UUID: </span>
          <span>
            <PVInputText type="text" v-model="watermarkUuid" size="small" />
          </span>
        </p>
        <p class="flex items-center mt-3">
          <span>Opacity: </span>
          <span class="ml-3">
            <PVInputText
              type="number"
              v-model="watermarkOpacity"
              :min="0"
              :max="100"
              style="width: 150px"
              size="small"
            />
          </span>
        </p>
      </div>
      <div v-if="content.enableAutoFormat">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="enableAutoFormat" />
            <span class="ml-3">Auto format</span>
          </div>
        </h4>
        <p>Automatically convert the image to the right format for whatever device it will be viewed on.</p>
      </div>
      <div v-if="content.enableAutoQuality">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="enableAutoQuality" />
            <span class="ml-3">Auto quality</span>
          </div>
        </h4>
        <p>
          Automatically adjust the quality of the image to achieve the best visual quality and the smallest file size.
        </p>
      </div>
      <div v-if="content.enableAutoProfilePicture">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="enableAutoProfilePicture" />
            <span class="ml-3">Auto profile picture</span>
          </div>
        </h4>
        <p>Automatically crop the image to a square, centering the face, and resizing it to 200x200 pixels.</p>
      </div>
      <div v-if="content.enablePreview">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="enablePreview" />
            <span class="ml-3">Preview</span>
          </div>
        </h4>
        <p>Downscale the image for preview purposes.</p>
        <p class="mt-3">
          <span>Dimensions: </span>
          <span>
            <PVInputText type="number" v-model="previewDimensionsX" size="small" />
          </span>
          <span>x</span>
          <span>
            <PVInputText type="number" v-model="previewDimensionsY" size="small" />
          </span>
        </p>
      </div>
      <div v-if="content.enableGrayscale">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="enableGrayscale" />
            <span class="ml-3">Grayscale</span>
          </div>
        </h4>
        <p>Convert the image to grayscale.</p>
      </div>
      <div v-if="content.enableSmartResize">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="enableSmartResize" />
            <span class="ml-3">Smart resize</span>
          </div>
        </h4>
        <p>Keep proportions, but fill the specified dimensions, by generating what's missing.</p>
        <p class="mt-3">
          <span>Dimensions: </span>
          <span>
            <PVInputText type="number" v-model="smartResizeDimensionsX" size="small" />
          </span>
          <span>x</span>
          <span>
            <PVInputText type="number" v-model="smartResizeDimensionsY" size="small" />
          </span>
        </p>
      </div>
      <div v-if="content.enableBlur">
        <h4>
          <div class="flex items-center">
            <PVInputSwitch v-model="enableBlur" />
            <span class="ml-3">Blur</span>
          </div>
        </h4>
        <p>Blur the image.</p>
        <p class="mt-3">
          <span>Radius: </span>
          <span>
            <PVInputText type="number" v-model="blurRadius" :min="0" :max="100" size="small" />
          </span>
        </p>
      </div>
    </div>
  </Component>
</template>
