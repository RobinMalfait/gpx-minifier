import { useState, useRef } from 'react'
import { minify } from 'minify-xml'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  let [state, setState] = useState('pending')
  let timers = useRef([])

  function handleChange(event) {
    // Clear old timers
    for (let timer of timers.current.splice(0)) {
      clearTimeout(timer)
    }
    setState('busy')

    let [file] = event.target.files

    let fr = new FileReader()
    fr.onloadend = () => {
      let result = minify(fr.result)
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.classList.add('sr-only')
      let blob = new Blob([result], { type: 'octet/stream' })
      let url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = file.name.replace('.gpx', '.min.gpx')
      a.click()
      window.URL.revokeObjectURL(url)
      a.parentElement.removeChild(a)
      setState('done')
      timers.current.push(
        setTimeout(() => {
          setState('pending')
        }, 5000)
      )
    }
    setTimeout(() => {
      fr.readAsText(file)
    }, 200)
    event.target.value = ''
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center h-screen w-screen">
      <div className="bg-white dark:bg-gray-800 h-64 flex items-center justify-center relative rounded-lg shadow-xl max-w-lg w-full text-center">
        <h1 className="p-12 text-4xl uppercase font-light tracking-widest text-gray-300">
          GPX Minifier
        </h1>

        <div
          className={classNames(
            'border border-4 border-dashed absolute inset-4 rounded-lg',
            'transition-all duration-300 ease-in-out',
            state === 'pending' && 'border-gray-300',
            state === 'busy' && 'border-yellow-300',
            state === 'done' && 'border-green-300'
          )}
        >
          <input
            accept=".gpx"
            onChange={handleChange}
            className="absolute inset-0 opacity-0"
            type="file"
          />
        </div>
      </div>
    </div>
  )
}
