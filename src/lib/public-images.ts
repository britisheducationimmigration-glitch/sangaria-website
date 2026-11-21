export const heroSrcSet = "/img/hero-480.webp 480w, /img/hero-768.webp 768w, /img/hero.webp 928w"
export const coachingSrcSet = "/img/coaching-480.webp 480w, /img/coaching-768.webp 768w, /img/coaching.webp 1199w"
export const familySrcSet = "/img/family-480.webp 480w, /img/family-768.webp 768w, /img/family.webp 1199w"
export const heroSizes = "(min-width: 1024px) 50vw, (min-width: 448px) 448px, 100vw"

const certificateThumbnails = new Set([
  "/certificates/achievement-01.webp",
  "/certificates/achievement-02.webp",
  "/certificates/achievement-03.webp",
  "/certificates/achievement-04.webp",
  "/certificates/achievement-05.webp",
  "/certificates/achievement-06.webp",
  "/certificates/achievement-07.webp",
  "/certificates/achievement-08.webp",
  "/certificates/representation-01.webp",
  "/certificates/representation-02.webp",
  "/certificates/representation-03.webp",
  "/certificates/representation-04.webp",
  "/certificates/representation-05.webp",
  "/certificates/representation-06.webp",
  "/certificates/representation-07.webp"
])

export function certificateThumbnail(src: string) {
  return certificateThumbnails.has(src) ? src.replace("/certificates/", "/certificates/thumbs/") : src
}
