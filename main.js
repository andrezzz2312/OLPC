import {GLTFLoader} from './loaders/GLTFLoader.js'
import {RGBELoader} from './loaders/RGBELoader.js'
import {OrbitControls} from './controls/OrbitControls.js'
import {RoughnessMipmapper} from './utils/RoughnessMipmapper.js'
import {CSS3DRenderer, CSS3DObject} from './renderers/CSS3DRenderer.js'
// import {GUI} from './libs/lil-gui.module.min.js'
// console.log(GUI)
// const panel = new GUI({width: 250})
// const point1 = panel.addFolder('point 1')
// const point2 = panel.addFolder('point 2')
// const point3 = panel.addFolder('point 3')
// const point4 = panel.addFolder('point 4')
// const point5 = panel.addFolder('point 5')

// const settings = {
//   x: 0,
//   y: 0,
//   z: 0,
//   'rotation x': 0,
//   'rotation y': 0,
//   'rotation z': 0,
//   'intensidad ambiental': 0,
//   'intensidad directional': 0,
// }
// point1.add(settings, 'x', -100, 100).onChange(function (value) {
//   points[0].position.x = value
// })
// point1.add(settings, 'y', -100, 100).onChange(function (value) {
//   points[0].position.y = value
// })
// point1.add(settings, 'z', -100, 100).onChange(function (value) {
//   points[0].position.z = value
// })
// point2.add(settings, 'x', -100, 100).onChange(function (value) {
//   points[1].position.x = value
// })
// point2.add(settings, 'y', -100, 100).onChange(function (value) {
//   points[1].position.y = value
// })
// point2.add(settings, 'z', -100, 100).onChange(function (value) {
//   points[1].position.z = value
// })
// point3.add(settings, 'x', -100, 100).onChange(function (value) {
//   points[2].position.x = value
// })
// point3.add(settings, 'y', -100, 100).onChange(function (value) {
//   points[2].position.y = value
// })
// point3.add(settings, 'z', -100, 100).onChange(function (value) {
//   points[2].position.z = value
// })
// point4.add(settings, 'x', -100, 100).onChange(function (value) {
//   points[3].position.x = value
// })
// point4.add(settings, 'y', -100, 100).onChange(function (value) {
//   points[3].position.y = value
// })
// point4.add(settings, 'z', -100, 100).onChange(function (value) {
//   points[3].position.z = value
// })
// point5.add(settings, 'x', -100, 100).onChange(function (value) {
//   points[4].position.x = value
// })
// point5.add(settings, 'y', -100, 100).onChange(function (value) {
//   points[4].position.y = value
// })
// point5.add(settings, 'z', -100, 100).onChange(function (value) {
//   points[4].position.z = value
// })

const scene = new THREE.Scene()
let box_canvas = document.getElementById('cont-canvas')
const camera = new THREE.PerspectiveCamera(
  60,
  box_canvas.clientWidth / box_canvas.clientHeight,
  3,
  1000
)
let clock, mixer
let laptopScene
let abrir, cerrar, antenas, tablet, cerrar_antenas
let laptop_open,
  laptop_close,
  monitor_180turn_a,
  monitor_180turn_b,
  lock_90degrees_a,
  lock_90degrees_b,
  lock_close,
  lock_fullclose,
  lock_open,
  laptop_90degrees_a,
  laptop_90degrees_b
let abrirpeso, cerrarpeso, acciones, animations
let setear_peso_abrir
let escala_tiempo
const container = document.getElementById('container')

let canvas = document.getElementById('artifactcanvas')
let btn_screen = document.getElementById('btn_screen')
let img_screen = document.getElementById('btn_screen_imagen')
let mobileD = window.matchMedia('(max-height: 550px)')
//botones en letiables
let btnabrir = document.getElementById('boton_abrir')
let btncerrar = document.getElementById('boton_cerrar')
let btntablet = document.getElementById('boton_tablet')

