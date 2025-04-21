import React, { useRef, forwardRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'

import Screen from './Screen'
import { useAppState } from '../../utils/context/AppStateContext'
import { useEvents } from '../../utils/hooks/useEvents'

/**
 * コンピュータスクリーンコンポーネント
 * 3Dスクリーンと、その中にレンダリングされるHTMLコンテンツを統合します
 */
const ComputerScreen = forwardRef(({ frame, panel, children, ...props }, ref) => {
  const screenRef = useRef()
  const { events } = useEvents()
  const { appState, dispatch } = useAppState()
  const { viewport } = useThree()

  // 外部refと内部refの統合
  React.useImperativeHandle(ref, () => ({
    ...screenRef.current,
    click: () => {
      if (screenRef.current) {
        // 手動でクリックイベントをトリガー
        handleClick({ stopPropagation: () => {} })
      }
    }
  }))

  // スクリーンをクリックした時のハンドラ
  const handleClick = (e) => {
    e.stopPropagation()

    // スクリーンがクリックされたときのステート変更をディスパッチ
    dispatch({
      type: 'SET_SCREEN_ACTIVE',
      payload: true
    })

    // イベントを発火
    events.emit('screen:clicked')
  }

  return (
    <Screen ref={screenRef} frame={frame} panel={panel} {...props} onClick={handleClick}>
      {children}
    </Screen>
  )
})

export default ComputerScreen
