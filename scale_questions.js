const fs = require('fs');
const path = require('path');

const topicsDir = 'c:\\Users\\NAVEEN\\Desktop\\BCA\\maths\\I-love-maths\\topics';

const NEW_QUESTIONS_MAP = {
  // ── ALGEBRA UNIT ──
  'binary-operations.html': [
    { q: "Is the operation $$ a * b = a + b + 2 $$ associative?", expr: "", opts: ["Yes", "No"], ans: 0, diff: "medium", exp: "Yes. Let's verify: $$ (a * b) * c = (a + b + 2) * c = a + b + c + 4 $$. And $$ a * (b * c) = a * (b + c + 2) = a + b + c + 4 $$. Since both are equal, the operation is associative." },
    { q: "Find the identity element for the binary operation $$ a * b = ab/3 $$ on non-zero rational numbers.", expr: "", opts: ["$$ 1 $$", "$$ 3 $$", "$$ 1/3 $$", "No identity element exists"], ans: 1, diff: "hard", exp: "An element $e$ is the identity if $$ a * e = a $$. So, $$ \\frac{a \\cdot e}{3} = a \\implies e = 3 $$." },
    { q: "Evaluate $$ (2 * 3) * 4 $$ for operation $$ a * b = a^2 + b $$", expr: "", opts: ["$$ 29 $$", "$$ 53 $$", "$$ 41 $$", "$$ 20 $$"], ans: 1, diff: "medium", exp: "First, $$ 2 * 3 = 2^2 + 3 = 7 $$. Then, $$ 7 * 4 = 7^2 + 4 = 49 + 4 = 53 $$." },
    { q: "For a binary operation to have an inverse, which of the following is absolutely required first?", expr: "", opts: ["Commutativity", "Associativity", "Identity element", "Distributivity"], ans: 2, diff: "easy", exp: "An inverse element $a^{-1}$ requires an identity element $e$ to satisfy $$ a * a^{-1} = e $$. Without an identity element, inverses cannot be defined." },
    { q: "Under what conditions is a binary operation commutative?", expr: "", opts: ["$$ a * b = b * a $$ for all $a, b$", "$$ (a * b) * c = a * (b * c) $$", "$$ a * e = a $$", "$$ a * b = a + b $$"], ans: 0, diff: "easy", exp: "A binary operation is commutative if changing the order of the operands does not change the result: $$ a * b = b * a $$." }
  ],
  'complex.html': [
    { q: "What is the polar form of the complex number $$ 1 + i $$?", expr: "", opts: ["$$ \\sqrt{2}(\\cos \\frac{\\pi}{4} + i\\sin \\frac{\\pi}{4}) $$", "$$ 2(\\cos \\frac{\\pi}{4} + i\\sin \\frac{\\pi}{4}) $$", "$$ \\sqrt{2}(\\cos \\frac{\\pi}{2} + i\\sin \\frac{\\pi}{2}) $$", "$$ \\cos \\frac{\\pi}{4} + i\\sin \\frac{\\pi}{4} $$"], ans: 0, diff: "medium", exp: "The modulus $r = \\sqrt{1^2 + 1^2} = \\sqrt{2}$. The argument $\\theta = \\tan^{-1}(1/1) = \\frac{\\pi}{4}$. Thus, the polar form is $$ \\sqrt{2}(\\cos \\frac{\\pi}{4} + i\\sin \\frac{\\pi}{4}) $$." },
    { q: "Find the conjugate of $$ (2 + 3i)(1 - i) $$", expr: "", opts: ["$$ 5 - i $$", "$$ 5 + i $$", "$$ 1 - 5i $$", "$$ 1 + 5i $$"], ans: 0, diff: "medium", exp: "Expand first: $$ (2 + 3i)(1 - i) = 2 - 2i + 3i - 3i^2 = 5 + i $$. The conjugate of $5+i$ is $5-i$." },
    { q: "What is the value of $$ i^{402} $$?", expr: "", opts: ["$$ 1 $$", "$$ -1 $$", "$$ i $$", "$$ -i $$"], ans: 1, diff: "easy", exp: "Since $i^4 = 1$, we divide the power 402 by 4: $$ 402 = 4 \\times 100 + 2 $$. Thus, $$ i^{402} = (i^4)^{100} \\cdot i^2 = 1 \\cdot (-1) = -1 $$." },
    { q: "Evaluate the modulus of $$ \\frac{3 + 4i}{1 - 2i} $$", expr: "", opts: ["$$ \\sqrt{5} $$", "$$ 5 $$", "$$ \\sqrt{2} $$", "$$ 1 $$"], ans: 0, diff: "hard", exp: "Modulus of a quotient is the quotient of their moduli: $$ |3+4i| = \\sqrt{3^2+4^2}=5 $$, and $$ |1-2i| = \\sqrt{1^2+(-2)^2}=\\sqrt{5} $$. Thus, the modulus is $$ 5/\\sqrt{5} = \\sqrt{5} $$." },
    { q: "By De Moivre's Theorem, what is $$ (\\cos \\theta + i\\sin \\theta)^n $$ equal to?", expr: "", opts: ["$$ \\cos(n\\theta) + i\\sin(n\\theta) $$", "$$ n(\\cos \\theta + i\\sin \\theta) $$", "$$ \\cos^n \\theta + i\\sin^n \\theta $$", "$$ \\cos(n\\theta) - i\\sin(n\\theta) $$"], ans: 0, diff: "easy", exp: "De Moivre's Theorem states that raising a complex number in polar form to the power $n$ multiplies the argument by $n$: $$ (\\cos \\theta + i\\sin \\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta) $$." }
  ],
  'inequalities.html': [
    { q: "Solve the inequality: $$ -3x + 7 < 19 $$", expr: "", opts: ["$$ x > -4 $$", "$$ x < -4 $$", "$$ x > 4 $$", "$$ x < 4 $$"], ans: 0, diff: "easy", exp: "Subtract 7 from both sides: $$ -3x < 12 $$. Divide by -3 and reverse the inequality sign: $$ x > -4 $$." },
    { q: "What is the solution set for the absolute value inequality $$ |2x - 3| \\le 5 $$?", expr: "", opts: ["$$ [-1, 4] $$", "$$ (-\\infty, -1] \\cup [4, \\infty) $$", "$$ [1, 4] $$", "$$ [-4, 1] $$"], ans: 0, diff: "medium", exp: "Rewrite as a compound inequality: $$ -5 \\le 2x - 3 \\le 5 $$. Add 3 to all parts: $$ -2 \\le 2x \\le 8 $$. Divide by 2: $$ -1 \\le x \\le 4 $$, which is the interval $$ [-1, 4] $$." },
    { q: "Solve the quadratic inequality: $$ x^2 - 3x - 10 > 0 $$", expr: "", opts: ["$$ (-\\infty, -2) \\cup (5, \\infty) $$", "$$ (-2, 5) $$", "$$ [5, \\infty) $$", "$$ (-\\infty, -2] $$"], ans: 0, diff: "medium", exp: "Factor the quadratic expression: $$ (x - 5)(x + 2) > 0 $$. The critical points are -2 and 5. Testing intervals shows the product is positive when $x < -2$ or $x > 5$." },
    { q: "If $$ a < b $$ and $$ c < 0 $$, which of the following is true?", expr: "", opts: ["$$ ac < bc $$", "$$ ac > bc $$", "$$ a/c < b/c $$", "$$ ac = bc $$"], ans: 1, diff: "easy", exp: "Multiplying or dividing both sides of an inequality by a negative number reverses the direction of the inequality sign. Thus, $$ ac > bc $$." },
    { q: "Find the domain of $$ f(x) = \\sqrt{x^2 - 9} $$", expr: "", opts: ["$$ x \\ge 3 $$", "$$ (-\\infty, -3] \\cup [3, \\infty) $$", "$$ [-3, 3] $$", "$$ x > 3 $$"], ans: 1, diff: "hard", exp: "The expression inside the square root must be non-negative: $$ x^2 - 9 \\ge 0 \\implies (x-3)(x+3) \\ge 0 $$. This holds true for $x \\le -3$ or $x \\ge 3$." }
  ],
  'relations-functions.html': [
    { q: "Find the domain of the function $$ f(x) = \\frac{3}{\\sqrt{x - 4}} $$", expr: "", opts: ["$$ x > 4 $$", "$$ x \\ge 4 $$", "$$ x \\neq 4 $$", "All real numbers"], ans: 0, diff: "medium", exp: "The value under the radical must be positive because it is in the denominator. So, $$ x - 4 > 0 \\implies x > 4 $$." },
    { q: "If $$ f(x) = x^2 $$ and $$ g(x) = 2x + 1 $$, find the composite function $$ (f \\circ g)(x) $$", expr: "", opts: ["$$ (2x + 1)^2 $$", "$$ 2x^2 + 1 $$", "$$ 2(x+1)^2 $$", "$$ x^2(2x+1) $$"], ans: 0, diff: "easy", exp: "The composite function is $$ f(g(x)) = f(2x + 1) = (2x + 1)^2 $$." },
    { q: "A function $f: \\mathbb{R} \\to \\mathbb{R}$ is defined by $$ f(x) = 3x - 5 $$. Find its inverse function $$ f^{-1}(x) $$", expr: "", opts: ["$$ \\frac{x + 5}{3} $$", "$$ 3x + 5 $$", "$$ \\frac{x - 5}{3} $$", "$$ 5x - 3 $$"], ans: 0, diff: "medium", exp: "Set $y = 3x - 5$. Swap $x$ and $y$: $x = 3y - 5$. Solve for $y$: $$ 3y = x + 5 \\implies y = \\frac{x + 5}{3} $$." },
    { q: "What defines a bijective function?", expr: "", opts: ["Injective only", "Surjective only", "Both Injective (one-to-one) and Surjective (onto)", "Neither injective nor surjective"], ans: 2, diff: "easy", exp: "A function is bijective if it is both one-to-one (injective) and onto (surjective), ensuring a perfect one-to-one correspondence." },
    { q: "Is the relation $$ R = \\{(x, y) \\mid x - y \\text{ is divisible by 5}\\} $$ on integers an equivalence relation?", expr: "", opts: ["Yes", "No"], ans: 0, diff: "hard", exp: "Yes. It is reflexive ($x - x = 0$ is divisible by 5), symmetric (if $5 | (x-y)$, then $5 | (y-x)$), and transitive (if $5 | (x-y)$ and $5 | (y-z)$, then $5 | (x-z)$)." }
  ],
  'sequence-series.html': [
    { q: "Find the 15th term of the arithmetic sequence: $$ 4, 7, 10, 13, \\dots $$", expr: "", opts: ["$$ 46 $$", "$$ 49 $$", "$$ 43 $$", "$$ 52 $$"], ans: 0, diff: "easy", exp: "Identify first term $a = 4$ and common difference $d = 3$. The general term is $$ a_n = a + (n-1)d $$. So, $$ a_{15} = 4 + (15-1) \\times 3 = 4 + 42 = 46 $$." },
    { q: "Find the sum of the infinite geometric series: $$ 8 + 4 + 2 + 1 + \\dots $$", expr: "", opts: ["$$ 16 $$", "$$ 12 $$", "$$ 15 $$", "The series does not converge"], ans: 0, diff: "medium", exp: "First term $a = 8$, common ratio $r = 1/2$. Since $|r| < 1$, the sum is $$ S_\\infty = \\frac{a}{1 - r} = \\frac{8}{1 - 0.5} = 16 $$." },
    { q: "If the 3rd term of a GP is 12 and the 6th term is 96, find the common ratio $r$.", expr: "", opts: ["$$ 2 $$", "$$ 3 $$", "$$ 4 $$", "$$ 1.5 $$"], ans: 0, diff: "medium", exp: "We know $$ a_3 = ar^2 = 12 $$ and $$ a_6 = ar^5 = 96 $$. Divide them: $$ \\frac{ar^5}{ar^2} = \\frac{96}{12} \\implies r^3 = 8 \\implies r = 2 $$." },
    { q: "What is the formula for the sum of the first $n$ natural numbers?", expr: "", opts: ["$$ \\frac{n(n+1)}{2} $$", "$$ n^2 $$", "$$ \\frac{n(n-1)}{2} $$", "$$ n(n+1) $$"], ans: 0, diff: "easy", exp: "The sum of the first $n$ natural numbers is given by the formula $$ \\sum_{i=1}^n i = \\frac{n(n+1)}{2} $$." },
    { q: "In a geometric progression, if the common ratio $|r| \\ge 1$, what can be said about the infinite sum?", expr: "", opts: ["It is finite", "It diverges (is infinite)", "It is zero", "It equals the first term"], ans: 1, diff: "easy", exp: "An infinite geometric series converges to a finite value if and only if the absolute value of the common ratio is strictly less than 1 ($|r| < 1$). Otherwise, it diverges." }
  ],
  'linear-programming.html': [
    { q: "Maximize utility $$ Z = 3x + 4y $$ subject to corner constraints: $$ (0,0), (4,0), (0,5), \\text{ and } (2,3) $$.", expr: "", opts: ["$$ Z = 20 $$ at $$ (0,5) $$", "$$ Z = 12 $$ at $$ (4,0) $$", "$$ Z = 18 $$ at $$ (2,3) $$", "$$ Z = 0 $$ at $$ (0,0) $$"], ans: 0, diff: "medium", exp: "Evaluate $Z$ at each corner point: $Z(0,0)=0$, $Z(4,0)=12$, $Z(0,5)=20$, $Z(2,3)=6+12=18$. The maximum value is 20 at $(0,5)$." },
    { q: "What is the name of the region that satisfies all constraints in a Linear Programming Problem?", expr: "", opts: ["Optimal region", "Feasible region", "Boundary region", "Target region"], ans: 1, diff: "easy", exp: "The solution set that satisfies all inequalities/constraints simultaneously is called the **Feasible Region**." },
    { q: "Where does the optimal solution (maximum or minimum) of an LPP always occur?", expr: "", opts: ["At the origin", "Along the boundary line only", "At one of the corner points (vertices) of the feasible region", "In the exact center of the region"], ans: 2, diff: "easy", exp: "According to the Corner Point Theorem, the optimal value of the objective function in any bounded LPP occurs at one of the corner points (vertices) of the feasible region." },
    { q: "If a constraint in an LPP is $$ x + y \\le 4 $$, which side of the boundary line $$ x + y = 4 $$ represents the solution?", expr: "", opts: ["The half-plane containing the origin", "The half-plane not containing the origin", "Only points exactly on the line", "The entire coordinate system"], ans: 0, diff: "medium", exp: "Test the origin $(0,0)$: $$ 0 + 0 \\le 4 $$ (True). Since it is true, the feasible region is the half-plane containing the origin $(0,0)$." },
    { q: "What happens if the feasible region of an LPP is unbounded in the direction of maximization?", expr: "", opts: ["No solution exists", "An optimal solution still exists at the origin", "The objective function can grow infinitely, leading to an unbounded solution", "Multiple optimal solutions exist"], ans: 2, diff: "medium", exp: "If the feasible region is unbounded in the direction of maximization, the objective function value can grow without bound, meaning there is no finite maximum solution." }
  ],

  // ── CALCULUS UNIT ──
  'diff-app.html': [
    { q: "Find the slope of the tangent to the curve $$ y = x^3 - 3x + 2 $$ at $$ x = 2 $$", expr: "", opts: ["$$ 9 $$", "$$ 3 $$", "$$ 12 $$", "$$ 6 $$"], ans: 0, diff: "easy", exp: "Take the derivative: $$ \\frac{dy}{dx} = 3x^2 - 3 $$. Substitute $x = 2$: $$ 3(2)^2 - 3 = 12 - 3 = 9 $$." },
    { q: "Find the points of local maxima and minima for $$ f(x) = x^3 - 3x $$", expr: "", opts: ["Max at $x=-1$, Min at $x=1$", "Max at $x=1$, Min at $x=-1$", "Max at $x=0$, Min at $x=3$", "No local extrema"], ans: 0, diff: "medium", exp: "Find critical points: $$ f'(x) = 3x^2 - 3 = 0 \\implies x^2 = 1 \\implies x = \\pm 1 $$. Second derivative is $$ f''(x) = 6x $$. Since $$ f''(-1) = -6 < 0 $$ (Maximum) and $$ f''(1) = 6 > 0 $$ (Minimum)." },
    { q: "A particle moves along a line according to $$ s(t) = t^3 - 6t^2 + 9t $$. Find its acceleration at $$ t = 4 $$ seconds.", expr: "", opts: ["$$ 12 \\text{ m/s}^2 $$", "$$ 6 \\text{ m/s}^2 $$", "$$ 24 \\text{ m/s}^2 $$", "$$ 0 \\text{ m/s}^2 $$"], ans: 0, diff: "medium", exp: "Velocity $$ v(t) = s'(t) = 3t^2 - 12t + 9 $$. Acceleration $$ a(t) = v'(t) = 6t - 12 $$. At $t = 4$, $$ a(4) = 6(4) - 12 = 24 - 12 = 12 \\text{ m/s}^2 $$." },
    { q: "What is the critical point of the function $$ f(x) = x^2 - 6x + 5 $$?", expr: "", opts: ["$$ x = 3 $$", "$$ x = 6 $$", "$$ x = 5 $$", "$$ x = 0 $$"], ans: 0, diff: "easy", exp: "Take the derivative and set it to zero: $$ f'(x) = 2x - 6 = 0 \\implies 2x = 6 \\implies x = 3 $$." },
    { q: "According to Rolle's Theorem, if $f(a) = f(b)$ for a continuous and differentiable function, what must exist in $(a, b)$?", expr: "", opts: ["A point where $$ f'(c) = 0 $$", "A point where $$ f(c) = 0 $$", "A point where $$ f'(c) > 0 $$", "No critical points exist"], ans: 0, diff: "medium", exp: "Rolle's Theorem states that under these conditions, there must exist at least one point $c$ in open interval $(a, b)$ such that the derivative is zero: $$ f'(c) = 0 $$." }
  ],
  'diff-equations-app.html': [
    { q: "According to Newton's Law of Cooling, the rate of change of temperature is proportional to what?", expr: "", opts: ["The difference between the object temperature and the ambient temperature", "The temperature of the object only", "The square of the temperature difference", "The elapsed time"], ans: 0, diff: "easy", exp: "Newton's Law of Cooling states $$ \\frac{dT}{dt} = -k(T - T_m) $$, which means the rate of cooling is directly proportional to the difference between the object's temperature ($T$) and its surrounding ambient temperature ($T_m$)." },
    { q: "If the population growth model is $$ \\frac{dP}{dt} = 0.05P $$, what is the population $P(t)$ given initial population $P_0$?", expr: "", opts: ["$$ P(t) = P_0 e^{0.05t} $$", "$$ P(t) = P_0 + 0.05t $$", "$$ P(t) = 0.05 P_0 t $$", "$$ P(t) = P_0 e^{-0.05t} $$"], ans: 0, diff: "medium", exp: "This is a separable differential equation. Integrate $$ \\int \\frac{1}{P} dP = \\int 0.05 dt \\implies \\ln P = 0.05t + C \\implies P(t) = P_0 e^{0.05t} $$." },
    { q: "In radioactive decay, if half-life is 100 years, find the decay constant $k$.", expr: "", opts: ["$$ \\frac{\\ln 2}{100} $$", "$$ 100 \\ln 2 $$", "$$ 0.01 $$", "$$ 0.5 $$"], ans: 0, diff: "hard", exp: "The decay formula is $N(t) = N_0 e^{-kt}$. At $t = t_{1/2}$, $N(t) = 0.5 N_0 \\implies e^{-k \\cdot 100} = 0.5 \\implies -100k = \\ln(0.5) = -\\ln 2 \\implies k = \\frac{\\ln 2}{100}$." },
    { q: "What type of differential equation model represents logistic population growth?", expr: "", opts: ["$$ \\frac{dP}{dt} = rP(1 - \\frac{P}{K}) $$", "$$ \\frac{dP}{dt} = kP $$", "$$ \\frac{dP}{dt} = -k(T - T_m) $$", "$$ \\frac{d^2s}{dt^2} = -g $$"], ans: 0, diff: "medium", exp: "The logistic growth model accounts for a carrying capacity $K$ and is modeled by the differential equation $$ \\frac{dP}{dt} = rP\\left(1 - \\frac{P}{K}\\right) $$." },
    { q: "A tank contains 100L of brine with 10kg of salt. Pure water enters at 5L/min and leaves at 5L/min. Set up the differential equation for salt amount $A(t)$.", expr: "", opts: ["$$ \\frac{dA}{dt} = -0.05A $$", "$$ \\frac{dA}{dt} = 5 - A $$", "$$ \\frac{dA}{dt} = -5A $$", "$$ \\frac{dA}{dt} = 0.05A $$"], ans: 0, diff: "hard", exp: "Salt entering rate is 0. Salt leaving rate is $$ 5 \\times \\frac{A}{100} = 0.05A $$. Thus, the rate of change is $$ \\frac{dA}{dt} = \\text{Rate In} - \\text{Rate Out} = -0.05A $$." }
  ],
  'exact-equations.html': [
    { q: "What is the condition for the differential equation $$ M(x,y)dx + N(x,y)dy = 0 $$ to be exact?", expr: "", opts: ["$$ \\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x} $$", "$$ \\frac{\\partial M}{\\partial x} = \\frac{\\partial N}{\\partial y} $$", "$$ M_x + N_y = 0 $$", "$$ M = N $$"], ans: 0, diff: "easy", exp: "A differential equation is exact if and only if the partial derivative of $M$ with respect to $y$ equals the partial derivative of $N$ with respect to $x$: $$ \\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x} $$." },
    { q: "Is the differential equation $$ (2xy + 3)dx + (x^2 - 1)dy = 0 $$ exact?", expr: "", opts: ["Yes", "No"], ans: 0, diff: "medium", exp: "Here, $M = 2xy + 3 \\implies \\frac{\\partial M}{\\partial y} = 2x$. And $N = x^2 - 1 \\implies \\frac{\\partial N}{\\partial x} = 2x$. Since the partial derivatives are equal, the equation is exact." },
    { q: "Solve the exact equation: $$ 2xdx + 2ydy = 0 $$", expr: "", opts: ["$$ x^2 + y^2 = C $$", "$$ x + y = C $$", "$$ x^2 - y^2 = C $$", "$$ xy = C $$"], ans: 0, diff: "medium", exp: "Integrate $M = 2x$ with respect to $x$: $$ \\int 2x dx = x^2 $$. Integrate $N = 2y$ with respect to $y$: $$ \\int 2y dy = y^2 $$. Combining gives the general solution: $$ x^2 + y^2 = C $$." },
    { q: "If an equation is not exact, what factor can sometimes multiply it to make it exact?", expr: "", opts: ["Integrating Factor", "Differential Quotient", "Exact Constant", "Exponent Modifier"], ans: 0, diff: "easy", exp: "An **Integrating Factor** $\\mu(x,y)$ is a function that makes an inexact differential equation exact when multiplied through." },
    { q: "Find the general solution of the exact equation $$ (y\\cos x)dx + (\\sin x)dy = 0 $$", expr: "", opts: ["$$ y\\sin x = C $$", "$$ y\\cos x = C $$", "$$ \\sin x + y = C $$", "$$ y^2 \\sin x = C $$"], ans: 0, diff: "hard", exp: "Let $M = y\\cos x$ and $N = \\sin x$. Note $$ \\frac{\\partial M}{\\partial y} = \\cos x = \\frac{\\partial N}{\\partial x} $$. Integrate $N$ with respect to $y$: $$ \\int \\sin x dy = y\\sin x $$. Taking the partial derivative with respect to $x$ matches $M$. Hence, $$ y\\sin x = C $$." }
  ],
  'int-app.html': [
    { q: "Find the area bounded by the curve $$ y = x^2 $$, the x-axis, and lines $$ x=1 $$ and $$ x=3 $$", expr: "", opts: ["$$ 8.67 $$ (or $$ 26/3 $$)", "$$ 9 $$", "$$ 27 $$", "$$ 26 $$"], ans: 0, diff: "medium", exp: "The bounded area is $$ \\int_1^3 x^2 dx = \\left[ \\frac{x^3}{3} \\right]_1^3 = \\frac{27}{3} - \\frac{1}{3} = \\frac{26}{3} \\approx 8.67 $$." },
    { q: "Find the volume of the solid generated by revolving the region bounded by $$ y = x $$, $$ x = 0 $$, and $$ x = 2 $$ about the x-axis.", expr: "", opts: ["$$ 8\\pi/3 $$", "$$ 4\\pi $$", "$$ 2\\pi $$", "$$ 8\\pi $$"], ans: 0, diff: "hard", exp: "Using the disk method, $$ V = \\pi \\int_a^b [f(x)]^2 dx = \\pi \\int_0^2 x^2 dx = \\pi \\left[ \\frac{x^3}{3} \\right]_0^2 = \\frac{8\\pi}{3} $$." },
    { q: "What is the average value of the function $$ f(x) = 2x $$ over the interval $$ [1, 5] $$?", expr: "", opts: ["$$ 6 $$", "$$ 5 $$", "$$ 12 $$", "$$ 8 $$"], ans: 0, diff: "medium", exp: "The average value formula is $$ \\frac{1}{b-a} \\int_a^b f(x) dx $$. So, $$ \\frac{1}{5-1} \\int_1^5 2x dx = \\frac{1}{4} \\left[ x^2 \\right]_1^5 = \\frac{1}{4} (25 - 1) = \\frac{24}{4} = 6 $$." },
    { q: "Which integral formula represents the arc length of a curve $$ y = f(x) $$ from $$ x = a $$ to $$ x = b $$?", expr: "", opts: ["$$ \\int_a^b \\sqrt{1 + [f'(x)]^2} \\, dx $$", "$$ \\int_a^b [f(x)]^2 \\, dx $$", "$$ \\int_a^b f'(x) \\, dx $$", "$$ \\int_a^b \\sqrt{1 + f(x)} \\, dx $$"], ans: 0, diff: "easy", exp: "The standard arc length formula for a differentiable function is $$ L = \\int_a^b \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2} \\, dx $$." },
    { q: "Find the area under the curve $$ y = \\sin x $$ from $$ x = 0 $$ to $$ x = \\pi $$", expr: "", opts: ["$$ 2 $$", "$$ 1 $$", "$$ 0 $$", "$$ \\pi $$"], ans: 0, diff: "easy", exp: "Compute the definite integral: $$ \\int_0^\\pi \\sin x \\, dx = [-\\cos x]_0^\\pi = -\\cos \\pi - (-\\cos 0) = -(-1) - (-1) = 1 + 1 = 2 $$." }
  ],
  'integration.html': [
    { q: "Evaluate: $$ \\int (3x^2 + 4x - 5) \\, dx $$", expr: "", opts: ["$$ x^3 + 2x^2 - 5x + C $$", "$$ 3x^3 + 4x^2 - 5x + C $$", "$$ x^3 + 4x^2 - 5x + C $$", "$$ x^3 + 2x^2 + C $$"], ans: 0, diff: "easy", exp: "Integrate term by term: $$ \\int 3x^2 dx = x^3 $$, $$ \\int 4x dx = 2x^2 $$, $$ \\int -5 dx = -5x $$. Combine and append constant $C$: $$ x^3 + 2x^2 - 5x + C $$." },
    { q: "Evaluate the definite integral: $$ \\int_1^3 (2x + 1) \\, dx $$", expr: "", opts: ["$$ 10 $$", "$$ 8 $$", "$$ 12 $$", "$$ 9 $$"], ans: 0, diff: "easy", exp: "First find antiderivative: $$ \\int (2x + 1) dx = x^2 + x $$. Now evaluate from 1 to 3: $$ (3^2 + 3) - (1^2 + 1) = (9 + 3) - (1 + 1) = 12 - 2 = 10 $$." },
    { q: "Evaluate using substitution: $$ \\int 2x e^{x^2} \\, dx $$", expr: "", opts: ["$$ e^{x^2} + C $$", "$$ 2e^{x^2} + C $$", "$$ e^x + C $$", "$$ x^2 e^{x^2} + C $$"], ans: 0, diff: "medium", exp: "Let $u = x^2 \\implies du = 2x dx$. The integral becomes $$ \\int e^u du = e^u + C = e^{x^2} + C $$." },
    { q: "What is the result of the integral $$ \\int \\frac{1}{x} \\, dx $$?", expr: "", opts: ["$$ \\ln|x| + C $$", "$$ -\\frac{1}{x^2} + C $$", "$$ x + C $$", "$$ e^x + C $$"], ans: 0, diff: "easy", exp: "The standard integral of $1/x$ is the natural logarithm of the absolute value of $x$: $$ \\int \\frac{1}{x} \\, dx = \\ln|x| + C $$." },
    { q: "Evaluate by parts: $$ \\int x \\cos x \\, dx $$", expr: "", opts: ["$$ x \\sin x + \\cos x + C $$", "$$ x \\sin x - \\cos x + C $$", "$$ -x \\sin x + \\cos x + C $$", "$$ x \\cos x + C $$"], ans: 0, diff: "hard", exp: "Let $u = x \\implies du = dx$ and $dv = \\cos x dx \\implies v = \\sin x$. By parts: $$ \\int u \\, dv = uv - \\int v \\, du = x\\sin x - \\int \\sin x dx = x\\sin x + \\cos x + C $$." }
  ],
  'linear-diff-equations.html': [
    { q: "What is the integrating factor (IF) for the linear differential equation $$ \\frac{dy}{dx} + P(x)y = Q(x) $$?", expr: "", opts: ["$$ e^{\\int P(x)dx} $$", "$$ e^{-\\int P(x)dx} $$", "$$ \\int P(x)dx $$", "$$ e^{\\int Q(x)dx} $$"], ans: 0, diff: "easy", exp: "The standard integrating factor for a first-order linear differential equation is $$ \\text{I.F.} = e^{\\int P(x) \\, dx} $$." },
    { q: "Find the Integrating Factor of: $$ \\frac{dy}{dx} + \\frac{2}{x}y = x^3 $$", expr: "", opts: ["$$ x^2 $$", "$$ x $$", "$$ e^{2x} $$", "$$ 2\\ln x $$"], ans: 0, diff: "medium", exp: "Here, $P(x) = 2/x$. The integrating factor is $$ e^{\\int \\frac{2}{x} dx} = e^{2\\ln x} = e^{\\ln(x^2)} = x^2 $$." },
    { q: "Find the general solution of $$ \\frac{dy}{dx} - y = e^x $$", expr: "", opts: ["$$ y = x e^x + C e^x $$", "$$ y = e^x + C $$", "$$ y = x e^{-x} + C $$", "$$ y = e^{2x} + C $$"], ans: 0, diff: "hard", exp: "Here, $P(x) = -1 \\implies \\text{I.F.} = e^{\\int -1 dx} = e^{-x}$. Multiply through: $$ e^{-x} \\frac{dy}{dx} - e^{-x}y = 1 \\implies \\frac{d}{dx}(y e^{-x}) = 1 \\implies y e^{-x} = x + C \\implies y = x e^x + C e^x $$." },
    { q: "What is the order of the differential equation $$ x^2 \\frac{d^2y}{dx^2} + 5x \\frac{dy}{dx} - 3y = 0 $$?", expr: "", opts: ["$$ 2 $$", "$$ 1 $$", "$$ 0 $$", "$$ 3 $$"], ans: 0, diff: "easy", exp: "The order of a differential equation is the order of the highest derivative present. In this case, the highest derivative is $$ \\frac{d^2y}{dx^2} $$, which is of second order." },
    { q: "Solve: $$ \\frac{dy}{dx} + y = 2 $$", expr: "", opts: ["$$ y = 2 + Ce^{-x} $$", "$$ y = 2 + Ce^x $$", "$$ y = Ce^{-x} $$", "$$ y = 2x + C $$"], ans: 0, diff: "medium", exp: "This is linear with $P(x) = 1 \\implies \\text{I.F.} = e^x$. The equation becomes $$ \\frac{d}{dx}(y e^x) = 2e^x \\implies y e^x = 2e^x + C \\implies y = 2 + C e^{-x} $$." }
  ],

  // ── DISCRETE UNIT ──
  'combinatorics.html': [
    { q: "How many distinct anagrams can be formed from the letters of the word 'CELL'?", expr: "", opts: ["$$ 12 $$", "$$ 24 $$", "$$ 6 $$", "$$ 4 $$"], ans: 0, diff: "medium", exp: "The word has 4 letters, with L repeating twice. The formula is $$ \\frac{n!}{p!} = \\frac{4!}{2!} = \\frac{24}{2} = 12 $$." },
    { q: "In how many ways can a committee of 3 members be selected from 7 candidates?", expr: "", opts: ["$$ 35 $$", "$$ 210 $$", "$$ 21 $$", "$$ 15 $$"], ans: 0, diff: "medium", exp: "Use combination formula since order does not matter: $$ ^7C_3 = \\frac{7 \\times 6 \\times 5}{3 \\times 2 \\times 1} = 35 $$." },
    { q: "What is the pigeonhole principle statement?", expr: "", opts: ["If $n$ items are put into $m$ containers, with $n > m$, then at least one container must contain more than one item.", "If $n < m$, all containers are full.", "Pigeons always return to their nests.", "All boxes have equal items."], ans: 0, diff: "easy", exp: "The Pigeonhole Principle states that if $n$ items are distributed into $m$ pigeonholes where $n > m$, then at least one pigeonhole must contain two or more items." },
    { q: "How many 3-digit numbers can be formed using the digits 1, 2, 3, 4, 5 if repetition of digits is allowed?", expr: "", opts: ["$$ 125 $$", "$$ 60 $$", "$$ 120 $$", "$$ 15 $$"], ans: 0, diff: "easy", exp: "Since repetition is allowed, there are 5 choices for each of the three positions: $$ 5 \\times 5 \\times 5 = 125 $$." },
    { q: "What is the value of $$ \sum_{k=0}^n \binom{n}{k} $$?", expr: "", opts: ["$$ 2^n $$", "$$ n^2 $$", "$$ 2n $$", "$$ 2^{n-1} $$"], ans: 0, diff: "medium", exp: "The sum of all binomial coefficients for a power $n$ equals $$ 2^n $$." }
  ],
  'induction.html': [
    { q: "What are the two primary steps in a proof by Mathematical Induction?", expr: "", opts: ["Base Step and Inductive Step", "Assumption and Resolution", "Hypothesis and Calculation", "Algebra and Geometry"], ans: 0, diff: "easy", exp: "Mathematical induction requires proving a Base Case (usually $n=1$) and then completing the Inductive Step (showing that if it holds for $k$, it must hold for $k+1$)." },
    { q: "If we assume a statement $P(k)$ is true to prove $P(k+1)$, what is this assumption called?", expr: "", opts: ["Inductive Hypothesis", "Base Assertion", "Inductive Theorem", "Deductive Axiom"], ans: 0, diff: "easy", exp: "The assumption that the statement holds true for some arbitrary integer $k$ is called the **Inductive Hypothesis**." },
    { q: "Using induction, we prove $$ 1 + 2 + 3 + \\dots + n = \\frac{n(n+1)}{2} $$. If the statement holds for $k$, what do we add to both sides in the inductive step?", expr: "", opts: ["$$ k + 1 $$", "$$ k $$", "$$ 1 $$", "$$ 2k $$"], ans: 0, diff: "medium", exp: "To prove the statement for $n = k+1$, we add the $(k+1)$-th term, which is $$ k + 1 $$, to both sides of our inductive hypothesis equation." },
    { q: "Evaluate the base case $P(1)$ for the statement: '$$ n! > 2^n $$ for all $$ n \\ge 4 $$'. What is the smallest integer we must test?", expr: "", opts: ["$$ 4 $$", "$$ 1 $$", "$$ 0 $$", "$$ 2 $$"], ans: 0, diff: "medium", exp: "Since the statement is constrained to $$ n \\ge 4 $$, the base case starts at the boundary value, which is $$ n = 4 $$." },
    { q: "If $P(k)$ is true implies $P(k+1)$ is true, but the base case $P(1)$ is false, what is the validity of the statement?", expr: "", opts: ["It is invalid for all $n$", "It is still valid", "It is only valid for large $n$", "It is conditionally valid"], ans: 0, diff: "easy", exp: "Without a valid base case to start the chain reaction, the induction argument fails completely, and the statement is not proven." }
  ],
  'logic.html': [
    { q: "What is the contrapositive of the logical statement $$ P \\to Q $$?", expr: "", opts: ["$$ \\neg Q \\to \\neg P $$", "$$ Q \\to P $$", "$$ \\neg P \\to \\neg Q $$", "$$ P \\land \\neg Q $$"], ans: 0, diff: "medium", exp: "The contrapositive of $P \\to Q$ is formed by negating both terms and reversing the implication arrow: $$ \\neg Q \\to \\neg P $$. They are logically equivalent." },
    { q: "What is the truth value of $$ P \\land (Q \\lor \\neg P) $$ when $P$ is True and $Q$ is False?", expr: "", opts: ["False", "True"], ans: 0, diff: "medium", exp: "Evaluate: $P = T$, $Q = F$. First, $\\neg P = F$. Then, $Q \\lor \\neg P = F \\lor F = F$. Finally, $P \\land F = T \\land F = F$ (False)." },
    { q: "A logical statement that is always true regardless of the truth values of its individual components is called what?", expr: "", opts: ["Tautology", "Contradiction", "Fallacy", "Satisfiable"], ans: 0, diff: "easy", exp: "A statement that is True under all possible valuations of its variables is a **Tautology**." },
    { q: "What is the negation of De Morgan's Law for $$ \\neg(P \\lor Q) $$?", expr: "", opts: ["$$ \\neg P \\land \\neg Q $$", "$$ \\neg P \\lor \\neg Q $$", "$$ P \\land Q $$", "$$ \\neg P \\to \\neg Q $$"], ans: 0, diff: "easy", exp: "De Morgan's Law states that the negation of a disjunction is the conjunction of the negations: $$ \\neg(P \\lor Q) \\equiv \\neg P \\land \\neg Q $$." },
    { q: "Under what single condition is the logical implication $$ P \\to Q $$ False?", expr: "", opts: ["When $P$ is True and $Q$ is False", "When both $P$ and $Q$ are False", "When $P$ is False and $Q$ is True", "It is never False"], ans: 0, diff: "easy", exp: "An implication $$ P \\to Q $$ is conditionally defined as false if and only if the premise ($P$) is true but the conclusion ($Q$) is false." }
  ],
  'permutations-combinations.html': [
    { q: "Evaluate: $$ ^{10}C_8 $$", expr: "", opts: ["$$ 45 $$", "$$ 90 $$", "$$ 10 $$", "$$ 5 $$"], ans: 0, diff: "easy", exp: "Apply the combinations identity $$ ^nC_r = ^nC_{n-r} $$. So, $$ ^{10}C_8 = ^{10}C_2 = \\frac{10 \\times 9}{2 \\times 1} = 45 $$." },
    { q: "How many ways can 5 books be arranged on a shelf?", expr: "", opts: ["$$ 120 $$", "$$ 24 $$", "$$ 60 $$", "$$ 10 $$"], ans: 0, diff: "easy", exp: "Since order matters, use permutations: $$ 5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120 $$." },
    { q: "What is the relation between Permutation ($^nP_r$) and Combination ($^nC_r$)?", expr: "", opts: ["$$ ^nP_r = r! \\cdot ^nC_r $$", "$$ ^nC_r = r! \\cdot ^nP_r $$", "$$ ^nP_r = ^nC_r $$", "$$ ^nP_r = \\frac{^nC_r}{r!} $$"], ans: 0, diff: "medium", exp: "Permutations account for the arrangement of selected items ($r!$). Thus, the number of permutations is $r!$ times the combinations: $$ ^nP_r = r! \\cdot ^nC_r $$." },
    { q: "In how many ways can 6 people sit around a circular table?", expr: "", opts: ["$$ 120 $$", "$$ 720 $$", "$$ 60 $$", "$$ 360 $$"], ans: 0, diff: "medium", exp: "For circular arrangements, we fix one position. The number of arrangements is $$ (n-1)! = (6-1)! = 5! = 120 $$." },
    { q: "A box contains 5 red and 4 blue balls. In how many ways can we select 3 balls such that 2 are red and 1 is blue?", expr: "", opts: ["$$ 40 $$", "$$ 20 $$", "$$ 80 $$", "$$ 120 $$"], ans: 0, diff: "hard", exp: "Ways to select 2 red from 5: $$ ^5C_2 = 10 $$. Ways to select 1 blue from 4: $$ ^4C_1 = 4 $$. Total combinations: $$ 10 \\times 4 = 40 $$." }
  ],

  // ── GEOMETRY UNIT ──
  '3d-geometry.html': [
    { q: "Find the direction cosines of a line that is equally inclined to the three coordinate axes.", expr: "", opts: ["$$ \\pm\\frac{1}{\\sqrt{3}}, \\pm\\frac{1}{\\sqrt{3}}, \\pm\\frac{1}{\\sqrt{3}} $$", "$$ 1, 1, 1 $$", "$$ 1/3, 1/3, 1/3 $$", "$$ 0, 0, 0 $$"], ans: 0, diff: "medium", exp: "Let direction cosines be $l, m, n$. Since they are equally inclined, $l^2 = m^2 = n^2$. We know $$ l^2 + m^2 + n^2 = 1 \\implies 3l^2 = 1 \\implies l = \\pm 1/\\sqrt{3} $$. Hence, all three are $$ \\pm 1/\\sqrt{3} $$." },
    { q: "What is the equation of a plane passing through the point $(x_1, y_1, z_1)$ with normal vector $(A, B, C)$?", expr: "", opts: ["$$ A(x - x_1) + B(y - y_1) + C(z - z_1) = 0 $$", "$$ Ax + By + Cz = 0 $$", "$$ \\frac{x-x_1}{A} = \\frac{y-y_1}{B} = \\frac{z-z_1}{C} $$", "$$ x_1 x + y_1 y + z_1 z = 1 $$"], ans: 0, diff: "easy", exp: "The standard point-normal form equation of a 3D plane is $$ A(x - x_1) + B(y - y_1) + C(z - z_1) = 0 $$." },
    { q: "Find the distance between the parallel planes $$ x + 2y - 2z + 5 = 0 $$ and $$ x + 2y - 2z - 7 = 0 $$.", expr: "", opts: ["$$ 4 $$", "$$ 12 $$", "$$ 2 $$", "$$ 6 $$"], ans: 0, diff: "hard", exp: "The distance formula between parallel planes $Ax+By+Cz+D_1=0$ and $Ax+By+Cz+D_2=0$ is $$ d = \\frac{|D_1 - D_2|}{\\sqrt{A^2+B^2+C^2}} = \\frac{|5 - (-7)|}{\\sqrt{1^2+2^2+(-2)^2}} = \\frac{12}{\\sqrt{9}} = \\frac{12}{3} = 4 $$." },
    { q: "What is the shortest distance between two skew lines in space?", expr: "", opts: ["The length of the common perpendicular vector", "The difference between their intercepts", "Always zero", "Infinite"], ans: 0, diff: "medium", exp: "For two non-intersecting, non-parallel lines (skew lines) in 3D, the shortest distance is the length of their common perpendicular line segment." },
    { q: "Find the coordinates of the midpoint of the segment joining $(2, -3, 4)$ and $(6, 1, -2)$.", expr: "", opts: ["$$ (4, -1, 1) $$", "$$ (8, -2, 2) $$", "$$ (4, -2, 1) $$", "$$ (2, 2, 3) $$"], ans: 0, diff: "easy", exp: "Use 3D midpoint formula: $$ (\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}, \\frac{z_1+z_2}{2}) = (\\frac{2+6}{2}, \\frac{-3+1}{2}, \\frac{4-2}{2}) = (4, -1, 1) $$." }
  ],
  'differential-geometry.html': [
    { q: "What does the curvature $\\kappa$ of a space curve measure?", expr: "", opts: ["The rate of change of the tangent vector direction with respect to arc length", "The speed of the curve", "The acceleration vector length only", "The deviation of the curve from being a plane"], ans: 0, diff: "easy", exp: "Curvature $\\kappa$ measures how sharply a curve bends, defined as the rate of change of the unit tangent vector direction with respect to arc length: $$ \\kappa = \\left\\| \\frac{d\\vec{T}}{ds} \\right\\| $$." },
    { q: "What does the torsion $\\tau$ of a 3D curve measure?", expr: "", opts: ["The twisting of the curve out of the osculating plane", "The rate of change of speed", "The curvature of the path projection", "The length of the binormal vector"], ans: 0, diff: "medium", exp: "Torsion $\\tau$ measures the twisting of a curve in 3D space, showing its deviation from being a completely flat 2D plane." },
    { q: "What are the components of the Frenet-Serret frame for a 3D space curve?", expr: "", opts: ["Unit Tangent (T), Principal Normal (N), and Binormal (B)", "Velocity, Acceleration, and Jerk", "Slope, Curvature, and Torsion", "X, Y, and Z coordinate directions"], ans: 0, diff: "easy", exp: "The Frenet-Serret frame consists of three mutually orthogonal unit vectors: Tangent vector $\\vec{T}$, Principal Normal vector $\\vec{N}$, and Binormal vector $\\vec{B}$." },
    { q: "Calculate the curvature of a circle of radius $R$.", expr: "", opts: ["$$ 1/R $$", "$$ R $$", "$$ R^2 $$", "$$ 2\\pi R $$"], ans: 0, diff: "medium", exp: "A circle bends uniformly. The curvature is inversely proportional to its radius: $$ \\kappa = \\frac{1}{R} $$. Smaller circles bend more sharply." },
    { q: "Which derivative relation is given by the Frenet-Serret formulas for $$ \\frac{d\\vec{T}}{ds} $$?", expr: "", opts: ["$$ \\kappa \\vec{N} $$", "$$ -\\kappa \\vec{T} $$", "$$ \\tau \\vec{B} $$", "$$ \\kappa \\vec{B} - \\tau \\vec{N} $$"], ans: 0, diff: "hard", exp: "The first Frenet-Serret equation relates the change in unit tangent vector to curvature and the principal normal: $$ \\frac{d\\vec{T}}{ds} = \\kappa \\vec{N} $$." }
  ],
  'vectors.html': [
    { q: "Find the unit vector in the direction of vector $$ \\vec{v} = 3\\hat{i} + 4\\hat{j} $$", expr: "", opts: ["$$ \\frac{3}{5}\\hat{i} + \\frac{4}{5}\\hat{j} $$", "$$ 3\\hat{i} + 4\\hat{j} $$", "$$ \\frac{1}{5}\\hat{i} + \\frac{1}{5}\\hat{j} $$", "$$ 5(3\\hat{i} + 4\\hat{j}) $$"], ans: 0, diff: "easy", exp: "First, find magnitude: $$ |\\vec{v}| = \\sqrt{3^2 + 4^2} = 5 $$. The unit vector is $$ \\frac{\\vec{v}}{|\\vec{v}|} = \\frac{3}{5}\\hat{i} + \\frac{4}{5}\\hat{j} $$." },
    { q: "Calculate the cross product $$ \\vec{u} \\times \\vec{v} $$ for $$ \\vec{u} = \\hat{i} $$, $$ \\vec{v} = \\hat{j} $$", expr: "", opts: ["$$ \\hat{k} $$", "$$ -\\hat{k} $$", "$$ 0 $$", "$$ 1 $$"], ans: 0, diff: "easy", exp: "By standard right-hand rule of Cartesian unit vectors, the cross product of $\\hat{i}$ and $\\hat{j}$ is $$ \\hat{k} $$." },
    { q: "Find the work done by force $$ \\vec{F} = 2\\hat{i} + 3\\hat{j} $$ in displacing an object along vector $$ \\vec{d} = 4\\hat{i} - 2\\hat{j} $$", expr: "", opts: ["$$ 2 \\text{ Joules} $$", "$$ 14 \\text{ Joules} $$", "$$ -2 \\text{ Joules} $$", "$$ 8 \\text{ Joules} $$"], ans: 0, diff: "medium", exp: "Work done is the dot product of force and displacement vectors: $$ W = \\vec{F} \\cdot \\vec{d} = (2 \\cdot 4) + (3 \\cdot -2) = 8 - 6 = 2 \\text{ Joules} $$." },
    { q: "What is the projection of vector $$ \\vec{a} $$ onto vector $$ \\vec{b} $$?", expr: "", opts: ["$$ \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} $$", "$$ \\vec{a} \\cdot \\vec{b} $$", "$$ \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}|} $$", "$$ |\\vec{a}|\\cos\\theta $$"], ans: 0, diff: "medium", exp: "The scalar projection of $\\vec{a}$ onto $\\vec{b}$ is the magnitude of the component in that direction: $$ \\text{comp}_{\\vec{b}} \\vec{a} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|} $$." },
    { q: "If two non-zero vectors $$ \\vec{a} $$ and $$ \\vec{b} $$ are perpendicular, what is their dot product?", expr: "", opts: ["$$ 0 $$", "$$ 1 $$", "$$ -1 $$", "Product of their magnitudes"], ans: 0, diff: "easy", exp: "The dot product is $$ \\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta $$. Since $\\theta = 90^\\circ$ and $\\cos 90^\\circ = 0$, their dot product is always zero." }
  ],

  // ── LINEAR ALGEBRA UNIT ──
  'determinants.html': [
    { q: "Evaluate the determinant: $$ A = \\begin{vmatrix} 3 & 4 \\\\ 2 & -1 \\end{vmatrix} $$", expr: "", opts: ["$$ -11 $$", "$$ 5 $$", "$$ -5 $$", "$$ 11 $$"], ans: 0, diff: "easy", exp: "Evaluate determinant for 2x2: $$ ad - bc = (3 \\cdot -1) - (4 \\cdot 2) = -3 - 8 = -11 $$." },
    { q: "If matrix $A$ is singular, what is the value of its determinant?", expr: "", opts: ["$$ 0 $$", "$$ 1 $$", "Infinite", "Undefined"], ans: 0, diff: "easy", exp: "By definition, a square matrix is singular if and only if its determinant is exactly equal to zero ($$ \\det(A) = 0 $$), meaning it has no inverse." },
    { q: "What is the determinant of a 3x3 identity matrix?", expr: "", opts: ["$$ 1 $$", "$$ 3 $$", "$$ 0 $$", "$$ -1 $$"], ans: 0, diff: "easy", exp: "The identity matrix is diagonal, and the determinant of any diagonal matrix is the product of its diagonal entries: $$ 1 \\times 1 \\times 1 = 1 $$." },
    { q: "If we swap two rows of a square matrix $A$, what happens to the value of its determinant?", expr: "", opts: ["It is multiplied by -1", "It remains unchanged", "It becomes zero", "It is squared"], ans: 0, diff: "medium", exp: "One of the fundamental properties of determinants states that swapping any two rows (or columns) of a matrix reverses the sign of its determinant." },
    { q: "Find the determinant of $$ B = \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & 3 & 0 \\\\ 5 & 4 & 4 \\end{pmatrix} $$", expr: "", opts: ["$$ 24 $$", "$$ 12 $$", "$$ 0 $$", "$$ 9 $$"], ans: 0, diff: "hard", exp: "This is a lower triangular matrix. The determinant of any triangular matrix is simply the product of its diagonal entries: $$ 2 \\times 3 \\times 4 = 24 $$." }
  ],
  'matrices-determinants-app.html': [
    { q: "By Cramer's Rule, how do we find variable $x$ in a system of linear equations?", expr: "", opts: ["$$ x = D_x / D $$", "$$ x = D / D_x $$", "$$ x = D \\cdot D_x $$", "$$ x = D_x - D $$"], ans: 0, diff: "easy", exp: "Cramer's Rule states that each variable is computed as the ratio of the modified determinant to the main coefficient determinant: $$ x = \\frac{D_x}{D} $$ (provided $D \\neq 0$)." },
    { q: "Under what condition is a system of linear equations $$ AX = B $$ guaranteed to have a unique solution?", expr: "", opts: ["$$ \\det(A) \\neq 0 $$", "$$ \\det(A) = 0 $$", "$$ A \\text{ is singular} $$", "$$ B = 0 $$"], ans: 0, diff: "easy", exp: "A system of equations has a unique solution if the coefficient matrix $A$ is invertible, which requires its determinant to be non-zero: $$ \\det(A) \\neq 0 $$." },
    { q: "What does it mean if a system of equations has no solution?", expr: "", opts: ["The system is inconsistent", "The system is consistent", "The system is homogenous", "The system is singular"], ans: 0, diff: "easy", exp: "A system of linear equations is called **Inconsistent** if there are no values that satisfy all equations simultaneously (i.e. no solution exists)." },
    { q: "Solve for $x$ and $y$ using Cramer's rule: $$ x + y = 5, \\, x - y = 1 $$", expr: "", opts: ["$$ x=3, y=2 $$", "$$ x=2, y=3 $$", "$$ x=4, y=1 $$", "$$ x=5, y=0 $$"], ans: 0, diff: "medium", exp: "Main determinant $$ D = \\begin{vmatrix} 1 & 1 \\\\ 1 & -1 \\end{vmatrix} = -2 $$. $$ D_x = \\begin{vmatrix} 5 & 1 \\\\ 1 & -1 \\end{vmatrix} = -6 \\implies x = -6/-2 = 3 $$. $$ D_y = \\begin{vmatrix} 1 & 5 \\\\ 1 & 1 \\end{vmatrix} = -4 \\implies y = -4/-2 = 2 $$. Hence, $x=3, y=2$." },
    { q: "For a homogeneous system $$ AX = 0 $$, when does a non-trivial (non-zero) solution exist?", expr: "", opts: ["$$ \\det(A) = 0 $$", "$$ \\det(A) \\neq 0 $$", "Always", "Never"], ans: 0, diff: "hard", exp: "A homogeneous system always has the trivial solution $X=0$. A non-trivial solution exists if and only if matrix $A$ is non-invertible, which corresponds to $$ \\det(A) = 0 $$." }
  ],
  'matrices.html': [
    { q: "Find the product $AB$ given: $$ A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}, \\, B = \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix} $$", expr: "", opts: ["$$ \\begin{pmatrix} 17 \\\\ 39 \\end{pmatrix} $$", "$$ \\begin{pmatrix} 17 & 39 \\end{pmatrix} $$", "$$ \\begin{pmatrix} 5 \\\\ 24 \\end{pmatrix} $$", "$$ AB \\text{ is undefined} $$"], ans: 0, diff: "medium", exp: "Multiply row elements by columns: $$ AB = \\begin{pmatrix} (1 \\cdot 5) + (2 \\cdot 6) \\\\ (3 \\cdot 5) + (4 \\cdot 6) \\end{pmatrix} = \\begin{pmatrix} 17 \\\\ 39 \\end{pmatrix} $$." },
    { q: "Find the inverse of matrix $$ A = \\begin{pmatrix} 4 & 7 \\\\ 1 & 2 \\end{pmatrix} $$", expr: "", opts: ["$$ \\begin{pmatrix} 2 & -7 \\\\ -1 & 4 \\end{pmatrix} $$", "$$ \\begin{pmatrix} 2 & 7 \\\\ 1 & 4 \\end{pmatrix} $$", "$$ \\begin{pmatrix} -2 & 7 \\\\ 1 & -4 \\end{pmatrix} $$", "$$ \\begin{pmatrix} 4 & 1 \\\\ 7 & 2 \\end{pmatrix} $$"], ans: 0, diff: "hard", exp: "First, determinant $$ \\det(A) = 4(2) - 7(1) = 1 $$. The inverse is $$ \\frac{1}{\\det(A)} \\text{adj}(A) = 1 \\cdot \\begin{pmatrix} 2 & -7 \\\\ -1 & 4 \\end{pmatrix} = \\begin{pmatrix} 2 & -7 \\\\ -1 & 4 \\end{pmatrix} $$." },
    { q: "What is the transpose of a symmetric matrix equal to?", expr: "", opts: ["The matrix itself ($A^T = A$)", "The negative of the matrix ($A^T = -A$)", "The inverse matrix ($A^T = A^{-1}$)", "The identity matrix ($A^T = I$)"], ans: 0, diff: "easy", exp: "A square matrix is symmetric if it is equal to its transpose: $$ A^T = A $$." },
    { q: "What are the dimensions of product matrix $AB$ if $A$ is $3 \\times 2$ and $B$ is $2 \\times 5$?", expr: "", opts: ["$$ 3 \\times 5 $$", "$$ 2 \\times 2 $$", "$$ 3 \\times 2 $$", "$t$ product is undefined"], ans: 0, diff: "easy", exp: "Matrix multiplication of $(m \\times n)$ by $(n \\times p)$ yields a matrix of dimension $(m \\times p)$. In this case: $(3 \\times 2) \\times (2 \\times 5) \\implies 3 \\times 5$." },
    { q: "For any square matrix $A$, what is $$ A \\cdot A^{-1} $$ equal to?", expr: "", opts: ["Identity Matrix ($I$)", "Zero Matrix ($0$)", "The matrix $A$ itself", "Inverse matrix $A^{-1}$"], ans: 0, diff: "easy", exp: "By algebraic definition, multiplying any invertible matrix by its inverse yields the **Identity Matrix ($I$)**: $$ A \\cdot A^{-1} = I $$." }
  ],

  // ── STATISTICS & PROBABILITY UNIT ──
  'correlation-regression.html': [
    { q: "What is the range of values for Pearson's correlation coefficient $r$?", expr: "", opts: ["$$ [-1, 1] $$", "$$ [0, 1] $$", "$$ (-\\infty, \\infty) $$", "$$ [-10, 10] $$"], ans: 0, diff: "easy", exp: "Pearson's correlation coefficient $r$ is bounded strictly between -1 and +1 inclusive: $$ -1 \\le r \\le 1 $$. Extremes represent perfect linear relationships." },
    { q: "If the correlation coefficient $$ r = -0.95 $$, what does this indicate?", expr: "", opts: ["Strong negative linear relationship", "Strong positive relationship", "Weak negative relationship", "No relationship exists"], ans: 0, diff: "easy", exp: "Since $r$ is very close to -1, it represents an extremely strong negative linear relationship (as one variable increases, the other decreases)." },
    { q: "What does a correlation coefficient $$ r = 0 $$ mean?", expr: "", opts: ["No linear relationship exists", "A perfect relationship exists", "The variables are equal", "There is positive relationship"], ans: 0, diff: "easy", exp: "A value of $r = 0$ indicates that there is **no linear relationship** between the two variables." },
    { q: "In the regression line equation $$ y = mx + c $$, what does the coefficient $m$ represent?", expr: "", opts: ["The slope (change in $y$ per unit change in $x$)", "The y-intercept", "The correlation factor", "The sample size"], ans: 0, diff: "easy", exp: "The coefficient $m$ is the **slope** of the regression line, representing how many units $y$ changes for each unit increase in $x$." },
    { q: "If the two regression lines are perpendicular, what is the correlation coefficient $r$?", expr: "", opts: ["$$ 0 $$", "$$ 1 $$", "$$ -1 $$", "$$ \\pm 0.5 $$"], ans: 0, diff: "hard", exp: "Regression lines are perpendicular if there is zero linear association between the variables. Thus, their slopes do not influence each other, indicating $$ r = 0 $$." }
  ],
  'discrete-prob-dist.html': [
    { q: "What is the sum of all probabilities in a discrete probability distribution?", expr: "", opts: ["$$ 1 $$", "$$ 0 $$", "Depends on sample size", "Infinite"], ans: 0, diff: "easy", exp: "For any valid probability distribution, the sum of all individual probabilities across the sample space must be exactly equal to 1: $$ \\sum P(x) = 1 $$." },
    { q: "Find the mean (expected value) of $X$ given: $$ X \\in \\{1, 2\\} $$ with probabilities $$ P(1)=0.4, P(2)=0.6 $$.", expr: "", opts: ["$$ 1.6 $$", "$$ 1.5 $$", "$$ 2.0 $$", "$$ 1.4 $$"], ans: 0, diff: "medium", exp: "Expected Value is $$ E(X) = \\sum x_i P(x_i) = (1 \\cdot 0.4) + (2 \\cdot 0.6) = 0.4 + 1.2 = 1.6 $$." },
    { q: "What are the parameters that completely define a Binomial Distribution?", expr: "", opts: ["Number of trials ($n$) and probability of success ($p$)", "Mean and Variance", "Standard Deviation only", "Lambda ($\\lambda$)"], ans: 0, diff: "easy", exp: "A binomial distribution represents $n$ independent trials with a constant probability of success $p$. Hence, parameters $n$ and $p$ define it completely." },
    { q: "What is the formula for the variance of a Binomial Distribution?", expr: "", opts: ["$$ npq $$ (where $q = 1-p$)", "$$ np $$", "$$ \\sqrt{npq} $$", "$$ np(1+p) $$"], ans: 0, diff: "medium", exp: "The mean is $np$, and the variance of a Binomial Distribution is $$ \\sigma^2 = npq $$ where $q = 1 - p$ represents the probability of failure." },
    { q: "Which distribution models the number of events occurring in a fixed interval of time if events occur with a known constant mean rate?", expr: "", opts: ["Poisson Distribution", "Binomial Distribution", "Normal Distribution", "Uniform Distribution"], ans: 0, diff: "medium", exp: "The **Poisson Distribution** models the probability of a number of events occurring within a fixed interval of time or space, characterized by parameter $\\lambda$." }
  ],
  'probability.html': [
    { q: "A coin is flipped and a standard 6-sided die is rolled. Find the probability of getting a Head AND rolling a 5.", expr: "", opts: ["$$ 1/12 $$", "$$ 1/4 $$", "$$ 1/6 $$", "$$ 2/3 $$"], ans: 0, diff: "easy", exp: "Probability of flipping a Head is $1/2$. Probability of rolling a 5 is $1/6$. Since these are independent events, multiply them: $$ \\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12} $$." },
    { q: "If $$ P(A) = 0.6, \\, P(B) = 0.4, \\text{ and } P(A \\cap B) = 0.2 $$, find $$ P(A \\cup B) $$", expr: "", opts: ["$$ 0.8 $$", "$$ 1.0 $$", "$$ 0.6 $$", "$$ 0.4 $$"], ans: 0, diff: "medium", exp: "Apply the addition rule of probability: $$ P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.6 + 0.4 - 0.2 = 0.8 $$." },
    { q: "What is the probability of drawing an Ace from a standard well-shuffled deck of 52 cards?", expr: "", opts: ["$$ 1/13 $$", "$$ 1/52 $$", "$$ 4/13 $$", "$$ 1/4 $$"], ans: 0, diff: "easy", exp: "There are 4 Aces in a deck of 52 cards. The probability is $$ \\frac{4}{52} = \\frac{1}{13} $$." },
    { q: "What is the conditional probability formula for $$ P(A \\mid B) $$?", expr: "", opts: ["$$ P(A \\cap B) / P(B) $$", "$$ P(A \\cup B) / P(B) $$", "$$ P(A) \\cdot P(B) $$", "$$ P(A \\cap B) / P(A) $$"], ans: 0, diff: "medium", exp: "Conditional probability of $A$ given $B$ is the probability of both occurring divided by the probability of the condition: $$ P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} $$ (for $P(B) > 0$)." },
    { q: "According to Bayes' Theorem, what is $$ P(A \\mid B) $$ equal to?", expr: "", opts: ["$$ \\frac{P(B \\mid A)P(A)}{P(B)} $$", "$$ \\frac{P(A \\mid B)P(B)}{P(A)} $$", "$$ P(B \\mid A)P(A) $$", "$$ P(A)P(B) $$"], ans: 0, diff: "hard", exp: "Bayes' Theorem relates conditional and marginal probabilities: $$ P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B)} $$." }
  ],
  'statistical-estimation.html': [
    { q: "Find a 95% Confidence Interval for sample mean $$ \\bar{x} = 50 $$, standard deviation $$ \\sigma = 10 $$, and sample size $$ n = 100 $$. (Use $z = 1.96$)", expr: "", opts: ["$$ [48.04, 51.96] $$", "$$ [49.02, 50.98] $$", "$$ [40.00, 60.00] $$", "$$ [45.00, 55.00] $$"], ans: 0, diff: "medium", exp: "Standard error is $$ SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{10}{\\sqrt{100}} = 1 $$. The margin of error is $$ z \\cdot SE = 1.96 \\times 1 = 1.96 $$. Thus, the 95% CI is $$ [50 - 1.96, 50 + 1.96] = [48.04, 51.96] $$." },
    { q: "What is an unbiased estimator?", expr: "", opts: ["An estimator whose expected value equals the true population parameter", "An estimator with zero variance", "An estimator based on a huge sample size", "A rounded value"], ans: 0, diff: "easy", exp: "An estimator is unbiased if its mathematical expected value is equal to the actual population parameter being estimated: $$ E(\\hat{\\theta}) = \\theta $$." },
    { q: "What happens to the margin of error of a confidence interval as the sample size $n$ increases?", expr: "", opts: ["It decreases", "It increases", "It remains unchanged", "It becomes zero"], ans: 0, diff: "easy", exp: "Since sample size $n$ sits in the denominator of the standard error formula ($$ \\sigma / \\sqrt{n} $$), increasing $n$ shrinks the standard error, thereby decreasing the margin of error." },
    { q: "Which value represents the degree of certainty we have that a confidence interval contains the true parameter?", expr: "", opts: ["Confidence Level (e.g. 95%)", "Significance Level ($\\alpha$)", "Margin of Error", "p-value"], ans: 0, diff: "easy", exp: "The **Confidence Level** (like 95% or 99%) expresses the probability that the estimated confidence interval contains the true population parameter over repeated samplings." },
    { q: "What is the standard error of the sample mean?", expr: "", opts: ["$$ \\sigma / \\sqrt{n} $$", "$$ \\sigma^2 / n $$", "$$ \\sqrt{\\sigma/n} $$", "$$ npq $$"], ans: 0, diff: "medium", exp: "The standard deviation of the sampling distribution of the sample mean is called the Standard Error, computed as $$ SE = \\frac{\\sigma}{\\sqrt{n}} $$." }
  ],
  'statistics.html': [
    { q: "Find the median of the following dataset: $$ 12, 5, 22, 17, 9, 14, 18 $$", expr: "", opts: ["$$ 14 $$", "$$ 12 $$", "$$ 17 $$", "$$ 13.86 $$"], ans: 0, diff: "easy", exp: "Sort the dataset first: $$ 5, 9, 12, 14, 17, 18, 22 $$. Since there are 7 data points (odd), the median is the middle value (4th element), which is 14." },
    { q: "What is the relationship between Mean, Median, and Mode in a perfectly symmetrical normal distribution?", expr: "", opts: ["Mean = Median = Mode", "Mean > Median > Mode", "Mean < Median < Mode", "They are unrelated"], ans: 0, diff: "easy", exp: "In a perfectly symmetrical distribution, the three central tendency measures coincide perfectly at the peak: $$ \\text{Mean} = \\text{Median} = \\text{Mode} $$." },
    { q: "Find the mean of the numbers: $$ 5, 10, 15, 20, 25 $$", expr: "", opts: ["$$ 15 $$", "$$ 12.5 $$", "$$ 10 $$", "$$ 20 $$"], ans: 0, diff: "easy", exp: "Sum all elements: $$ 5 + 10 + 15 + 20 + 25 = 75 $$. Divide by sample size 5: $$ 75 / 5 = 15 $$." },
    { q: "What is the standard deviation equal to?", expr: "", opts: ["The positive square root of the variance", "The square of the variance", "The range divided by 2", "The average deviation"], ans: 0, diff: "easy", exp: "Standard deviation $\\sigma$ is defined mathematically as the positive square root of the variance: $$ \\sigma = \\sqrt{\\sigma^2} $$." },
    { q: "If a dataset has variance equal to 49, what is its standard deviation?", expr: "", opts: ["$$ 7 $$", "$$ 49 $$", "$$ 9.8 $$", "$$ 24.5 $$"], ans: 0, diff: "easy", exp: "Standard deviation is the square root of variance: $$ \\sqrt{49} = 7 $$." }
  ],
  'trigonometry.html': [
    { q: "Simplify: $$ \\sin \\theta \\cdot \\cot \\theta $$", expr: "", opts: ["$$ \\cos \\theta $$", "$$ \\sin \\theta $$", "$$ \\tan \\theta $$", "$$ 1 $$"], ans: 0, diff: "easy", exp: "Express cotangent in terms of sine and cosine: $$ \\cot \\theta = \\frac{\\cos \\theta}{\\sin \\theta} $$. Multiply by sine: $$ \\sin \\theta \\cdot \\frac{\\cos \\theta}{\\sin \\theta} = \\cos \\theta $$." },
    { q: "What is the value of $$ \\sin^2(35^\\circ) + \\sin^2(55^\\circ) $$?", expr: "", opts: ["$$ 1 $$", "$$ 0 $$", "$$ 0.5 $$", "$$ 2 $$"], ans: 0, diff: "medium", exp: "Note that $$ 55^\\circ = 90^\\circ - 35^\\circ $$. Since $$ \\sin(90^\\circ - x) = \\cos x $$, we have $$ \\sin^2(55^\\circ) = \\cos^2(35^\\circ) $$. By the Pythagorean identity, $$ \\sin^2(35^\\circ) + \\cos^2(35^\\circ) = 1 $$." },
    { q: "If $$ \\tan \\theta = 3/4 $$ and $\\theta$ is in the first quadrant, find $$ \\sin \\theta $$", expr: "", opts: ["$$ 3/5 $$", "$$ 4/5 $$", "$$ 3/4 $$", "$$ 5/3 $$"], ans: 0, diff: "easy", exp: "Since $$ \\tan \\theta = \\text{Opposite/Adjacent} = 3/4 $$, the hypotenuse is $$ \\sqrt{3^2 + 4^2} = 5 $$. Hence, $$ \\sin \\theta = \\text{Opposite/Hypotenuse} = 3/5 $$." },
    { q: "State the value of $$ \\cos(120^\\circ) $$.", expr: "", opts: ["$$ -1/2 $$", "$$ 1/2 $$", "$$ -\\sqrt{3}/2 $$", "$$ \\sqrt{3}/2 $$"], ans: 0, diff: "medium", exp: "In the second quadrant, cosine is negative: $$ \\cos(120^\\circ) = \\cos(180^\\circ - 60^\\circ) = -\\cos(60^\\circ) = -1/2 $$." },
    { q: "Which of the following is equivalent to $$ 1 + \\tan^2 \\theta $$?", expr: "", opts: ["$$ \\sec^2 \\theta $$", "$$ \\csc^2 \\theta $$", "$$ \\cot^2 \\theta $$", "$$ \\cos^2 \\theta $$"], ans: 0, diff: "easy", exp: "By standard Pythagorean trigonometric identities, $$ 1 + \\tan^2 \\theta = \\sec^2 \\theta $$." }
  ]
};