let btnspecs = document.getElementById('boton_specifications')
let botonar = document.getElementById('btn_ar')
// boton aumented reality
let modal = document.querySelector('.modal')
let card = document.querySelector('.card')
/*
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar')

let sceneReady = false
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      // gsap.to(overlayMaterial.uniforms.uAlpha, {
      //   duration: 3,
      //   value: 0,
      //   delay: 1,
      // })
      // Update loadingBarElement
      // loadingBarElement.classList.add('ended')
      // loadingBarElement.style.transform = ''
    }, 500)

    window.setTimeout(() => {
      sceneReady = true
    }, 2000)
  }
)

/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster()
const points = [
  {
    position: new THREE.Vector3(1.4, 3, -2.8),
    element: document.querySelector('.point-0'),
  },
  {
    position: new THREE.Vector3(-4, -8, 8),
    element: document.querySelector('.point-1'),
  },
  {
    position: new THREE.Vector3(-8, 11, -10),
    element: document.querySelector('.point-2'),
  },
  {
    position: new THREE.Vector3(5.4, -7, -9.4),
    element: document.querySelector('.point-3'),
  },
  {
    position: new THREE.Vector3(12.5, -2, 1.7),
    element: document.querySelector('.point-4'),
  },
]

/**
 * Sizes
 */
const sizes = {
  width: box_canvas.offsetWidth,
  height: box_canvas.offsetHeight,
}

