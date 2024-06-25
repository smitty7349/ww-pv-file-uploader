<template>
  <div class="pv-file-uploader">
    <PVFileUpload
      name="demo[]"
      :multiple="true"
      accept="image/*"
      auto
      :maxFileSize="1000000"
      customUpload
      @uploader="onSelect"
      :disabled="!content.publicKey"
    >
      <template #header="{ chooseCallback, uploadCallback, clearCallback }">
        <div class="flex flex-wrap justify-between items-center flex-1 gap-2" v-if="content.style !== 'minimal'">
          <div class="flex gap-2">
            <PVButton @click="chooseCallback()" icon="pi pi-images" rounded :disabled="!content.publicKey"></PVButton>
            <!-- <PVButton
              @click="uploadEvent(uploadCallback)"
              icon="pi pi-cloud-upload"
              rounded
              severity="success"
              :disabled="!files || files.length === 0"
            ></PVButton> -->
            <PVButton
              @click="clearCallback()"
              icon="pi pi-times"
              rounded
              severity="danger"
              :disabled="!content.publicKey || !localFiles || localFiles.length === 0"
            ></PVButton>
          </div>
          <PVProgressBar
            :value="uploadProgressPercent"
            :showValue="false"
            :class="['md:w-[20rem] h-[1rem] w-full md:ml-auto']"
            ><span class="white-space-nowrap">{{ uploadProgressPercent }}%</span></PVProgressBar
          >
        </div>
        <div v-else>
          <PVButton
            @click="chooseCallback()"
            rounded
            :disabled="!content.publicKey"
            icon="pi pi-cloud-upload"
            label="Upload file"
          />
        </div>
      </template>
      <template #content>
        <template v-if="content.style !== 'minimal'">
          <FileThumbnails :files="localFiles" pending v-model:editingFile="editingFile" />
          <FileThumbnails :files="uploadedFiles" v-model:editingFile="editingFile" />
        </template>
        <template v-else>
          <FileRows :files="localFiles" pending v-model:editingFile="editingFile" />
          <FileRows :files="uploadedFiles" v-model:editingFile="editingFile" />
        </template>

        <FileModal
          v-if="content.style !== 'minimal'"
          v-model:editingFile="editingFile"
          v-model:showEditFileModal="showEditFileModal"
          :content="content"
        />
      </template>
      <template #empty>
        <div
          v-if="content.style !== 'minimal'"
          class="flex items-center justify-center flex-col"
          :class="{ 'pointer-events-none': !content.publicKey }"
        >
          <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400 rounded-full" />
          <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
        </div>
      </template>
    </PVFileUpload>
  </div>
</template>

<script>
import PrimeVue from "primevue/config"
import FileUpload from "primevue/fileupload"
import Badge from "primevue/badge"
import Button from "primevue/button"
import ProgressBar from "primevue/progressbar"
import "primevue/resources/themes/aura-light-green/theme.css"
import "primeicons/primeicons.css"
import { UploadClient } from "@uploadcare/upload-client"
import Dialog from "primevue/dialog"
import FileModal from "./FileModal.vue"
import { formatSize } from "./composables"
import InputSwitch from "primevue/inputswitch"
import InputText from "primevue/inputtext"
import FileThumbnails from "./FileThumbnails.vue"
import FileRows from "./FileRows.vue"

export default {
  beforeCreate() {
    // Add Tailwind to the head
    if (!wwLib.getFrontDocument().getElementById("pv-tailwind")) {
      const script = wwLib.getFrontDocument().createElement("script")
      script.src = "https://cdn.tailwindcss.com"
      script.id = "pv-tailwind"
      wwLib.getFrontDocument().body.appendChild(script)
    }

    if (!this.$.appContext.app) return
    // If already registered, skip
    if (this.$.appContext.app.component("PVFileUpload")) return
    this.$.appContext.app.use(PrimeVue)
    this.$.appContext.app.component("PVFileUpload", FileUpload)
    this.$.appContext.app.component("PVBadge", Badge)
    this.$.appContext.app.component("PVButton", Button)
    this.$.appContext.app.component("PVProgressBar", ProgressBar)
    this.$.appContext.app.component("PVDialog", Dialog)
    this.$.appContext.app.component("PVInputSwitch", InputSwitch)
    this.$.appContext.app.component("PVInputText", InputText)
  },
  components: {
    FileModal,
    FileThumbnails,
    FileRows,
  },
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return {
      totalSize: 0,
      totalSizePercent: 0,
      /**
       * @type {UploadClient | null}
       */
      client: null,
      fileInput: null,
      localFiles: [],
      uploadedFiles: [],
      uploadProgressPercent: 0,
      editingFile: null,
      showEditFileModal: false,
    }
  },

  watch: {
    editingFile(newVal, oldVal) {
      if (!newVal) return
      if (oldVal && newVal)
        this.$emit("trigger-event", {
          name: "update:editing-file",
          event: {
            ...newVal,
            fileName: newVal.name,
          },
        })
      // this.$emit("update:content", { ...this.content, uplaodedFiles: this.uploadedFiles })
      this.uploadedFiles = this.uploadedFiles.map((file) => {
        if (file && file.uuid === newVal.uuid) {
          return newVal
        }
        return file
      })
      this.$emit("update:content", { ...this.content, uploadedFiles: this.uploadedFiles })
    },
    "content.uploadedFiles": {
      handler(newVal) {
        console.log("content.uploadedFiles newVal :", newVal)
        this.uploadedFiles = newVal
      },
      deep: true,
    },
  },

  methods: {
    formatSize,
    uploadEvent() {},
    async onSelect(event) {
      const file = event.files[0]
      this.localFiles.push(file)
      console.log("this.localFiles :", this.localFiles)
      this.uploadProgressPercent = 0
      const result = await this.client.uploadFile(new File([file], file.name), {
        publicKey: this.content.publicKey,
        store: "auto",
        metadata: {
          subsystem: "js-client",
          pet: "cat",
        },
        onProgress: (progress) => {
          this.uploadProgressPercent = progress.value * 100
          console.log("progress :", progress)
        },
      })
      this.localFiles.splice(this.localFiles.indexOf(file), 1)
      this.uploadedFiles.push(result)
      console.log("this.uploadedFiles :", this.uploadedFiles)
    },
  },
  mounted() {
    this.client = new UploadClient({ publicKey: this.content.publicKey })
    this.$emit("update:content", { ...this.content, uploadedFiles: this.uploadedFiles })
  },
}
</script>

<style scoped lang="scss">
:deep(button.p-button.p-button-icon-only.p-button-rounded) {
  text-align: center;
  border-width: unset;
}
</style>
