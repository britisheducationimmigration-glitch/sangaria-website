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

// Basic browser-side motion check; not identity matching or trusted anti-spoofing.
export async function checkFaceTurn(video: HTMLVideoElement, message: (text: string) => void) {
  message('Loading face check. Keep your face in the camera.')
  const url = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/vision_bundle.mjs'
  const { FaceLandmarker, FilesetResolver } = await import(/* @vite-ignore */ url)
  const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm')
  const detector = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task' },
    runningMode: 'VIDEO', numFaces: 2, minFaceDetectionConfidence: 0.65, minFacePresenceConfidence: 0.65,
  })
  const direction = crypto.getRandomValues(new Uint8Array(1))[0] % 2 ? 1 : -1
  let stage = 0, heldSince = 0, lastFrame = -1
  const deadline = performance.now() + 25000
  try {
    while (performance.now() < deadline) {
      if (document.hidden || !video.srcObject || video.readyState < 2) throw new Error('Camera interrupted. Restart the face check.')
      if (video.currentTime !== lastFrame) {
        lastFrame = video.currentTime
        const now = performance.now()
        const score = faceTurnScore(detector.detectForVideo(video, now).faceLandmarks)
        if (score === null) {
          stage = 0; heldSince = 0
          message('Keep exactly one face clearly visible, closer to the camera.')
        } else {
          const good = stage === 1 ? score * direction > 0.20 : Math.abs(score) < 0.12
          message(stage === 1 ? `Slowly turn your nose toward the ${direction > 0 ? 'left' : 'right'} of the mirrored preview.` : 'Look straight into the camera and hold still.')
          if (!good) heldSince = 0
          else if (!heldSince) heldSince = now
          else if (now - heldSince >= 450) {
            stage++; heldSince = 0
            if (stage === 3) return
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error('Face/head-turn check timed out. Use good lighting and try again.')
  } finally { detector.close() }
}
