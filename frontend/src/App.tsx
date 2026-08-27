import { Routes, Route } from "react-router-dom"
import LocationList from "./pages/LocationList"
import Location from "./pages/Location"
import Pokedex from "./pages/Pokedex"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LocationList />} />
      <Route path="/location/:locationName" element={<Location />} />
      <Route path="/pokedex" element={<Pokedex />} />
    </Routes>
  )
}

export default App
