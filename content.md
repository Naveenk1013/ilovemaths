PROJECT GOAL:
Create a completely free platform where any student can understand mathematics clearly, intuitively, and interactively.

LEARNING PHILOSOPHY:
- Start from zero (no assumptions of prior knowledge)
- Build concepts step-by-step
- Focus on understanding, not memorization
- Use interaction, visuals, and examples to improve retention

CONTENT STRUCTURE (MANDATORY)

The application must follow this exact flow:

1. FOUNDATION PAGE (ENTRY LEVEL)

This page must display:
- All basic math rules and identities in a clean, visual format

Examples:
- + + = +
- + - = -
- - - = +
- (a + b)² = a² + 2ab + b²
- (a - b)² = a² - 2ab + b²
- a² - b² = (a - b)(a + b)

Requirements:
- Highly visual layout (cards or grid)
- Simple explanations (1–2 lines max)
- No complexity
- Acts as a quick memory builder

---

2. TOPIC NAVIGATION

After foundation:
- Show structured topics (Basic → Intermediate → Advanced)

Examples:
- Arithmetic Basics
- Algebra
- Functions
- Calculus
- Geometry

Each topic must be modular and independent.

---

3. TOPIC LEARNING MODULE (CORE SYSTEM)

Each topic MUST follow this exact structure:

A. Concept Explanation
- Simple language
- No jargon without explanation
- Build intuition first

B. Visual / Formula Representation
- Highlight key formulas
- Use visual blocks or diagrams where possible

C. Real-Life Analogy
- Explain using practical situations
- Example: speed, money, growth, etc.

D. Worked Examples
- Step-by-step solutions
- No skipped steps

E. Practice Questions
- MCQs and input-based
- Difficulty levels: easy, medium, hard

F. Instant Feedback
- Show correct/incorrect immediately
- Always include explanation

G. Tips & Tricks
- Shortcuts
- Memory hacks
- Common mistakes

H. Quick Revision Box
- 30-second recap of key points

---

4. INTERACTION REQUIREMENTS

- User must interact every 20–40 seconds
- Include:
  - Click-based answers
  - Step-by-step reveal
  - Mini quizzes
- Avoid passive reading blocks

---

5. UI/UX PRINCIPLES

- Clean and minimal
- Mobile-first
- Large readable text
- High contrast
- No clutter
- No unnecessary animations

---

6. TECHNICAL RULES

- Modular architecture (topic-based)
- Separate content, logic, and UI
- Reusable quiz engine
- No hardcoded logic inside UI
- Keep code simple and scalable

---

7. CONTENT QUALITY RULES

- No vague explanations
- No unnecessary theory
- Every concept must include:
  - Example
  - Application
  - Practice

- Use:
  - Analogies
  - Real-life scenarios
  - Visual thinking

---

8. WHAT TO AVOID

- Overloading with theory
- Complex UI
- Long paragraphs
- Skipping steps in solutions
- Feature creep

---

9. OUTPUT EXPECTATION

When generating any feature or topic:
- Follow the full structure strictly
- Keep explanations simple but precise
- Ensure reusability of code
- Maintain consistency across all topics

---

CURRENT TASK:
[Define task here]

Before generating output:
- Ensure alignment with project goal
- Follow structure strictly
- Keep learning clarity as top priority




Basic Mathematics

specially focused on the syllabus Syllabus of BCS-012.

unit 1 : Core Unique Topics
unit 2 : Number Systems
unit 3 : Real Number System
unit 4 : Logarithms
unit 5 : Sets
unit 6 : Relations and Functions
unit 7 : Binary Operations
unit 8 : Logic
unit 9 : Combinatorics
unit 10 : Permutations and Combinations
unit 11 : Mathematical Induction
unit 12 : Sequences and Series
unit 13 : Trigonometry (I & II combined)
unit 14 : Complex Numbers
unit 15 : Equations (including Quadratic)
unit 16 : Inequalities
unit 17 : Matrices
unit 18 : Determinants
unit 19 : Applications of Matrices & Determinants
unit 20 : Vectors
unit 21 : Three Dimensional Geometry
unit 22 : Differential Calculus
unit 23 : Applications of Differential Calculus
unit 24 : Integration
unit 25 : Applications of Integral Calculus
unit 26 : Linear Differential Equations
unit 27 : Exact Equations
unit 28 : Applications of Differential Equations
unit 29 : Linear Programming
unit 30 : Statistics
unit 31 : Correlation and Regression
unit 32 : Probability
unit 33 : Discrete Probability Distributions
unit 34 : Statistical Estimation
unit 35 : Differential Geometry