function generateStepsHtml(questions) {
  return questions.map((q, idx) => {
    if (!q || !q.q) return '';
    const opts = q.opts || ['Yes', 'No'];
    
    // Generate beautiful list of choices for Step 1
    const optionsList = opts.map((opt, oIdx) => {
      const label = String.fromCharCode(65 + oIdx); // A, B, C, D...
      return `<li style="margin-bottom:0.4rem;text-align:left;"><strong>Option ${label}:</strong> ${opt}</li>`;
    }).join('');
    
    const ansIdx = typeof q.ans === 'number' ? q.ans : 0;
    const correctLabel = String.fromCharCode(65 + ansIdx);
    const correctOptionText = opts[ansIdx] || 'Correct Option';

    return `
          <!-- Example ${idx + 1} -->
          <div class="solved-example-card">
            <div class="solved-example-header">
              <span class="solved-badge">Example ${idx + 1} · Concept Application</span>
              <div class="solved-timer" id="timer-${idx + 1}">
                <span class="timer-display">00:00</span>
                <button class="timer-btn" onclick="toggleTimer(${idx + 1})">Start Timer ⏱️</button>
              </div>
            </div>
            <div class="solved-question">
              ${q.q}
              ${q.expr ? `<div style="margin-top:0.5rem;font-size:1.15rem;font-weight:600;">${q.expr}</div>` : ''}
            </div>
            <div class="solved-solution-wrap" id="solution-${idx + 1}">
              <button class="btn btn-primary btn-reveal" onclick="revealSolution(${idx + 1})">Reveal Step-by-Step Solution 👁️</button>
              <div class="solved-steps" style="display: none;">
                
                <div class="solved-step">
                  <div class="step-num">Step 1</div>
                  <div class="step-content">
                    <div class="step-desc">
                      Analyze the given options:
                      <ul style="margin-top:0.5rem; padding-left:1.2rem; list-style-type: none;">
                        ${optionsList}
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="solved-step">
                  <div class="step-num">Step 2</div>
                  <div class="step-content">
                    <div class="step-math">$$\\text{Apply Core Principles}$$</div>
                    <div class="step-desc">${q.exp}</div>
                  </div>
                </div>

                <div class="solved-step">
                  <div class="step-num">Step 3</div>
                  <div class="step-content">
                    <div class="step-desc">
                      Cross-reference choices to select the valid deduction. Option <strong>${correctLabel}</strong> perfectly aligns with the principles analyzed.
                    </div>
                  </div>
                </div>

                <div class="solved-success-box">
                  <strong>Final Answer:</strong> Option ${correctLabel} (${correctOptionText})
                </div>
              </div>
            </div>
          </div>`;
  }).join('\n');
}

