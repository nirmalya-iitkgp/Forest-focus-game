import * as THREE from 'three';
import { ForestMaterials } from './materials';

export interface AnimatedBunny {
  name: string;
  group: THREE.Group;
  leftEar: THREE.Group;
  rightEar: THREE.Group;
  head: THREE.Group;
  body: THREE.Mesh;
  baseY: number;
  hopPhase: number;
  targetHop: number;
  currentPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  isMoving: boolean;
  moveProgress: number;
  triggerHop: () => void;
}

// Procedural Pine Tree (3-12 parts: trunk, layered canopy tiers, snow/accent cap)
export function createPineTree(scale: number, materials: ForestMaterials, isWinter = false): THREE.Group {
  const tree = new THREE.Group();
  tree.userData = { type: 'tree', name: 'Evergreen Pine', interactive: true };

  // Trunk (bottom-center aligned)
  const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 0.8 * scale, 7);
  const trunk = new THREE.Mesh(trunkGeo, materials.wood);
  trunk.position.y = (0.8 * scale) / 2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  // 3 Layered foliage cones
  const foliageMat = isWinter ? materials.stone : materials.pineFoliage;
  const deepFoliageMat = isWinter ? materials.stone : materials.pineFoliageDeep;

  const tier1Geo = new THREE.ConeGeometry(0.85 * scale, 1.0 * scale, 7);
  const tier1 = new THREE.Mesh(tier1Geo, deepFoliageMat);
  tier1.position.y = 0.9 * scale;
  tier1.castShadow = true;
  tier1.receiveShadow = true;
  tree.add(tier1);

  const tier2Geo = new THREE.ConeGeometry(0.7 * scale, 0.9 * scale, 7);
  const tier2 = new THREE.Mesh(tier2Geo, foliageMat);
  tier2.position.y = 1.45 * scale;
  tier2.rotation.y = 0.4;
  tier2.castShadow = true;
  tier2.receiveShadow = true;
  tree.add(tier2);

  const tier3Geo = new THREE.ConeGeometry(0.52 * scale, 0.8 * scale, 7);
  const tier3 = new THREE.Mesh(tier3Geo, foliageMat);
  tier3.position.y = 1.95 * scale;
  tier3.rotation.y = 0.8;
  tier3.castShadow = true;
  tier3.receiveShadow = true;
  tree.add(tier3);

  // Top tip
  const tipGeo = new THREE.ConeGeometry(0.22 * scale, 0.4 * scale, 6);
  const tip = new THREE.Mesh(tipGeo, isWinter ? materials.bunnyFurWhite : foliageMat);
  tip.position.y = 2.4 * scale;
  tip.castShadow = true;
  tree.add(tip);

  return tree;
}

// Procedural Deciduous Oak Tree
export function createDeciduousTree(scale: number, materials: ForestMaterials, isWinter = false): THREE.Group {
  const tree = new THREE.Group();
  tree.userData = { type: 'tree', name: 'Lush Oak', interactive: true };

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.14 * scale, 0.22 * scale, 1.0 * scale, 8);
  const trunk = new THREE.Mesh(trunkGeo, materials.wood);
  trunk.position.y = (1.0 * scale) / 2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  // Clustered canopy puffs (3 parts)
  const foliageMat = isWinter ? materials.stone : materials.deciduousFoliage;

  const mainPuffGeo = new THREE.DodecahedronGeometry(0.75 * scale, 1);
  const mainPuff = new THREE.Mesh(mainPuffGeo, foliageMat);
  mainPuff.position.set(0, 1.45 * scale, 0);
  mainPuff.castShadow = true;
  mainPuff.receiveShadow = true;
  tree.add(mainPuff);

  const sidePuffGeo1 = new THREE.DodecahedronGeometry(0.55 * scale, 1);
  const sidePuff1 = new THREE.Mesh(sidePuffGeo1, foliageMat);
  sidePuff1.position.set(0.4 * scale, 1.3 * scale, 0.2 * scale);
  sidePuff1.castShadow = true;
  tree.add(sidePuff1);

  const sidePuffGeo2 = new THREE.DodecahedronGeometry(0.5 * scale, 1);
  const sidePuff2 = new THREE.Mesh(sidePuffGeo2, foliageMat);
  sidePuff2.position.set(-0.35 * scale, 1.55 * scale, -0.2 * scale);
  sidePuff2.castShadow = true;
  tree.add(sidePuff2);

  return tree;
}

