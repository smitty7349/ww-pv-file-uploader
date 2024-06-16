export default {
  editor: {
    label: {
      en: "PrimeVue Uploadcare",
    },
  },
  triggerEvents: [
    {
      name: "update:editing-file",
      label: {
        en: "Update to a currently-editing file",
      },
      event: {
        cdnUrl: "",
        fileName: "",
        size: 0,
        uuid: "",
      },
    },
  ],
  properties: {
    publicKey: {
      label: {
        en: "Public Key",
      },
      type: "Text",
      bindable: true,
      responsive: true,
    },
    enableScaleCrop: {
      label: {
        en: "Enable Scale Crop",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enableRotate: {
      label: {
        en: "Enable Rotate",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enableWatermark: {
      label: {
        en: "Enable Watermark",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enableAutoFormat: {
      label: {
        en: "Enable Auto Format",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enableAutoQuality: {
      label: {
        en: "Enable Auto Quality",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enableAutoProfilePicture: {
      label: {
        en: "Enable Auto Profile Picture",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enablePreview: {
      label: {
        en: "Enable Preview",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enableGrayscale: {
      label: {
        en: "Enable Grayscale",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enableSmartResize: {
      label: {
        en: "Enable Smart Resize",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
    enableBlur: {
      label: {
        en: "Enable Blur",
      },
      type: "OnOff",
      bindable: true,
      responsive: true,
    },
  },
}
