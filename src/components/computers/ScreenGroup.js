import React, { Suspense } from 'react'
import { SCREEN_DEFINITIONS } from '../../utils/constants/computerConstants'
import ScreenText from './ScreenText'
import ScreenInteractive from './ScreenInteractive'
import ScreenImage from './ScreenImage'

/**
 * カスタムエラーバウンダリコンポーネント
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // エラーが発生した場合のステート更新
    console.error('ErrorBoundary caught error:', error)
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // エラーロギング
    console.error('Screen Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // フォールバックUIの表示
      return this.props.fallback || <meshBasicMaterial color="red" />
    }

    return this.props.children
  }
}

/**
 * スクリーングループコンポーネント - 複数のスクリーンをまとめて管理
 * @param {Object} props - プロパティ
 */
const ScreenGroup = React.memo(({ instances }) => {
  console.log('[ScreenGroup] Rendering screen group with definitions:', SCREEN_DEFINITIONS)

  return (
    <>
      {SCREEN_DEFINITIONS.map((screen, i) => {
        console.log(`[ScreenGroup] Rendering screen ${i} of type ${screen.type}`)

        // 画像タイプのスクリーン
        if (screen.type === 'image') {
          return (
            <ErrorBoundary
              key={`screen-${i}`}
              fallback={
                <ScreenText
                  {...screen}
                  content="画像読込エラー"
                  fontSize={2.5}
                  invert={!screen.invert} // 反転させて目立たせる
                />
              }>
              <ScreenImage key={`screen-${i}`} {...screen} />
            </ErrorBoundary>
          )
        }

        // 対話型スクリーン
        else if (screen.type === 'interactive') {
          return (
            <ErrorBoundary key={`screen-${i}`}>
              <Suspense fallback={null}>
                <ScreenInteractive key={`screen-${i}`} {...screen} />
              </Suspense>
            </ErrorBoundary>
          )
        }

        // テキストスクリーン
        else if (screen.type === 'text') {
          return (
            <ErrorBoundary key={`screen-${i}`}>
              <Suspense fallback={null}>
                <ScreenText key={`screen-${i}`} {...screen} />
              </Suspense>
            </ErrorBoundary>
          )
        }

        // 未対応のタイプ
        console.warn(`[ScreenGroup] Unsupported screen type: ${screen.type}`)
        return null
      })}
    </>
  )
})

export default ScreenGroup
