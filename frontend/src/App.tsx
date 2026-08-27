function App() {
  let count = 0

  function handleClick() {
    count ++
    console.log(count)
  }
  return (
    <div>
      <h1>{count} pokemon yakaladın</h1>
      <button
        onClick={handleClick}
        className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
      > Yakala
      </button>
    </div>
  )
}
export default App
