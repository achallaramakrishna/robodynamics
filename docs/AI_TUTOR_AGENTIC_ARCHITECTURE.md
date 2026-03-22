# AI-Tutor Agentic AI Architecture

This document defines the target agentic architecture for RoboDynamics AI-Tutor.

The goal is to support multiple tutor products and large course families such as:

- MindSutra
- MindSparc
- MoneyMind
- CBSE Maths
- CBSE Science
- CBSE Hindi
- CBSE Kannada
- NEET Exam Prep
- Coding Tutors
- future tutor families beyond these

without cloning the tutor app or mixing product logic into one large client component.

## Objectives

- one shared tutor platform
- one clear Brain that orchestrates the learning flow
- product adapters for each tutor family
- trusted structured content as the source of truth
- no vector database unless a proven retrieval use case requires it
- existing MySQL remains the canonical system of record
- deterministic learning flow where correctness matters
- agentic reasoning only where it improves teaching quality
- support concept tutoring, reasoning practice, language learning, coding practice, exam prep, and scenario-based financial literacy inside one platform
- scale cleanly to hundreds or thousands of courses without forking the runtime

## Non-Goals

- not a free-form chatbot that invents lessons
- not self-modifying agents in production
- not memory built on embeddings as the source of truth
- not separate tutor apps for each course family
- not financial advice personalization for real investments, loans, or regulated recommendations
- not uncontrolled generative grading for high-stakes academic evaluation

## Core Principle

AI-Tutor must be a constrained agentic system, not an unconstrained conversational system.

The platform should operate on:

- validated lesson content
- explicit stage transitions
- product-specific adapters
- deterministic assessment rules where possible
- policy guardrails for domain-specific safety
- domain packs for subject-specific behaviors

The agents help choose, explain, evaluate, and personalize. They do not replace the lesson contract.

## High-Level Architecture

```text
Student UI
  -> Tutor API / Session Runtime
    -> Tutor Brain
      -> Content Agent
      -> Pedagogy Agent
      -> Assessment Agent
      -> Coach Agent
      -> Visual Agent
      -> Progress Agent
      -> Guard Agent
      -> Policy Agent
      -> Domain Tool Agent
    -> Product Adapter
    -> Domain Pack
    -> MySQL
    -> Content Store
```

## System Layers

### 1. Experience Layer

This is the web or app surface the learner sees.

Responsibilities:

- render coach turn
- render student turn
- render feedback
- capture answers
- play audio
- show SVG/board visuals
- render tables, budgets, timelines, code editors, lab cards, reading passages, grammar cards, and scenario cards when the product requires them

The UI should not decide pedagogy or content sequencing.

### 2. Tutor Brain

The Brain is the only orchestrator.

Responsibilities:

- load learner context
- load normalized lesson context
- determine current stage
- invoke the right agents
- assemble a learner-safe response
- persist progress and event logs

The Brain owns orchestration. It does not own product-specific content rules.

### 3. Specialist Agents

These agents are bounded services. They do not act independently on the UI.

### 4. Product Adapters

Each tutor family provides one adapter:

- `mindsutra`
- `mindsparc`
- `moneymind`
- `cbse_math`
- `cbse_science`
- `cbse_hindi`
- `cbse_kannada`
- `neet_prep`
- `coding`
- future adapters for new tutor products

The adapter maps product-specific content and policies into the shared runtime contract.

### 5. Domain Packs

A Domain Pack is a reusable capability bundle for a subject domain.

Examples:

- `math_domain_pack`
- `science_domain_pack`
- `language_domain_pack`
- `exam_prep_domain_pack`
- `coding_domain_pack`
- `financial_literacy_domain_pack`

A product adapter can reuse one or more domain packs.

Examples:

- MindSutra -> math domain pack
- CBSE Maths -> math domain pack
- CBSE Science -> science domain pack
- CBSE Hindi -> language domain pack
- CBSE Kannada -> language domain pack
- NEET Prep -> exam prep domain pack + science domain pack
- Coding Tutor -> coding domain pack
- MoneyMind -> financial literacy domain pack

This is how the platform scales beyond a few named products.

### 6. Data Layer

The system of record should remain in the existing MySQL stack.

Use MySQL for:

