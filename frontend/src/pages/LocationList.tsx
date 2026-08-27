import {useEffect, useState} from "react"
import { Link } from "react-router-dom"

type Location = {name: string; url:string}

function LocationList() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/location-area?offset=0&limit=20"
        )
        //1. HTTP cevabı geldi
        const data = await response.json()
        //2. gövdesi JSON'a çevrildi
        setLocations(data.results)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, []) 
  
  if(loading) {
    return<p>Yükleniyor...</p>
  } 

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-1 text-3xl font-bold">Location'lar</h1>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Bir bölgeye tıkla, oradaki pokémonları gör.
        </p>
        <Link
          to="/pokedex"
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
        >
          Pokédex
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {locations.map((loc) => (
          <li key={loc.name}>
            <Link
              to={`/location/${loc.name}`}
              className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-400 hover:shadow-md"
            >
              <span className="capitalize">{loc.name.replaceAll("-", " ")}</span>
              <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600">
                &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LocationList