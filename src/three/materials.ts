import * as THREE from 'three';

// Procedural canvas texture for lush meadow grass
export function createGrassCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Lush multi-tone radial gradient
  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
  grad.addColorStop(0, '#66bb6a');
  grad.addColorStop(0.5, '#43a047');
  grad.addColorStop(1, '#2e7d32');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft moss speckles
  for (let i = 0; i < 700; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.5 ? '#81c784' : '#1b5e20';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft clover clusters
  for (let c = 0; c < 30; c++) {
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

// Procedural birch bark texture with dark lenticels
export function createBirchBarkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#1e293b';
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 256;
    const x = Math.random() * 200;
    const w = 12 + Math.random() * 24;
    const h = 2 + Math.random() * 3;
    ctx.fillRect(x, y, w, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural contact shadow texture
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export interface ForestMaterials {
  grass: THREE.MeshStandardMaterial;
  dirt: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  birchWood: THREE.MeshStandardMaterial;
  pineFoliage: THREE.MeshStandardMaterial;
  pineFoliageDeep: THREE.MeshStandardMaterial;
  deciduousFoliage: THREE.MeshStandardMaterial;
  blossomFoliage: THREE.MeshStandardMaterial;
  sprout: THREE.MeshStandardMaterial;
  bunnyFurWhite: THREE.MeshStandardMaterial;
  bunnyFurCaramel: THREE.MeshStandardMaterial;
  bunnyFurSlate: THREE.MeshStandardMaterial;
  bunnyPink: THREE.MeshStandardMaterial;
  bunnyEye: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  pathStone: THREE.MeshStandardMaterial;
  kintsugiGold: THREE.MeshStandardMaterial;
  flowerPetal: THREE.MeshStandardMaterial;
  flowerCenter: THREE.MeshStandardMaterial;
  mushroomCap: THREE.MeshStandardMaterial;
  mushroomStem: THREE.MeshStandardMaterial;
  focusRingMat: THREE.MeshBasicMaterial;
}

export function createForestMaterials(): ForestMaterials {
  const grassTexture = createGrassCanvasTexture();
  const birchTexture = createBirchBarkTexture();

  return {
    grass: new THREE.MeshStandardMaterial({
      map: grassTexture,
      roughness: 0.85,
      metalness: 0.05,
    }),
    dirt: new THREE.MeshStandardMaterial({
      color: 0x4a3525,
      roughness: 0.95,
      metalness: 0.0,
      flatShading: true,
    }),
    wood: new THREE.MeshStandardMaterial({
      color: 0x5d4037,
      roughness: 0.8,
      metalness: 0.02,
    }),
    birchWood: new THREE.MeshStandardMaterial({
      map: birchTexture,
      roughness: 0.75,
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
    blossomFoliage: new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.6,
      metalness: 0.05,
      flatShading: true,
    }),
    sprout: new THREE.MeshStandardMaterial({
      color: 0x81c784,
      roughness: 0.5,
      metalness: 0.1,
    }),
    bunnyFurWhite: new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.6,
      metalness: 0.02,
    }),
    bunnyFurCaramel: new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.65,
      metalness: 0.02,
    }),
    bunnyFurSlate: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6,
      metalness: 0.02,
    }),
    bunnyPink: new THREE.MeshStandardMaterial({
      color: 0xf48fb1,
      roughness: 0.8,
      metalness: 0.0,
    }),
    bunnyEye: new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.8,
    }),
    stone: new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    }),
    pathStone: new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    }),
    kintsugiGold: new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.25,
      metalness: 0.9,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
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
    mushroomCap: new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.4,
      metalness: 0.1,
      flatShading: true,
    }),
    mushroomStem: new THREE.MeshStandardMaterial({
      color: 0xfef2f2,
      roughness: 0.7,
      metalness: 0.0,
    }),
    focusRingMat: new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    }),
  };
}
