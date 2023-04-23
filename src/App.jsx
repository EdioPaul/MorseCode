import { useState } from 'react'
import morseCode from './morseCode'
import stringCode from './stringCode'
import morsecode from './morsecode.svg'
import morsecodeicon from './morsecodeicon.svg'

const App = () => {
  const [values, setValues] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = (event) => {

    const FREQUENCY_VALUE = 600
    const DOT_VALUE = 1.2 / 15
    const OSC_TYPE = 'sine'
    
    event.preventDefault()
    const { str } = values
    const code = str || ''
    const morse = code.toUpperCase().split("").map(element => {
      return morseCode[element] ? morseCode[element] : element
    }).join("")

    const message = code.split(" ").map(element => {
      return stringCode[element] ? stringCode[element] : element
    }).join("")
    setValues({ morse, message })
    
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const context = new AudioContext()
    const dot = DOT_VALUE
    
    var time = context.currentTime

    const oscillator = context.createOscillator()
    oscillator.type = OSC_TYPE
    oscillator.frequency.value = FREQUENCY_VALUE

    const gainNode = context.createGain()
    gainNode.gain.setValueAtTime(0, time)

    morse.split("").forEach(function (letter) {
      if (letter === ".") {
        gainNode.gain.setValueAtTime(1, time)
        time += dot
        gainNode.gain.setValueAtTime(0, time)
        time += dot
      } else if (letter === "-") {
        gainNode.gain.setValueAtTime(1, time)
        time += 3 * dot
        gainNode.gain.setValueAtTime(0, time)
        time += dot
      } else {
        time += 7 * dot
      }
    })

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.start()
  }

  const clear = () => {
    document.getElementById('form').reset()
    window.location.reload()
  }

  return (
    <div className="container">
      <h1 className="title">Código Morse</h1>
      <img className="icon" src={morsecodeicon} alt="morse code icon" />
      <form id="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            name="str"
            placeholder='Message...'
            value={values.str}
            onChange={handleChange}
          />
        </div>
        <div>Letras em código Morse devem ser separadas por espaço</div>
        <div className="form-group">
          <div className='code'>{values.morse}</div>
        </div>
        <div className="form-group">
          <div className='message'>{values.message}</div>
        </div>
        <button type="submit" class="btn">Enviar</button>
        <button className="btn-clear" onClick={() => clear()}>Limpar</button>
      </form>
      <img className="img" src={morsecode} alt="morse code" />
    </div>
  )
}

export default App