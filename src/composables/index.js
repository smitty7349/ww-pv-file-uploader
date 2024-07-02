export function formatSize(size) {
  if (size === 0) return "0 B"
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${["B", "KB", "MB", "GB", "TB"][i]}`
}

export function limitFileName(fileName, limit = 20) {
  if (!fileName) return ""
  if (fileName.length <= limit) return fileName
  // Preserve the file extension at the end
  const extension = fileName.split(".").pop()
  const name = fileName.slice(0, limit - extension.length - 1)
  return `${name}...${extension}`
}
