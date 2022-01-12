import React, { Component } from 'react';
import styles from './index.css';
import * as THREE from 'three';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
			void main() {
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_PointSize = scale * ( 30.0 / - mvPosition.z );
				gl_Position = projectionMatrix * mvPosition;
			}
      `,
      fragmentShader: `
			uniform vec3 color;
			void main() {
				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
				gl_FragColor = vec4( color, 1.0 );
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

        positions[ i + 1 ] = (( Math.sin( ( ix + count ) * 0.1 ) * 5 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 15 )) / 50;
        scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 2 +
                ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;
        i += 3;
        j ++;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;
    count += 0.02;
  }
  initControls(){
    const controls = this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = - 1.0;
    controls.enableDamping = true;
  }
  initWebGLLayer(){
    const scene = this.scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x505050 );
    const camera = this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.set( 0, 1.6, 3 );

    // this.initWebGLMeshes();
    this.initParticles();

    const renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.autoClear = false;
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
    this.updateParticles();
    this.controls.update();
    this.renderer.render( this.scene, this.camera );
  }
  componentDidMount(){
    this.initWebGLLayer();
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
