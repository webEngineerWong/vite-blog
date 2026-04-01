<template>
  <div class="home-background" aria-hidden="true">
    <span class="home-background__mesh"></span>
    <span class="home-background__orb home-background__orb--blue"></span>
    <span class="home-background__orb home-background__orb--green"></span>
    <span class="home-background__orb home-background__orb--orange"></span>
    <span class="home-background__line home-background__line--one"></span>
    <span class="home-background__line home-background__line--two"></span>
  </div>
</template>

<style scoped>
.home-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.home-background__mesh,
.home-background__orb,
.home-background__line {
  position: absolute;
}

.home-background__mesh {
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.68), transparent 82%);
}

.home-background__orb {
  border-radius: 999px;
  filter: blur(50px);
  opacity: 0.3;
}

.home-background__orb--blue {
  top: 72px;
  left: -40px;
  width: 320px;
  height: 320px;
  background: rgba(31, 111, 255, 0.24);
}

.home-background__orb--green {
  top: 340px;
  right: 8%;
  width: 280px;
  height: 280px;
  background: rgba(34, 197, 161, 0.18);
}

.home-background__orb--orange {
  bottom: 160px;
  left: 10%;
  width: 240px;
  height: 240px;
  background: rgba(255, 138, 61, 0.18);
}

.home-background__line {
  border: 1px solid rgba(59, 130, 246, 0.14);
  border-radius: 999px;
}

.home-background__line--one {
  top: 120px;
  right: -120px;
  width: 520px;
  height: 520px;
}

.home-background__line--two {
  top: 420px;
  left: -180px;
  width: 420px;
  height: 420px;
}

:global(.dark) .home-background__mesh {
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
}

:global(.dark) .home-background__orb--blue {
  background: rgba(77, 136, 255, 0.2);
}

:global(.dark) .home-background__orb--green {
  background: rgba(45, 212, 191, 0.14);
}

:global(.dark) .home-background__orb--orange {
  background: rgba(251, 146, 60, 0.14);
}

:global(.dark) .home-background__line {
  border-color: rgba(96, 165, 250, 0.12);
}
</style>
