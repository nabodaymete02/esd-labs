// The whole app: App → Header, Matrix → Cell, Stats.
// App owns the numbers. Matrix and Stats only receive them as props.
import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
import Stats from "./Stats.jsx";
import { START, incrementAt, decrementAt, zeros } from "./matrix.js";

export default function App() {
  // Section 07: hold the matrix in state, starting from START, and render
  //             <Matrix matrix={…} /> under the header.
  // Section 08: write increment(row, col): it calls the setter with incrementAt.
  //             Pass it down to Matrix as onIncrement.
  // Section 09: render <Stats matrix={…} /> NEXT TO the matrix, not inside it.
  // Section 11: load /matrix.json once, in a useEffect, and put it in the state.
  const [matrix, setMatrix] = useState(START);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch("/matrix.json")
      .then((response) => response.json())
      .then(setMatrix);
  }, []);

  function increment(row, col) {
    setMatrix((m) => incrementAt(m, row, col, step));
  }

  function decrement(row, col) {
    setMatrix((m) => decrementAt(m, row, col));
  }

  function reset() {
    setMatrix((m) => zeros(m));
  }
  return (
    <main className="app">
      <Header />
      <label>
        Step{" "}
        <input
          type="number"
          value={step}
          onChange={(event) => setStep(Number(event.target.value))}
        />
      </label>
      <button onClick={reset}>Reset</button>
      <Matrix matrix={matrix} onIncrement={increment} onDecrement={decrement} />
      <Stats matrix={matrix} />
    </main>
  );
}
