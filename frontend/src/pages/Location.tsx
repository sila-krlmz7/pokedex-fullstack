import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Encounter = {pokemon: {name:string; url:string}}

function spriteUrl(pokemonUrl: string) {
    const parts = pokemonUrl.split("/")
    const id = parts[parts.length - 2]
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}


function Location() {
    const {locationName} = useParams()
    const [encounters, setEncounters] = useState<Encounter[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const response = await fetch(
                `https://pokeapi.co/api/v2/location-area/${locationName}`)
                const data = await response.json()
                setEncounters(data.pokemon_encounters)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [locationName])

    if (loading) {
      return <p>Yükleniyor...</p>
    }

    return (
      <div className="mx-auto max-w-3xl p-6">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-800">
          &larr; Location'lar
        </Link>

        <h1 className="mt-2 mb-6 text-3xl font-bold capitalize">
          {locationName?.replaceAll("-", " ")}
        </h1>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {encounters.map((e) => (
            <li
              key={e.pokemon.name}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <img
                src={spriteUrl(e.pokemon.url)}
                alt={e.pokemon.name}
                className="h-16 w-16 shrink-0"
              />
              <span className="capitalize">{e.pokemon.name}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

export default Location