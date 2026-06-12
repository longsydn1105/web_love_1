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