- learner profile
- enrollment
- tutor session
- stage progression
- attempt history
- chapter completion
- mastery summaries
- agent traces
- content metadata
- audit logs
- domain policy flags
- scenario outcomes
- tool execution summaries

Do not use a vector database as a default dependency.

## Why No Vector DB By Default

For AI-Tutor, the primary data is structured:

- learner progress by chapter and skill
- session state
- authored lesson content
- answer keys
- misconceptions
- checkpoints
- scenario state
- budget or table values when a lesson uses them
- code run results when a lesson uses coding tools

This data is better stored and queried in MySQL.

Vector storage is optional later for use cases such as:

- semantic retrieval of similar explanations
- semantic search across a large content library
- retrieval of similar misconception cases
- semantic retrieval of analogous financial literacy scenarios
- semantic retrieval of similar student coding errors

Until those use cases are real and measured, MySQL is enough.

## Product Coverage Model

The architecture must support several broad lesson families.

### 1. Procedural Concept Courses

Examples:

- MindSutra Vedic Math
- CBSE Maths
- parts of CBSE Science

Common patterns:

- explain a method or principle
- work a board example
- ask a short exercise
- check correctness
- advance or remediate

### 2. Reasoning And Pattern Courses

Examples:

- MindSparc aptitude and reasoning
- logical reasoning segments in exam prep

Common patterns:

- introduce a pattern or rule
- show a small example
- ask inference or logic questions
- explain why an answer is right or wrong

### 3. Scenario And Decision Courses

Examples:

- MoneyMind financial literacy

Common patterns:

- present a realistic scenario
- ask the learner to choose, calculate, compare, or justify
- evaluate both arithmetic and reasoning
- explain consequences and principles
- reinforce safe, age-appropriate habits

### 4. Language Learning Courses

Examples:

- CBSE Hindi
- CBSE Kannada

Common patterns:

- reading passage
- vocabulary or grammar prompt
- listening or speaking support later
- sentence formation
- comprehension and explanation

### 5. Exam Prep Courses

Examples:

- NEET Prep

Common patterns:

- concept explanation
- timed question solving
- difficulty ramping
- exam strategy hints
- weak-topic remediation
- chapter and mock-test analytics

### 6. Coding Courses

Examples:

- coding tutors for children or exam-oriented coding tracks

Common patterns:

- explain a concept
- show code or pseudocode
- ask learner to predict, fix, or write code
- run tests or compare outputs
- provide debugging guidance

The shared platform must handle all of these without a product fork.

## Agent Responsibilities

## 1. Tutor Brain

The Brain is not a general LLM persona. It is a deterministic orchestrator with bounded agent calls.

Inputs:

- learner id
- product id
- course id
- chapter code
- current session state
- latest learner action

Outputs:

- current stage
- current coach payload
- current student task
- current feedback payload
- persistence updates

The Brain should be implemented as service logic, not prompt-only logic.

## 2. Content Agent

Purpose:

- retrieve the exact normalized lesson step
- provide the right question, hint, explanation, solution, and metadata

Inputs:

- product id
- course id
- chapter code
- lesson step id

Outputs:

- teaching step
- question spec
- hint set
- solution set
- available visuals
- scenario payload when the lesson is scenario-based
- passage payload when the lesson is reading-based
- code task payload when the lesson is coding-based

This agent should operate over validated content only.

## 3. Pedagogy Agent

Purpose:

- choose what to do next in the lesson loop

Examples:

- explain first
- ask now
- give a smaller hint
- remediate
- retry
- advance
- switch from calculation to reflection or from reflection to calculation
- switch from explanation to exam drill
- switch from code reading to code writing

Inputs:

- learner mastery snapshot
- current stage
- current exercise difficulty
- recent mistakes
- adapter policy

Outputs:

- next pedagogical action
- difficulty adjustment
- remediation choice

This is a good place for bounded reasoning.

## 4. Assessment Agent

Purpose:

- evaluate learner answers

Supported modes:

- MCQ
- exact text
- numeric answer
- step sequence
- constrained rubric evaluation
- scenario choice evaluation
- justification quality against a bounded rubric
- reading comprehension evaluation
- grammar or language pattern checks
- coding output or test-result checks

