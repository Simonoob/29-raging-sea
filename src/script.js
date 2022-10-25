import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterFragment from './shaders/water/fragment.frag'
import waterVertex from './shaders/water/vertex.vert'
import { Color } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
gui.close()
const debugObj = {
	depthColor: '#186691',
	surfaceColor: '#9bd8ff',
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
	fragmentShader: waterFragment,
	vertexShader: waterVertex,
	transparent: true,
	uniforms: {
		uTime: { value: 0 },

		uBigWavesElevation: { value: 0.2 },
		uBigWavesFrequency: { value: new THREE.Vector2(4, 1.25) },
		uBigWavesSpeed: { value: 0.75 },

		uSmallWavesElevation: { value: 0.03 },
		uSmallWavesFrequency: { value: 3 },
		uSmallWavesSpeed: { value: 0.4 },
		uSmallIterations: { value: 5 },

		uSurfaceColor: { value: new THREE.Color(debugObj.surfaceColor) },
		uDepthColor: { value: new THREE.Color(debugObj.depthColor) },
		uColorOffset: { value: 0.08 },
		uColorMultiplier: { value: 5 },
	},
})

const bigWavesGUI = gui.addFolder('Big waves')
bigWavesGUI
	.add(waterMaterial.uniforms.uBigWavesElevation, 'value')
	.min(0)
	.max(1)
	.step(0.001)
	.name('Elevation')
bigWavesGUI
	.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
	.min(0)
	.max(10)
	.step(0.001)
	.name('Frequency X')
bigWavesGUI
	.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
	.min(0)
	.max(10)
	.step(0.001)
	.name('Frequency Y')
bigWavesGUI
	.add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
	.min(0)
	.max(4)
	.step(0.001)
	.name('Speed')

const smallWavesGUI = gui.addFolder('Small waves')
smallWavesGUI
	.add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
	.min(0)
	.max(1)
	.step(0.001)
	.name('Elevation')
smallWavesGUI
	.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
	.min(0)
	.max(30)
	.step(0.001)
	.name('Frequency')
smallWavesGUI
	.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
	.min(0)
	.max(4)
	.step(0.001)
	.name('Speed')
smallWavesGUI
	.add(waterMaterial.uniforms.uSmallIterations, 'value')
	.min(0)
	.max(4)
	.step(1)
	.name('Iterations')

const colorsGUI = gui.addFolder('Colors')
colorsGUI
	.addColor(debugObj, 'surfaceColor')
	.name('Surface')
	.onChange(() =>
		waterMaterial.uniforms.uSurfaceColor.value.set(
			new THREE.Color(debugObj.surfaceColor),
		),
	)
colorsGUI
	.addColor(debugObj, 'depthColor')
	.name('Depth')
	.onChange(() =>
		waterMaterial.uniforms.uDepthColor.value.set(
			new THREE.Color(debugObj.depthColor),
		),
	)
colorsGUI
	.add(waterMaterial.uniforms.uColorOffset, 'value')
	.min(0)
	.max(1)
	.step(0.001)
	.name('Offset')
colorsGUI
	.add(waterMaterial.uniforms.uColorMultiplier, 'value')
	.min(0)
	.max(10)
	.step(0.001)
	.name('Multiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,
)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 - 0.5
controls.minDistance = 0.75
controls.maxDistance = 5

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()
	// Water
	waterMaterial.uniforms.uTime.value = elapsedTime

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
