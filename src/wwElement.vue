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
        <div class="flex flex-wrap justify-between items-center flex-1 gap-2">
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
      </template>
      <template #content>
        <div v-if="localFiles.length > 0">
          <h5>Pending</h5>
          <div class="flex flex-wrap p-0 sm:p-5 gap-5">
            <div
              v-for="(file, index) of localFiles"
              :key="file.name + file.type + file.size"
              class="card m-0 px-6 flex flex-col border surface-border items-center gap-3"
            >
              <div>
                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" />
              </div>
              <span class="font-semibold">{{ file.name }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <PVBadge value="Pending" severity="warning" />
              <PVButton icon="pi pi-times" @click="onRemoveTemplatingFile(file, index)" rounded severity="danger" />
            </div>
          </div>
        </div>

        <div v-if="uploadedFiles.length > 0">
          <h5>Completed</h5>
          <div class="flex flex-wrap p-0 sm:p-5 gap-5">
            <div
              v-for="(file, index) of uploadedFiles"
              :key="file.name + file.type + file.size"
              class="card m-0 px-6 flex flex-col border surface-border items-center gap-3"
            >
              <div @click="editingFile = file">
                <img role="presentation" :alt="file.name" :src="file.cdnUrl" width="100" />
              </div>
              <span class="font-semibold">{{ file.name }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <PVBadge value="Completed" class="mt-3" severity="success" />
              <PVButton icon="pi pi-times" @click="removeUploadedFileCallback(index)" rounded severity="danger" />
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex items-center justify-center flex-col" :class="{ 'pointer-events-none': !content.publicKey }">
          <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400 rounded-full" />
          <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
        </div>
      </template>
    </PVFileUpload>
    <PVDialog :header="editingFile?.name" v-model:visible="showEditFileModal" modal>
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
import { deleteFile } from "@uploadcare/rest-client"
import Dialog from "primevue/dialog"

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
      copiedLink: false,
    }
  },
  watch: {
    editingFile: {
      handler() {
        this.showEditFileModal = !!this.editingFile
      },
      immediate: true,
    },
    showEditFileModal: {
      handler() {
        if (!this.showEditFileModal) {
          this.editingFile = null
        }
      },
    },
  },
  methods: {
    formatSize(size) {
      if (size === 0) return "0 B"
      const i = Math.floor(Math.log(size) / Math.log(1024))
      return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${["B", "KB", "MB", "GB", "TB"][i]}`
    },
    onRemoveTemplatingFile(file, index) {
      this.localFiles.splice(index, 1)
    },
    async removeUploadedFileCallback(index) {
      const originalLength = this.uploadedFiles.length
      this.uploadedFiles.splice(index, 1)
      this.uploadProgressPercent = (this.uploadedFiles.length / originalLength) * 100
    },
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
  },
  mounted() {
    this.client = new UploadClient({ publicKey: this.content.publicKey })
  },
}
</script>

<style scoped lang="scss">
:deep(button.p-button.p-button-icon-only.p-button-rounded) {
  text-align: center;
  border-width: unset;
}
</style>
