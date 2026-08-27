import {Routes, Route} from "react-router-dom"
import LocationList from "./pages/LocationList"
import Location  from "./pages/Location"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LocationList />} />
      <Route path="/location/:locationName" element={<Location />} />
    </Routes>
  )
}

export default  App