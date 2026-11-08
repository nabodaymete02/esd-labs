// Section 05 — State as a state machine
//
// The whole app's state is ONE object. It only ever changes through
// transition(state, event), which returns a NEW state (or the SAME state
// when the event changes nothing). Never change `state` itself.

export const initialState = Object.freeze({
  status: "idle",       // "idle" | "loading" | "ready" | "error"
  courses: [],          // the courses from the last successful load
  error: null,          // the error message when status is "error"
  departments: [],      // every department name, sorted — filled by the first successful load
  department: "",       // the selected department filter ("" = all)
  query: "",            // the search box text
  planner: [],          // planned courses: { id, code, title, credits }
  grades: {},           // the SGPA calculator form: { [courseId]: "A" | "A-" | … }
});

export function transition(state, event) {
  switch (event.type) {
    case "LOAD_START": {
      // status becomes "loading" and error becomes null; everything else stays
      return {
        ...state,
        status: "loading",
        error: null
      };
    }
    case "LOAD_OK": {
      // status "ready", courses from event.courses; on the FIRST success also
      // fill departments (unique, sorted) from those courses
      let departments = state.departments;

      if (departments.length === 0) {
        departments = [
          ...new Set(event.courses.map(course => course.department))
        ].sort();
      }

      return {
        ...state,
        status: "ready",
        courses: event.courses,
        departments
      };
    }
    case "LOAD_FAIL": {
      // status "error", error from event.message (keep the old courses)
      return {
        ...state,
        status: "error",
        error: event.message
      };
    }
    case "SET_DEPARTMENT": {
      // department from event.department — the SAME state if it didn't change
      if (state.department === event.department) {
        return state;
      }

      return {
        ...state,
        department: event.department
      };
    }
    case "SET_QUERY": {
      // query from event.query — the SAME state if it didn't change
      if (state.query === event.query) {
        return state;
      }

      return {
        ...state,
        query: event.query
      };
    }
    case "ADD": {
      // add { id, code, title, credits } of event.course to the planner —
      // the SAME state if it's already there, if the course is full,
      // or if it would push the planner over 24 credits.
      const course = event.course;

      // Already planned → no change.
      if (state.planner.some(c => c.id === course.id)) {
        return state;
      }

      // Full course → refuse.
      if (
        course.full === true ||
        (typeof course.seatsLeft === "number" && course.seatsLeft <= 0) ||
        (typeof course.seats === "number" && course.seats <= 0) ||
        (typeof course.enrolled === "number" &&
          typeof course.capacity === "number" &&
          course.enrolled >= course.capacity)
      ) {
        return state;
      }

      // Would go over 24 credits → refuse.
      const totalCredits = state.planner.reduce((sum, c) => sum + c.credits, 0);
      if (totalCredits + course.credits > 24) {
        return state;
      }

      // Keep only the required properties.
      const newCourse = {
        id: course.id,
        code: course.code,
        title: course.title,
        credits: course.credits
      };

      return {
        ...state,
        planner: [...state.planner, newCourse]
      };
    }
    case "REMOVE": {
      // remove the course with id event.id, AND its grade if it has one —
      // the SAME state if it isn't in the planner
      const exists = state.planner.some(
        course => course.id === event.id
      );

      if (!exists) {
        return state;
      }

      // Remove the course from planner.
      const planner = state.planner.filter(
        course => course.id !== event.id
      );

      // Remove its corresponding grade.
      const grades = { ...state.grades };
      delete grades[event.id];

      return {
        ...state,
        planner,
        grades
      };
    }
    case "SET_GRADE": {
      // grades[event.id] = event.grade (a computed key!); an empty grade ""
      // removes that course's entry — the SAME state if nothing changes
      const currentGrade = state.grades[event.id];

      // Nothing changes if the grade is already the same.
      if (currentGrade === event.grade) {
        return state;
      }

      const grades = { ...state.grades };

      if (event.grade === "") {
        delete grades[event.id];
      } else {
        grades[event.id] = event.grade;
      }

      return {
        ...state,
        grades
      };
    }

    default:
      return state;
  }
}