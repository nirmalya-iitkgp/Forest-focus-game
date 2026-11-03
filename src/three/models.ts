import * as THREE from 'three';
import { ForestMaterials } from './materials';

export interface AnimatedBunny {
  group: THREE.Group;
  leftEar: THREE.Group;
  rightEar: THREE.Group;
  head: THREE.Group;
  body: THREE.Mesh;
  baseY: number;
  hopPhase: number;
  targetHop: number;
  triggerHop: () => void;
}

// Procedural Pine Tree (3-12 parts: trunk, 3 canopy tiers, snow/accent cap)
export function createPineTree(scale: number, materials: ForestMaterials, isWinter = false): THREE.Group {
  const tree = new THREE.Group();
  tree.userData = { type: 'tree', interactive: true };

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

  // Tiny top tip
  const tipGeo = new THREE.ConeGeometry(0.25 * scale, 0.4 * scale, 5);
  const tip = new THREE.Mesh(tipGeo, isWinter ? materials.bunnyFur : foliageMat);
  tip.position.y = 2.4 * scale;
  tip.castShadow = true;
  tree.add(tip);

  return tree;
}

// Procedural Deciduous Oak Tree
export function createDeciduousTree(scale: number, materials: ForestMaterials, isWinter = false): THREE.Group {
  const tree = new THREE.Group();
  tree.userData = { type: 'tree', interactive: true };

  // Trunk with slight bend
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

// Procedural Sprout for early growth
export function createSprout(materials: ForestMaterials): THREE.Group {
  const sprout = new THREE.Group();
  sprout.userData = { type: 'sprout', interactive: true };

  // Tiny curved stem
  const stemGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.3, 6);
  const stem = new THREE.Mesh(stemGeo, materials.sprout);
  stem.position.y = 0.15;
  stem.rotation.z = 0.1;
  stem.castShadow = true;
  sprout.add(stem);

  // Leaf 1
  const leafGeo = new THREE.SphereGeometry(0.1, 6, 6);
  leafGeo.scale(1.8, 0.4, 0.9);
  const leaf1 = new THREE.Mesh(leafGeo, materials.sprout);
  leaf1.position.set(0.08, 0.28, 0);
  leaf1.rotation.set(0.2, 0, 0.5);
  leaf1.castShadow = true;
  sprout.add(leaf1);

  // Leaf 2
  const leaf2 = new THREE.Mesh(leafGeo, materials.sprout);
  leaf2.position.set(-0.08, 0.26, 0);
  leaf2.rotation.set(-0.2, 0, -0.5);
  leaf2.castShadow = true;
  sprout.add(leaf2);

  return sprout;
}

// Procedural Bunny (Multi-part model with animated ears & hop rig)
export function createBunnyModel(materials: ForestMaterials): AnimatedBunny {
  const root = new THREE.Group();
  root.userData = { type: 'bunny', interactive: true };

  // Body
  const bodyGeo = new THREE.SphereGeometry(0.35, 12, 10);
  bodyGeo.scale(0.9, 1.0, 1.15);
  const body = new THREE.Mesh(bodyGeo, materials.bunnyFur);
  body.position.set(0, 0.35, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  root.add(body);

  // Fluffy Tail
  const tailGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const tail = new THREE.Mesh(tailGeo, materials.bunnyFur);
  tail.position.set(0, 0.28, -0.42);
  tail.castShadow = true;
  root.add(tail);

  // Front Paws
  const pawGeo = new THREE.SphereGeometry(0.08, 8, 8);
  pawGeo.scale(0.8, 0.6, 1.2);
  const pawL = new THREE.Mesh(pawGeo, materials.bunnyFur);
  pawL.position.set(-0.16, 0.08, 0.25);
  root.add(pawL);

  const pawR = new THREE.Mesh(pawGeo, materials.bunnyFur);
  pawR.position.set(0.16, 0.08, 0.25);
  root.add(pawR);

  // Hind Feet
  const footGeo = new THREE.SphereGeometry(0.11, 8, 8);
  footGeo.scale(0.9, 0.5, 1.4);
  const footL = new THREE.Mesh(footGeo, materials.bunnyFur);
  footL.position.set(-0.26, 0.06, -0.1);
  root.add(footL);

  const footR = new THREE.Mesh(footGeo, materials.bunnyFur);
  footR.position.set(0.26, 0.06, -0.1);
  root.add(footR);

  // Head Group (pivotable)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.62, 0.22);
  root.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.26, 12, 10);
  headGeo.scale(1.0, 0.95, 1.05);
  const head = new THREE.Mesh(headGeo, materials.bunnyFur);
  head.castShadow = true;
  headGroup.add(head);

  // Snout
  const snoutGeo = new THREE.SphereGeometry(0.11, 8, 8);
  snoutGeo.scale(1.2, 0.9, 1.1);
  const snout = new THREE.Mesh(snoutGeo, materials.bunnyFur);
  snout.position.set(0, -0.05, 0.2);
  headGroup.add(snout);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.04, 6, 6);
  const nose = new THREE.Mesh(noseGeo, materials.bunnyPink);
  nose.position.set(0, -0.02, 0.31);
  headGroup.add(nose);

  // Eyes (Glossy Dark)
  const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const eyeL = new THREE.Mesh(eyeGeo, materials.bunnyEye);
  eyeL.position.set(-0.14, 0.06, 0.2);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, materials.bunnyEye);
  eyeR.position.set(0.14, 0.06, 0.2);
  headGroup.add(eyeR);

  // Ears (Pivot from base)
  const earOuterGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.38, 7);
  earOuterGeo.scale(1.0, 1.0, 0.5);
  const earInnerGeo = new THREE.CylinderGeometry(0.025, 0.045, 0.34, 6);
  earInnerGeo.scale(1.0, 1.0, 0.3);

  // Left Ear
  const leftEar = new THREE.Group();
  leftEar.position.set(-0.1, 0.22, -0.02);
  const lOuter = new THREE.Mesh(earOuterGeo, materials.bunnyFur);
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
  const rOuter = new THREE.Mesh(earOuterGeo, materials.bunnyFur);
  rOuter.position.y = 0.19;
  rOuter.castShadow = true;
  const rInner = new THREE.Mesh(earInnerGeo, materials.bunnyPink);
  rInner.position.set(0, 0.19, 0.02);
  rightEar.add(rOuter);
  rightEar.add(rInner);
  rightEar.rotation.z = 0.15;
  headGroup.add(rightEar);

  let targetHop = 0;

  return {
    group: root,
    leftEar,
    rightEar,
    head: headGroup,
    body,
    baseY: 0,
    hopPhase: Math.random() * Math.PI * 2,
    targetHop,
    triggerHop: () => {
      targetHop = 1.0;
    },
  };
}

