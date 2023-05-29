import './App.css'
import { PinInput } from './components/PinInput'


function App() {
  return (
    <div className='w-screen flex flex-col ustify-center items-center flex-wrap'>
      <h2 className='font-bold mb-2 text-[20px]'>Pin Input</h2>
      <PinInput
        length={4}
        secret={false}
        regex="\d"
        // pinDefault="266"
        handleFillFull={(pinValue: string) => setTimeout(() => alert(`auto call after filled: ${pinValue}`), 200)}
      />

      <h2 className='font-bold mb-2 mt-10 text-[20px]'>Pin Input with secret mode</h2>
      <PinInput
        length={8}
        secret={true}
        regex="\d"
        // pinDefault="266"
        handleFillFull={(pinValue: string) => setTimeout(() => alert(`auto call after filled: ${pinValue}`), 200)}
      />
    </div>
  )
}

export default App
