# Primevue Uploadcare File Uploader

This is an element for [weweb.io](https://www.weweb.io/). It allows uploading files (images) to [Uploadcare](https://uploadcare.com/) and applying transformations to them.

## Installation

To run locally, first install all dependencies with `npm i`

## Start

To serve locally, run `npm run serve --port=[PORT]`, and then go to Weweb editor, open developper popup and add your custom element.

## Build

Before release, you can check build error by running `npm run build --name=my-element`

## Releases

### next

- fix modal not opening when clicking images

### 0.0.9

- it only shows a button for minimal style at first
- it shows a condensed list of the photos for minimal style
- fix 'close' button in inline style
- (📐: attempt; please test) fix spacing in inline style between each transformation
- remove 'x' button below images

### 0.0.8

- it has three style modes: basic, inline, minimal
  - it has them in the editor UI
  - it responds to them
  - basic: the default, with the file picker and the file modal
  - inline: the file modal shows below the file picker
  - minimal: no file modal, only the file picker
- it has uploadedFiles bound as an array

### 0.0.7

- all features from 0.0.6 can be disabled/enabled in Weweb
- fix bug stopping the dialog from closing
- emit single-object event for each image

### 0.0.6 - First round of transformations, Uploadcare only (no Weweb integration), text overlay missing

- grayscale transformation, Uploadcare only (no Weweb integration)
- smart resize transformation, Uploadcare only (no Weweb integration)
- blur transformation, Uploadcare only (no Weweb integration)

### 0.0.5

- basic watermark transformation, Uploadcare only (no Weweb integration)
  - with opacity
- basic auto format transformation, Uploadcare only (no Weweb integration)
- basic quality transformation, Uploadcare only (no Weweb integration)
- basic profile picture preset transformation, Uploadcare only (no Weweb integration)
- basic preview transformation, Uploadcare only (no Weweb integration)

### 0.0.4

- show the link
- smart scale crop transformation, Uploadcare only (no Weweb integration)
- basic rotation transformation, Uploadcare only (no Weweb integration)

### 0.0.3

- fix buttons' icons not being centered
- allow removing files from the file picker
- add 'download' and 'copy link' buttons in the file modal

### 0.0.1

Initial release

## Requirements

### Round 2

1. Basic / inline / minimal: design changes to bring it into fuller unity with Uploadcare
   1. Minimal:
      - ✔️ should be a single button to begin with, no dropzone
      - ✔️ should show a condensed list of the photos
   2. Inline:
      - ✔️ 'Close' button should work
      - ✔️ 📐 more space between all the tools (for this one, it appears like Tailwind took in my development environment but not in Weweb's production environment. Will take some research or switching to a different method of spacing)
   3. Basic:
      - ✔️ modal isn't opening when you click the images
      - filename should wrap or have ellipsis on the end
      - bottom-aligned status chips should all be vertically aligned with each other
      - progress bar should have a label 'Upload progress'
2. Bugs:
   1. ✔️ Modal doesn't open when you click the images
   2. ✔️ 'X' button below images doesn't do anything (remove it)
   3. Should allow uploading multiple at once
   4. Uploaded files array not updating on upload
   5. Copy button not working (this is an interesting one; I do have a confirmation message when it copies, so it must be having some problem, but I have the code set up where it attempts two different ways to copy, so it surprises me that it doesn't work 😅)
3. the ability to change the "accept" value via a prop (string or array) or list of booleans (props). I want this component to accept and preview images, videos, files, etc.

### Round 1

- Has these capabilities, in the UI:

  - [x] scale_crop with smart (they can enter the dimensions)
  - [x] rotate
  - [x] watermark (they can enter another UUID)
  - [x] format
  - [x] quality
  - [x] profile picture preset
  - [x] preview
  - [x] grayscale
  - [x] smart resize
  - [ ] ~~overlay (text and image only)~~
  - [x] blur

- The capabilities can be enabled/disabled in Weweb:

  - [x] scale_crop with smart
  - [x] rotate
  - [x] watermark
  - [x] format
  - [x] quality
  - [x] profile picture preset
  - [x] preview
  - [x] grayscale
  - [x] smart resize
  - [ ] ~~overlay (text and image only)~~
  - [x] blur

- Emits an array of `{ uuid (str), cdnURL, size (# decimal), fileName (str), moderationCheck (bool) }` for each image
  - [x] single object event for each image
