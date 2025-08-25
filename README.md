# Edgar’s Mission

This repository hosts my submission for https://js13kgames.com/ for 2025.

The current version of the game is available at https://schnark.github.io/js13kgames-2025/.

**Some notes about the design:**

Most platformers treat the player just as one point. The image for the player is larger, but either you are on a platform or you are not. This works well for any body where the feet are near each other at any time, but a cat viewed from the side is much larger. So this platformer works with two points, which makes movement more natural and more difficult. There are three modes:

**Walking:** When both points are on the ground or a platform, moving just changes the x-coordinates, the y-coordinates are calculated to keep the player on the current curve. When you hit an obstacle or the border of the level you just stop, when you run into the end of a platform one point looses contact, when you jump both points loose contact.

**Flying:** When neither point is on the ground or a platform you are flying. When you just recently left the ground you can jump, and in any case gravity applies. The current velocity is applied to both points, additionally you rotate to adapt to the direction in which you jump. When you hit an obstacle from below you stop in the vertical direction, when you hit one from the side you stop in the horizontal direction and also regain the ability to jump. When you hit something from above, you get locked to that curve.

**Sliding:** The most difficult mode is the case when one point is locked to a curve, and the other one is free. In this case the free point moves like flying, while the other one is moved on the curve trying to keep the correct distance.

Technically, the cat is just a rectangle (with slighly varying length and more or less arbitrary height), and this was exactly the placeholder in the early prototypes of the game. The actual cat is just drawn into this rectangle, and there is https://schnark.github.io/js13kgames-2025/test-cat.html to test the design of the cat.

For level design there is https://schnark.github.io/js13kgames-2025/test-levels.html which allows direct selection of a level, shows the position, disables death, and most importantly allows reloading an updated level while keeping the current position of the cat.