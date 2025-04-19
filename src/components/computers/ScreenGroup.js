import React from 'react'
import { SCREEN_DEFINITIONS } from '../../utils/constants/computerConstants'
import ScreenText from './ScreenText'
import ScreenInteractive from './ScreenInteractive'

/**
 * スクリーングループコンポーネント - 複数のスクリーンをまとめて管理
 * @param {Object} props - プロパティ
 */
const ScreenGroup = React.memo(({ instances }) => {
  return (
    <>
      {SCREEN_DEFINITIONS.map((screen, i) => {
        // スクリーンのタイプによって適切なコンポーネントを返す
        if (screen.type === 'interactive') {
          return <ScreenInteractive key={`screen-${i}`} {...screen} />
        } else if (screen.type === 'text') {
          return <ScreenText key={`screen-${i}`} {...screen} />
        }
        return null
      })}
    </>
  )
})

export default ScreenGroup
