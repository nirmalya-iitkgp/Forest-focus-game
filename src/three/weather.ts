import * as THREE from 'three';
import { SessionState } from '../types';

export interface WeatherSystem {
  group: THREE.Group;
  update: (delta: number, state: SessionState, isWinter: boolean) => void;
  triggerBurst: (position: THREE.Vector3, colorHex?: number) => void;
  dispose: () => void;
}

export function createWeatherSystem(): WeatherSystem {
  const group = new THREE.Group();

  // 1. Rain Particles (Storm)
  const rainCount = 450;
  const rainGeo = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    rainPositions[i * 3] = (Math.random() - 0.5) * 16;
    rainPositions[i * 3 + 1] = Math.random() * 10;
    rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  const rainMat = new THREE.PointsMaterial({
    color: 0x93c5fd,
    size: 0.08,
    transparent: true,
    opacity: 0.65,
  });
  const rainPoints = new THREE.Points(rainGeo, rainMat);
  rainPoints.visible = false;
  group.add(rainPoints);

  // 2. Snow Particles (Winter)
  const snowCount = 400;
  const snowGeo = new THREE.BufferGeometry();
  const snowPositions = new Float32Array(snowCount * 3);
  for (let i = 0; i < snowCount; i++) {
    snowPositions[i * 3] = (Math.random() - 0.5) * 14;
    snowPositions[i * 3 + 1] = Math.random() * 8;
    snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
  const snowMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.09,
    transparent: true,
    opacity: 0.85,
  });
  const snowPoints = new THREE.Points(snowGeo, snowMat);
  snowPoints.visible = false;
  group.add(snowPoints);

  // 3. Spores & Pollen (Focus & Break)
  const sporeCount = 70;
  const sporeGeo = new THREE.BufferGeometry();
  const sporePositions = new Float32Array(sporeCount * 3);
  for (let i = 0; i < sporeCount; i++) {
    sporePositions[i * 3] = (Math.random() - 0.5) * 8;
    sporePositions[i * 3 + 1] = 0.2 + Math.random() * 3.5;
    sporePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePositions, 3));
  const sporeMat = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.12,
    transparent: true,
    opacity: 0.75,
  });
  const sporePoints = new THREE.Points(sporeGeo, sporeMat);
  group.add(sporePoints);

  // 4. Stylized Storm Clouds Group
  const cloudsGroup = new THREE.Group();
  cloudsGroup.position.set(0, 5, 0);
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true,
    transparent: true,
    opacity: 0.85,
  });

  for (let c = 0; c < 5; c++) {
    const cloudCluster = new THREE.Group();
    const angle = (c * Math.PI * 2) / 5;
    const r = 2.5 + Math.random();
    cloudCluster.position.set(Math.cos(angle) * r, Math.sin(c) * 0.4, Math.sin(angle) * r);
    for (let p = 0; p < 4; p++) {
      const puffGeo = new THREE.DodecahedronGeometry(0.7 + Math.random() * 0.4, 1);
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      puff.position.set((p - 1.5) * 0.45, Math.random() * 0.2, (Math.random() - 0.5) * 0.5);
      cloudCluster.add(puff);
    }
    cloudsGroup.add(cloudCluster);
  }
  cloudsGroup.visible = false;
  group.add(cloudsGroup);

  // 5. Interactive Particle Burst Pool (hearts & sparkles on click)
  const burstCount = 25;
  const burstGeo = new THREE.BufferGeometry();
  const burstPositions = new Float32Array(burstCount * 3);
  const burstVelocities = new Float32Array(burstCount * 3);
  burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
  const burstMat = new THREE.PointsMaterial({
    color: 0xf472b6,
    size: 0.15,
    transparent: true,
    opacity: 0.0,
  });
  const burstPoints = new THREE.Points(burstGeo, burstMat);
  group.add(burstPoints);
  let burstLife = 0;

  const triggerBurst = (position: THREE.Vector3, colorHex = 0xf472b6) => {
    burstMat.color.setHex(colorHex);
    burstLife = 1.0;
    const pos = burstGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < burstCount; i++) {
      pos[i * 3] = position.x;
      pos[i * 3 + 1] = position.y + 0.3;
      pos[i * 3 + 2] = position.z;

      burstVelocities[i * 3] = (Math.random() - 0.5) * 1.5;
      burstVelocities[i * 3 + 1] = 0.8 + Math.random() * 1.2;
      burstVelocities[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    burstGeo.attributes.position.needsUpdate = true;
  };

  let time = 0;

  const update = (delta: number, state: SessionState, isWinter: boolean) => {
    time += delta;
    const isStorm = state === SessionState.STORM;

    rainPoints.visible = isStorm;
    cloudsGroup.visible = isStorm;
    snowPoints.visible = isWinter && !isStorm;
    sporePoints.visible = !isStorm;

    // Rain
    if (isStorm) {
      cloudsGroup.rotation.y += delta * 0.15;
      const pos = rainGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        pos[i * 3 + 1] -= delta * 15;
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 8 + Math.random() * 2;
        }
      }
      rainGeo.attributes.position.needsUpdate = true;
    }

    // Snow
    if (snowPoints.visible) {
      const pos = snowGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        pos[i * 3 + 1] -= delta * 1.5;
        pos[i * 3] += Math.sin(time + i) * 0.005;
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 7 + Math.random() * 2;
        }
      }
      snowGeo.attributes.position.needsUpdate = true;
    }

    // Spores / Fireflies
    if (sporePoints.visible) {
      const isBreak = state === SessionState.BREAK;
      sporeMat.color.setHex(isBreak ? 0xa78bfa : 0xfde047);
      const pos = sporeGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < sporeCount; i++) {
        pos[i * 3 + 1] += Math.sin(time * 2 + i) * 0.006;
        pos[i * 3] += Math.cos(time + i) * 0.004;
      }
      sporeGeo.attributes.position.needsUpdate = true;
    }

    // Burst particles
    if (burstLife > 0) {
      burstLife -= delta * 1.5;
      burstMat.opacity = Math.max(burstLife, 0);
      const pos = burstGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < burstCount; i++) {
        pos[i * 3] += burstVelocities[i * 3] * delta;
        pos[i * 3 + 1] += burstVelocities[i * 3 + 1] * delta;
        pos[i * 3 + 2] += burstVelocities[i * 3 + 2] * delta;
        burstVelocities[i * 3 + 1] -= delta * 1.5; // gravity
      }
      burstGeo.attributes.position.needsUpdate = true;
    } else {
      burstMat.opacity = 0;
    }
  };

  const dispose = () => {
    rainGeo.dispose();
    rainMat.dispose();
    snowGeo.dispose();
    snowMat.dispose();
    sporeGeo.dispose();
    sporeMat.dispose();
    burstGeo.dispose();
    burstMat.dispose();
    cloudMat.dispose();
  };

  return { group, update, triggerBurst, dispose };
}
