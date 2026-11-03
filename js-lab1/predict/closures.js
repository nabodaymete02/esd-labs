// PREDICT, THEN RUN.   node predict/closures.js
// For each block, write your prediction in the comment BEFORE running.
// The point is the gap between what you expected and what happened.

// ---- 1. Two counters --------------------------------------------------
function makeCounter() {
  let n = 0;
  return () => ++n;
}
const a = makeCounter();
const b = makeCounter();
a(); a();
console.log("1:", a(), b());
// Prediction: 
// first a is initialized with that makeCounter() function returns which is the arrow function.
// then a(); a(); increments the value by 2.
// again a() increments the value by 1 and returns value to be 3.
// b() return 1;

// ---- 2. A closure sees the VARIABLE, not a copy of its value ----------
let total = 0;
const report = () => console.log("2:", total);
total = 24;
report();
// Prediction:
// 2: 24 would be the output 
// because report() is called after total is changed to 24


// ---- 3. var vs let in a loop ------------------------------------------
for (var i = 0; i < 3; i++) setTimeout(() => console.log("3 var:", i), 0);
for (let j = 0; j < 3; j++) setTimeout(() => console.log("3 let:", j), 0);
// Prediction:
// 0 1 2 in let as loop binding is per iteration
// 3 3 3 in var as loop binding is shared

// ---- 4. One function call = one set of variables (React's model) -----
// Imagine render() is a React component running once per render.
function render(count) {
  const handleClick = () => console.log("4: clicked, count was", count);
  return handleClick;
}
const firstRender = render(0);
const secondRender = render(1);
firstRender();
secondRender();
// Prediction:
// 4: clicked, count was 0
// becuase render(0) is called which creates handleClick and it returns handleClick
// firstRender receives the returned function
// 4: clicked, count was 1
// because similarly handleClick is passed to secondRender by render(1)

// ---- 5. The stale handler ---------------------------------------------
// A timer set up during the FIRST render fires later, after the screen
// already shows count = 1. Which count does it log?
function renderWithTimer(count) {
  setTimeout(() => console.log("5: timer from the render where count was", count), 10);
}
renderWithTimer(0);
renderWithTimer(1);
// Prediction:
// 5: timer from the render where count was 0
// becuase 0 is passed as count
// 5: timer from the render where count was 1
// becuase 1 is passed as count