// Procedural Birch Tree (with white bark and lenticels)
export function createBirchTree(scale: number, materials: ForestMaterials, isWinter = false): THREE.Group {
  const tree = new THREE.Group();
  tree.userData = { type: 'tree', name: 'White Birch', interactive: true };

  const trunkGeo = new THREE.CylinderGeometry(0.1 * scale, 0.16 * scale, 1.3 * scale, 8);
  const trunk = new THREE.Mesh(trunkGeo, materials.birchWood);
  trunk.position.y = (1.3 * scale) / 2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  const foliageMat = isWinter ? materials.stone : materials.deciduousFoliage;
  const puffGeo1 = new THREE.DodecahedronGeometry(0.6 * scale, 1);
  const puff1 = new THREE.Mesh(puffGeo1, foliageMat);
  puff1.position.set(0, 1.7 * scale, 0);
  puff1.castShadow = true;
  tree.add(puff1);

  const puffGeo2 = new THREE.DodecahedronGeometry(0.48 * scale, 1);
  const puff2 = new THREE.Mesh(puffGeo2, foliageMat);
  puff2.position.set(0.3 * scale, 1.4 * scale, -0.15 * scale);
  puff2.castShadow = true;
  tree.add(puff2);

  return tree;
}

// Procedural Flowering Blossom Tree
export function createBlossomTree(scale: number, materials: ForestMaterials, isWinter = false): THREE.Group {
  const tree = new THREE.Group();
  tree.userData = { type: 'tree', name: 'Blossom Tree', interactive: true };

  const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.19 * scale, 1.1 * scale, 8);
  const trunk = new THREE.Mesh(trunkGeo, materials.wood);
  trunk.position.y = (1.1 * scale) / 2;
  trunk.castShadow = true;
  tree.add(trunk);

  const foliageMat = isWinter ? materials.stone : materials.blossomFoliage;
  const puffGeo1 = new THREE.DodecahedronGeometry(0.7 * scale, 1);
  const puff1 = new THREE.Mesh(puffGeo1, foliageMat);
  puff1.position.set(0, 1.5 * scale, 0);
  puff1.castShadow = true;
  tree.add(puff1);

  const puffGeo2 = new THREE.DodecahedronGeometry(0.5 * scale, 1);
  const puff2 = new THREE.Mesh(puffGeo2, foliageMat);
  puff2.position.set(-0.35 * scale, 1.35 * scale, 0.2 * scale);
  puff2.castShadow = true;
  tree.add(puff2);

  return tree;
}

// Procedural Sprout for early growth
export function createSprout(materials: ForestMaterials): THREE.Group {
  const sprout = new THREE.Group();
  sprout.userData = { type: 'sprout', name: 'Seedling', interactive: true };

  const stemGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.3, 6);
  const stem = new THREE.Mesh(stemGeo, materials.sprout);
  stem.position.y = 0.15;
  stem.rotation.z = 0.1;
  stem.castShadow = true;
  sprout.add(stem);

  const leafGeo = new THREE.SphereGeometry(0.1, 6, 6);
  leafGeo.scale(1.8, 0.4, 0.9);
  const leaf1 = new THREE.Mesh(leafGeo, materials.sprout);
  leaf1.position.set(0.08, 0.28, 0);
  leaf1.rotation.set(0.2, 0, 0.5);
  leaf1.castShadow = true;
  sprout.add(leaf1);

  const leaf2 = new THREE.Mesh(leafGeo, materials.sprout);
  leaf2.position.set(-0.08, 0.26, 0);
  leaf2.rotation.set(-0.2, 0, -0.5);
  leaf2.castShadow = true;
  sprout.add(leaf2);

  return sprout;
}

