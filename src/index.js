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
            <a href="/crystallization" style={{ color: '#999999', textDecoration: 'none' }}>
              CRYSTALLIZATION
            </a>
          </li>
          <li className="menu-item">
            <a href="/disco" style={{ color: '#999999', textDecoration: 'none' }}>
              DISCO
            </a>
          </li>
          <li className="menu-item">
            <a href="/jellyfish2" style={{ color: '#999999', textDecoration: 'none' }}>
              JELLY FISH 2
            </a>
          </li>
          <li className="menu-item">
            <a href="/malachite" style={{ color: '#999999', textDecoration: 'none' }}>
              MALACHITE
            </a>
          </li>
          <li className="menu-item">
            <a href="/brush" style={{ color: '#999999', textDecoration: 'none' }}>
              BRUSH
            </a>
          </li>
          <li className="menu-item">
            <a href="/threerects" style={{ color: '#999999', textDecoration: 'none' }}>
              THREE RECTS
            </a>
          </li>
          <li className="menu-item">
            <a href="/nightmare2" style={{ color: '#999999', textDecoration: 'none' }}>
              NIGHTMARE 2
            </a>
          </li>
          <li className="menu-item">
            <a href="/jellyfish" style={{ color: '#999999', textDecoration: 'none' }}>
              JELLY FISH
            </a>
          </li>
          <li className="menu-item">
            <a href="/watercolor" style={{ color: '#999999', textDecoration: 'none' }}>
              WATER COLOR
            </a>
          </li>
          <li className="menu-item">
            <a href="/nerves" style={{ color: '#999999', textDecoration: 'none' }}>
              NERVES
            </a>
          </li>
          <li className="menu-item">
            <a href="/drylandscape" style={{ color: '#999999', textDecoration: 'none' }}>
              DRY LANDSCAPE
            </a>
          </li>
          <li className="menu-item">
            <a href="/photodecay" style={{ color: '#999999', textDecoration: 'none' }}>
              PHOTO DECAY
            </a>
          </li>
          <li className="menu-item">
            <a href="/nightmare" style={{ color: '#999999', textDecoration: 'none' }}>
              NIGHTMARE
            </a>
          </li>
          <li className="menu-item">
            <a href="/dotparade" style={{ color: '#999999', textDecoration: 'none' }}>
              DOT PARADE
            </a>
          </li>
          <li className="menu-item">
            <a href="/specimenofpixels" style={{ color: '#999999', textDecoration: 'none' }}>
              SPECIMEN OF PIXELS
            </a>
          </li>
          <li className="menu-item">
            <a href="/flow" style={{ color: '#999999', textDecoration: 'none' }}>
              FLOW
            </a>
          </li>
          <li className="menu-item">
            <a href="/pixelacid" style={{ color: '#999999', textDecoration: 'none' }}>
              PIXEL ACID
            </a>
          </li>
          <li className="menu-item">
            <a href="/specimenofmotions" style={{ color: '#999999', textDecoration: 'none' }}>
              SPECIMEN OF MOTIONS
            </a>
          </li>
          <li className="menu-item">
            <a href="/voronoi" style={{ color: '#999999', textDecoration: 'none' }}>
              VORONOI
            </a>
          </li>
          <li className="menu-item">
            <a href="/growth" style={{ color: '#999999', textDecoration: 'none' }}>
              GROWTH
            </a>
          </li>
          <li className="menu-item">
            <a href="/proliferate" style={{ color: '#999999', textDecoration: 'none' }}>
              PROLIFERATE
            </a>
          </li>
          <li className="menu-item">
            <a href="/mesh" style={{ color: '#999999', textDecoration: 'none' }}>
              MESH
            </a>
          </li>
          <li className="menu-item">
            <a href="/stratum" style={{ color: '#999999', textDecoration: 'none' }}>
              STRATUM
            </a>
          </li>
          <li className="menu-item">
            <a href="/kaleidoscope" style={{ color: '#999999', textDecoration: 'none' }}>
              KALEIDOSCOPE
            </a>
          </li>
          <li className="menu-item">
            <a href="/tidyup" style={{ color: '#999999', textDecoration: 'none' }}>
              TIDY UP
            </a>
          </li>
          <li className="menu-item">
            <a href="/marathonman" style={{ color: '#999999', textDecoration: 'none' }}>
              MARATHON MAN
            </a>
          </li>
          <li className="menu-item">
            <a href="/fillpill2" style={{ color: '#999999', textDecoration: 'none' }}>
              FILL PILL2
            </a>
          </li>
          <li className="menu-item">
            <a href="/fillpill" style={{ color: '#999999', textDecoration: 'none' }}>
              FILL PILL
            </a>
          </li>
          <li className="menu-item">
            <a href="/supernova" style={{ color: '#999999', textDecoration: 'none' }}>
              SUPER NOVA
            </a>
          </li>
          <li className="menu-item">
            <a href="/moire" style={{ color: '#999999', textDecoration: 'none' }}>
              MOIRE
            </a>
          </li>
          <li className="menu-item">
            <a href="/sakao" style={{ color: '#999999', textDecoration: 'none' }}>
              SAKAO
            </a>
          </li>
          <li className="menu-item">
            <a href="/feedme" style={{ color: '#999999', textDecoration: 'none' }}>
              FEED ME
            </a>
          </li>
          <li className="menu-item">
            <a href="/spin" style={{ color: '#999999', textDecoration: 'none' }}>
              SPIN
            </a>
          </li>
          <li className="menu-item">
            <a href="/springzoo" style={{ color: '#999999', textDecoration: 'none' }}>
              SPRING ZOO
            </a>
          </li>
          <li className="menu-item">
            <a href="/amoeba" style={{ color: '#999999', textDecoration: 'none' }}>
              AMOEBA
            </a>
          </li>
          <li className="menu-item">
            <a href="/wormpainting" style={{ color: '#999999', textDecoration: 'none' }}>
              WORM PAINTING
            </a>
          </li>
          <li style={{ marginBottom: '20px' }}></li>
          <li className="menu-item">
            <a href="/blog" style={{ color: '#999999', textDecoration: 'none' }}>
              BLOG
            </a>
          </li>
          <li className="menu-item">
            <a href="/works" style={{ color: '#999999', textDecoration: 'none' }}>
              WORKS
            </a>
          </li>
          <li className="menu-item">
            <a href="https://twitter.com/flapdict" target="_blank" style={{ color: '#999999', textDecoration: 'none' }}>
              TWITTER
            </a>
          </li>
          <li className="menu-item">
            <a href="https://www.facebook.com/flapdict" target="_blank" style={{ color: '#999999', textDecoration: 'none' }}>
              FACEBOOK
            </a>
          </li>
          <li className="menu-item">
            <a href="mailto:info@flapdict.com" style={{ color: '#999999', textDecoration: 'none' }}>
              MAIL
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
