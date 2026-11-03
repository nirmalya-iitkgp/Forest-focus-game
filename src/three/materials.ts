import * as THREE from 'three';

// Helper to create a procedural canvas texture for the grassy ground
export function createGrassCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base lush grass gradient
  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  grad.addColorStop(0, '#5cb85c');
  grad.addColorStop(0.6, '#388e3c');
  grad.addColorStop(1, '#2e7d32');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft moss speckles
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 2.5;
    ctx.fillStyle = Math.random() > 0.5 ? '#81c784' : '#1b5e20';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft clover patches
  for (let c = 0; c < 25; c++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    ctx.fillStyle = '#a5d6a7';
    for (let p = 0; p < 3; p++) {
      const angle = (p * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * 3, cy + Math.sin(angle) * 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural snow blanket texture for winter mode
export function createSnowCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.8, '#e0f2fe');
  grad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle sparkle flecks
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Material palette for procedural island & actors
export interface ForestMaterials {
  grass: THREE.MeshStandardMaterial;
  dirt: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  pineFoliage: THREE.MeshStandardMaterial;
  pineFoliageDeep: THREE.MeshStandardMaterial;
  deciduousFoliage: THREE.MeshStandardMaterial;
  sprout: THREE.MeshStandardMaterial;
  bunnyFur: THREE.MeshStandardMaterial;
  bunnyPink: THREE.MeshStandardMaterial;
  bunnyEye: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  kintsugiGold: THREE.MeshStandardMaterial;
  flowerPetal: THREE.MeshStandardMaterial;
  flowerCenter: THREE.MeshStandardMaterial;
}

export function createForestMaterials(): ForestMaterials {
  const grassTexture = createGrassCanvasTexture();

  return {
    grass: new THREE.MeshStandardMaterial({
      map: grassTexture,
      roughness: 0.85,
      metalness: 0.05,
    }),
    dirt: new THREE.MeshStandardMaterial({
      color: 0x5d4037,
      roughness: 0.95,
      metalness: 0.0,
    }),
    wood: new THREE.MeshStandardMaterial({
      color: 0x6d4c41,
      roughness: 0.8,
      metalness: 0.02,
    }),
    pineFoliage: new THREE.MeshStandardMaterial({
      color: 0x2e7d32,
      roughness: 0.7,
      metalness: 0.05,
      flatShading: true,
    }),
    pineFoliageDeep: new THREE.MeshStandardMaterial({
      color: 0x1b5e20,
      roughness: 0.75,
      metalness: 0.05,
      flatShading: true,
    }),
    deciduousFoliage: new THREE.MeshStandardMaterial({
      color: 0x4caf50,
      roughness: 0.65,
      metalness: 0.05,
      flatShading: true,
    }),
    sprout: new THREE.MeshStandardMaterial({
      color: 0x81c784,
      roughness: 0.5,
      metalness: 0.1,
    }),
    bunnyFur: new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.6,
      metalness: 0.02,
    }),
    bunnyPink: new THREE.MeshStandardMaterial({
      color: 0xf48fb1,
      roughness: 0.8,
      metalness: 0.0,
    }),
    bunnyEye: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.1,
      metalness: 0.4,
    }),
    stone: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    }),
    kintsugiGold: new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.25,
      metalness: 0.9,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
    }),
    flowerPetal: new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.6,
      metalness: 0.05,
    }),
    flowerCenter: new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.4,
      metalness: 0.1,
    }),
  };
}
