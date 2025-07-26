import { Piano } from "./components/Piano"
import { Button } from "./components/ui/button"
import Sheet from "./Sheet"

function App() {
  return (
    <div className="app px-4 flex flex-col items-center gap-4">
      <Sheet className="mx-auto" />
      <Piano />
      <Button>Next</Button>
    </div>
  )
}

export default App
