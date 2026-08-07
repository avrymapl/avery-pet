---
title: Fourier series
summary: Writing any periodic function as an infinite sum of sines and cosines.
---

A Fourier series represents a [[periodic-function]] as an infinite sum of
[[trigonometric-functions|sines and cosines]]. The claim is startling on first
contact: the function being represented can jag, step, and corner, while every
sine and cosine is as smooth as a function can be. Yet for any reasonable
periodic function f with period 2π there are coefficients a₀, a₁, b₁, a₂, b₂, …
such that

f(x) = a₀/2 + a₁ cos x + b₁ sin x + a₂ cos 2x + b₂ sin 2x + …

and the sum on the right, carried far enough, comes as close to f as you
please. Joseph Fourier asserted as much in 1807 while studying the flow of
heat, to the open scepticism of his examiners; making his claim precise took
mathematics most of a century, and the tools invented to do it — much of
modern analysis among them — outgrew the original problem entirely.

## Where the coefficients come from

The formula for the coefficients is the heart of the matter, and it is best
understood geometrically. The periodic functions on an interval form a
[[vector-space]]: two functions add pointwise, a function scales by a number,
and the axioms hold. On this space there is an [[inner-product]], given by
integrating the product of two functions over one period. With it, questions
about functions become questions about geometry: lengths, angles, and
projections all make sense.

The trigonometric family — the constant function together with cos nx and
sin nx for every whole number n — has a remarkable property under this inner
product: [[orthogonality]]. Take any two distinct members of the family,
multiply them, and take the [[integral]] over a period, and the answer is
exactly zero, every time. The family behaves like a set of mutually
perpendicular directions in space, one direction per frequency.

That perpendicularity is what makes the coefficients computable. To find the
component of an ordinary vector along one axis of a perpendicular frame, you
project: dot the vector with the axis and divide by the axis's squared length,
and no other axis interferes. The Fourier coefficients are precisely this
projection, performed in a space of functions:

aₙ = (1/π) ∫ f(x) cos nx dx,  bₙ = (1/π) ∫ f(x) sin nx dx,

each integral taken over one period. Each coefficient answers, independently
of all the others, the question "how much of this frequency does f contain?"
The independence is orthogonality speaking: because the directions do not
overlap, the recipe for each is oblivious to the rest. It also explains the
otherwise odd-looking a₀/2 — the constant function is the lone member of the
family with a different squared length, and the halving quietly repairs the
mismatch.

## In what sense the sum reaches f

The claim that the series equals f is a statement about [[convergence]], and
its precise form is where the century of work went. The honest statement is
that the partial sums converge to f in mean square: the integral of the
squared error over a period tends to zero. For functions no worse than
piecewise smooth, more is true — the series converges at every point,
settling at each jump on the midpoint of the gap, splitting the difference
between the two sides.

Pointwise convergence near a jump hides a famous surprise. The partial sums
overshoot the jump by about nine percent of its height, and the overshoot
never shrinks as more terms arrive — it only narrows, crowding ever closer to
the jump itself. This is the Gibbs phenomenon, and it is not a defect of
truncation but a permanent fact about approximating discontinuity with
smoothness.

Viewed through the geometry, the whole subject compresses into one sentence:
the trigonometric family is not merely an orthogonal family but a [[basis]]
for the space — no periodic function of finite energy sits outside the span
of the frequencies — and a Fourier series is nothing more than the expansion
of a vector in a perpendicular frame, written out with integrals.

## Why the representation earns its keep

The value of trading f for its coefficients is that hard operations become
easy ones. Take the [[derivative]]: differentiating f term by term merely
multiplies the nth pair of coefficients by n and swaps sine with cosine.
Differentiation — an operation involving limits — becomes multiplication,
which is why Fourier reached for the series in the first place: his heat
equation relates a time derivative to two space derivatives, and frequency by
frequency it collapses into an equation a first course can solve. Each
frequency evolves on its own, the high ones dying fastest, which is exactly
the smoothing of temperature one observes in an iron bar.

The same trade powers the modern uses. A signal stored as coefficients can be
compressed by discarding the frequencies too faint to perceive; a
differential equation can be solved frequency by frequency; a convolution —
expensive in the original variables — becomes plain multiplication of
coefficients. Wherever a problem respects [[periodic-function|periodicity]],
the perpendicular frame of frequencies is usually the right set of axes, and
the Fourier series is the change of coordinates that gets you there.
