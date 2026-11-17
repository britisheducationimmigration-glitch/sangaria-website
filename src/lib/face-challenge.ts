type Point = { x: number; y: number; z: number }
export function faceTurnScore(faces: Point[][]): number | null {
  if (faces.length !== 1) return null
  const face = faces[0], nose = face[1], left = face[33], right = face[263]
  if (!nose || !left || !right) return null
  const width = Math.abs(right.x - left.x)
  if (width < 0.07 || width > 0.65) return null
  const score = (nose.x - (left.x + right.x) / 2) / width
  return Number.isFinite(score) ? score : null
}

export function advanceBlink(stage: number, left: number, right: number): number {
  if (![left, right].every(value => Number.isFinite(value) && value >= 0 && value <= 1)) return 0
  const open = left < 0.25 && right < 0.25
  const closed = left > 0.55 && right > 0.55
  if (stage === 0 && open) return 1
  if (stage === 1 && closed) return 2
  if (stage === 2 && open) return 3
  return stage
}

// Basic browser-side blink check; not identity matching or trusted anti-spoofing.
export async function checkFaceBlink(video: HTMLVideoElement, message: (text: string) => void) {
  message('Loading face check. Keep your face in the camera.')
  const url = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/vision_bundle.mjs'
  const { FaceLandmarker, FilesetResolver } = await import(/* @vite-ignore */ url)
  const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm')
  const detector = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task' },
    runningMode: 'VIDEO', numFaces: 2, outputFaceBlendshapes: true, minFaceDetectionConfidence: 0.65, minFacePresenceConfidence: 0.65,
  })
  let stage = 0, lastFrame = -1, closedAt = 0
  const deadline = performance.now() + 15000
  try {
    while (performance.now() < deadline) {
      if (document.hidden || !video.srcObject || video.readyState < 2) throw new Error('Camera interrupted. Restart the face check.')
      if (video.currentTime !== lastFrame) {
        lastFrame = video.currentTime
        const now = performance.now()
        const result = detector.detectForVideo(video, now)
        const score = faceTurnScore(result.faceLandmarks)
        if (score === null || Math.abs(score) > 0.20) {
          stage = 0; closedAt = 0
          message('Keep exactly one face clearly visible, closer to the camera.')
        } else {
          message('Look into the camera and blink once.')
          const categories = result.faceBlendshapes?.[0]?.categories ?? []
          const left = categories.find((item: { categoryName: string }) => item.categoryName === 'eyeBlinkLeft')?.score ?? NaN
          const right = categories.find((item: { categoryName: string }) => item.categoryName === 'eyeBlinkRight')?.score ?? NaN
          if (stage === 2 && now - closedAt > 2000) stage = 0
          const next = advanceBlink(stage, left, right)
          if (next === 2 && stage !== 2) closedAt = now
          stage = next
          if (stage === 3) return
        }
      }
      await new Promise(resolve => setTimeout(resolve, 40))
    }
    throw new Error('Face/blink check timed out. Use good lighting and blink once again.')
  } finally { detector.close() }
}
