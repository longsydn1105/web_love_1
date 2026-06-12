import { useState } from 'react'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'

export default function App() {
  const [screen, setScreen] = useState(1)
  const [wrongClicks, setWrongClicks] = useState(0)
  const [score, setScore] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { width, height } = useWindowSize()

  const handleWrongClick = () => setWrongClicks(c => Math.min(c + 1, 5))
  const handleCorrectClick = () => setScreen(2)

  const handleScoreContinue = () => {
    if (score === null) return
    setScreen(3)
  }

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, feedbackText }),
      })
      if (!res.ok) throw new Error('Server error')
      setScreen(4)
    } catch {
      setError('Có lỗi xảy ra, em thử lại nhé 🥺')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-green-100 flex items-center justify-center p-4">
      <FloatingElements />
      {screen === 1 && (
        <Screen1
          wrongClicks={wrongClicks}
          onCorrect={handleCorrectClick}
          onWrong={handleWrongClick}
        />
      )}
      {screen === 2 && (
        <Screen2
          score={score}
          onScoreChange={setScore}
          onContinue={handleScoreContinue}
        />
      )}
      {screen === 3 && (
        <Screen3
          feedbackText={feedbackText}
          onChange={setFeedbackText}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}
      {screen === 4 && <Screen4 width={width} height={height} />}
    </div>
  )
}

