// Section 11 — The array toolkit for UIs
import { toCardView } from "./s04-functions.js";
import { byField } from "./s05-higher-order.js";

// Courses in one department. Case-insensitive.
export function byDepartment(courses, department) {
  // throw new Error("TODO");
  return courses.filter(
    course => course.department.toLowerCase() === department.toLowerCase()
  );
}

// Courses that still have seats.
export function openOnly(courses) {
  // throw new Error("TODO");
  return courses.filter(course => course.seatsLeft > 0);
}

// Case-insensitive match on code OR title. A blank query returns everything.
export function searchCourses(courses, query) {
  // throw new Error("TODO");
  const q = query.trim().toLowerCase();

  if(q === "") return courses;

  return courses.filter(course =>
    course.code.toLowerCase().includes(q) ||
    course.title.toLowerCase().includes(q)
  );
}

// The course with this code (case-insensitive), or undefined.
export function findByCode(courses, code) {
  // throw new Error("TODO");
  return courses.find(
    course => course.code.toLowerCase() === code.toLowerCase()
  );
}

// Sum of credits.
export function totalCredits(courses) {
  // throw new Error("TODO");
  return courses.reduce((total, course) => total + course.credits, 0);
}

// { "Computer Science": 5, "Electronics": 4, ... }
export function countByDepartment(courses) {
  // throw new Error("TODO");
  return courses.reduce((counts, course) => {
    counts[course.department] = (counts[course.department] || 0) + 1;
    return counts;
  }, {});
}

// Unique department names, sorted A→Z.
export function departments(courses) {
  // throw new Error("TODO");
  return [...new Set(courses.map(course => course.department))].sort();
}

// A sorted COPY. The input must not change. Reuse byField from section 05.
export function sortedBy(courses, field) {
  // throw new Error("TODO");
  return [...courses].sort(byField(field));
}

// Is at least one course full?
export function anyFull(courses) {
  // throw new Error("TODO");
  return courses.some(course => course.seatsLeft === 0);
}

// Does every course have at least `n` seats?
export function allHaveSeats(courses, n = 1) {
  // throw new Error("TODO");
  return courses.every(course => course.seatsLeft >= n);
}

// The cards a department page shows: that department, open courses only,
// sorted by code, turned into card views. One chain.
export function courseCards(courses, department) {
  // throw new Error("TODO");
  return courses
    .filter(course => course.department.toLowerCase() === department.toLowerCase())
    .filter(course => course.seatsLeft > 0)
    .sort(byField("code"))
    .map(toCardView);
}

// Planner ids → the course objects, in planner order. Unknown ids are skipped.
export function plannerCourses(planner, courses) {
  // throw new Error("TODO");
  return planner
    .map(id => courses.find(course => course.id === id))
    .filter(course => course !== undefined);
}

// Total credits of the planned courses.
export function plannerCredits(planner, courses) {
  // throw new Error("TODO");
  return totalCredits(plannerCourses(planner, courses));
}

// Can this course be added? It must exist, have a seat, not already be in
// the planner, and keep the total within the limit (24 by default).
export function canAdd(planner, courses, courseId, limit = 24) {
  // throw new Error("TODO");
  const course = courses.find(course => course.id === courseId);
  if(!course) return false;
  if(course.seatsLeft <= 0) return false;
  if(planner.includes(courseId)) return false;

  return plannerCredits(planner, courses) + course.credits <= limit;
}
