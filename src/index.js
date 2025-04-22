import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

/*
このファイルはReactアプリケーションのエントリーポイントです。
主な機能:
- Reactアプリケーションのルート要素を設定
- メインの3Dシーンコンポーネントの描画
- メニューリストの表示

このコードは、3Dシーン（App.js）をレンダリングします。
*/

function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <div
        className="menu-list"
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '12px',
          color: '#999999',
          textAlign: 'left',
          lineHeight: '1.2'
        }}>
        <h1
          className="menu-title"
          style={{
            fontSize: '16px',
            marginBottom: '15px'
          }}
          onClick={() => window.open('/', '_self')}>
          _aruday
        </h1>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="menu-item">
            <a href="https://github.com/yutosuda" target="_blank" style={{ color: '#999999', textDecoration: 'none' }}>
              Github
            </a>
          </li>
          <li className="menu-item">
            <a href="https://twitter.com/_aruday" target="_blank" style={{ color: '#999999', textDecoration: 'none' }}>
              X（Twitter）
            </a>
          </li>
          <li className="menu-item">
            <a href="https://note.com/aruday" target="_blank" style={{ color: '#999999', textDecoration: 'none' }}>
              note
            </a>
          </li>
          <li className="menu-item">
            <a href="https://note.com/aruday/n/n0bafd0b58211" style={{ color: '#999999', textDecoration: 'none' }}>
              『スイカ入門』 初心者編
            </a>
          </li>
          <li className="menu-item">
            <a href="https://note.com/aruday/n/n01a981656686" style={{ color: '#999999', textDecoration: 'none' }}>
              『スイカ入門』 意思決定編
            </a>
          </li>
          <li className="menu-item">
            <a href="https://note.com/aruday/n/n25596294368e" style={{ color: '#999999', textDecoration: 'none' }}>
              『スイカ入門』 ホモ・サピエンス編
            </a>
          </li>
          <li className="menu-item">
            <a href="https://note.com/aruday/n/n21b68ab90a27" style={{ color: '#999999', textDecoration: 'none' }}>
              『一入門』 起業・経営編
            </a>
          </li>
          <li className="menu-item">
            <a href="https://note.com/aruday/n/n21fba33f3fa7" style={{ color: '#999999', textDecoration: 'none' }}>
              『ラクダ入門』営業・事業編
            </a>
          </li>
          <li className="menu-item">
            <a href="https://note.com/aruday/n/ncdd8b17e1ff1" style={{ color: '#999999', textDecoration: 'none' }}>
              『安藤入門』ファイナンス編
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Overlay />
  </>
)
