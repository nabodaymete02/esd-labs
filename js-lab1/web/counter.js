// Section 15 exercise: a counter, three ways.
// Run it:  npm run web   → open http://localhost:5500/web/counter.html
// Follow section 15 of the lab doc: stage 1 → 2 → 3 → 4.

const countEl = document.querySelector("#count");
const parityEl = document.querySelector("#parity");
const inc = document.querySelector("#inc");
const dec = document.querySelector("#dec");
const reset = document.querySelector("#reset");
const stepInput = document.querySelector("#step");

/*
// Stage 1 — one number, one button, one line that updates the page.
let count = 0;

inc.addEventListener("click", () => {
  count += 1;
  countEl.textContent = count; // ← the line that "tells the screen"
});

// Stage 2 — TODO: make "− Step" and "Reset" work the same way, then make the
//   parity label ("even"/"odd"), the disabled "−" at zero, and the tab title
//   (document.title) follow the count. Count how many update lines you wrote.

inc.addEventListener("click", () => {
  count += 1;
  countEl.textContent = count;
  parityEl.textContent = count % 2 === 0 ? "even" : "odd";
  dec.disabled = count === 0;
  document.title = `Count: ${count}`;
});

dec.addEventListener("click", () => {
  count -= 1;
  countEl.textContent = count;
  parityEl.textContent = count % 2 === 0 ? "even" : "odd";
  dec.disabled = count === 0;
  document.title = `Count: ${count}`;
});

reset.addEventListener("click", () => {
  count = 0;
  countEl.textContent = count;
  parityEl.textContent = count % 2 === 0 ? "even" : "odd";
  dec.disabled = count === 0;
  document.title = `Count: ${count}`;
});

// Stage 3 — TODO: move every update line into ONE function, render(),
//   and call it after every change.
function render(){
  countEl.textContent = count;
  parityEl.textContent = count % 2 === 0 ? "even" : "odd";
  dec.disabled = count === 0;
  document.title = `Count: ${count}`;
}

inc.addEventListener("click", () => {
  count += 1;
  render();
});

dec.addEventListener("click", () => {
  count -= 1;
  render();
});

reset.addEventListener("click", () => {
  count = 0;
  render();
});

render();
*/

// Stage 4 — TODO: write useState in src/s15-state.js, import it, and
//   replace `let count` with  const [getCount, setCount] = useState(0, render);
//   Then add the step input as a second piece of state.
import { useState } from "../src/s15-state.js";

const [getCount, setCount] = useState(0, render);
const [getStep, setStep] = useState(1, render);

function render(){
  countEl.textContent = getCount();
  parityEl.textContent = getCount() % 2 === 0 ? "even" : "odd";
  dec.disabled = getCount() - getStep() < 0;
  document.title = `Count: ${getCount()}`;
}

inc.addEventListener("click", () => setCount((c) => c + getStep()));
dec.addEventListener("click", () => setCount((c) => c - getStep()));
reset.addEventListener("click", () => setCount(0));
stepInput.addEventListener("input", () => setStep(Number(stepInput.value) || 1));

render();
