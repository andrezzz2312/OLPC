import {GLTFLoader} from './loaders/GLTFLoader.js'
import {RGBELoader} from './loaders/RGBELoader.js'
import {OrbitControls} from './controls/OrbitControls.js'
import {RoughnessMipmapper} from './utils/RoughnessMipmapper.js'
import {CSS3DRenderer, CSS3DObject} from './renderers/CSS3DRenderer.js'

const scene = new THREE.Scene()
//const scene2 = new THREE.scene();
const camera = new THREE.PerspectiveCamera(60, 700 / 700, 3, 1000)

let clock, mixer
var esto
let abrir, cerrar, antenas, tablet, cerrar_antenas
var laptop_open,
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
var abrirpeso, cerrarpeso, acciones, animations
var setear_peso_abrir
let escala_tiempo
const container = document.getElementById('container')
var box_canvas = document.getElementById('cont-canvas')
var canvas = document.getElementById('artifactcanvas')
var btn_screen = document.getElementById('btn_screen')
var img_screen = document.getElementById('btn_screen_imagen')
function changefondo() {
  img_screen.src = 'imagenes/puntito-verde.png'
}

const renderer = new THREE.WebGLRenderer({
  canvas: artifactcanvas,
  alpha: true,
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(box_canvas.clientWidth, box_canvas.clientHeight)
camera.aspect = box_canvas.clientWidth / box_canvas.clientHeight
camera.updateProjectionMatrix()
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.4
renderer.outputEncoding = THREE.sRGBEncoding
//container.appendChild( renderer.domElement );
clock = new THREE.Clock()

//funcion de resize canvas

//hdri
var pmremGenerator = new THREE.PMREMGenerator(renderer)
pmremGenerator.compileEquirectangularShader()
//hdri parte 2
var efecto = new RGBELoader()
efecto.setDataType(THREE.UnsignedByteType)
efecto.load(
  'imagenes/hdri/christmas_photo_studio_04_1k_LIGHT.hdr',
  function (texture) {
    var envMap = pmremGenerator.fromEquirectangular(texture).texture
    scene.environment = envMap
    texture.dispose()
    pmremGenerator.dispose()
  }
)
//fin del hdri
var posicion = new THREE.Vector3()
var root = new THREE.Object3D()
scene.add(root)
const roughnessMipmapper = new RoughnessMipmapper(renderer)
const objeto = new GLTFLoader()
objeto.load('objetos/OneLaptopPerChild_Laptop.glb', function (gltf) {
  esto = gltf.scene
  esto.position.set(0, -8, 1)
  esto.scale.set(100, 100, 100)
  //esto.lookAt(0,180.7,0);
  //esto.rotation.set(-30.76,180,6.2);
  esto.rotation.set(0, 180.2, 0)
  scene.add(esto)
  root.add(esto) //nuevo
  gltf.scene.traverse(function (child) {
    if (child.isMesh) {
      // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
      roughnessMipmapper.generateMipmaps(child.material)
    }
  })
  const animations = gltf.animations
  mixer = new THREE.AnimationMixer(esto)
  console.log(animations)

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
//botones en variables
var btnabrir = document.getElementById('boton_abrir')
var btncerrar = document.getElementById('boton_cerrar')
var btntablet = document.getElementById('boton_tablet')
var btnmeasure = document.getElementById('boton_measure')
var btnspecs = document.getElementById('boton_specifications')
var botonar = document.getElementById('btn_ar')
//botones de especificacione
var btnscreen = document.getElementById('screeninfo')
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
  btnmeasure.disabled = false
  btnmeasure.style.opacity = 1
  btncerrar.disabled = false
  btncerrar.style.opacity = 1
  laptop_pose_frontal()
}
//funcion cerrar laptop
function cerrarpantalla() {
  if (lock_fullclose.weight == 1) {
    console.log('problem')
    laptop_open.setEffectiveWeight(1)
    laptop_open.fadeOut(0.8)
    laptop_close.fadeIn(0.01)
    laptop_close.play()
    /* laptop_close.setEffectiveWeight(1);  
		   laptop_close.fadeIn(1);
		   laptop_close.play();*/
    laptop_close.loop = THREE.LoopOnce
    laptop_close.clampWhenFinished = true
    var laptop_open_peso_if = laptop_open.getEffectiveWeight()
    var laptop_close_peso_if = laptop_close.getEffectiveWeight()
    console.log('peso-open-if:' + laptop_open_peso_if)
    console.log('peso-close-if:' + laptop_close_peso_if)
    btncerrar.disabled = true
    btncerrar.style.opacity = 0.5
    btnabrir.disabled = false
    btnabrir.style.opacity = 1
    btnmeasure.disabled = true
    btnmeasure.style.opacity = 0.5
    btnspecs.disabled = true
    btnspecs.style.opacity = 0.5
    btntablet.disabled = true
    btntablet.style.opacity = 0.5
  } else if (lock_fullclose.weight == 0) {
    //cerrar antenas
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
    laptop_close.fadeIn(0.01)
    laptop_close.play()
    laptop_close.clampWhenFinished = true
    laptop_close.loop = THREE.LoopOnce
    btnabrir.disabled = false
    btnabrir.style.opacity = 1
    btnmeasure.disabled = true
    btnmeasure.style.opacity = 0.5
    btnspecs.disabled = true
    btnspecs.style.opacity = 0.5
    btntablet.disabled = true
    btntablet.style.opacity = 0.5
    btncerrar.disabled = true
    btncerrar.style.opacity = 0.5
  } else {
    //cerrar antenas
    lock_open.weight = 0
    lock_open.fadeOut(0.1)
    lock_close.weight = 1
    lock_close.fadeIn(0.01)
    lock_close.loop = THREE.LoopOnce
    lock_close.clampWhenFinished = true
    lock_close.play()
    //cerrar pantalla- de abierto a cerrado normal
    laptop_open.setEffectiveWeight(0)
    laptop_open.fadeOut(0.1)
    laptop_close.setEffectiveWeight(1)
    laptop_close.fadeIn(0.01)
    laptop_close.loop = THREE.LoopOnce
    laptop_close.clampWhenFinished = true
    laptop_close.play()
    btnabrir.disabled = false
    btnabrir.style.opacity = 1
  }
}

function modetablet() {
  if (lock_open.weight == 1 && laptop_open.weight == 1) {
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
    btnspecs.disabled = true
    btnspecs.style.opacity = 0.5
  } else if (monitor_180turn_a.weight == 1 && laptop_close.weight == 1) {
    //mixer.stopAllAction();
    //laptop_open.reset(); //con este se queda en loop
    lock_open.setEffectiveWeight(1)
    lock_fullclose.weight = 0

    lock_open.fadeIn(0.6)
    lock_open.play()
    lock_open.clampWhenFinished = true
    lock_open.loop = THREE.LoopOnce

    var speed_open = 0.6
    laptop_close.setEffectiveWeight(0)
    laptop_close.fadeOut(1)
    laptop_open.setEffectiveWeight(1)
    laptop_open.fadeIn(speed_open)
    laptop_open.play()
    laptop_open.clampWhenFinished = true
    laptop_open.loop = THREE.LoopOnce
    // monitor_180turn_b.reset(); //con este se queda en loop
    monitor_180turn_a.weight = 0
    monitor_180turn_a.fadeOut(0.1) //con 0.01 el cambio adquiere lentitud
    monitor_180turn_b.weight = 1
    monitor_180turn_b.fadeIn(0.01)
    monitor_180turn_b.play()
    monitor_180turn_b.loop = THREE.LoopOnce
    monitor_180turn_b.clampWhenFinished = true
    //if(measure_o.visible==true){
    //measure_o.visible=false;//ocultar measure
    //}
    btnspecs.disabled = false
    btncerrar.disabled = false
    btncerrar.style.opacity = 1
    btnspecs.style.opacity = 1
    btntablet.disabled = true
    btntablet.style.opacity = 0.5
  } else {
    mixer.stopAllAction()
    lock_fullclose.weight = 1
    monitor_180turn_b.setEffectiveWeight(0)
    monitor_180turn_b.fadeOut(0.1)
    monitor_180turn_a.reset()
    monitor_180turn_a.weight = 1
    monitor_180turn_a.fadeIn(0.01)
    monitor_180turn_a.play()
    monitor_180turn_a.clampWhenFinished = true
    monitor_180turn_a.loop = THREE.LoopOnce
    laptop_open.fadeOut(0.7)
    laptop_close.reset()
    laptop_close.setEffectiveWeight(1)
    laptop_close.fadeIn(0.01)
    laptop_close.play()
    laptop_close.clampWhenFinished = true
    laptop_close.loop = THREE.LoopOnce
    console.log('tercer click')
    //mostrar = false;
    measure_o.visible = false //ocultar measure
  }
}
function out_mode_tablet() {
  //abrir pantalla
  laptop_close.setEffectiveWeight(0)
  laptop_close.fadeOut(0.1)
  laptop_open.setEffectiveWeight(1)
  laptop_open.fadeIn(1)
  laptop_open.play()
  laptop_open.clampWhenFinished = true
  laptop_open.loop = THREE.LoopOnce
  var lock_fullclose_peso = lock_fullclose.getEffectiveWeight()
  var peso = laptop_open.getEffectiveWeight()
  var pesoclose = laptop_close.getEffectiveWeight()
  console.log('out-mode-laptop-open-weight:' + peso)
  console.log('out-mode-laptop_close_peso:' + pesoclose)
  console.log('out-mode-antenas_Fullclose_peso:' + lock_fullclose_peso)
  //girar pantalla a to b
  monitor_180turn_a.weight = 0
  monitor_180turn_a.fadeOut(0.1) //con 0.01 el cambio adquiere lentitud
  monitor_180turn_b.weight = 1
  monitor_180turn_b.fadeIn(0.01)
  monitor_180turn_b.play()
  monitor_180turn_b.loop = THREE.LoopOnce
  monitor_180turn_b.clampWhenFinished = true
}
//evento AR
var isMobile = {
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
var mostrar_qr = false
var card_qr = document.getElementById('card')
function ar() {
  /*----------*/

  if (mostrar_qr == false && screen.width > 1200) {
    card_qr.style.visibility = 'visible'
    mostrar_qr = true
  } else if (screen.width < 1200) {
    window.location = 'https://wireframereality.com/laptop/qr/'
  } else {
    mostrar_qr = false
    card_qr.style.visibility = 'hidden'
  }
  /*else if( isMobile.iOS() ) window.location="https://wireframereality.com/laptop/qr/"; 
    else if( isMobile.Android() ) window.location="https://titanium-ninth-oregano.glitch.me";  
	else{ 
		mostrar_qr=false; 
		card_qr.style.visibility='hidden';
	}*/

  /*----mostrar_qr=false; 
		card_qr.style.visibility='hidden'; ----*/
  /* if(isMobile.Android==true || isMobile.iOS==true){ 
		mostrar_qr=false; 
		card_qr.style.visibility='hidden'; 
		
	}*/
}
//evento measure
var measure_o
var mostrar = false
function measure() {
  if (mostrar == false) {
    var obj_measure = new GLTFLoader()
    obj_measure.load(
      'objetos/OneLaptopPerChild_Laptop_Measurements.glb',
      function (gltf) {
        measure_o = gltf.scene
        measure_o.scale.set(95, 95, 95)
        measure_o.position.set(0, -5, 1)
        measure_o.rotation.copy(esto.rotation)
        scene.add(measure_o)
        mostrar = true
      }
    )
  } else {
    mostrar = false
    measure_o.visible = false
  }
}
// eventos de Tween camara
function vista_normal() {
  var normal_view = new TWEEN.Tween(camera.position)
    .to({x: 0, y: 0, z: 40}, 1500)
    .start()
  var normal_view_rotation = new TWEEN.Tween(camera.rotation)
    .to({x: 0, y: 0, z: 0}, 10)
    .start()
  var laptop_view_defrente = new TWEEN.Tween(esto.rotation)
    .to({x: 0, y: 180.6, z: 0}, 10)
    .start()
  animate()
  primer_div.style.visibility = 'hidden'
  segundo_div.style.visibility = 'hidden'
  tecer_div.style.visibility = 'hidden'
  cuarto_div.style.visibility = 'hidden'
  quinto_div.style.visibility = 'hidden'
}
function laptop_pose_frontal() {
  var laptop_pose_defrente = new TWEEN.Tween(esto.rotation)
    .to({x: 0, y: 180.6, z: 0}, 1000)
    .start()
  animate()
}
//eventos camara de los botones de especificaciones
function camara_info_pantalla() {
  var normal_view_rotation = new TWEEN.Tween(camera.rotation)
    .to({x: 0, y: 0, z: 0}, 10)
    .start()
  var laptop_view_defrente = new TWEEN.Tween(esto.rotation)
    .to({x: 0, y: 180.6, z: 0}, 10)
    .start()
  var tweentarget_1 = new TWEEN.Tween(camera.position)
    .to({x: -10, y: 10, z: 20}, 1000)
    .start()
  animate()
  primer_div.style.visibility = 'visible'
  segundo_div.style.visibility = 'hidden'
  tecer_div.style.visibility = 'hidden'
  cuarto_div.style.visibility = 'hidden'
  quinto_div.style.visibility = 'hidden'
  if (measure_o.visible == true) {
    measure_o.visible = false //ocultar measure
  }
}
function camara_info_mouse_pad() {
  var mouse_pad_view = new TWEEN.Tween(camera.position)
    .to({x: 0, y: 10, z: 20}, 1000)
    .start()
  var mouse_pad_view_rotation = new TWEEN.Tween(camera.rotation)
    .to({x: -0.9, y: 0, z: 0}, 1000)
    .start() //x -0.65 y 0.04
  var laptop_pose_lateral = new TWEEN.Tween(esto.rotation)
    .to({x: 0, y: 180.2, z: 0}, 1000)
    .start()
  animate()
  primer_div.style.visibility = 'hidden'
  segundo_div.style.visibility = 'hidden'
  tecer_div.style.visibility = 'visible'
  cuarto_div.style.visibility = 'hidden'
  quinto_div.style.visibility = 'hidden'
  if (measure_o.visible == true) {
    measure_o.visible = false //ocultar measure
  }
}
function camara_info_wifi() {
  var rotacion_laptop_wifi = new TWEEN.Tween(esto.rotation)
    .to({x: -0.3, y: 0, z: 0}, 10)
    .start()
  var rotar_camara_wifi = new TWEEN.Tween(camera.rotation)
    .to({x: 0, y: 0, z: 0.02}, 1000)
    .start()
  var posicion_camara_wifi = new TWEEN.Tween(camera.position)
    .to({x: -9, y: 14, z: 18.7}, 1000)
    .start()
  animate()
  primer_div.style.visibility = 'hidden'
  segundo_div.style.visibility = 'visible'
  tecer_div.style.visibility = 'hidden'
  cuarto_div.style.visibility = 'hidden'
  quinto_div.style.visibility = 'hidden'
  if (measure_o.visible == true) {
    measure_o.visible = false //ocultar measure
  }
}
function camara_info_green_surrounding_bumper() {
  //volver a la vista normal del canvas cuando se da click en el camvas
  //canvas.addEventListener('click', vista_normal);
  var rotacion_laptop_surrounding = new TWEEN.Tween(esto.rotation)
    .to({x: -0.35, y: 3, z: 0}, 10)
    .start()
  var posicion_camara_surrounding = new TWEEN.Tween(camera.position)
    .to({x: 5, y: 3, z: 20}, 1000)
    .start()
  animate()
  primer_div.style.visibility = 'hidden'
  segundo_div.style.visibility = 'hidden'
  tecer_div.style.visibility = 'hidden'
  cuarto_div.style.visibility = 'hidden'
  quinto_div.style.visibility = 'visible'
  if (measure_o.visible == true) {
    measure_o.visible = false //ocultar measure
  }
}
function camara_info_handle() {
  var rotacion_laptop_handle = new TWEEN.Tween(esto.rotation)
    .to({x: 0, y: 40, z: 0}, 10)
    .start()
  var posicion_camara_handle = new TWEEN.Tween(camera.position)
    .to({x: -1, y: -1, z: 30}, 1000)
    .start()
  var rotacion_camara_handle = new TWEEN.Tween(camera.rotation)
    .to({x: -0.1, y: 0, z: 0}, 10)
    .start()
  animate()
  primer_div.style.visibility = 'hidden'
  segundo_div.style.visibility = 'hidden'
  tecer_div.style.visibility = 'hidden'
  cuarto_div.style.visibility = 'visible'
  quinto_div.style.visibility = 'hidden'
  if (measure_o.visible == true) {
    measure_o.visible = false //ocultar measure
  }
}
var contenedor_especificaciones = document.getElementById(
  'contenedor-especificaciones'
)
var primer_div = document.getElementById('screenlabel')
var segundo_div = document.getElementById('wifi')
var tecer_div = document.getElementById('track_pad')
var cuarto_div = document.getElementById('handle')
var quinto_div = document.getElementById('surrounding')
var primer_boton_especificaciones = document.getElementById('btn_screen')
var segundo_boton_especificaciones = document.getElementById('btn_wifi')
var tercer_boton_especificaciones = document.getElementById('btn_track_pad')
var cuarto_boton_especificaciones = document.getElementById('btn_handle')
var quinto_boton_especificaciones = document.getElementById('btn_surrounding')

//mostrar los 5 botones de las specs
var mostrar_especificaciones = false
function mostrar_opciones_especs() {
  var normal_view = new TWEEN.Tween(camera.position)
    .to({x: 0, y: 0, z: 40}, 1500)
    .start()
  var normal_view_rotation = new TWEEN.Tween(camera.rotation)
    .to({x: 0, y: 0, z: 0}, 10)
    .start()
  var laptop_view_defrente = new TWEEN.Tween(esto.rotation)
    .to({x: 0, y: 180.6, z: 0}, 10)
    .start()
  animate()
  if (mostrar_especificaciones == false) {
    contenedor_especificaciones.style.visibility = 'visible'
    btntablet.disabled = true
    btntablet.style.opacity = 0.5
    mostrar_especificaciones = true
  } else {
    mostrar_especificaciones = false
    btnspecs.disabled = true
    btnspecs.style.opacity = 0.5
    contenedor_especificaciones.style.visibility = 'hidden'
    btntablet.disabled = false
    btntablet.style.opacity = 1
    primer_div.style.visibility = 'hidden'
    segundo_div.style.visibility = 'hidden'
    tecer_div.style.visibility = 'hidden'
    cuarto_div.style.visibility = 'hidden'
    quinto_div.style.visibility = 'hidden'
  }
}
// primer_boton_especificaciones.addEventListener('click', camara_info_pantalla);
// segundo_boton_especificaciones.addEventListener('click', camara_info_mouse_pad);
// tercer_boton_especificaciones.addEventListener('click', camara_info_wifi);
// cuarto_boton_especificaciones.addEventListener('click', camara_info_handle);
// quinto_boton_especificaciones.addEventListener('click', camara_info_green_surrounding_bumper);
//orbit controls
const controls = new OrbitControls(camera, renderer.domElement)
//desahabilitar	botones
btncerrar.disabled = true
btntablet.disabled = true
btnspecs.disabled = true
btnmeasure.disabled = true
if (btncerrar.disabled == true) {
  btncerrar.style.opacity = 0.5
}
if (btntablet.disabled == true) {
  btntablet.style.opacity = 0.5
}
if (btnspecs.disabled == true) {
  btnspecs.style.opacity = 0.5
}
if (btnmeasure.disabled == true) {
  btnmeasure.style.opacity = 0.5
}

//eventos click de animaciones
btnabrir.addEventListener('click', abrirpantalla)
btncerrar.addEventListener('click', cerrarpantalla)
btntablet.addEventListener('click', modetablet)
btnmeasure.addEventListener('click', measure)
btnspecs.addEventListener('click', mostrar_opciones_especs)
botonar.addEventListener('click', ar)
//responsive
window.addEventListener('resize', onWindowResize)
function onWindowResize() {
  camera.aspect = box_canvas.clientWidth / box_canvas.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(box_canvas.clientWidth, box_canvas.clientHeight)
}

camera.position.z = 38
controls.update()

//luz ambiental
const luz_ambiental = new THREE.AmbientLight(0x404040, 3)
scene.add(luz_ambiental)
//imagen de fondo
var blanco = new THREE.Color(0xffffff)
const fondo = new THREE.TextureLoader().load('imagenes/fondo-gris.png')
//scene.background = blanco;
const animate = function () {
  requestAnimationFrame(animate)

  //const elapsed = clock.getElapsedTime();
  //esto.position.set( Math.sin( elapsed ) * 4, 0, 0 );
  var mixerUpdateDelta = clock.getDelta()
  mixer.update(mixerUpdateDelta)
  TWEEN.update()
  renderer.render(scene, camera)
  //renderdivs.render( scene, camera );
  //render_bottom.render(scene2, camera2);
}

animate()
