import React, { createContext, useContext, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PERFORMANCE_CONFIG } from '../constants/computerConstants'
import { usePerformanceMonitor, PerformanceStats } from '../hooks/usePerformanceMonitor'

// パフォーマンス最適化のためのコンテキスト
export const PerformanceContext = createContext({
  qualityLevel: 'HIGH',
  fps: 60,
  getQualitySettings: () => PERFORMANCE_CONFIG.LOD.QUALITY_LEVELS.HIGH,
  registerAnimationPhase: () => {},
  unregisterAnimationPhase: () => {},
  shouldAnimateThisFrame: () => true,
  isLowPerformanceDevice: false
})

/**
 * パフォーマンス最適化のためのプロバイダーコンポーネント
 * シーン全体のパフォーマンス監視と最適化設定を提供
 */
export const PerformanceProvider = ({ children }) => {
  const performance = usePerformanceMonitor()
  const { camera, clock } = useThree()

  // 並列処理のためにグローバルなパフォーマンスデータを更新
  useFrame(() => {
    PerformanceStats.frameCount = performance.frameCount
    PerformanceStats.fps = performance.fps
    PerformanceStats.frameTime = performance.frameTime
    PerformanceStats.qualityLevel = performance.qualityLevel
  })

  return <PerformanceContext.Provider value={performance}>{children}</PerformanceContext.Provider>
}

/**
 * パフォーマンスコンテキストを使用するためのカスタムフック
 * @returns {Object} パフォーマンス最適化ユーティリティと設定
 */
export const usePerformance = () => {
  return useContext(PerformanceContext)
}