Inputs:

- question spec
- learner answer
- expected answer
- acceptable alternatives
- rubric when justification is required
- tool result when the lesson uses external deterministic tools

Outputs:

- correct or incorrect
- partial credit
- misconception code
- feedback cue

Assessment should remain deterministic for school-grade content whenever possible.

## 5. Coach Agent

Purpose:

- convert lesson payloads into student-facing language

Responsibilities:

- simplify language by grade
- maintain tutor persona
- keep responses brief and clear
- preserve educational intent
- keep money-related language educational rather than advisory
- keep language-learning prompts age-appropriate and grammatically correct
- keep coding guidance beginner-safe and non-overwhelming

Inputs:

- teaching step
- product tone policy
- learner grade and confidence

Outputs:

- coach intro line
- handoff line
- corrective feedback line
- encouragement line

This agent should not rewrite facts, answer keys, or policy rules.

## 6. Visual Agent

Purpose:

- select or assemble the best learner visual

Responsibilities:

- choose existing SVGs
- decide when board steps are needed
- attach topic-appropriate visual specs
- support charts, tables, wallets, receipts, budgets, and comparison cards for MoneyMind
- support diagrams, lab cards, timelines, and process visuals for science
- support passages, sentence cards, and grammar highlights for language tutors
- support code blocks, trace tables, and execution cards for coding tutors

Inputs:

- question type
- chapter topic
- product adapter visual rules

Outputs:

- SVG asset path
- inline SVG payload
- board instruction payload
- structured visual card payload

The Visual Agent should prefer existing assets first.

## 7. Progress Agent

Purpose:

- update learner state

Responsibilities:

- resume point
- retries
- hearts / streak / XP if kept
- mastery summary
- chapter completion
- chapter recommendation
- domain-specific competency summaries such as saving, budgeting, comparison, comprehension, grammar, coding fluency, or exam readiness

Inputs:

- current attempt result
- lesson state
- chapter completion policy

Outputs:

- updated progress state
- persistence actions

This should be a deterministic service backed by MySQL.

## 8. Guard Agent

Purpose:

- stop bad runtime payloads before they reach the student

Checks:

- chapter and course mismatch
- missing learner question
- contradictory answer data
- unsafe or off-grade language
- blank coach payload
- invalid stage transition
- unsupported scenario branch
- unsupported tool output state

If the Guard Agent blocks a payload, the Brain should fail closed and log the issue.

## 9. Policy Agent

Purpose:

- apply domain rules that are stricter than normal tutoring quality checks

Examples:

- educational-only financial literacy boundaries for MoneyMind
- exam-integrity boundaries for test-prep products
- language-safety and age-appropriateness rules for language tutors
- coding sandbox rules for coding tutors

This agent can be lightweight for some products and stricter for others.

## 10. Domain Tool Agent

Purpose:

- call deterministic tools needed by particular subject domains

Examples:

- code runner or test harness for coding tutors
- symbolic or numeric checker for maths
- formula checker or scientific unit checker for science
- rubric helper for language writing evaluation
- timer and exam-mode scoring helper for NEET prep

The Domain Tool Agent should never replace the Brain. It supplies deterministic outputs back to the Brain.

## Product Adapter Model

Each product adapter must implement a shared interface.

```ts
type TutorProductAdapter = {
  productId: string;
  matchesCourseId(courseId: string): boolean;
  resolveCourseId(input: LaunchInput): string;
  normalizeLesson(rawLesson: unknown): RuntimeLesson;
  getTheme(): TutorTheme;
  getPedagogyPolicy(): PedagogyPolicy;
  getVisualPolicy(): VisualPolicy;
  getAssessmentPolicy(): AssessmentPolicy;
  getPolicyRules(): PolicyRules;
  getDomainPackIds(): string[];
};
```

### MindSutra Adapter

Responsibilities:

- map `vedic_math_g4` to `vedic_math_g8`
- normalize Vedic Math chapter content
- preserve Vedic-specific visuals and coaching tone
- use Vedic assessment rules

### MindSparc Adapter

Responsibilities:

- map `aptitude_reasoning_g4` to `aptitude_reasoning_g8`
- normalize reasoning chapter content
- use logic and reasoning visuals
- use reasoning-specific hint and evaluation rules