// Procedural Cute Red Mushroom with White Dots
export function createMushroom(materials: ForestMaterials, scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.userData = { type: 'mushroom', name: 'Forest Toadstool', interactive: true };

  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.06 * scale, 0.09 * scale, 0.28 * scale, 8);
  const stem = new THREE.Mesh(stemGeo, materials.mushroomStem);
  stem.position.y = (0.28 * scale) / 2;
  stem.castShadow = true;
  group.add(stem);

  // Red Cap
  const capGeo = new THREE.SphereGeometry(0.18 * scale, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const cap = new THREE.Mesh(capGeo, materials.mushroomCap);
  cap.position.y = 0.26 * scale;
  cap.castShadow = true;
  group.add(cap);

  // 3 White Dots
  const dotGeo = new THREE.SphereGeometry(0.03 * scale, 4, 4);
  const dotMat = materials.bunnyFurWhite;
  for (let i = 0; i < 4; i++) {
    const dot = new THREE.Mesh(dotGeo, dotMat);
    const angle = (i * Math.PI * 2) / 4;
    dot.position.set(
      Math.cos(angle) * (0.11 * scale),
      0.34 * scale,
      Math.sin(angle) * (0.11 * scale)
    );
    group.add(dot);
  }

  return group;
}

// Procedural Bunny with Breed / Skin Palette
export function createBunnyModel(
  materials: ForestMaterials,
  breed: 'clover' | 'hazel' | 'pip' = 'clover'
): AnimatedBunny {
  const root = new THREE.Group();
  const name = breed === 'clover' ? 'Clover' : breed === 'hazel' ? 'Hazel' : 'Pip';
  root.userData = { type: 'bunny', name, breed, interactive: true };

  const furMaterial =
    breed === 'clover'
      ? materials.bunnyFurWhite
      : breed === 'hazel'
      ? materials.bunnyFurCaramel
      : materials.bunnyFurSlate;

  // Body
  const bodyGeo = new THREE.SphereGeometry(0.35, 12, 10);
  bodyGeo.scale(0.9, 1.0, 1.15);
  const body = new THREE.Mesh(bodyGeo, furMaterial);
  body.position.set(0, 0.35, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  root.add(body);

  // Fluffy Tail
  const tailGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const tail = new THREE.Mesh(tailGeo, materials.bunnyFurWhite);
  tail.position.set(0, 0.28, -0.42);
  tail.castShadow = true;
  root.add(tail);

  // Front Paws
  const pawGeo = new THREE.SphereGeometry(0.08, 8, 8);
  pawGeo.scale(0.8, 0.6, 1.2);
  const pawL = new THREE.Mesh(pawGeo, furMaterial);
  pawL.position.set(-0.16, 0.08, 0.25);
  root.add(pawL);

  const pawR = new THREE.Mesh(pawGeo, furMaterial);
  pawR.position.set(0.16, 0.08, 0.25);
  root.add(pawR);

  // Hind Feet
  const footGeo = new THREE.SphereGeometry(0.11, 8, 8);
  footGeo.scale(0.9, 0.5, 1.4);
  const footL = new THREE.Mesh(footGeo, furMaterial);
  footL.position.set(-0.26, 0.06, -0.1);
  root.add(footL);

  const footR = new THREE.Mesh(footGeo, furMaterial);
  footR.position.set(0.26, 0.06, -0.1);
  root.add(footR);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.62, 0.22);
  root.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.26, 12, 10);
  headGeo.scale(1.0, 0.95, 1.05);
  const head = new THREE.Mesh(headGeo, furMaterial);
  head.castShadow = true;
  headGroup.add(head);

  // Snout
  const snoutGeo = new THREE.SphereGeometry(0.11, 8, 8);
  snoutGeo.scale(1.2, 0.9, 1.1);
  const snout = new THREE.Mesh(snoutGeo, furMaterial);
  snout.position.set(0, -0.05, 0.2);
  headGroup.add(snout);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.04, 6, 6);
  const nose = new THREE.Mesh(noseGeo, materials.bunnyPink);
  nose.position.set(0, -0.02, 0.31);
  headGroup.add(nose);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const eyeL = new THREE.Mesh(eyeGeo, materials.bunnyEye);
  eyeL.position.set(-0.14, 0.06, 0.2);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, materials.bunnyEye);
  eyeR.position.set(0.14, 0.06, 0.2);
  headGroup.add(eyeR);

  // Ears
  const earOuterGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.38, 7);
  earOuterGeo.scale(1.0, 1.0, 0.5);
  const earInnerGeo = new THREE.CylinderGeometry(0.025, 0.045, 0.34, 6);
  earInnerGeo.scale(1.0, 1.0, 0.3);

  // Left Ear
  const leftEar = new THREE.Group();
  leftEar.position.set(-0.1, 0.22, -0.02);
  const lOuter = new THREE.Mesh(earOuterGeo, furMaterial);
  lOuter.position.y = 0.19;
  lOuter.castShadow = true;
  const lInner = new THREE.Mesh(earInnerGeo, materials.bunnyPink);
  lInner.position.set(0, 0.19, 0.02);
  leftEar.add(lOuter);
  leftEar.add(lInner);
  leftEar.rotation.z = -0.15;
  headGroup.add(leftEar);

  // Right Ear
  const rightEar = new THREE.Group();
  rightEar.position.set(0.1, 0.22, -0.02);
  const rOuter = new THREE.Mesh(earOuterGeo, furMaterial);
  rOuter.position.y = 0.19;
  rOuter.castShadow = true;
  const rInner = new THREE.Mesh(earInnerGeo, materials.bunnyPink);
  rInner.position.set(0, 0.19, 0.02);
  rightEar.add(rOuter);
  rightEar.add(rInner);
  rightEar.rotation.z = 0.15;
  headGroup.add(rightEar);

  // Pip gets a tiny flower crown or head petal
  if (breed === 'pip') {
    const flowerCrown = createFlower(materials, 0xfde047);
    flowerCrown.scale.set(0.5, 0.5, 0.5);
    flowerCrown.position.set(0, 0.26, 0.06);
    headGroup.add(flowerCrown);
  }

  let targetHop = 0;

  return {
    name,
    group: root,
    leftEar,
    rightEar,
    head: headGroup,
    body,
    baseY: 0,
    hopPhase: Math.random() * Math.PI * 2,
    targetHop,
    currentPos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(),
    isMoving: false,
    moveProgress: 0,
    triggerHop: () => {
      targetHop = 1.0;
    },
  };
}

