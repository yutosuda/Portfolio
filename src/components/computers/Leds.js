import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

import { MODEL_PATH, LED_POSITIONS, PERFORMANCE_CONFIG } from '../../utils/constants/computerConstants'
import { createLedMaterial } from '../../utils/materials/screenMaterials'
import { usePerformance } from '../../utils/context/PerformanceContext'
import { useWorkerizedComputation } from '../../utils/hooks/useWorkerizedComputation'

/**
 * LEDアニメーション計算用のワーカー関数
 * メインスレッドの負荷を軽減するために使用
 */
const computeLedColors = (data) => {
  const { positions, time, baseColor } = data
  const results = []

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i]
    const rand = Math.abs(2 + position[0])
    const t = Math.round((1 + Math.sin(rand * 10000 + time * rand)) / 2)

    // RGB値を計算
    results.push([
      0, // R
      t * baseColor[1], // G
      t * baseColor[2] // B
    ])
  }

  return results
}

/**
 * 点滅するLEDをレンダリングするコンポーネント
 * パフォーマンス最適化とWeb Workerによる並列計算を実装
 * @param {Object} props - プロパティ
 * @param {Object} props.instances - インスタンス化されたメッシュオブジェクト
 */
const Leds = React.memo(({ instances }) => {
  const ref = useRef()
  const { nodes } = useGLTF(MODEL_PATH)
  const ledsRef = useRef([])

  // パフォーマンス監視機能
  const performance = usePerformance()
  const animationId = useMemo(() => `leds-${Date.now().toString(36)}`, [])

  // Web Worker を使用してLEDの色計算を並列化
  const { compute, isAvailable } = useWorkerizedComputation(computeLedColors, {
    enabled: window.Worker !== undefined // Workers APIが使用可能な場合にのみ有効化
  })

  // LED計算用の基本色
  const baseColor = useMemo(() => [1, 1.1, 1], [])

  // 基本材質の設定
  useMemo(() => {
    nodes.Sphere.material = createLedMaterial()
  }, [nodes])

  // アニメーションフェーズの登録
  useEffect(() => {
    // LED用アニメーションの登録（優先度：中）
    performance.registerAnimationPhase(animationId, PERFORMANCE_CONFIG.ANIMATION.UPDATE_PRIORITIES.LED)

    return () => {
      performance.unregisterAnimationPhase(animationId)
    }
  }, [animationId, performance])

  // LEDの点滅アニメーション（最適化版）
  useFrame(async ({ clock }) => {
    if (!ref.current) return

    // パフォーマンスに応じてアニメーション更新頻度を調整
    if (performance.shouldAnimateThisFrame(animationId)) {
      if (isAvailable()) {
        try {
          // Web Worker を使用してバックグラウンドで色計算
          const colors = await compute({
            positions: LED_POSITIONS,
            time: clock.getElapsedTime(),
            baseColor
          })

          // 結果を反映（参照が残っていることを確認）
          if (ref.current) {
            ref.current.children.forEach((instance, i) => {
              if (colors[i]) {
                instance.color.setRGB(...colors[i])
              }
            })
          }
        } catch (error) {
          // Worker処理失敗の場合はメインスレッドでフォールバック
          if (ref.current) {
            ref.current.children.forEach((instance) => {
              const rand = Math.abs(2 + instance.position.x)
              const t = Math.round((1 + Math.sin(rand * 10000 + clock.getElapsedTime() * rand)) / 2)
              instance.color.setRGB(0, t * 1.1, t)
            })
          }
        }
      } else {
        // Worker未サポート環境ではメインスレッドで計算
        if (ref.current) {
          ref.current.children.forEach((instance) => {
            const rand = Math.abs(2 + instance.position.x)
            const t = Math.round((1 + Math.sin(rand * 10000 + clock.getElapsedTime() * rand)) / 2)
            instance.color.setRGB(0, t * 1.1, t)
          })
        }
      }
    }
  })

  // インスタンス化されたLEDメッシュの参照を保持
  const handleLedRef = (index) => (mesh) => {
    if (mesh) {
      ledsRef.current[index] = mesh
    }
  }

  return (
    <group ref={ref}>
      {LED_POSITIONS.map((position, i) => (
        <instances.Sphere key={`led-${i}`} position={position} scale={0.005} color={[1, 2, 1]} ref={handleLedRef(i)} />
      ))}
    </group>
  )
})

export default Leds