### MoneyMind Adapter

Responsibilities:

- map MoneyMind course families and grade bands
- normalize scenario-based financial literacy content
- support mixed activity types: compute, compare, choose, justify, reflect
- attach finance-safe pedagogy and policy rules
- use visual types such as budget tables, receipt cards, goal jars, savings trackers, and simple charts

### CBSE Maths Adapter

Responsibilities:

- support grade-wise curriculum mapping
- normalize textbook-aligned math lessons
- support procedural and conceptual math questions
- reuse math domain tools and visuals

### CBSE Science Adapter

Responsibilities:

- support physics, chemistry, and biology chapter families
- normalize concept, diagram, process, and experiment-oriented lessons
- support science visuals and explanation patterns

### CBSE Hindi And Kannada Adapters

Responsibilities:

- support reading, grammar, vocabulary, comprehension, and writing tasks
- normalize language passages and question sets
- support rubric-based language evaluation with bounded rules

### NEET Prep Adapter

Responsibilities:

- support exam-mode lessons, timed drills, and mock tests
- combine science content with exam strategy policy
- track accuracy, speed, and weak-topic recovery

### Coding Adapter

Responsibilities:

- support concept, debugging, code reading, and code writing tasks
- attach code-runner or deterministic execution tools through the domain tool agent
- normalize code snippets, tests, and expected outputs

The product adapter is how new tutor families are added without cloning the runtime.

## Runtime Lesson Contract

All content must normalize into one shared contract before runtime.

```ts
type RuntimeLesson = {
  productId: string;
  courseId: string;
  chapterCode: string;
  title: string;
  gradeBand: string;
  subjectDomain: string;
  goals: string[];
  teachingSteps: TeachingStep[];
  questionPool: RuntimeQuestion[];
  exerciseFlow: ExerciseGroup[];
  visuals: VisualSpec[];
  progressionRules: ProgressionRule[];
  scenarioRules?: ScenarioRule[];
  policyTags?: string[];
  toolRequirements?: ToolRequirement[];
};
```

### RuntimeQuestion

```ts
type RuntimeQuestion = {
  questionId: string;
  exerciseGroup: string;
  questionType:
    | 'mcq'
    | 'text'
    | 'number'
    | 'step'
    | 'scenario_choice'
    | 'short_justification'
    | 'reading_comprehension'
    | 'grammar_fill'
    | 'coding_output'
    | 'coding_write';
  questionText: string;
  options?: string[];
  expectedAnswer?: string;
  acceptableAnswers?: string[];
  hint?: string;
  solution?: string;
  passage?: PassageSpec;
  starterCode?: string;
  tests?: ToolTestSpec[];
  visual?: VisualSpec;
  rubric?: RubricSpec;
  difficulty?: 'easy' | 'medium' | 'hard';
};
```

No raw course JSON should flow directly into the UI.

## Launch Resolution

Launch identity must be normalized once and reused everywhere.

```ts
type TutorLaunchConfig = {
  productId: string;
  courseId: string;
  chapterCode: string;
  grade?: string;
  launchMode: 'demo' | 'enrolled' | 'resume' | 'restart' | 'assignment' | 'mock_test';
  learnerId?: string;
  enrollmentId?: string;
  returnUrl?: string;
};
```

Resolution priority:

1. explicit course id
2. chapter prefix
3. product + grade mapping
4. adapter fallback
5. fail closed if unresolved

The current fragmented course resolution should be replaced by this single resolver.

## Stage Machine

The tutor runtime should not derive UI state from many booleans.

Use explicit stages:

- `boot`
- `entry`
- `coach_intro`
- `coach_demo`
- `student_turn`
- `evaluate`
- `feedback`
- `remediate`
- `review`
- `complete`
- `error`

The Brain decides stage transitions.

The UI only renders the current stage payload.

Products can reuse the same stage machine with different content payloads inside the stages.

Examples:

- MoneyMind:
  - `coach_intro`: scenario setup
  - `coach_demo`: worked budgeting example
- NEET Prep:
  - `student_turn`: timed exam question
  - `feedback`: accuracy plus strategy note
- Coding Tutor:
  - `student_turn`: code prediction or coding task
  - `evaluate`: test-run result + explanation

