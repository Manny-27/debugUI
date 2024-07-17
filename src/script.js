import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI({
    width: 300,
    title: 'Debug',
    // theme: 'dark'
    closeFolders: false
})
// gui.close()
// gui.hide()

window.addEventListener('keydown', (event) => {
    if (event.key == 'h')
        gui.show(gui._hidden)
})


const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObject.color = '#3a6ea6'

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//debub folders

const cubeTweaks = gui.addFolder('cube tweaks')
const cubeAnimation = gui.addFolder('animations')
// cubeTweaks.close()

cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.02).name('elevation')
cubeTweaks.add(mesh.position, 'x').min(-3).max(3).step(0.02).name('elevation x')
cubeTweaks.add(mesh.position, 'z').min(-3).max(3).step(0.02).name('elevation z')

cubeTweaks.add(mesh, 'visible').name('visible')
cubeTweaks.add(material, 'wireframe')

cubeTweaks
    .addColor(debugObject, 'color')
    .onChange(() => {
        material.color.set(debugObject.color)
    })

debugObject.spin = () => {
    gsap.to(mesh.rotation, {  y: mesh.rotation.y + Math.PI * 2}).name('spin')
}

cubeAnimation.add(debugObject, 'spin')

// subdivisions

debugObject.subdivisions = 2
cubeTweaks
    .add(debugObject, 'subdivisions')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
            1,1,1,
            debugObject.subdivisions, debugObject.subdivisions, debugObject.subdivisions
        )
    })


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()