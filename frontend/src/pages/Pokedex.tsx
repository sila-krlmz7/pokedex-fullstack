import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type CaughtPokemon = {
    catchId: number
    pokemonId: number
    name: string
    caughtAt: string
}

const USER_ID = 1  // 1 siley, 2 berke, 3 burak

function spriteUrl(pokemonId: number) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
}

function Pokedex() {
    const [caught, setCaught] = useState<CaughtPokemon[]>([])
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [pokedexRes, userRes] = await Promise.all([
                    fetch(`http://localhost:3000/api/pokedex/${USER_ID}`),
                    fetch(`http://localhost:3000/api/users/${USER_ID}`),
                ])
                setCaught(await pokedexRes.json())
                setUserName((await userRes.json()).name)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return <p>Yükleniyor...</p>
    }

    return (
        <div className="mx-auto max-w-3xl p-6">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-800">
                &larr; Location'lar
            </Link>

            <h1 className="mt-2 text-3xl font-bold capitalize">
                {userName}
            </h1>
            <p className="mb-6 text-sm text-slate-500">
                {caught.length} pokémon yakaladı
            </p>

            {caught.length === 0 ? (
                <p className="text-slate-500">Henüz hiç pokémon yakalanmamış.</p>
            ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {caught.map((c) => (
                        <li
                            key={c.catchId}
                            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                        >
                            <img
                                src={spriteUrl(c.pokemonId)}
                                alt={c.name}
                                className="h-16 w-16 shrink-0"
                            />
                            <span className="capitalize">{c.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Pokedex