function processFile(filePath) {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. If we have custom questions to scale, replace the questions array in the file!
  if (NEW_QUESTIONS_MAP[fileName]) {
    const questionsPattern = /(?:const|let|var)\s+(\w*[qQ]uestions)\s*=\s*\[[^]*?\]\s*;/;
    if (questionsPattern.test(content)) {
      const qArrayNameMatch = content.match(/(?:const|let|var)\s+(\w*[qQ]uestions)\s*=/);
      const qArrayName = qArrayNameMatch ? qArrayNameMatch[1] : 'questions';
      
      const newQuestionsStr = `const ${qArrayName} = ` + JSON.stringify(NEW_QUESTIONS_MAP[fileName], null, 2) + ';';
      content = content.replace(questionsPattern, newQuestionsStr);
      console.log(`[Success] Scaled up quiz questions array in ${fileName}`);
    }
  }

  // 2. Extract the newly updated (or pre-existing) questions array
  const questionsMatch = content.match(/(?:const|let|var)\s+(\w*[qQ]uestions)\s*=\s*(\[[^]*?\])\s*;/);
  if (!questionsMatch) {
    console.log(`[Error] Unmatched questions pattern in ${fileName}`);
    return;
  }
  
  const arrayStr = questionsMatch[2];
  let questions = [];
  try {
    const getQuestions = new Function(`return ${arrayStr};`);
    questions = getQuestions();
  } catch (err) {
    console.error(`[Error] Parsing compiled questions in ${fileName}:`, err);
    return;
  }

  // 3. Construct Solved Examples HTML Pane
  const stepsHtml = generateStepsHtml(questions);
  const paneSolvedHtml = `
        <!-- SOLVED EXAMPLES -->
        <div class="tab-pane" id="pane-solved">
          <div class="solved-examples-container">
            ${stepsHtml}
          </div>
        </div>
  `;

  // 4. Inject or replace the pane solved block
  const solvedPaneRegex = /<!-- SOLVED EXAMPLES -->[^]*?id="pane-solved"[^]*?<\/div>\s*<\/div>/;
  if (solvedPaneRegex.test(content)) {
    content = content.replace(solvedPaneRegex, paneSolvedHtml);
    console.log(`[Success] Solved Examples successfully rebuilt in ${fileName} (${questions.length} examples)`);
  } else {
    // Fallback if not injected before
    const quizPanePattern = /<div class="tab-pane"\s+id="pane-quiz">/;
    if (quizPanePattern.test(content)) {
      content = content.replace(quizPanePattern, `${paneSolvedHtml}\n        <div class="tab-pane" id="pane-quiz">`);
      console.log(`[Success] Solved Examples injected via fallback in ${fileName}`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.html')) {
      processFile(fullPath);
    }
  });
}

console.log('Scaling quiz questions and Solved Examples to at least 5-10 for all topics...');
walkDir(topicsDir);
console.log('Finished dynamic scaling and rebuilding!');
