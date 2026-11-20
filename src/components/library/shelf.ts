import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Object3D,
  type Texture,
} from 'three'
import type { Book } from './books'

const PX_PER_UNIT = 400
const BOOK_DEPTH = 1.6
const COVER = 0.03
const GAP = 0.04
const SHELF_INNER_HEIGHT = 2.8
const SHELF_DEPTH = 1.9
const SHELF_FRONT_Z = SHELF_DEPTH / 2 - BOOK_DEPTH / 2 - 0.05
const BOARD = 0.12
const FOV = 28
const TAN_HALF_FOV = Math.tan((FOV * Math.PI) / 360)
const PAPER = '#f3eee3'
const INK = '#26231f'

const PULL_OUT = 0.9
const PULL_OUT_SHARE = 0.3
const HOVER_OUT = 0.25
const HOVER_TILT = 0.04
const DISPLAY_TILT = 0.04
const DISPLAY_FILL = 0.8
const DISPLAY_MIN_DISTANCE = 3
const DISPLAY_CLEARANCE = 1.2
const MIN_FREE_PX = 120
const DRAG_YAW_PER_PX = 0.012
const DRAG_PITCH_PER_PX = 0.008
const MAX_PITCH = 0.7
const DRAG_THRESHOLD_PX = 3

export type Selection = { id: string; free: DOMRect } | null

interface Pose {
  x: number
  y: number
  z: number
  pitch: number
  yaw: number
  roll: number
  scale: number
}

interface BookRig {
  book: Book
  group: Group
  shelfX: number
  height: number
  hover: number
  pull: number
}

function inkFor(hex: string) {
  const { r, g, b } = new Color(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? INK : PAPER
}

function spineTexture(book: Book, thickness: number, height: number) {
  const canvas = document.createElement('canvas')
  const w = (canvas.width = Math.round(thickness * PX_PER_UNIT))
  const h = (canvas.height = Math.round(height * PX_PER_UNIT))
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = book.spineColor
  ctx.fillRect(0, 0, w, h)
  ctx.translate(w / 2, 0)
  ctx.rotate(Math.PI / 2)
  ctx.fillStyle = inkFor(book.spineColor)
  ctx.textBaseline = 'middle'
  const author = book.spineAuthor.toUpperCase()
  const authorFont = `${Math.round(w * 0.2)}px Lexend`
  ctx.font = authorFont
  const authorWidth = ctx.measureText(author).width
  ctx.font = `bold ${w * 0.42}px ClashDisplay`
  const room = h - authorWidth - h * 0.16
  const titleSize = w * 0.42 * Math.min(1, room / ctx.measureText(book.title).width)
  ctx.font = `bold ${titleSize}px ClashDisplay`
  ctx.fillText(book.title, h * 0.06, 0)
  ctx.font = authorFont
  ctx.globalAlpha = 0.75
  ctx.fillText(author, h - authorWidth - h * 0.05, 0)
  return withColorSpace(new CanvasTexture(canvas))
}

const loader = new TextureLoader()

function coverTexture(book: Book, onLoad: () => void) {
  return withColorSpace(loader.load(book.cover.src, onLoad))
}

function withColorSpace<T extends Texture>(texture: T) {
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function thicknessOf(book: Book) {
  return 0.3 + (book.title.length % 5) * 0.045
}

function buildBook(book: Book, thickness: number, shelfX: number, onTextureLoad: () => void): BookRig {
  const t = thickness
  const h = (BOOK_DEPTH * book.cover.height) / book.cover.width
  const color = new MeshStandardMaterial({ color: book.spineColor, roughness: 0.75 })
  const paper = new MeshStandardMaterial({ color: PAPER, roughness: 0.9 })

  const pages = new Mesh(new BoxGeometry(t - COVER * 2, h - 0.06, BOOK_DEPTH - 0.04), paper)
  pages.position.z = -0.02

  const back = new Mesh(new BoxGeometry(COVER, h, BOOK_DEPTH), color)
  back.position.x = -t / 2 + COVER / 2

  const spineMaterial = new MeshStandardMaterial({ map: spineTexture(book, t, h), roughness: 0.75 })
  const spine = new Mesh(new BoxGeometry(t, h, COVER), [color, color, color, color, spineMaterial, color])
  spine.position.z = BOOK_DEPTH / 2 - COVER / 2

  const frontMaterial = new MeshStandardMaterial({ map: coverTexture(book, onTextureLoad), roughness: 0.75 })
  const front = new Mesh(new BoxGeometry(COVER, h, BOOK_DEPTH), [frontMaterial, color, color, color, color, color])
  front.position.x = t / 2 - COVER / 2

  const group = new Group()
  group.add(pages, back, spine, front)
  group.userData.bookId = book.id
  return { book, group, shelfX, height: h, hover: 0, pull: 0 }
}

function buildShelf(innerWidth: number, boardMaterial: MeshStandardMaterial, backMaterial: MeshStandardMaterial) {
  const shelf = new Group()
  const outerWidth = innerWidth + BOARD * 2
  const board = (w: number, h: number, d: number, x: number, y: number, z: number, material = boardMaterial) => {
    const mesh = new Mesh(new BoxGeometry(w, h, d), material)
    mesh.position.set(x, y, z)
    shelf.add(mesh)
  }
  board(outerWidth, BOARD, SHELF_DEPTH, 0, -BOARD / 2, 0)
  board(outerWidth, BOARD, SHELF_DEPTH, 0, SHELF_INNER_HEIGHT + BOARD / 2, 0)
  board(BOARD, SHELF_INNER_HEIGHT, SHELF_DEPTH, -innerWidth / 2 - BOARD / 2, SHELF_INNER_HEIGHT / 2, 0)
  board(BOARD, SHELF_INNER_HEIGHT, SHELF_DEPTH, innerWidth / 2 + BOARD / 2, SHELF_INNER_HEIGHT / 2, 0)
  board(innerWidth, SHELF_INNER_HEIGHT, 0.05, 0, SHELF_INNER_HEIGHT / 2, -SHELF_DEPTH / 2, backMaterial)
  return shelf
}

function woodColors() {
  return document.documentElement.classList.contains('dark')
    ? { board: '#4a3d31', back: '#2f2721' }
    : { board: '#d2bea3', back: '#bfa98c' }
}

function damp(current: number, target: number, rate: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-rate * dt))
}

