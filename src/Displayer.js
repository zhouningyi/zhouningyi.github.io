import React, { Component } from 'react';
import styles from './index.css';
import * as THREE from 'three';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ppt_config from './ppt_config.json';

 function getStyles(props, state) {
   const center = {
    position: 'absolute',
    left: '0%',
    top:  '0%',
    width: '100%',
    height:  '100%',
   };
  return {
    main: {
      ...center,
      background: 'linear-gradient(358.7deg, rgb(42, 136, 157) 1.7%, rgb(122, 197, 214) 51.1%, rgb(211, 232, 242) 95.5%)'
    }
  };
}

let count = 0;

class DisplayLayer extends Component {
  constructor(){
    super();
    this.state = {};
  }
  _getStyles(){
    return getStyles(this.props, this.state);
  }
  initController(){
    const { renderer, scene } = this;
    const controllerModelFactory = new XRControllerModelFactory();

    const controller1 = this.controller1 = renderer.xr.getControllerGrip( 0 );
    controller1.add( controllerModelFactory.createControllerModel( controller1 ) );
    scene.add( controller1 );

    const controller2 = this.controller2 = renderer.xr.getControllerGrip( 1 );
    controller2.add( controllerModelFactory.createControllerModel( controller2 ) );
    scene.add( controller2 );
  }
  reset(){
    this.setPPTIndex(0);
  }
  setPPTIndex(index = 0){
    this.ppt_index = index;
    if (this.mesh){
      const l = ppt_config[index];
      if (l && l.texture){
        console.log(l.texture, 'l.texture...');
        this.mesh.material = new THREE.MeshBasicMaterial( { color: 0xffccaa, map: l.texture } );
      }
    } else {
      setTimeout(() => this.setPPTIndex(index), 200);
    }
  }
  initWebGLMeshes(){
    const room = new THREE.LineSegments(
      new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
      new THREE.LineBasicMaterial( { color: 0x808080 } )
    );
    room.geometry.translate( 0, 3, 0 );
    this.scene.add( room );
  }
  initParticles(){
    const SEPARATION = 0.2;
    const AMOUNTX = this.AMOUNTX = 50;
    const AMOUNTY = this.AMOUNTY = 50;
    const numParticles = AMOUNTX * AMOUNTY;

    const positions = new Float32Array( numParticles * 3 );
    const scales = new Float32Array( numParticles );
    let i = 0, j = 0;
    for ( let ix = 0; ix < AMOUNTX; ix ++ ) {
      for ( let iy = 0; iy < AMOUNTY; iy ++ ) {
        positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
        positions[ i + 1 ] = 0; // y
        positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z
        scales[ j ] = 1;
        i += 3;
        j ++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );
    const material = new THREE.ShaderMaterial( {
      uniforms: {
        color: { value: new THREE.Color( 0xffffff ) },
      },
      vertexShader: `
			attribute float scale;
      varying float _scale;
			void main() {
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        _scale = scale;
				gl_PointSize = scale * ( 30.0 / - mvPosition.z );
				gl_Position = projectionMatrix * mvPosition;
			}
      `,
      fragmentShader: `
			uniform vec3 color;
      varying float _scale;
			void main() {
				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
				gl_FragColor = vec4( 1.0, 1.0, 0.1, 0.02 );
			}
      `
    } );
    const particles = this.particles = new THREE.Points( geometry, material );
    this.scene.add( particles );
  }
  updateParticles(){
    const { particles, AMOUNTX, AMOUNTY } = this;
    const positions = particles.geometry.attributes.position.array;
    const scales = particles.geometry.attributes.scale.array;

    let i = 0, j = 0;

    for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

      for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

        positions[ i + 1 ] = (
           Math.sin( ( ix + count ) * 0.1 ) * 2 + 
           Math.sin( ( iy + count ) * 0.5 ) * 4 +
           Math.sin( ( iy + count ) * 0.8 ) * 8
          ) / 10;
        scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 0.5 +
                ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 0.5;
        i += 3;
        j ++;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;
    count += 0.01;
  }
  initScreen(){
    const scale = 3 / 1000;
    const geom_width = 1024;
    const geom_height = 768;
    const geometry = new THREE.PlaneGeometry(geom_width, geom_height);
    const material = this.genScreenMat();
    // const material = new THREE.MeshBasicMaterial({color: '#f00'});

    const mesh = this.mesh = new THREE.Mesh( geometry, material );
    // mesh.rotation.x = - Math.PI / 2;
    mesh.scale.set( scale, scale, scale );
    mesh.position.set(0, geom_height * scale / 2, 0);
    this.scene.add( mesh );
    // const mesh = 
  }
  genScreenMat(){
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#444444";
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
    //
    const texture = new THREE.CanvasTexture( canvas );
    texture.repeat.set( 1, 1 );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
  }
  async _loadPPT(l){
    const texture = l.texture = new THREE.TextureLoader().load(l.url, () => {
      texture.needsUpdate = true;
    });
  }
  async loadPPT(){
    const tasks = [];
    for (const l of ppt_config) tasks.push(this._loadPPT(l));
    await Promise.all(tasks);
  }
  updateScreen(){
  }
  initControls(){
    const controls = this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = - 1.0;
    controls.enableDamping = true;
  }
  initWebGLLayer(){
    const scene = this.scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1500, 4000 );
    // scene.background = new THREE.Vector4( 0,0,222,0 );
    scene.transparent = true;
    const camera = this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.set( 0, 1.6, 3 );

    // this.initWebGLMeshes();
    this.initParticles();
    this.initScreen();

    const renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    //
    this.initControls();
    this.node.appendChild(renderer.domElement );
    this.node.appendChild( VRButton.createButton( renderer ) );
  }
  animate(){
    this.renderer.setAnimationLoop( this.renderScene );
  }
  renderScene = () => {
    // this.updateParticles();
    this.updateScreen();
    this.controls.update();
    this.renderer.render( this.scene, this.camera );
  }
  componentDidMount(){
    this.initWebGLLayer();
    this.loadPPT();
    this.reset();
    this.animate();
  }
  render (){
    const styles = this._getStyles();
    return (
      <div ref={r => (this.node = r)} style={styles.main}>
      </div>
    );
  }
}


export default DisplayLayer;