## MySQL Data Model

Use the existing MySQL system for canonical state.

Recommended tables:

- `tutor_products`
- `tutor_courses`
- `tutor_chapters`
- `tutor_sessions`
- `tutor_session_events`
- `tutor_attempts`
- `tutor_progress`
- `tutor_mastery`
- `tutor_agent_traces`
- `tutor_content_audit`
- `tutor_policy_events`
- `tutor_scenario_state`
- `tutor_domain_tool_runs`
- `tutor_exam_metrics`

### `tutor_sessions`

Store:

- session id
- learner id
- product id
- course id
- chapter code
- launch mode
- current stage
- current question id
- resume cursor
- status

### `tutor_session_events`

Store:

- event id
- session id
- event type
- stage
- payload snapshot
- created at

This gives replayability and auditability.

### `tutor_agent_traces`

Store:

- trace id
- session id
- agent name
- input summary
- output summary
- decision code
- latency
- success signal

This is experience logging, not autonomous self-training.

### `tutor_policy_events`

Store:

- policy event id
- session id
- product id
- blocked or warned payload
- rule code
- resolution
- created at

### `tutor_domain_tool_runs`

Store:

- tool run id
- session id
- tool name
- input summary
- result summary
- pass or fail
- latency
- created at

This is important for coding, science, and math tool-assisted evaluation.

## Memory Model

Use three memory layers.

### 1. Student Memory

Stored in MySQL.

Examples:

- mastery by chapter
- misconception history
- retry history
- pace preference
- resume point
- domain competency summaries such as saving, budgeting, comparison, comprehension, grammar, coding fluency, or exam readiness

### 2. Content Memory

Stored in structured content plus metadata tables.

Examples:

- normalized lessons
- hints
- visuals
- rubrics
- misconception map
- scenario templates
- passages
- code starter templates
- lab or diagram assets

### 3. Agent Experience Memory

Stored as traces in MySQL.

Examples:

- what action was chosen
- what hint was used
- whether the learner succeeded
- whether remediation worked
- whether a scenario branch confused learners
- whether a code hint improved completion
- whether an exam strategy hint improved timing

This should improve the system through offline review and policy updates, not live self-modification.

## Deterministic vs Agentic Boundaries

### Deterministic

- launch resolution
- chapter lookup
- session creation
- stage transition rules
- answer key comparison
- progress persistence
- entitlement and enrollment
- policy rule enforcement
- tool execution and result capture

### Agentic

- hint wording
- coaching phrasing
- remediation choice
- difficulty adjustment
- visual selection
- partial-answer interpretation
- bounded evaluation of short justifications
- bounded evaluation of learner explanations in language or science when rubric-backed

This boundary is mandatory for educational quality.

## Content Pipeline

The agentic runtime is only as good as the content it serves.

Every chapter must pass a content pipeline before use.

Validation checks:

- valid JSON
- correct chapter metadata
- question presence
- answer-key consistency
- hint and solution presence
- SVG or visual presence where needed
- grade-appropriate language
- no mojibake or encoding corruption
- no chapter and topic mismatch
- domain policy tags where needed
- scenario coherence where scenario paths exist
- passage quality for language tutors
- tool requirement validity for coding and science tools
- exam metadata validity for exam-prep products

Only validated content should enter runtime normalization.

## SVG And Rich Visual Strategy

Use existing SVG libraries first.

Current asset groups already cover:

- vedic
- series
- arrows
- directions
- coding
- clocks
- logic
- shapes
- seating
- relations
- data
- patterns

Each adapter should map chapter topics to preferred assets.

Examples:

- MindSutra:
  - `vm_near_100_deficit.svg`
  - `vm_division_flag.svg`
  - `vm_criss_cross_4x4.svg`

- MindSparc:
  - `logic/venn_2.svg`
  - `directions/compass.svg`
  - `coding/alphabet_grid.svg`
  - `seating/seating_circular_8.svg`

- CBSE Science:
  - process diagrams
  - labeled figures
  - tables and charts

- Language Tutors:
  - reading cards
  - word maps
  - sentence tiles

- MoneyMind:
  - budget tables
  - spending buckets
  - needs vs wants cards
  - savings goal jars
  - receipt or invoice cards
  - simple comparison charts