// Procedural Wildflower patch
export function createFlower(materials: ForestMaterials, petalColor?: number): THREE.Group {
  const flower = new THREE.Group();
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

  // 5 Petals
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

// Procedural Island / Meadow Diorama Base with resilience scars
export function createFloatingIsland(radius: number, height: number, materials: ForestMaterials, scars: number, isWinter = false): THREE.Group {
  const island = new THREE.Group();

  // Top Meadow Disc (Lush grass surface)
  const topGeo = new THREE.CylinderGeometry(radius, radius * 1.05, 0.4, 24);
  const topMesh = new THREE.Mesh(topGeo, isWinter ? materials.stone : materials.grass);
  topMesh.position.y = -0.2;
  topMesh.receiveShadow = true;
  island.add(topMesh);

  // Sub-surface cliff / soil cone
  const cliffGeo = new THREE.ConeGeometry(radius * 1.05, height, 16);
  const cliffMesh = new THREE.Mesh(cliffGeo, materials.dirt);
  cliffMesh.rotation.x = Math.PI;
  cliffMesh.position.y = -(height / 2) - 0.4;
  cliffMesh.receiveShadow = true;
  island.add(cliffMesh);

  // Decorative mossy stones around edge
  const stoneAngles = [0.2, 1.4, 2.8, 3.9, 5.2];
  stoneAngles.forEach((angle, idx) => {
    const stoneGeo = new THREE.DodecahedronGeometry(0.25 + (idx % 3) * 0.1, 0);
    const stone = new THREE.Mesh(stoneGeo, materials.stone);
    const r = radius * 0.88;
    stone.position.set(Math.cos(angle) * r, 0.05, Math.sin(angle) * r);
    stone.rotation.set(idx * 0.5, idx * 0.8, 0);
    stone.castShadow = true;
    stone.receiveShadow = true;
    island.add(stone);
  });

  // Resilience Scars: Kintsugi-inspired golden glowing fissures on the soil
  if (scars > 0) {
    const scarCount = Math.min(scars, 12);
    for (let s = 0; s < scarCount; s++) {
      const startAngle = (s * 2.4);
      const dist = (radius * 0.25) + ((s * 0.4) % (radius * 0.5));
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(startAngle) * dist, 0.02, Math.sin(startAngle) * dist),
        new THREE.Vector3(Math.cos(startAngle + 0.3) * (dist + 0.4), 0.02, Math.sin(startAngle + 0.3) * (dist + 0.4)),
        new THREE.Vector3(Math.cos(startAngle + 0.5) * (dist + 0.8), 0.02, Math.sin(startAngle + 0.5) * (dist + 0.8)),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 8, 0.035, 5, false);
      const vein = new THREE.Mesh(tubeGeo, materials.kintsugiGold);
      island.add(vein);
    }
  }

  return island;
}
