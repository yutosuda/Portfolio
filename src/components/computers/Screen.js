import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, RenderTexture } from '@react-three/drei'
import * as THREE from 'three'

import { MODEL_PATH, COMPUTER_CONSTANTS, PERFORMANCE_CONFIG } from '../../utils/constants/computerConstants'
import { createGlowMaterial, createCornerMaterial } from '../../utils/materials/screenMaterials'
import { calculateScreenParameters } from '../../utils/geometry/screenGeometry'
import { createScanlineMaterial, updateScanlineAnimation } from '../../utils/shaders/screenShaders'
import { useRenderTextureCache } from '../../utils/hooks/useRenderTextureCache'
import { usePerformance } from '../../utils/context/PerformanceContext'
import { PerformanceStats } from '../../utils/hooks/usePerformanceMonitor'

/**
 * 最適化されたスクリーンコンポーネント
 * モニター（GLTFモデルから取り出したもの）をレンダリングし、
 * カスタムシーンをテクスチャにレンダリングして、それをモニターの画面に投影します
 * パフォーマンス最適化機能を組み込み済み
 */
const Screen = React.memo(({ frame, panel, children, customEffect = false, ...props }) => {
  const { nodes, materials } = useGLTF(MODEL_PATH)
  const screenRef = useRef()

  // パフォーマンス監視機能を取得
  const performance = usePerformance()
  const animationId = useMemo(() => `screen-${panel}-${Date.now().toString(36)}`, [panel])
  const qualitySettings = performance.getQualitySettings()

  // レンダーテクスチャ解像度の動的調整
  const textureWidth = qualitySettings.textureSize.width
  const textureHeight = qualitySettings.textureSize.height

  // レンダーテクスチャのキャッシュを使用
  const { renderTarget } = useRenderTextureCache({
    width: textureWidth,
    height: textureHeight,
    anisotropy: qualitySettings.anisotropy,
    id: `screen-${panel}`,
    useCache: PERFORMANCE_CONFIG.MEMORY.CACHE_SCREENS
  })

  // スキャンライン効果の材質（メモ化して再生成を防止）
  const scanlineMaterial = useMemo(() => createScanlineMaterial(), [])

  // スクリーンパラメータ
  const screenParams = useMemo(() => {
    const geometry = nodes[panel].geometry
    return calculateScreenParameters(geometry)
  }, [nodes, panel])

  // スクリーンの輝き効果用の材質（メモ化して再生成を防止）
  const glowMaterial = useMemo(() => (PERFORMANCE_CONFIG.MEMORY.USE_SHARED_MATERIALS ? createGlowMaterial() : createGlowMaterial()), [])

  // コーナー装飾用の共通材質（メモ化して再生成を防止）
  const cornerMaterial = useMemo(() => (PERFORMANCE_CONFIG.MEMORY.USE_SHARED_MATERIALS ? createCornerMaterial() : createCornerMaterial()), [])

  // 初期化時にアニメーションを登録
  useEffect(() => {
    if (customEffect) {
      // カスタム効果のアニメーション登録（優先度：低）
      performance.registerAnimationPhase(animationId, PERFORMANCE_CONFIG.ANIMATION.UPDATE_PRIORITIES.SCANLINE)
    }

    return () => {
      // コンポーネントのアンマウント時にアニメーションを登録解除
      if (customEffect) {
        performance.unregisterAnimationPhase(animationId)
      }
    }
  }, [customEffect, animationId, performance])

  // スキャンライン効果のアニメーション（パフォーマンス最適化対応版）
  useFrame(({ clock }) => {
    // パフォーマンスに基づいて更新頻度を調整
    if (customEffect && screenRef.current) {
      if (performance.shouldAnimateThisFrame(animationId)) {
        updateScanlineAnimation(scanlineMaterial, clock.getElapsedTime() * 2)
      }
    }
  })

  // コーナー装飾の形状（LODに応じて品質調整）
  const cornerSegments = qualitySettings.cornerSegments

  // コーナージオメトリをより精密に調整
  // 正確な四分円形状のジオメトリを生成し、各コーナーにぴったり合うように調整
  const cornerGeometry = useMemo(
    () => (
      <sphereGeometry
        args={[
          1, // 半径
          Math.max(cornerSegments * 1.5, 16), // 横方向のセグメント数を増やして滑らかさ向上
          Math.max(cornerSegments * 1.5, 16), // 縦方向のセグメント数を増やして滑らかさ向上
          0, // phiStart - 開始角度（横方向）
          COMPUTER_CONSTANTS.HALF_PI * 1.05, // thetaLength - より広い角度範囲で視認性向上
          0, // thetaStart - 開始角度（縦方向）
          COMPUTER_CONSTANTS.HALF_PI * 1.05 // phiLength - より広い角度範囲で視認性向上
        ]}
      />
    ),
    [cornerSegments]
  )

  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={nodes[frame].geometry} material={materials.Texture} />

      {/* スクリーン周囲の輝き効果 */}
      <mesh
        geometry={nodes[panel].geometry}
        position={[0, screenParams.yAdjustment, screenParams.z.glow]}
        scale={[screenParams.scale, screenParams.scale, 1.3]}
        material={glowMaterial}
      />

      {/* メインスクリーン */}
      <mesh ref={screenRef} geometry={nodes[panel].geometry} position={[0, screenParams.yAdjustment, screenParams.z.main]} scale={screenParams.scale}>
        <meshBasicMaterial transparent={false} toneMapped={false}>
          <RenderTexture
            width={textureWidth}
            height={textureHeight}
            attach="map"
            anisotropy={qualitySettings.anisotropy}
            // レンダーテクスチャキャッシュを使用してGPUメモリ消費を削減
            renderTarget={renderTarget}>
            {children}
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>

      {/* スキャンライン効果オーバーレイ（オプション） */}
      {customEffect && (
        <mesh geometry={nodes[panel].geometry} position={[0, screenParams.yAdjustment, screenParams.z.main + 0.001]} scale={screenParams.scale}>
          <primitive object={scanlineMaterial}>
            <RenderTexture width={textureWidth} height={textureHeight} attach="uniforms-tMap-value" anisotropy={qualitySettings.anisotropy} />
          </primitive>
        </mesh>
      )}

      {/* コーナー装飾群 - より精密に位置決めされたコーナー */}
      <group>
        {/* コーナー加飾 - 左上 */}
        <mesh
          position={screenParams.corner.topLeft}
          scale={screenParams.cornerScale}
          // 左上のコーナーは回転不要（デフォルトの向き）
          rotation={[0, 0, 0]}>
          {cornerGeometry}
          <primitive object={cornerMaterial} />
        </mesh>

        {/* コーナー加飾 - 右上 */}
        <mesh
          position={screenParams.corner.topRight}
          scale={screenParams.cornerScale}
          // 右上のコーナーはz軸に90度回転
          rotation={[0, 0, COMPUTER_CONSTANTS.HALF_PI]}>
          {cornerGeometry}
          <primitive object={cornerMaterial} />
        </mesh>

        {/* コーナー加飾 - 左下 */}
        <mesh
          position={screenParams.corner.bottomLeft}
          scale={screenParams.cornerScale}
          // 左下のコーナーはz軸に-90度回転
          rotation={[0, 0, -COMPUTER_CONSTANTS.HALF_PI]}>
          {cornerGeometry}
          <primitive object={cornerMaterial} />
        </mesh>

        {/* コーナー加飾 - 右下 */}
        <mesh
          position={screenParams.corner.bottomRight}
          scale={screenParams.cornerScale}
          // 右下のコーナーはz軸に180度回転
          rotation={[0, 0, COMPUTER_CONSTANTS.FULL_PI]}>
          {cornerGeometry}
          <primitive object={cornerMaterial} />
        </mesh>
      </group>
    </group>
  )
})

export default Screen