- Coding Tutors:
  - code trace tables
  - flow diagrams
  - input-output cards

If a chapter needs a richer visual and no asset exists, add a new SVG or structured card asset under the same asset library approach.

## MoneyMind-Specific Design Notes

MoneyMind should fit the same platform, but it adds a few real requirements.

### 1. Scenario State

Some lessons need temporary scenario variables such as:

- pocket money amount
- savings goal
- item prices
- discount percentage
- weekly budget

These should live in structured session state, not in free-form prompts.

### 2. Mixed Assessment

A MoneyMind lesson may need both:

- arithmetic correctness
- decision quality
- explanation quality

So the assessment path should support a mixed score made of deterministic checks plus bounded rubric checks.

### 3. Safety And Policy

MoneyMind must stay educational.

Allowed examples:

- budgeting
- savings goals
- needs vs wants
- comparison shopping
- simple interest concepts for learning
- digital payment awareness
- fraud awareness basics

Not allowed as open-ended tutoring behavior:

- personalized investing advice
- real loan recommendations
- tax planning advice
- guaranteed return claims
- product endorsements

### 4. Visual Richness

MoneyMind will benefit from richer cards and charts than pure math tutoring. The architecture already supports that through `VisualSpec` and `scenarioRules` without changing the Brain.

## Exam-Prep-Specific Design Notes

Exam-prep tutors such as NEET need additional metrics.

Examples:

- speed
- accuracy
- topic weakness
- attempt confidence
- timed-mode behavior

These should be treated as structured progress data, not free-form memory.

## Coding-Tutor-Specific Design Notes

Coding tutors need deterministic tooling.

Required capabilities:

- sandboxed execution
- test result capture
- starter code support
- syntax and runtime error capture
- safe feedback without exposing raw unsafe execution details

These should be handled through the Domain Tool Agent and MySQL run logs.

## Language-Tutor-Specific Design Notes

Language tutors need richer content structures.

Examples:

- passages
- dialogues
- grammar cards
- writing prompts
- vocabulary sets

Evaluation should stay bounded by rubric and pattern rules. The system should avoid unconstrained essay grading for high-stakes outcomes.

## Rollout Plan

### Phase 1: Content Hardening

- audit all MindSutra chapters
- audit all MindSparc chapters
- define content contracts for MoneyMind, CBSE subjects, NEET prep, and coding tutors before large-scale authoring
- normalize content into the shared runtime contract
- fix encoding, missing questions, weak prompts, and visual gaps

### Phase 2: Shared Brain Runtime

- implement launch resolver
- implement stage machine
- implement Brain service
- implement Content, Assessment, Progress, Guard, Policy, and Domain Tool agents

### Phase 3: Product Adapters And Domain Packs

- implement MindSutra adapter
- implement MindSparc adapter
- implement MoneyMind adapter
- implement CBSE subject adapters
- implement NEET prep adapter
- implement coding adapter
- implement the reusable domain packs

### Phase 4: Teaching Quality Layer

- implement Coach agent
- implement Visual agent
- improve remediation logic
- add controlled adaptive paths

### Phase 5: Experience Logging and Offline Improvement

- persist agent traces in MySQL
- review low-quality sessions
- tune prompts and policies
- add course QA dashboards

## Success Criteria

The architecture is successful when:

- new tutor families are added through adapters, not forks
- launch routing always opens the correct course and chapter
- coach and student states are clean and predictable
- content defects are caught before runtime
- every agent action is reviewable in MySQL traces
- policy-sensitive products like MoneyMind can run safely on the same platform
- coding and exam-prep products can use deterministic tools without changing the Brain
- no vector DB is required for the core tutor platform

## Immediate Next Steps

1. finish the full content audit for MindSutra and MindSparc
2. define the normalized `RuntimeLesson` schema in code
3. create the product adapter and domain pack interfaces
4. implement the shared launch resolver
5. replace boolean tutor state with the explicit stage machine
6. add the `Policy Agent` and `Domain Tool Agent` hook points early so the platform is future-safe

This architecture gives AI-Tutor a scalable foundation for thousands of courses without turning the runtime into a large, fragile, product-specific code path.
