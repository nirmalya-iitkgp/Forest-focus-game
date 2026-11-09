import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SessionState } from '../types';
import { createForestMaterials, ForestMaterials } from './materials';
import {
  createFloatingIsland,
  createPineTree,
  createDeciduousTree,
  createBirchTree,
  createBlossomTree,
  createSprout,
  createMushroom,
  createBunnyModel,
  createFlower,
  AnimatedBunny,
} from './models';
import { createWeatherSystem, WeatherSystem } from './weather';
import { forestAudio } from './audio';
import { Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Sun, Moon, Sunset, Sunrise } from 'lucide-react';

interface ForestCanvasProps {
  growth: number;
  state: SessionState;
  scars: number;
  isWinter: boolean;
}

export type CameraPreset = 'overview' | 'bunny' | 'top';
export type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'night';

export const ForestCanvas: React.FC<ForestCanvasProps> = ({
  growth,
  state,
  scars,
  isWinter,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [isZenFullscreen, setIsZenFullscreen] = useState(false);
  const [interactiveNotice, setInteractiveNotice] = useState<string | null>(null);

  // References to preserve Three.js state across React re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const weatherRef = useRef<WeatherSystem | null>(null);
  const bunniesRef = useRef<AnimatedBunny[]>([]);
  const treesGroupRef = useRef<THREE.Group | null>(null);
  const islandGroupRef = useRef<THREE.Group | null>(null);
  const propsGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<ForestMaterials | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const focusRingRef = useRef<THREE.Mesh | null>(null);

  // State refs for animation loop
  const growthRef = useRef(growth);
  const stateRef = useRef(state);
  const scarsRef = useRef(scars);
  const isWinterRef = useRef(isWinter);
  const cameraPresetRef = useRef<CameraPreset>(cameraPreset);
  const timeOfDayRef = useRef<TimeOfDay>(timeOfDay);

  // Orbit rotation gesture refs
  const isDraggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.35, y: -0.6 });
  const currentRotationRef = useRef({ x: 0.35, y: -0.6 });

  // Camera targets
  const targetCamPosRef = useRef(new THREE.Vector3(0, 3.8, 6.2));
  const targetCamLookRef = useRef(new THREE.Vector3(0, 0.4, 0));
  const currentCamLookRef = useRef(new THREE.Vector3(0, 0.4, 0));

  growthRef.current = growth;
  stateRef.current = state;
  scarsRef.current = scars;
  isWinterRef.current = isWinter;
  cameraPresetRef.current = cameraPreset;
  timeOfDayRef.current = timeOfDay;

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    forestAudio.setMuted(next);
    forestAudio.toggleNatureAmbience(!next);
    if (!next) {
      forestAudio.playChime(1.2);
    }
  }, [isMuted]);

  // Adjust camera preset coordinates
  const selectPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    if (preset === 'overview') {
      targetCamPosRef.current.set(0, 3.8, 6.2);
      targetCamLookRef.current.set(0, 0.4, 0);
    } else if (preset === 'bunny') {
      targetCamPosRef.current.set(0.6, 1.2, 2.5);
      targetCamLookRef.current.set(0.2, 0.5, 0.2);
    } else if (preset === 'top') {
      targetCamPosRef.current.set(0, 7.5, 0.05);
      targetCamLookRef.current.set(0, 0, 0);
    }
    forestAudio.playChime(1.4);
  };

  // Rebuild the forest trees, props and island layout whenever growth or winter state updates
  const rebuildForestEcosystem = useCallback(() => {
    const scene = sceneRef.current;
    const materials = materialsRef.current;
    if (!scene || !materials) return;

    // 1. Rebuild or update Island
    if (islandGroupRef.current) {
      scene.remove(islandGroupRef.current);
    }
    const newIsland = createFloatingIsland(3.2, 2.2, materials, scarsRef.current, isWinterRef.current);
    islandGroupRef.current = newIsland;
    scene.add(newIsland);

    // 2. Rebuild Trees
    if (treesGroupRef.current) {
      scene.remove(treesGroupRef.current);
    }
    const treesGroup = new THREE.Group();
    treesGroupRef.current = treesGroup;
    scene.add(treesGroup);

    // 3. Rebuild Props (Mushrooms, flowers)
    if (propsGroupRef.current) {
      scene.remove(propsGroupRef.current);
    }
    const propsGroup = new THREE.Group();
    propsGroupRef.current = propsGroup;
    scene.add(propsGroup);

    // Tree positions distributed over the circular glade
    const treePositions = [
      { x: -1.4, z: -1.2, scale: 1.1, type: 'pine' },
      { x: -1.9, z: -0.3, scale: 0.95, type: 'deciduous' },
      { x: -0.8, z: -1.8, scale: 1.2, type: 'pine' },
      { x: 1.2, z: -1.5, scale: 1.05, type: 'birch' },
      { x: 1.8, z: -0.6, scale: 0.95, type: 'blossom' },
      { x: 0.2, z: -2.0, scale: 1.15, type: 'pine' },
      { x: -1.2, z: 1.2, scale: 0.85, type: 'birch' },
      { x: 1.5, z: 0.9, scale: 1.0, type: 'pine' },
      { x: -2.1, z: 0.8, scale: 0.9, type: 'pine' },
      { x: 2.1, z: -1.0, scale: 1.05, type: 'deciduous' },
    ];

    const currentGrowth = growthRef.current;

    // Sprout early stage (< 20%)
    if (currentGrowth > 0 && currentGrowth < 20) {
      const sprout = createSprout(materials);
      sprout.position.set(-0.2, 0, 0.4);
      treesGroup.add(sprout);
    }

    // Number of trees to display based on growth
    const totalTreesToShow = Math.floor((currentGrowth / 100) * treePositions.length);
    for (let i = 0; i < totalTreesToShow; i++) {
      const conf = treePositions[i];
      let tree: THREE.Group;
      if (conf.type === 'pine') {
        tree = createPineTree(conf.scale, materials, isWinterRef.current);
      } else if (conf.type === 'birch') {
        tree = createBirchTree(conf.scale, materials, isWinterRef.current);
      } else if (conf.type === 'blossom') {
        tree = createBlossomTree(conf.scale, materials, isWinterRef.current);
      } else {
        tree = createDeciduousTree(conf.scale, materials, isWinterRef.current);
      }
      tree.position.set(conf.x, 0, conf.z);
      tree.rotation.y = i * 0.9;
      treesGroup.add(tree);
    }

    // Mushrooms & Wildflowers
    if (currentGrowth >= 25 && !isWinterRef.current) {
      // 2 Red toadstools
      const shroom1 = createMushroom(materials, 1.1);
      shroom1.position.set(-0.9, 0, 0.3);
      propsGroup.add(shroom1);

      const shroom2 = createMushroom(materials, 0.8);
      shroom2.position.set(-1.1, 0, 0.5);
      propsGroup.add(shroom2);

      // Wildflowers
      const flowerColors = [0xf472b6, 0x60a5fa, 0xfbbf24, 0xa78bfa];
      for (let f = 0; f < 8; f++) {
        const flower = createFlower(materials, flowerColors[f % flowerColors.length]);
        const angle = f * 0.8;
        const rad = 1.0 + (f % 3) * 0.45;
        flower.position.set(Math.cos(angle) * rad, 0, Math.sin(angle) * rad);
        propsGroup.add(flower);
      }
    }

    // 4. Rebuild Bunnies
    bunniesRef.current.forEach((b) => scene.remove(b.group));
    bunniesRef.current = [];

    const bunnyCount = currentGrowth >= 70 ? 3 : currentGrowth >= 40 ? 2 : currentGrowth >= 10 ? 1 : 0;
    const bunnyConfigs: { breed: 'clover' | 'hazel' | 'pip'; x: number; z: number; rotY: number }[] = [
      { breed: 'clover', x: 0.3, z: 0.8, rotY: -0.4 },
      { breed: 'hazel', x: -0.6, z: 0.6, rotY: 0.5 },
      { breed: 'pip', x: 0.8, z: -0.2, rotY: -1.2 },
    ];

    for (let b = 0; b < bunnyCount; b++) {
      const conf = bunnyConfigs[b];
      const bunny = createBunnyModel(materials, conf.breed);
      bunny.group.position.set(conf.x, 0, conf.z);
      bunny.group.rotation.y = conf.rotY;
      bunny.currentPos.set(conf.x, 0, conf.z);
      bunny.targetPos.set(conf.x, 0, conf.z);
      bunniesRef.current.push(bunny);
      scene.add(bunny.group);
    }

    // 5. Focus Halo Ring on Meadow
    if (!focusRingRef.current) {
      const ringGeo = new THREE.RingGeometry(2.3, 2.38, 36);
      const ringMesh = new THREE.Mesh(ringGeo, materials.focusRingMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.02;
      focusRingRef.current = ringMesh;
      scene.add(ringMesh);
    }
  }, []);

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Guard (Per Skill Instruction)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 440;

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0xe8f5e9, 8, 22);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.copy(targetCamPosRef.current);
    camera.lookAt(targetCamLookRef.current);
    cameraRef.current = camera;

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Setup (Warm Key Light & Cool Fill)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x81c784, 0.75);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.6);
    keyLight.position.set(6, 9, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // 6. Materials & Weather
    const materials = createForestMaterials();
    materialsRef.current = materials;

    const weather = createWeatherSystem();
    weatherRef.current = weather;
    scene.add(weather.group);

    // Initial build
    rebuildForestEcosystem();

    // 7. Raycasting for Interaction (Click bunny / tree / mushroom)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      pointerStartRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = (clientX - pointerStartRef.current.x) * 0.006;
      const deltaY = (clientY - pointerStartRef.current.y) * 0.004;

      targetRotationRef.current.y += deltaX;
      targetRotationRef.current.x = THREE.MathUtils.clamp(
        targetRotationRef.current.x + deltaY,
        0.1,
        0.95
      );
      pointerStartRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = false;
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let current: THREE.Object3D | null = intersects[0].object;
        while (current && current !== scene) {
          if (current.userData && current.userData.type === 'bunny') {
            const hitBunny = current;
            bunniesRef.current.forEach((b) => {
              if (b.group === hitBunny) {
                b.triggerHop();
                forestAudio.playBunnyHop();
                if (weatherRef.current) {
                  weatherRef.current.triggerBurst(b.group.position, 0xf472b6);
                }
                setInteractiveNotice(`🐰 ${b.name} feels joyful! Your presence keeps the forest safe.`);
                setTimeout(() => setInteractiveNotice(null), 3200);
              }
            });
            break;
          } else if (current.userData && current.userData.type === 'mushroom') {
            forestAudio.playMushroomPop();
            const originalY = current.position.y;
            current.position.y = originalY + 0.12;
            setTimeout(() => {
              if (current) current.position.y = originalY;
            }, 180);
            if (weatherRef.current) {
              weatherRef.current.triggerBurst(current.position, 0xfde047);
            }
            setInteractiveNotice('🍄 You gently tapped a forest toadstool. A joyful chime echoes.');
            setTimeout(() => setInteractiveNotice(null), 3200);
            break;
          } else if (current.userData && current.userData.type === 'tree') {
            forestAudio.playRustle();
            const targetTree = current;
            const originalRot = targetTree.rotation.z;
            targetTree.rotation.z = originalRot + 0.08;
            setTimeout(() => {
              targetTree.rotation.z = originalRot;
            }, 250);
            if (weatherRef.current) {
              weatherRef.current.triggerBurst(targetTree.position, 0x86efac);
            }
            setInteractiveNotice(`🍃 ${targetTree.userData.name || 'Tree'} rustles gently in the morning breeze.`);
            setTimeout(() => setInteractiveNotice(null), 3200);
            break;
          }
          current = current.parent;
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 8. Animation & Render Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const syncState = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (syncState === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Smooth camera preset interpolation
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPosRef.current.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPosRef.current.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPosRef.current.z, 3.5, delta);

      currentCamLookRef.current.x = THREE.MathUtils.damp(currentCamLookRef.current.x, targetCamLookRef.current.x, 3.5, delta);
      currentCamLookRef.current.y = THREE.MathUtils.damp(currentCamLookRef.current.y, targetCamLookRef.current.y, 3.5, delta);
      currentCamLookRef.current.z = THREE.MathUtils.damp(currentCamLookRef.current.z, targetCamLookRef.current.z, 3.5, delta);
      camera.lookAt(currentCamLookRef.current);

      // Smooth Island Rotation gesture
      currentRotationRef.current.x = THREE.MathUtils.damp(
        currentRotationRef.current.x,
        targetRotationRef.current.x,
        6.0,
        delta
      );
      currentRotationRef.current.y = THREE.MathUtils.damp(
        currentRotationRef.current.y,
        targetRotationRef.current.y,
        6.0,
        delta
      );

      // Auto gentle idle orbit if not dragging and in overview mode
      if (!isDraggingRef.current && cameraPresetRef.current === 'overview') {
        targetRotationRef.current.y += delta * 0.08;
      }

      if (islandGroupRef.current) {
        islandGroupRef.current.rotation.y = currentRotationRef.current.y;
        islandGroupRef.current.rotation.x = (currentRotationRef.current.x - 0.35) * 0.3;
      }
      if (treesGroupRef.current) {
        treesGroupRef.current.rotation.y = currentRotationRef.current.y;
        treesGroupRef.current.rotation.x = (currentRotationRef.current.x - 0.35) * 0.3;
      }
      if (propsGroupRef.current) {
        propsGroupRef.current.rotation.y = currentRotationRef.current.y;
        propsGroupRef.current.rotation.x = (currentRotationRef.current.x - 0.35) * 0.3;
      }

      // Animate Bunnies (Hop, ear twitches, head tilt, and gentle wandering)
      bunniesRef.current.forEach((bunny, idx) => {
        bunny.leftEar.rotation.x = Math.sin(time * 3 + idx) * 0.12;
        bunny.rightEar.rotation.x = Math.cos(time * 2.8 + idx) * 0.12;
        bunny.head.rotation.y = Math.sin(time * 1.5 + idx) * 0.15;

        // Hopping physics
        if (bunny.targetHop > 0) {
          bunny.targetHop = THREE.MathUtils.damp(bunny.targetHop, 0, 5, delta);
          bunny.group.position.y = Math.sin(bunny.targetHop * Math.PI) * 0.45;
          bunny.body.scale.set(0.9, 1.15, 0.9);
        } else {
          // Subtle breathing bounce
          bunny.group.position.y = Math.sin(time * 2.5 + idx) * 0.03;
          bunny.body.scale.set(1.0, 1.0 + Math.sin(time * 2.5 + idx) * 0.02, 1.0);
        }
      });

      // Subtle Tree Breeze Sway
      if (treesGroupRef.current) {
        treesGroupRef.current.children.forEach((child, i) => {
          child.rotation.z = Math.sin(time * 1.2 + i) * 0.025;
        });
      }

      // Update Weather & Atmosphere
      if (weatherRef.current) {
        weatherRef.current.update(delta, stateRef.current, isWinterRef.current);
      }

      // Time of Day & State-responsive Lighting
      const curState = stateRef.current;
      const tod = timeOfDayRef.current;

      if (curState === SessionState.STORM) {
        if (hemiLightRef.current) hemiLightRef.current.intensity = 0.25;
        if (keyLightRef.current) keyLightRef.current.intensity = 0.4;
        if (scene.fog instanceof THREE.Fog) scene.fog.color.setHex(0x1e293b);
      } else if (curState === SessionState.BREAK) {
        if (hemiLightRef.current) hemiLightRef.current.intensity = 0.85;
        if (keyLightRef.current) {
          keyLightRef.current.intensity = 1.2;
          keyLightRef.current.color.setHex(0xfbcfe8);
        }
        if (scene.fog instanceof THREE.Fog) scene.fog.color.setHex(0xf3e8ff);
      } else if (isWinterRef.current) {
        if (hemiLightRef.current) hemiLightRef.current.intensity = 0.7;
        if (keyLightRef.current) {
          keyLightRef.current.intensity = 1.3;
          keyLightRef.current.color.setHex(0xe0f2fe);
        }
        if (scene.fog instanceof THREE.Fog) scene.fog.color.setHex(0xecfeff);
      } else {
        // Normal Day / Time of day control
        if (tod === 'dawn') {
          if (hemiLightRef.current) hemiLightRef.current.intensity = 0.8;
          if (keyLightRef.current) {
            keyLightRef.current.intensity = 1.4;
            keyLightRef.current.color.setHex(0xfed7aa); // warm peach
          }
          if (scene.fog instanceof THREE.Fog) scene.fog.color.setHex(0xffedd5);
        } else if (tod === 'sunset') {
          if (hemiLightRef.current) hemiLightRef.current.intensity = 0.75;
          if (keyLightRef.current) {
            keyLightRef.current.intensity = 1.3;
            keyLightRef.current.color.setHex(0xfb923c); // golden orange
          }
          if (scene.fog instanceof THREE.Fog) scene.fog.color.setHex(0xfdf2f8);
        } else if (tod === 'night') {
          if (hemiLightRef.current) hemiLightRef.current.intensity = 0.35;
          if (keyLightRef.current) {
            keyLightRef.current.intensity = 0.6;
            keyLightRef.current.color.setHex(0x93c5fd); // cool moonlight
          }
          if (scene.fog instanceof THREE.Fog) scene.fog.color.setHex(0x0f172a);
        } else {
          // 'day'
          if (hemiLightRef.current) hemiLightRef.current.intensity = 0.85;
          if (keyLightRef.current) {
            keyLightRef.current.intensity = 1.6;
            keyLightRef.current.color.setHex(0xfff7ed);
          }
          if (scene.fog instanceof THREE.Fog) scene.fog.color.setHex(0xe8f5e9);
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      if (isSoftwareGl) {
        clearTimeout(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
      }

      if (weatherRef.current) {
        weatherRef.current.dispose();
      }
      renderer.dispose();
      if (dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
    };
  }, []);

  // Update forest when growth, scars, or winter state changes
  useEffect(() => {
    rebuildForestEcosystem();
  }, [growth, scars, isWinter, rebuildForestEcosystem]);

  // Adjust container resize whenever entering or exiting fullscreen zen mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    }, 150);
    return () => clearTimeout(timer);
  }, [isZenFullscreen]);

  return (
    <div
      className={`relative w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-4 transition-all duration-500 select-none ${
        isZenFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none h-screen bg-slate-950'
          : 'h-[460px] border-emerald-100 bg-gradient-to-b from-sky-50 via-emerald-50/60 to-emerald-100/40'
      }`}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate the 3D ecosystem! Click on bunnies, mushrooms, or trees to interact."
      />

      {/* Floating Interaction Feedback Toast */}
      {interactiveNotice && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/95 text-emerald-900 border border-emerald-200 px-5 py-2.5 rounded-full text-xs font-bold shadow-xl animate-fade-in pointer-events-none flex items-center gap-2 z-40 max-w-sm text-center">
          <Sparkles className="w-4 h-4 text-emerald-500 animate-spin-slow shrink-0" />
          <span>{interactiveNotice}</span>
        </div>
      )}

      {/* Top Left State Pill */}
      <div className="absolute top-5 left-6 flex items-center gap-2 z-30">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl text-[11px] font-black text-emerald-950 shadow-md border border-emerald-100/80 flex items-center gap-2 uppercase tracking-wider">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              state === SessionState.STORM
                ? 'bg-rose-500 animate-pulse'
                : state === SessionState.BREAK
                ? 'bg-indigo-500'
                : state === SessionState.RECOVERY
                ? 'bg-amber-500'
                : isWinter
                ? 'bg-sky-400'
                : 'bg-emerald-500'
            }`}
          />
          <span>
            {state === SessionState.STORM
              ? 'Gentle Storm Rising'
              : state === SessionState.BREAK
              ? 'Restful Recess'
              : state === SessionState.RECOVERY
              ? 'Soil Recovery'
              : isWinter
              ? 'Winter Frost Mode'
              : state === SessionState.FOCUSING
              ? 'Ecosystem Flourishing'
              : 'Soil Ready to Grow'}
          </span>
        </div>
      </div>

      {/* Top Right Controls: Zen Mode & Time-of-Day */}
      <div className="absolute top-5 right-6 flex items-center gap-2 z-30">
        {/* Time of Day Mood Selector */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-2xl shadow-md border border-emerald-100">
          <button
            onClick={() => setTimeOfDay('dawn')}
            className={`p-1.5 rounded-xl transition-all ${
              timeOfDay === 'dawn' ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Dawn atmosphere"
          >
            <Sunrise className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay('day')}
            className={`p-1.5 rounded-xl transition-all ${
              timeOfDay === 'day' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Daylight atmosphere"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay('sunset')}
            className={`p-1.5 rounded-xl transition-all ${
              timeOfDay === 'sunset' ? 'bg-orange-100 text-orange-800' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Sunset golden hour"
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`p-1.5 rounded-xl transition-all ${
              timeOfDay === 'night' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Starry night atmosphere"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fullscreen Zen Mode Button */}
        <button
          onClick={() => setIsZenFullscreen(!isZenFullscreen)}
          className="p-2.5 bg-white/90 hover:bg-white text-emerald-800 rounded-2xl shadow-md border border-emerald-100 transition-all active:scale-95"
          title={isZenFullscreen ? 'Exit Zen Fullscreen' : 'Enter Zen Fullscreen'}
        >
          {isZenFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Floating 3D Control Bar (Camera views, Mute ambience) */}
      <div className="absolute bottom-5 inset-x-6 flex items-center justify-between pointer-events-none z-30">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl shadow-md border border-emerald-100 pointer-events-auto">
          <button
            onClick={() => selectPreset('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              cameraPreset === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => selectPreset('bunny')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              cameraPreset === 'bunny'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            🐰 Bunny Cam
          </button>
          <button
            onClick={() => selectPreset('top')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              cameraPreset === 'top'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            Zen Top-Down
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleMute}
            className="p-2.5 bg-white/90 hover:bg-white text-emerald-700 rounded-2xl shadow-md border border-emerald-100 transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-bold"
            title={isMuted ? 'Unmute forest audio ambience' : 'Mute audio ambience'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Ambience'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
