/// <reference types="vite/client" />

declare module '@assets/*' {
  const src: string
  export default src
}

declare module '@assets/svg/*.svg?url' {
  const src: string
  export default src
}

declare module '@assets/images/*.png' {
  const src: string
  export default src
}

declare module '@assets/images/*.jpg' {
  const src: string
  export default src
}

declare module '@assets/images/*.jpeg' {
  const src: string
  export default src
}

declare module '@assets/images/*.gif' {
  const src: string
  export default src
}

declare module '@assets/images/*.webp' {
  const src: string
  export default src
}