function Screen1({ wrongClicks, onCorrect, onWrong }) {
  const btn1Scale = 1 + wrongClicks * 0.5
  const btn23Scale = Math.max(0.05, 1 - wrongClicks * 0.2)
  const isFullscreen = wrongClicks >= 5

  return (
    <>
      {/* Khi wrongClicks === 5: nút 1 chiếm toàn màn hình */}
      {isFullscreen && (
        <button
          onClick={onCorrect}
          className="fixed inset-0 z-50 w-full h-full bg-purple-400 hover:bg-purple-500 text-white font-bold flex flex-col items-center justify-center gap-6 transition-colors duration-300"
        >
          <span className="text-7xl animate-heartbeat">💜</span>
          <span className="text-4xl md:text-5xl">Em vô cùng thích!</span>
        </button>
      )}

      <div
        className={`text-center space-y-10 w-full max-w-sm transition-opacity duration-500 ${
          isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-fadeIn'
        }`}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-purple-700">
          Em thấy thế nào về buổi đi chơi? 💖
        </h1>

        <div className="flex flex-col items-center gap-5 overflow-hidden py-6">
          <button
            onClick={onCorrect}
            style={{
              transform: `scale(${btn1Scale})`,
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className="px-8 py-4 bg-purple-300 hover:bg-purple-400 text-purple-900 font-semibold rounded-2xl shadow-lg text-lg whitespace-nowrap origin-center"
          >
            Em vô cùng thích 💜
          </button>

          <button
            onClick={onWrong}
            style={{
              transform: `scale(${btn23Scale})`,
              opacity: btn23Scale,
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className="px-8 py-4 bg-green-200 hover:bg-green-300 text-green-900 font-semibold rounded-2xl shadow-md text-lg whitespace-nowrap origin-center"
          >
            Bình thường 🤔
          </button>

          <button
            onClick={onWrong}
            style={{
              transform: `scale(${btn23Scale})`,
              opacity: btn23Scale,
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-2xl shadow-md text-lg whitespace-nowrap origin-center"
          >
            So bad 😔
          </button>
        </div>
      </div>
    </>
  )
}

function Screen2({ score, onScoreChange, onContinue }) {
  const getEmoji = (s) => {
    if (s <= 2) return '😔'
    if (s <= 4) return '😐'
    if (s <= 6) return '😊'
    if (s <= 8) return '😄'
    if (s <= 9) return '🥰'
    return '💖'
  }

  return (
    <div className="text-center space-y-8 w-full max-w-sm bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl animate-fadeIn">
      <h1 className="text-xl md:text-2xl font-bold text-purple-700 leading-relaxed">
        Anh đùa thôi, em hãy chấm điểm hài lòng từ 1 tới 10 nha ✨
      </h1>

      <div className="space-y-5">
        <div className="h-20 flex items-center justify-center">
          {score !== null ? (
            <div className="flex items-center gap-3">
              <span className="text-5xl">{getEmoji(score)}</span>
              <span className="text-6xl font-bold text-purple-600">{score}</span>
              <span className="text-2xl text-purple-300 font-medium">/ 10</span>
            </div>
          ) : (
            <span className="text-2xl text-purple-300 font-medium italic">
              Chọn điểm nhé 🌸
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => onScoreChange(n)}
              className={`aspect-square rounded-xl font-bold text-lg transition-all duration-200 ${
                score === n
                  ? 'bg-purple-400 text-white scale-110 shadow-lg ring-2 ring-purple-300'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-700 hover:scale-105'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onContinue}
        disabled={score === null}
        className="w-full py-4 bg-purple-400 hover:bg-purple-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 text-lg"
      >
        Tiếp tục →
      </button>
    </div>
  )
}

function Screen3({ feedbackText, onChange, onSubmit, loading, error }) {
  return (
    <div className="text-center space-y-6 w-full max-w-sm bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl animate-fadeIn">
      <h1 className="text-xl md:text-2xl font-bold text-purple-700 leading-relaxed">
        Em có ấn tượng gì, hay góp ý gì để anh cải thiện cho những lần sau không? 🌱
      </h1>

      <textarea
        value={feedbackText}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cứ nói thật lòng nhé, anh hứa không giận đâu 🥺"
        rows={5}
        className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none text-gray-700 bg-white/80 transition-all placeholder:text-purple-300 placeholder:italic"
      />

      {error && (
        <p className="text-red-400 text-sm font-medium">{error}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-4 bg-green-300 hover:bg-green-400 disabled:bg-gray-200 disabled:text-gray-400 text-green-900 font-semibold rounded-2xl shadow-lg transition-all duration-200 text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block animate-spin">💌</span>
            Đang gửi...
          </span>
        ) : (
          'Gửi cho anh 💌'
        )}
      </button>
    </div>
  )
}

// CSS filter để tô màu bướm theo tone tím-xanh
const BUTTERFLY_FILTERS = [
  'hue-rotate(-50deg) saturate(1.4)',                    // tím đậm
  'hue-rotate(-30deg) saturate(1.2)',                    // violet
  'hue-rotate(-70deg) saturate(1.5) brightness(1.1)',    // hồng tím
  'hue-rotate(30deg) saturate(1.1)',                     // xanh lá nhạt
  '',                                                    // gốc xanh dương
  'hue-rotate(-20deg) saturate(1.3) brightness(1.15)',   // lavender
  'hue-rotate(50deg) saturate(1.2)',                     // mint xanh
  'hue-rotate(200deg) saturate(1.3) brightness(1.1)',    // tím xanh
]

const BUTTERFLIES = [
  { top: '6%',  dur: '19s', delay: '0s',    anim: 1, size: '2rem',   opacity: 0.70, flutter: '0.42s', fi: 0 },
  { top: '18%', dur: '26s', delay: '-8s',   anim: 4, size: '1.6rem', opacity: 0.55, flutter: '0.36s', fi: 1 },
  { top: '38%', dur: '17s', delay: '-4s',   anim: 2, size: '1.9rem', opacity: 0.65, flutter: '0.50s', fi: 5 },
  { top: '62%', dur: '23s', delay: '-14s',  anim: 5, size: '1.4rem', opacity: 0.50, flutter: '0.40s', fi: 2 },
  { top: '12%', dur: '31s', delay: '-20s',  anim: 3, size: '2.3rem', opacity: 0.60, flutter: '0.46s', fi: 3 },
  { top: '75%', dur: '21s', delay: '-6s',   anim: 6, size: '1.7rem', opacity: 0.45, flutter: '0.38s', fi: 6 },
  { top: '50%', dur: '27s', delay: '-23s',  anim: 1, size: '1.3rem', opacity: 0.55, flutter: '0.33s', fi: 4 },
  { top: '28%', dur: '14s', delay: '-3s',   anim: 5, size: '1.8rem', opacity: 0.60, flutter: '0.48s', fi: 7 },
  { top: '85%', dur: '22s', delay: '-11s',  anim: 2, size: '1.5rem', opacity: 0.45, flutter: '0.43s', fi: 1 },
  { top: '44%', dur: '30s', delay: '-17s',  anim: 4, size: '2.0rem', opacity: 0.55, flutter: '0.37s', fi: 5 },
  { top: '70%', dur: '16s', delay: '-7s',   anim: 3, size: '1.6rem', opacity: 0.50, flutter: '0.44s', fi: 3 },
  { top: '22%', dur: '25s', delay: '-15s',  anim: 6, size: '1.2rem', opacity: 0.45, flutter: '0.35s', fi: 2 },
  { top: '57%', dur: '20s', delay: '-2s',   anim: 1, size: '2.1rem', opacity: 0.60, flutter: '0.50s', fi: 6 },
  { top: '33%', dur: '29s', delay: '-19s',  anim: 4, size: '1.5rem', opacity: 0.50, flutter: '0.41s', fi: 0 },
]

const PETAL_COLORS = [
  '#e0b8f4', // tím nhạt
  '#f2c8e4', // hồng tím
  '#c8b8f0', // lavender
  '#b8e8cc', // xanh mint
  '#f0d8f0', // blush tím
  '#cce0f5', // xanh lavender nhạt
  '#d4f0dc', // xanh lá pastel
]

const PETALS = [
  { left: '4%',  dur: '12s', delay: '0s',    v: 1, color: PETAL_COLORS[0], size: 14, opacity: 0.75 },
  { left: '11%', dur: '15s', delay: '-4s',   v: 2, color: PETAL_COLORS[1], size: 18, opacity: 0.65 },
  { left: '19%', dur: '10s', delay: '-7s',   v: 3, color: PETAL_COLORS[2], size: 12, opacity: 0.70 },
  { left: '27%', dur: '14s', delay: '-2s',   v: 1, color: PETAL_COLORS[3], size: 16, opacity: 0.60 },
  { left: '36%', dur: '11s', delay: '-9s',   v: 2, color: PETAL_COLORS[4], size: 20, opacity: 0.70 },
  { left: '45%', dur: '13s', delay: '-5s',   v: 3, color: PETAL_COLORS[0], size: 13, opacity: 0.65 },
  { left: '54%', dur: '16s', delay: '-12s',  v: 1, color: PETAL_COLORS[5], size: 17, opacity: 0.60 },
  { left: '62%', dur: '9s',  delay: '-3s',   v: 2, color: PETAL_COLORS[1], size: 15, opacity: 0.70 },
  { left: '70%', dur: '14s', delay: '-8s',   v: 3, color: PETAL_COLORS[6], size: 11, opacity: 0.65 },
  { left: '79%', dur: '11s', delay: '-1s',   v: 1, color: PETAL_COLORS[2], size: 19, opacity: 0.60 },
  { left: '87%', dur: '13s', delay: '-6s',   v: 2, color: PETAL_COLORS[3], size: 14, opacity: 0.70 },
  { left: '93%', dur: '15s', delay: '-10s',  v: 3, color: PETAL_COLORS[4], size: 16, opacity: 0.65 },
]

function PetalSVG({ color, size }) {
  const w = size
  const h = Math.round(size * 1.7)
  return (
    <svg width={w} height={h} viewBox="0 0 20 34" fill="none">
      <path d="M10 0 C18 6 19 16 10 34 C1 16 2 6 10 0Z" fill={color} />
    </svg>
  )
}

function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {BUTTERFLIES.map((b, i) => (
        <div
          key={`b${i}`}
          style={{
            position: 'absolute',
            top: b.top,
            opacity: b.opacity,
            animation: `fly-${b.anim} ${b.dur} linear ${b.delay} infinite`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: b.size,
              filter: BUTTERFLY_FILTERS[b.fi],
              animation: `wing-flutter ${b.flutter} ease-in-out infinite`,
            }}
          >
            🦋
          </span>
        </div>
      ))}

      {PETALS.map((p, i) => (
        <div
          key={`p${i}`}
          style={{
            position: 'absolute',
            left: p.left,
            top: 0,
            opacity: p.opacity,
            animation: `petal-fall-${p.v} ${p.dur} ease-in-out ${p.delay} infinite`,
          }}
        >
          <PetalSVG color={p.color} size={p.size} />
        </div>
      ))}
    </div>
  )
}

function Screen4({ width, height }) {
  return (
    <>
      <ReactConfetti
        width={width}
        height={height}
        colors={['#d8b4e2', '#b4e2b9', '#ffc8d4', '#ffe4e1', '#c8d4ff', '#f9c6cf', '#fde68a']}
        numberOfPieces={250}
        recycle={false}
        gravity={0.12}
      />
      <div className="text-center space-y-5 bg-white/70 backdrop-blur-sm rounded-3xl px-10 py-12 shadow-2xl max-w-sm animate-fadeIn">
        <div className="text-7xl animate-float">🥰</div>
        <h1 className="text-2xl md:text-3xl font-bold text-purple-700 leading-relaxed">
          Chân thành cảm ơn em, anh sẽ trân trọng những điều này.
        </h1>
        <p className="text-xl text-green-700 font-semibold">
          Chúc em buổi tối vui vẻ! 🌟
        </p>
        <p className="text-sm text-gray-400 italic pt-1">
          Hôm nay đi chơi với em vui lắm.
        </p>
      </div>
    </>
  )
}