const renderer = new THREE.WebGLRenderer({
  canvas: artifactcanvas,
  alpha: true,
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

renderer.setSize(box_canvas.offsetWidth, box_canvas.offsetHeight)
// renderer.scale.set()
camera.aspect = box_canvas.offsetWidth / box_canvas.offsetHeight
camera.updateProjectionMatrix()
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.4
renderer.outputEncoding = THREE.sRGBEncoding
//container.appendChild( renderer.domElement );
clock = new THREE.Clock()

//hdri
let pmremGenerator = new THREE.PMREMGenerator(renderer)
pmremGenerator.compileEquirectangularShader()
//hdri parte 2
let efecto = new RGBELoader()
efecto.setDataType(THREE.UnsignedByteType)
efecto.load(
  'imagenes/hdri/christmas_photo_studio_04_1k_LIGHT.hdr',
  function (texture) {
    let envMap = pmremGenerator.fromEquirectangular(texture).texture
    scene.environment = envMap
    texture.dispose()
    pmremGenerator.dispose()
  }
)
//fin del hdri
const roughnessMipmapper = new RoughnessMipmapper(renderer)
const objeto = new GLTFLoader(loadingManager)
objeto.load('objetos/OneLaptopPerChild_Laptop.glb', function (gltf) {
  laptopScene = gltf.scene
  laptopScene.position.set(0, -8, 1)
  laptopScene.scale.set(100, 100, 100)
  laptopScene.rotation.set(0, 180.2, 0)
  scene.add(gltf.scene)
  laptopScene.traverse(function (child) {
    if (child.isMesh) {
      roughnessMipmapper.generateMipmaps(child.material)
    }
  })
  const animations = gltf.animations
  mixer = new THREE.AnimationMixer(laptopScene)

  tablet = mixer.clipAction(animations[0])
  monitor_180turn_a = mixer.clipAction(animations[0])
  monitor_180turn_b = mixer.clipAction(animations[1])
  lock_90degrees_a = mixer.clipAction(animations[2])
  lock_90degrees_b = mixer.clipAction(animations[3])
  lock_close = mixer.clipAction(animations[4])
  lock_fullclose = mixer.clipAction(animations[5])
  lock_open = mixer.clipAction(animations[6])
  laptop_90degrees_a = mixer.clipAction(animations[7])
  laptop_90degrees_b = mixer.clipAction(animations[8])
  laptop_open = mixer.clipAction(animations[9])
  laptop_close = mixer.clipAction(animations[10])
})

//funciones de animaciones
//abrir laptop
function abrirpantalla() {
  mixer.stopAllAction()
  //iniciando la accion de abrir antenas
  lock_open.weight = 1
  lock_open.fadeIn(0.01)
  lock_open.play()
  lock_fullclose.weight = 0 // se puso fullcose 0 para que pudiera realizar la accion open-close
  //iniciando la accion de abrir laptop
  laptop_open.weight = 1
  laptop_open.fadeIn(0.01)
  laptop_open.play()
  laptop_open.clampWhenFinished = true
  laptop_open.loop = THREE.LoopOnce
  lock_open.clampWhenFinished = true
  lock_open.loop = THREE.LoopOnce
  btnabrir.disabled = true
  btnabrir.style.opacity = 0.5
  btntablet.disabled = false
  btntablet.style.opacity = 1
  btnspecs.disabled = false
  btnspecs.style.opacity = 1
  btncerrar.disabled = false
  btncerrar.style.opacity = 1
}

//funcion cerrar laptop
function cerrarpantalla() {
  if (lock_fullclose.weight == 0) {
    //cerrar antenas
    mixer.stopAllAction()
    lock_open.setEffectiveWeight(0)

    lock_open.weight = 0
    lock_open.fadeOut(0.1)

    lock_close.weight = 1
    lock_close.fadeIn(0.01)
    lock_close.loop = THREE.LoopOnce
    lock_close.clampWhenFinished = true
    lock_close.play()
    //correciones
    laptop_open.fadeOut(0.9)
    laptop_close.setEffectiveWeight(1)
    // laptop_close.fadeIn(0.01)
    laptop_close.play()
    laptop_close.clampWhenFinished = true
    laptop_close.loop = THREE.LoopOnce
    btnabrir.disabled = false
    btnabrir.style.opacity = 1
    btnspecs.disabled = true
    btnspecs.style.opacity = 0.5
    btntablet.disabled = true
    btntablet.style.opacity = 0.5
    btncerrar.disabled = true
    btncerrar.style.opacity = 0.5
  }
}

function modetablet() {
  if (lock_open.weight == 1 && laptop_open.weight == 1) {
    console.log('1')
    mixer.stopAllAction()

    lock_open.weight = 0
    //lock_open.fadeOut(0.1);
    lock_fullclose.weight = 1
    lock_fullclose.fadeIn(0.01)
    lock_fullclose.play()
    lock_fullclose.clampWhenFinished = true
    lock_fullclose.loop = THREE.LoopOnce
    monitor_180turn_a.weight = 1
    monitor_180turn_a.fadeIn(0.01)
    monitor_180turn_a.play()
    monitor_180turn_a.clampWhenFinished = true
    monitor_180turn_a.loop = THREE.LoopOnce
    laptop_open.setEffectiveWeight(0)
    laptop_close.weight = 1
    laptop_close.fadeIn(0.01)
    laptop_close.loop = THREE.LoopOnce
    laptop_close.clampWhenFinished = true
    laptop_close.play()

    //measure_o.visible=false;//ocultar measure
    btncerrar.disabled = true
    btncerrar.style.opacity = 0.5
    btnspecs.disabled = true
    btnspecs.style.opacity = 0.5
  } else if (monitor_180turn_a.weight == 1 && laptop_close.weight == 1) {
    console.log('2')
    //laptop_open.reset(); //con este se queda en loop

    laptop_close.weight = 0
    laptop_close.fadeOut(0.01)

    laptop_open.weight = 1
    lock_fullclose.weight = 0
    laptop_open.fadeIn(0.01)
    laptop_open.play()

    laptop_open.loop = THREE.LoopOnce

    laptop_open.clampWhenFinished = true
    setTimeout(() => {
      lock_open.setEffectiveWeight(1)

      lock_open.fadeIn(0.01)
      lock_open.play()
      lock_open.clampWhenFinished = true
      lock_open.loop = THREE.LoopOnce
    }, 1000)

    // monitor_180turn_b.reset(); //con este se queda en loop
    setTimeout(() => {
      monitor_180turn_a.weight = 0
      monitor_180turn_a.fadeOut(0.1) //con 0.01 el cambio adquiere lentitud
      monitor_180turn_b.weight = 1
      monitor_180turn_b.fadeIn(0.01)
      monitor_180turn_b.play()
      monitor_180turn_b.loop = THREE.LoopOnce
      monitor_180turn_b.clampWhenFinished = true
    }, 3000)

    btnspecs.disabled = false
    btncerrar.disabled = false
    btncerrar.style.opacity = 1
    btnspecs.style.opacity = 1
  }
}

//evento AR
let isMobile = {
  Android: function () {
    /*window.location="https://titanium-ninth-oregano.glitch.me";*/
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: function () {
    /*window.location="https://titanium-ninth-oregano.glitch.me";*/
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: function () {
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    )
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    )
  },
}
let mostrar_qr = false

function ar() {
  /*----------*/

  if (mostrar_qr == false) {
    modal.style.visibility = 'visible'
    card.classList.toggle('grow')
    card.classList.remove('shrink')

    mostrar_qr = true
  } else {
    card.classList.toggle('grow')
    card.classList.toggle('shrink')

    mostrar_qr = false
    setTimeout(() => {
      modal.style.visibility = 'hidden'
    }, 1000)
  }
  /*else if( isMobile.iOS() ) window.location="https://wireframereality.com/laptop/qr/"; 
    else if( isMobile.Android() ) window.location="https://titanium-ninth-oregano.glitch.me";  
	else{ 
		mostrar_qr=false; 
		modal.style.visibility='hidden';
	}*/

  /*----mostrar_qr=false; 
		modal.style.visibility='hidden'; ----*/
  /* if(isMobile.Android==true || isMobile.iOS==true){ 
		mostrar_qr=false; 
		modal.style.visibility='hidden'; 
		
	}*/
}
function qr() {
  window.location = 'https://wireframereality.com/laptop/qr/'
}
card.addEventListener('click', qr)
//evento measure
let measure_o
function measure() {
  if (mostrar_especificaciones === false) {
    let obj_measure = new GLTFLoader()
    obj_measure.load(
      'objetos/OneLaptopPerChild_Laptop_Measurements.glb',
      function (gltf) {
        measure_o = gltf.scene
        measure_o.scale.set(100, 100, 100)
        measure_o.position.set(0, -7, 1)
        measure_o.rotation.copy(laptopScene.rotation)
        scene.add(measure_o)
      }
    )
  } else {
    measure_o.visible = false
  }
}
// eventos de Tween camara

//mostrar los 5 botones de las specs
let mostrar_especificaciones = false
const labelpoint = document.querySelectorAll('.point .label')
const point = document.querySelectorAll('.point')

const visible = document.querySelectorAll('.visible')

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//desahabilitar	botones
btncerrar.disabled = true
btntablet.disabled = true
btnspecs.disabled = true

if (btncerrar.disabled == true) {
  btncerrar.style.opacity = 0.5
}
if (btntablet.disabled == true) {
  btntablet.style.opacity = 0.5
}
if (btnspecs.disabled == true) {
  btnspecs.style.opacity = 0.5
}

//eventos click de animaciones
btnabrir.addEventListener('click', abrirpantalla)
btncerrar.addEventListener('click', cerrarpantalla)
btntablet.addEventListener('click', modetablet)
btnspecs.addEventListener('click', mostrar_opciones_especs)
botonar.addEventListener('click', ar)
//responsive
window.addEventListener('resize', onWindowResize)
function onWindowResize() {
  camera.aspect = box_canvas.offsetWidth / box_canvas.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(box_canvas.offsetWidth, box_canvas.offsetHeight)
}

camera.position.z = 38

controls.update()

//luz ambiental
const luz_ambiental = new THREE.AmbientLight(0x404040, 3)
scene.add(luz_ambiental)

//imagen de fondo
let blanco = new THREE.Color(0xffffff)
const fondo = new THREE.TextureLoader().load('imagenes/fondo-gris.png')
// mostrar especs

function mostrar_opciones_especs() {
  if (mostrar_especificaciones === false) {
    measure()
    labelpoint.forEach((element) => {
      element.style.opacity = '0.3'
    })
    btntablet.disabled = true
    btntablet.style.opacity = 0.5
    btncerrar.disabled = true
    btncerrar.style.opacity = 0.5
    mostrar_especificaciones = true
  } else {
    measure()
    mostrar_especificaciones = false
    btntablet.disabled = false
    btntablet.style.opacity = 1
    btncerrar.disabled = false
    btncerrar.style.opacity = 1
  }
}
//scene.background = blanco;
const animate = function () {
  if (sceneReady && mostrar_especificaciones) {
    point.forEach((element) => {
      element.style.opacity = '1'
    })
    // Go through each point
    for (const point of points) {
      // Get 2D screen position

      const screenPosition = point.position.clone()
      screenPosition.project(camera)

      // Set the raycaster
      raycaster.setFromCamera(screenPosition, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      // No intersect found
      if (intersects.length === 0) {
        // Show
        point.element.classList.add('visible')
      }

      // Intersect found
      else {
        // Get the distance of the intersection and the distance of the point
        const intersectionDistance = intersects[0].distance
        const pointDistance = point.position.distanceTo(camera.position)

        // Intersection is close than the point
        if (intersectionDistance < pointDistance) {
          // Hide

          point.element.classList.remove('visible')
        }
        // Intersection is further than the point
        else {
          // Show
          point.element.classList.add('visible')
        }
      }

      const translateX = screenPosition.x * sizes.width * 0.5
      const translateY = -screenPosition.y * sizes.height * 0.5
      point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
    }
  } else {
    point.forEach((element) => {
      element.classList.remove('visible')
      element.style.opacity = '0'
    })
  }
  controls.update()
  requestAnimationFrame(animate)

  let mixerUpdateDelta = clock.getDelta()
  mixer.update(mixerUpdateDelta)

  renderer.render(scene, camera)
}

animate()
