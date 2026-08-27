import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Encounter = {pokemon: {name:string; url:string}}

const USER_ID = 1  // 1 siley, 2 berke, 3 burak

function spriteUrl(pokemonUrl: string) {
    const parts = pokemonUrl.split("/")
    const id = parts[parts.length - 2]
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}


function Location() {
    const {locationName} = useParams()
    const [encounters, setEncounters] = useState<Encounter[]>([])
    const [loading, setLoading] = useState(true)
    const [mesaj, setMesaj] = useState<string | null>(null)

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

    async function handleCatch(pokemonName: string) {
        setMesaj(`${pokemonName} için pokeball atılıyor...`)
        try {
            const response = await fetch("http://localhost:3000/api/catch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: USER_ID, pokemonName }),
            })
            const data = await response.json()

            if (!response.ok) {
                setMesaj(data.error)
                return
            }

            setMesaj(
                data.caught
                    ? `${pokemonName} yakalandı!`
                    : `${pokemonName} kaçtı!`
            )
        } catch (err) {
            console.error(err)
            setMesaj("Sunucuya ulaşılamadı")
        }
    }

    if (loading) {
      return <p>Yükleniyor...</p>
    }

    return (
      <div className="mx-auto max-w-3xl p-6">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-800">
          &larr; Location'lar
        </Link>

        <h1 className="mt-2 mb-4 text-3xl font-bold capitalize">
          {locationName?.replaceAll("-", " ")}
        </h1>

        {mesaj && (
          <p className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
            {mesaj}
          </p>
        )}

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {encounters.map((e) => (
            <li
              key={e.pokemon.name}
              className="group relative flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <img
                src={spriteUrl(e.pokemon.url)}
                alt={e.pokemon.name}
                className="h-16 w-16 shrink-0"
              />
              <span className="capitalize">{e.pokemon.name}</span>

              <button
                onClick={() => handleCatch(e.pokemon.name)}
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/70 font-bold tracking-wide text-white opacity-0 transition hover:cursor-pointer group-hover:opacity-100"
              >
                YAKALA
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

export default Location
