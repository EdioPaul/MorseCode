import { useState } from 'react'
import morseCode from './morseCode'

const App = () => {
  const [values, setValues] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { str } = values
    const message = str || ''
    const morse = message.toUpperCase().split("").map(element => {
      return morseCode[element] ? morseCode[element] : element
    }).join("")

    setValues({ morse })

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const dot = 1.2 / 15;

    var time = context.currentTime;

    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 600;

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, time);

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
      <h1 className="title">Morse Code</h1>
      <form id="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="str"
            placeholder="Message"
            value={values.str}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            name="morse"
            placeholder="Morse Code"
            value={values.morse}
            onChange={handleChange}
          />
        </div>
        <div className="btn-wrapper">
          <button type="submit" class="btn">Morse</button>
          <button className="btn-clear" onClick={() => clear()}>Clear</button>
        </div>
      </form>
    </div>
  )
}

export default App