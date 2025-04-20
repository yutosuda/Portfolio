import * as THREE from 'three'
import { SCREEN_PARAMS } from '../constants/computerConstants'

/**
 * パネルのジオメトリサイズを計算し、スクリーンパラメータを返す
 * @param {THREE.BufferGeometry} geometry - パネルのジオメトリ
 * @returns {Object} スクリーンパラメータオブジェクト
 */
export const calculateScreenParameters = (geometry) => {
  // ジオメトリのバウンディングボックスを計算
  const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  // スクリーンのスケール係数とその他のパラメータを取得
  const { screenScale, yAdjustment, cornerOffset, z, cornerScale } = SCREEN_PARAMS

  // 実際のスクリーンサイズを計算
  const width = size.x * screenScale
  const height = size.y * screenScale

  // 元のジオメトリの精密な端点の位置を計算
  // screenScaleでスケールした後の実際のエッジ位置を正確に計算する
  const scaledLeft = (center.x - size.x / 2) * screenScale
  const scaledRight = (center.x + size.x / 2) * screenScale
  const scaledTop = (center.y + size.y / 2) * screenScale + yAdjustment
  const scaledBottom = (center.y - size.y / 2) * screenScale + yAdjustment

  // コーナーのオフセットを細かく調整
  // コーナーをより強調するために、オフセットを微調整
  const adjustedCornerOffset = cornerOffset * 1.02

  // コーナーエッジの突出度を調整（0に近いほどスクリーンの端に近づく）
  const edgeOffset = 0.002

  // 正確なコーナー位置と回転を計算
  // 球体の四分円ジオメトリの形状を考慮して、各コーナーの位置を精密に計算
  const cornerLeft = scaledLeft + adjustedCornerOffset - edgeOffset
  const cornerRight = scaledRight - adjustedCornerOffset + edgeOffset
  const cornerTop = scaledTop - adjustedCornerOffset + edgeOffset
  const cornerBottom = scaledBottom + adjustedCornerOffset - edgeOffset

  return {
    size,
    center,
    yAdjustment,
    scale: screenScale,
    width,
    height,
    cornerOffset: adjustedCornerOffset,
    cornerScale,
    z,
    // 各コーナーの精密な位置を保持
    edges: {
      left: scaledLeft,
      right: scaledRight,
      top: scaledTop,
      bottom: scaledBottom
    },
    // コーナー装飾の位置を計算
    corner: {
      // 四分円の球体形状とその回転を考慮した正確な位置
      // 球体の部分の形状に合わせたオフセット値を設定
      topLeft: new THREE.Vector3(cornerLeft, cornerTop, z.corner),
      topRight: new THREE.Vector3(cornerRight, cornerTop, z.corner),
      bottomLeft: new THREE.Vector3(cornerLeft, cornerBottom, z.corner),
      bottomRight: new THREE.Vector3(cornerRight, cornerBottom, z.corner)
    }
  }
}
