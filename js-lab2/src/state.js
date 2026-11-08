// useState — from JS Lab 1, section 15, with its smarter setState. This lab's app is built on it.
// It's your own code: `npm run carry -- ../js-lab1` copies your js-lab1/src/s15-state.js
// over this file (section 01 of the lab doc). Until then, calling it throws "TODO".
//
//   const [getState, setState] = useState(initial, render);
//   setState(next) or setState((prev) => next) stores the new state and calls render(),
//   unless the new state is the SAME value (Object.is), in which case nothing happens.
export function useState(initial, onChange) {
  let state = initial;

  function getState() {
    return state;
  }

  function setState(next) {
    // Support functional updates.
    const newState =
      typeof next === "function"
        ? next(state)
        : next;

    // Avoid unnecessary updates and rendering.
    if (Object.is(state, newState)) {
      return;
    }

    // Update the stored state.
    state = newState;

    // Trigger rendering.
    onChange();
  }

  return [getState, setState];
}

