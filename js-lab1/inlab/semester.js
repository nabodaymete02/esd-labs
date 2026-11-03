// IN-LAB TASK (AI closed). Do this in the lab, not at home.
//
// A study plan groups planned course ids by semester:
//
//   const plan = {
//     student: "Asha",
//     semesters: { "2026-odd": [4, 10], "2027-even": [18] },
//   };
//
// Write addToSemester(plan, semester, courseId). It returns a NEW plan where
// that semester's list ends with courseId. Rules:
//   - never change the input (the tests freeze it — mutation throws)
//   - the student and every OTHER semester stay the SAME references
//   - a semester that does not exist yet is created
//   - if the id is already in that semester, return the SAME plan
//
// Stretch: moveCourse(plan, from, to, courseId) — out of one semester, into another.

export function addToSemester(plan, semester, courseId) {
  // throw new Error("TODO");

  const oldList = plan.semesters[semester] || [];

  if(oldList.includes(courseId)) return plan;

  const newList = [...oldList, courseId];
  const newSemesters = { ...plan.semesters, [semester] : newList };
  return { ...plan, semesters: newSemesters };
}

export function moveCourse(plan, from, to, courseId) {
  // throw new Error("TODO");

  const fromList = plan.semesters[from] || [];

  if(!fromList.includes(courseId)) return plan;

  const newFromList = fromList.filter((id) => id !== courseId);
  const newToList = [...(plan.semesters[to] || []), courseId];

  const newSemesters = {
    ...plan.semesters,
    [from]: newFromList,
    [to]: newToList,
  };
  return {...plan, semesters: newSemesters};

}
