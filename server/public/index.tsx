import { createRoot } from 'react-dom/client'
import '@public/global.css'

function App() {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)
