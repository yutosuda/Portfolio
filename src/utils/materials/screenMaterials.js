import * as THREE from 'three'
import { COLORS } from '../constants/computerConstants'

/**
 * スクリーンの輝き効果用のマテリアルを作成
 * @returns {THREE.MeshPhysicalMaterial} 輝き効果マテリアル
 */
export const createGlowMaterial = () => {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(COLORS.glow),
    emissive: new THREE.Color(COLORS.glow).multiplyScalar(0.12),
    roughness: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    transmission: 0.95,
    thickness: 0.05,
    transparent: true,
    opacity: 0.55
  })
}

/**
 * コーナー装飾用の共通マテリアルを作成
 * @returns {THREE.MeshStandardMaterial} コーナー装飾マテリアル
 */
export const createCornerMaterial = () => {
  // コーナーの色を少し明るくして、基本色に白みを加える
  const cornerColor = new THREE.Color(COLORS.glow).lerp(new THREE.Color(1, 1, 1), 0.15)

  return new THREE.MeshStandardMaterial({
    color: cornerColor, // 明るい色を使用
    emissive: COLORS.glow,
    emissiveIntensity: 0.9, // 発光強度を大幅に上げる
    roughness: 0.15, // より滑らかな表面（光沢感アップ）
    metalness: 0.5, // メタリック感をさらに強く
    transparent: true, // 透明度を有効に
    opacity: 0.95 // 不透明度を上げて、より目立たせる
  })
}

/**
 * LED用の基本マテリアルを作成して返す
 * @returns {THREE.MeshBasicMaterial} LEDマテリアル
 */
export const createLedMaterial = () => {
  const material = new THREE.MeshBasicMaterial()
  material.toneMapped = false
  return material
}
