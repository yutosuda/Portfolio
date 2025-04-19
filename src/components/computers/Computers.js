import React, { useContext, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { MODEL_PATH } from '../../utils/constants/computerConstants'
import { InstancesContext } from './Instances'
import ComputerObjects from './ComputerObjects'
import StaticMeshes from './StaticMeshes'
import ScreenGroup from './ScreenGroup'
import Leds from './Leds'
import { PerformanceProvider } from '../../utils/context/PerformanceContext'
import { PerformanceStats } from '../../utils/hooks/usePerformanceMonitor'

/**
 * メインコンピュータグループコンポーネント
 * 3Dのレトロコンピュータモデルを表示する
 * パフォーマンス最適化機能を統合
 * @param {Object} props - プロパティ
 */
const Computers = React.memo((props) => {
  const { nodes, materials } = useGLTF(MODEL_PATH)
  const instances = useContext(InstancesContext)

  // グローバルなパフォーマンス状態を更新
  useFrame(({ clock }) => {
    // フレームカウンターの更新
    PerformanceStats.frameCount++

    // ここの処理は最も優先度が高く、毎フレーム実行される
    // 他のコンポーネントがパフォーマンス状態を参照するため
  })

  // コンポーネントをメモ化してプロパティ変更時のみ再レンダリング
  const computerObjects = useMemo(() => <ComputerObjects instances={instances} />, [instances])
  const staticMeshes = useMemo(() => <StaticMeshes nodes={nodes} materials={materials} instances={instances} />, [nodes, materials, instances])
  const screenGroup = useMemo(() => <ScreenGroup instances={instances} />, [instances])
  const leds = useMemo(() => <Leds instances={instances} />, [instances])

  return (
    <PerformanceProvider>
      <group {...props} dispose={null} frustumCulled={true}>
        {/* 各コンポーネントをメモ化して不要な再レンダリングを防止 */}
        {computerObjects}
        {staticMeshes}
        {screenGroup}
        {leds}
      </group>
    </PerformanceProvider>
  )
})

// コンポーネントの事前読み込みを行い初期化を高速化
if (typeof window !== 'undefined') {
  useGLTF.preload(MODEL_PATH)
}

export default Computers
