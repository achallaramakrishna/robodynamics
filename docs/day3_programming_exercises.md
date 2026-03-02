# Java Full Stack · Day 3 Programming Exercises

Use these bite-sized hands-on activities to reinforce the Day 3 topics. Each section lists the objective, required deliverable, and a testing note you can run during the live session.

## 1. Classes & Object Modeling

- **Objective:** Model a `LearningPlan` with fields for `moduleName`, `durationMinutes`, and `mentorName`. Provide constructors, getters/setters, and a `describe()` method that returns a formatted summary.
- **Deliverable:** Implement `LearningPlan` plus a `main` that instantiates three plans, stores them in an array, and prints each description.
- **Testing hint:** After creating the objects, call `Arrays.stream(plans).forEach(System.out::println);` and verify the output matches expectations.

## 2. Inheritance & Polymorphism

- **Objective:** Build a superclass `Mentor` with `name` and `expertise`, then subclass `RampUpMentor` (adds `onboardingDays`) and `LabMentor` (adds `labCount`). Override `getProfile()` in each subclass to include subclass-specific info.
- **Deliverable:** Create an array of `Mentor` and demonstrate polymorphism by iterating and calling `getProfile()` on each instance.
- **Testing hint:** Use `instanceof` to log which mentors are `RampUpMentor` vs `LabMentor` without casting.

## 3. Interfaces & Static Helpers

- **Objective:** Define a `Trackable` interface with `start()` and `stop()` methods. Create a `SessionTimer` class implementing `Trackable` and include a `static` factory method `SessionTimer.of(String name)` that returns a new timer with initial state.
- **Deliverable:** Implement `Trackable`, create two timers via the static factory, and simulate start/stop while printing timestamps.
- **Testing hint:** Because `start()`/`stop()` change state, call them twice and assert the recorded duration increases.

## 4. Exception Handling Scenario

- **Objective:** Simulate configuration loading by writing `ConfigLoader.load(String path)`. It should throw a checked `ConfigMissingException` (custom) when the file is absent, and catch `NumberFormatException` when a numeric property fails to parse.
- **Deliverable:** Provide a `main` that calls `ConfigLoader.load` with invalid data, catches `ConfigMissingException`, logs the message, and rethrows a wrapped `IllegalStateException`.
- **Testing hint:** Supply two property strings (one valid, one invalid) and show the logged stack traces to ensure propagation works.

## 5. Collections & Algorithms

- **Objective:** Maintain a roster map `Map<String, List<Integer>>` where the key is module name and the value is a list of scores. Implement a method `addScore(Map<String, List<Integer>> roster, String module, int score)` that uses `computeIfAbsent` to init lists.
- **Deliverable:** Use `HashMap`, populate at least three modules, sort the module names lexicographically, and print each module with average score.
- **Testing hint:** Use `Collections.sort(new ArrayList<>(roster.keySet()))` before printing and verify averages with `stream().mapToInt(Integer::intValue).average().orElse(0)`.

## 6. Challenge: Combine Concepts

- **Objective:** Create `LearningSession` with fields `title`, `mentorName`, `durationMinutes`, and `status`. Implement `Comparable<LearningSession>` to sort by duration, and add a static method `safeSchedule(List<LearningSession> sessions)` that sorts and returns the first five. Handle `IllegalArgumentException` when `durationMinutes <= 0`.
- **Deliverable:** Compose mixed sessions, intentionally create one with invalid duration to trigger exception handling, catch it in `main`, and continue scheduling.
- **Testing hint:** Use `ArrayDeque` to process the safe schedule (offerFirst/offerLast) and print the final queue order.

## Suggested Workflow for Live Training

1. Present the problem statement using the annotated slides.
2. Ask participants to work in pairs for 10 minutes while you monitor chat/polls.
3. Debrief by reviewing a correct solution (share your IDE snippet) and highlight pitfalls.
4. Launch a quick poll (“Which collection did you choose and why?”) or a debugging challenge based on their submitted code.

Use these exercises interchangeably with the labs; tie them to polls, debugging prompts, and assignment reviews to maximize engagement.
