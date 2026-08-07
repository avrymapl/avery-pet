---
title: Orthogonality
summary: Perpendicularity, generalised to any space with an inner product.
---

Orthogonality is perpendicularity, freed from the picture that gave it birth.
Two arrows in the plane are perpendicular when they meet at a right angle; the
generalisation says that two vectors in any [[vector-space]] are orthogonal
when their [[inner-product]] is zero. Nothing in the definition mentions
angles, and that is its strength: it applies verbatim in three dimensions, in
thirty, and in spaces of functions where no protractor could follow.

The definition earns the name by agreeing with the picture where the picture
exists. In the plane, the dot product of two arrows is the product of their
lengths with the cosine of the angle between them, and the cosine vanishes
exactly at a right angle. The abstract definition simply keeps the algebraic
half of this fact — inner product zero — and discards the geometric half,
letting the algebra decide what "perpendicular" means wherever it goes.

What makes orthogonality more than a definition is what it buys. First,
independence: a family of mutually orthogonal nonzero vectors can never be
redundant, since no member can be assembled from the others. Second, and more
practically, it makes coordinates computable. Given a [[basis]] whose vectors
are mutually orthogonal, the coefficient of any vector along one basis
direction is found by a single inner product with that direction, ignoring
every other. In an oblique basis, by contrast, finding coordinates means
solving simultaneous equations in which every direction interferes with every
other. An orthogonal basis is a frame in which questions decouple.

Third, orthogonality gives the Pythagorean theorem in every dimension: when
two vectors are orthogonal, the squared length of their sum is the sum of
their squared lengths. From this follows the theory of projection — the
nearest point to a vector within a subspace is found by dropping a
perpendicular, and the error made is itself orthogonal to the subspace. Least
squares fitting, the workhorse of data analysis, is exactly this projection.

The reach of the idea comes from how unassuming its ingredients are. Whenever
a collection of objects forms a vector space and admits an inner product, the
whole apparatus arrives free of charge. Functions on an interval are the
striking case: with the inner product given by the [[integral]] of a product,
the [[trigonometric-functions|sines and cosines]] of distinct frequencies
turn out to be mutually orthogonal, and the machinery of perpendicular
frames — coordinates, projections, Pythagoras — applies to objects that are
not arrows at all. That single observation is the engine of Fourier analysis,
where a function's frequency content is read off by projection, one
orthogonal direction at a time.