function ease(x: number) {
  const c = Math.min(1, Math.max(0, x))
  return c * c * (3 - 2 * c)
}

function blend(a: Pose, b: Pose, t: number): Pose {
  const mix = (key: keyof Pose) => a[key] + (b[key] - a[key]) * t
  return {
    x: mix('x'),
    y: mix('y'),
    z: mix('z'),
    pitch: mix('pitch'),
    yaw: mix('yaw'),
    roll: mix('roll'),
    scale: mix('scale'),
  }
}

function intersect(a: DOMRect, b: DOMRect) {
  const left = Math.max(a.left, b.left)
  const top = Math.max(a.top, b.top)
  return new DOMRect(left, top, Math.min(a.right, b.right) - left, Math.min(a.bottom, b.bottom) - top)
}

export function createShelf(host: HTMLElement, books: Book[], onSelect: (id: string | null) => void) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%' })
  host.append(canvas)

  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100)
  scene.add(new AmbientLight(0xffffff, 1.6))
  const sun = new DirectionalLight(0xffffff, 1.8)
  sun.position.set(-3, 5, 6)
  scene.add(sun)

  const innerWidth = books.reduce((sum, b) => sum + thicknessOf(b) + GAP, GAP)
  let nextX = -innerWidth / 2 + GAP
  const rigs = books.map((book) => {
    const thickness = thicknessOf(book)
    const rig = buildBook(book, thickness, nextX + thickness / 2, requestRender)
    nextX += thickness + GAP
    scene.add(rig.group)
    return rig
  })

  const wood = woodColors()
  const boardMaterial = new MeshStandardMaterial({ color: wood.board, roughness: 0.85 })
  const backMaterial = new MeshStandardMaterial({ color: wood.back, roughness: 0.9 })
  scene.add(buildShelf(innerWidth, boardMaterial, backMaterial))

  const centerY = SHELF_INNER_HEIGHT / 2
  const tallest = Math.max(...rigs.map((r) => r.height))
  let selectedId: string | null = null
  let hoveredId: string | null = null
  let display = { x: 0, y: centerY, z: 0, scale: 1 }
  const spin = { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0 }
  let frame = 0
  let last = 0

  function layout() {
    const width = host.clientWidth
    const height = host.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    const halfH = SHELF_INNER_HEIGHT / 2 + BOARD + 0.35
    const halfW = innerWidth / 2 + BOARD + 0.35
    const distance = Math.max(halfH / TAN_HALF_FOV, halfW / (TAN_HALF_FOV * camera.aspect))
    camera.position.set(0, centerY + 0.2, SHELF_DEPTH / 2 + distance)
    camera.lookAt(0, centerY, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    requestRender()
  }

  function placeDisplay(free: DOMRect) {
    const rect = canvas.getBoundingClientRect()
    const visible = intersect(free, rect)
    const area = visible.width > MIN_FREE_PX && visible.height > MIN_FREE_PX ? visible : rect
    const unitsPerPx = Math.max(
      (BOOK_DEPTH + 0.6) / (area.width * DISPLAY_FILL),
      tallest / (area.height * DISPLAY_FILL),
    )
    const idealDistance = (unitsPerPx * rect.height) / (2 * TAN_HALF_FOV)
    const inFrontOfShelf = camera.position.z - SHELF_DEPTH / 2 - DISPLAY_CLEARANCE
    const distance = Math.max(DISPLAY_MIN_DISTANCE, Math.min(idealDistance, inFrontOfShelf))
    const ndcX = ((area.x + area.width / 2 - rect.left) / rect.width) * 2 - 1
    const ndcY = 1 - ((area.y + area.height / 2 - rect.top) / rect.height) * 2
    const point = camera.localToWorld(
      new Vector3(ndcX * distance * TAN_HALF_FOV * camera.aspect, ndcY * distance * TAN_HALF_FOV, -distance),
    )
    display = { x: point.x, y: point.y, z: point.z, scale: Math.min(1, distance / idealDistance) }
  }

  function shelfPose(rig: BookRig): Pose {
    return {
      x: rig.shelfX,
      y: rig.height / 2,
      z: SHELF_FRONT_Z + ease(rig.pull / PULL_OUT_SHARE) * PULL_OUT + rig.hover * HOVER_OUT,
      pitch: 0,
      yaw: 0,
      roll: -HOVER_TILT * rig.hover,
      scale: 1,
    }
  }

  function displayPose(): Pose {
    return { ...display, pitch: DISPLAY_TILT + spin.pitch, yaw: -Math.PI / 2 + spin.yaw, roll: 0 }
  }

  function applyPose(rig: BookRig) {
    const travel = ease((rig.pull - PULL_OUT_SHARE) / (1 - PULL_OUT_SHARE))
    const pose = blend(shelfPose(rig), displayPose(), travel)
    rig.group.position.set(pose.x, pose.y, pose.z)
    rig.group.rotation.set(pose.pitch, pose.yaw, pose.roll)
    rig.group.scale.setScalar(pose.scale)
  }

  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
    last = now
    let moving = false
    const settle = (current: number, target: number, rate: number) => {
      const next = damp(current, target, rate, dt)
      if (Math.abs(next - target) > 0.001) moving = true
      return next
    }
    spin.yaw = settle(spin.yaw, spin.targetYaw, 12)
    spin.pitch = settle(spin.pitch, spin.targetPitch, 12)
    for (const rig of rigs) {
      rig.pull = settle(rig.pull, rig.book.id === selectedId ? 1 : 0, 4.5)
      rig.hover = settle(rig.hover, rig.book.id === hoveredId && !selectedId ? 1 : 0, 10)
      applyPose(rig)
    }
    renderer.render(scene, camera)
    frame = moving ? requestAnimationFrame(tick) : 0
  }

  function requestRender() {
    if (frame) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }

  const raycaster = new Raycaster()
  const pointer = new Vector2()
  function bookAt(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
    let node: Object3D | null = raycaster.intersectObjects(rigs.map((r) => r.group), true)[0]?.object ?? null
    while (node && !node.userData.bookId) node = node.parent
    return (node?.userData.bookId as string | undefined) ?? null
  }

  let drag: { x: number; y: number; moved: boolean } | null = null
  let dragJustEnded = false

  canvas.addEventListener('pointerdown', (event) => {
    if (!selectedId || bookAt(event) !== selectedId) return
    drag = { x: event.clientX, y: event.clientY, moved: false }
    canvas.setPointerCapture(event.pointerId)
    canvas.style.cursor = 'grabbing'
  })
  canvas.addEventListener('pointermove', (event) => {
    if (drag) {
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      drag.moved ||= Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD_PX
      drag.x = event.clientX
      drag.y = event.clientY
      spin.targetYaw += dx * DRAG_YAW_PER_PX
      spin.targetPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, spin.targetPitch + dy * DRAG_PITCH_PER_PX))
      requestRender()
      return
    }
    if (event.pointerType !== 'mouse') return
    const id = bookAt(event)
    canvas.style.cursor = !id ? 'default' : id === selectedId ? 'grab' : 'pointer'
    if (id !== hoveredId) {
      hoveredId = id
      requestRender()
    }
  })
  const endDrag = () => {
    if (!drag) return
    dragJustEnded = drag.moved
    drag = null
    canvas.style.cursor = 'grab'
  }
  canvas.addEventListener('pointerup', endDrag)
  canvas.addEventListener('pointercancel', endDrag)
  canvas.addEventListener('pointerleave', () => {
    hoveredId = null
    requestRender()
  })
  canvas.addEventListener('click', (event) => {
    if (dragJustEnded) {
      dragJustEnded = false
      return
    }
    const id = bookAt(event)
    if (id !== selectedId) onSelect(id)
  })

  new ResizeObserver(layout).observe(host)
  new MutationObserver(() => {
    const colors = woodColors()
    boardMaterial.color.set(colors.board)
    backMaterial.color.set(colors.back)
    requestRender()
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  layout()

  return {
    select(selection: Selection) {
      if (selection) placeDisplay(selection.free)
      selectedId = selection?.id ?? null
      hoveredId = null
      Object.assign(spin, { targetYaw: 0, targetPitch: 0 })
      canvas.style.touchAction = selection ? 'none' : ''
      requestRender()
    },
  }
}
