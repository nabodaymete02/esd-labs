// Section 06 — Scope and closures

// Each call returns a NEW generator with its own counter:
// const next = createIdGenerator("ORD"); next() → "ORD-1", next() → "ORD-2"
export function createIdGenerator(prefix) {
  // throw new Error("TODO");
  let count = 0;
  
  return function(){
    count++;
    return `${prefix}-${count}`;
  };
}

// A function factory: returns a check that "remembers" the limit.
export function makeCreditCheck(limit) {
  // throw new Error("TODO");
  return function(currentCredits){
    return currentCredits <= limit;
  };
}

// A value only a function can change.
// Returns [get, set]. The value lives in the closure; nothing else can reach it.
export function createBox(initial) {
  // throw new Error("TODO");
  let value = initial;
  const get = () => value;
  const set = (newValue) => {
    value = newValue;
  };

  return [get, set];
}