1. CORE IDEA

Do NOT hardcode topics in UI.

Instead:

Maintain a global topic library
Map courses → topics

This gives:

Reusability
Scalability
Clean filtering

[
  { "id": "determinants", "title": "Determinants" },
  { "id": "matrices", "title": "Matrices" },
  { "id": "induction", "title": "Mathematical Induction" },
  { "id": "sequence-series", "title": "Sequence and Series" },
  { "id": "complex", "title": "Complex Numbers" },
  { "id": "equations", "title": "Equations" },
  { "id": "inequalities", "title": "Inequalities" },
  { "id": "diff-calculus", "title": "Differential Calculus" },
  { "id": "diff-app", "title": "Applications of Differential Calculus" },
  { "id": "integration", "title": "Integration" },
  { "id": "int-app", "title": "Applications of Integration" },
  { "id": "vectors", "title": "Vectors" },
  { "id": "3d-geometry", "title": "Three Dimensional Geometry" },
  { "id": "linear-programming", "title": "Linear Programming" },
  { "id": "basic-foundation", "title": "Basic Foundation" },
  { "id": "arithmetic", "title": "Arithmetic Basics" },
  { "id": "algebra", "title": "Algebra" },
  { "id": "functions", "title": "Functions" },
  { "id": "calculus", "title": "Calculus" },
  { "id": "geometry", "title": "Geometry" },
  { "id": "trigonometry", "title": "Trigonometry" },
  { "id": "statistics", "title": "Statistics" },
  { "id": "probability", "title": "Probability" },
  { "id": "number-systems", "title": "Number Systems" },
  { "id": "binary-operations", "title": "Binary Operations" },
  { "id": "logic", "title": "Logic" },
  { "id": "combinatorics", "title": "Combinatorics" },
  { "id": "inequalities", "title": "Inequalities" },
  { "id": "diff-calculus", "title": "Differential Calculus" },
  { "id": "diff-app", "title": "Applications of Differential Calculus" },
  { "id": "integration", "title": "Integration" },
  { "id": "int-app", "title": "Applications of Integration" },
  { "id": "vectors", "title": "Vectors" },
  { "id": "3d-geometry", "title": "Three Dimensional Geometry" },
  { "id": "linear-programming", "title": "Linear Programming" },
  { "id": "statistics", "title": "Statistics" },
  { "id": "correlation-regression", "title": "Correlation and Regression" },
  { "id": "probability", "title": "Probability" },
  { "id": "discrete-probability-distributions", "title": "Discrete Probability Distributions" },
  { "id": "statistical-estimation", "title": "Statistical Estimation" },
  { "id": "differential-geometry", "title": "Differential Geometry" }
] (avoid the repetition of the topics if i have amnually entered)

{
  "courseId": "bcs-012",
  "title": "BCS-012 Basic Mathematics",
  "topics": [
    "determinants",
    "matrices",
    "induction",
    "sequence-series",
    "complex",
    "equations",
    "inequalities",
    "diff-calculus",
    "diff-app",
    "integration",
    "int-app",
    "vectors",
    "3d-geometry",
    "linear-programming"
  ]
}

FRONTEND FEATURE DESIGN
Step 1: Course Selection UI

Simple dropdown or cards:

<select id="courseSelect">
  <option value="all">All Topics</option>
  <option value="bcs-012">BCS-012</option>
</select>

function getFilteredTopics(courseId) {
  if (courseId === "all") return allTopics;

  const course = courses.find(c => c.courseId === courseId);
  return allTopics.filter(topic => course.topics.includes(topic.id));
}

Progress Tracking 
{
  "userId": "123",
  "courseId": "bcs-012",
  "completedTopics": ["determinants"]
}

Course Card
BCS-012 Basic Mathematics
14 Topics
Beginner → Advanced

Click → loads course

WHAT YOU MUST AVOID
Hardcoding topics inside HTML (your current mistake)
Mixing course logic with UI
Duplicating topics for each course


You should now:

Extract your current quiz topics into topic modules
Create:
topics.json
courses.json
Implement filtering logic