// Procedural Wildflower
export function createFlower(materials: ForestMaterials, petalColor?: number): THREE.Group {
  const flower = new THREE.Group();
  flower.userData = { type: 'flower', name: 'Meadow Wildflower', interactive: true };

  const stemGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.2, 5);
  const stem = new THREE.Mesh(stemGeo, materials.sprout);
  stem.position.y = 0.1;
  flower.add(stem);

  const petalMat = petalColor ? materials.flowerPetal.clone() : materials.flowerPetal;
  if (petalColor && 'color' in petalMat) {
    petalMat.color.setHex(petalColor);
  }

  const centerGeo = new THREE.SphereGeometry(0.04, 6, 6);
  const center = new THREE.Mesh(centerGeo, materials.flowerCenter);
  center.position.y = 0.2;
  flower.add(center);

  const petalGeo = new THREE.SphereGeometry(0.04, 6, 6);
  petalGeo.scale(1.2, 0.4, 0.8);
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(petalGeo, petalMat);
    const angle = (i * Math.PI * 2) / 5;
    p.position.set(Math.cos(angle) * 0.06, 0.2, Math.sin(angle) * 0.06);
    flower.add(p);
  }

  return flower;
}

// Procedural Floating Island with Rolling Meadow, Stepping Stones, and Resilience Scars
export function createFloatingIsland(
  radius: number,
  height: number,
  materials: ForestMaterials,
  scars: number,
  isWinter = false
): THREE.Group {
  const island = new THREE.Group();

  // Top Meadow Disc
  const topGeo = new THREE.CylinderGeometry(radius, radius * 1.06, 0.45, 28);
  const topMesh = new THREE.Mesh(topGeo, isWinter ? materials.stone : materials.grass);
  topMesh.position.y = -0.22;
  topMesh.receiveShadow = true;
  island.add(topMesh);

  // Central Gentle Hill mound for terrain variation
  const hillGeo = new THREE.SphereGeometry(1.4, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.35);
  hillGeo.scale(1.2, 0.28, 1.1);
  const hillMesh = new THREE.Mesh(hillGeo, isWinter ? materials.stone : materials.grass);
  hillMesh.position.set(-0.2, 0.0, -0.4);
  hillMesh.receiveShadow = true;
  island.add(hillMesh);

  // Stepping Stone Path across the clearing
  const pathPositions = [
    { x: -0.2, z: 0.9, r: 0.16 },
    { x: 0.1, z: 0.6, r: 0.14 },
    { x: 0.35, z: 0.3, r: 0.18 },
    { x: 0.6, z: 0.05, r: 0.15 },
    { x: 0.75, z: -0.25, r: 0.17 },
  ];
  pathPositions.forEach((stoneData, idx) => {
    const stoneGeo = new THREE.CylinderGeometry(stoneData.r, stoneData.r * 1.1, 0.04, 7);
    const stoneMesh = new THREE.Mesh(stoneGeo, materials.pathStone);
    stoneMesh.position.set(stoneData.x, 0.02, stoneData.z);
    stoneMesh.rotation.y = idx * 0.7;
    stoneMesh.receiveShadow = true;
    island.add(stoneMesh);
  });

  // Sub-surface cliff / stratified soil cone
  const cliffGeo = new THREE.ConeGeometry(radius * 1.06, height, 18);
  const cliffMesh = new THREE.Mesh(cliffGeo, materials.dirt);
  cliffMesh.rotation.x = Math.PI;
  cliffMesh.position.y = -(height / 2) - 0.45;
  cliffMesh.receiveShadow = true;
  island.add(cliffMesh);

  // Hanging crystal / root tip at the bottom of the island
  const rootTipGeo = new THREE.ConeGeometry(0.35, 0.8, 6);
  const rootTip = new THREE.Mesh(rootTipGeo, materials.dirt);
  rootTip.rotation.x = Math.PI;
  rootTip.position.y = -height - 0.45;
  island.add(rootTip);

  // Mossy rocks around edges
  const stoneAngles = [0.3, 1.5, 2.7, 3.8, 5.1];
  stoneAngles.forEach((angle, idx) => {
    const stoneGeo = new THREE.DodecahedronGeometry(0.24 + (idx % 3) * 0.09, 0);
    const stone = new THREE.Mesh(stoneGeo, materials.stone);
    const r = radius * 0.88;
    stone.position.set(Math.cos(angle) * r, 0.06, Math.sin(angle) * r);
    stone.rotation.set(idx * 0.4, idx * 0.9, 0);
    stone.castShadow = true;
    stone.receiveShadow = true;
    island.add(stone);
  });

  // Resilience Scars: Kintsugi-inspired golden glowing fissures
  if (scars > 0) {
    const scarCount = Math.min(scars, 12);
    for (let s = 0; s < scarCount; s++) {
      const startAngle = s * 2.3;
      const dist = radius * 0.25 + ((s * 0.45) % (radius * 0.45));
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(startAngle) * dist, 0.03, Math.sin(startAngle) * dist),
        new THREE.Vector3(
          Math.cos(startAngle + 0.3) * (dist + 0.35),
          0.03,
          Math.sin(startAngle + 0.3) * (dist + 0.35)
        ),
        new THREE.Vector3(
          Math.cos(startAngle + 0.5) * (dist + 0.75),
          0.03,
          Math.sin(startAngle + 0.5) * (dist + 0.75)
        ),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 8, 0.038, 5, false);
      const vein = new THREE.Mesh(tubeGeo, materials.kintsugiGold);
      island.add(vein);
    }
  }

  return island;
}
