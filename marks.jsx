// WovenMap marks — brand-faithful family.
// Anchored to the canonical "Woven Crosshatch · 8 Bearings" mark from the
// brand guide: 4 curved Bézier threads N–S, E–W, NE–SW, NW–SE; an inner
// straight crosshatch; 8 endpoint dots (cardinal r=4, intercardinal r=3);
// a center "you-are-here" dot. Single-color mark only.
//
// All marks render at viewBox 0 0 200 200 to match the brand SVG.

const MarkBox = ({ children, size = 120, vb = 200 }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${vb} ${vb}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    {children}
  </svg>
);

// Shared geometry helpers ----------------------------------------------------
const THREADS = (
  <>
    <path d="M 100 22 C 108 60, 108 140, 100 178" />
    <path d="M 22 100 C 60 108, 140 108, 178 100" />
    <path d="M 155 45 C 130 78, 70 122, 45 155" />
    <path d="M 45 45 C 70 78, 130 122, 155 155" />
  </>
);

const INNER_CROSS = (
  <>
    <path d="M 70 70 L 130 130" />
    <path d="M 130 70 L 70 130" />
    <path d="M 100 70 L 100 130" />
    <path d="M 70 100 L 130 100" />
  </>
);

const ENDPOINT_DOTS = (color) => (
  <g fill={color}>
    <circle cx="100" cy="22" r="4" />
    <circle cx="100" cy="178" r="4" />
    <circle cx="22" cy="100" r="4" />
    <circle cx="178" cy="100" r="4" />
    <circle cx="155" cy="45" r="3" />
    <circle cx="45" cy="155" r="3" />
    <circle cx="45" cy="45" r="3" />
    <circle cx="155" cy="155" r="3" />
  </g>
);

// 1. CANONICAL — 8-thread starburst per the brand reference.
// Each thread is its OWN curved segment from an outer endpoint dot toward
// the center (it does not continue through to the opposite side as one
// path — that's what gives the reference its airy, woven feel near the
// middle). Cardinals (N/E/S/W) reach further out than diagonals.
// Every thread bows the SAME rotational direction (slight clockwise
// pinwheel). Each thread carries one small mid-thread bead near its outer
// end. A thin open ring at center; long sighting ticks extend through it
// vertically and horizontally with a small gap at the center; tiny outer
// cardinal ticks float at the very edges. Soft luminous haze behind it all.
const MarkCanonical = ({ ink, size, stroke = 1.6, haze = true }) => {
  const cx = 100, cy = 100;
  const Rcard = 84;        // cardinal endpoint radius
  const Rdiag = 60;        // diagonal endpoint radius (shorter)
  const innerStop = 14;    // threads stop ~here from center (just outside the ring)
  const endR = 4.0;        // endpoint dot radius
  const beadR = 1.9;       // mid-thread bead radius
  const beadFracFromEnd = 0.30; // bead sits 30% from the OUTER end (closer to endpoint)
  const bowFraction = 0.18; // perpendicular bow as fraction of thread length

  // 8 bearings, starting at N, going clockwise.
  const bearings = [
    { deg: -90, len: Rcard },   // N
    { deg: -45, len: Rdiag },   // NE
    { deg:   0, len: Rcard },   // E
    { deg:  45, len: Rdiag },   // SE
    { deg:  90, len: Rcard },   // S
    { deg: 135, len: Rdiag },   // SW
    { deg: 180, len: Rcard },   // W
    { deg:-135, len: Rdiag },   // NW
  ];

  const rad = (d) => (d * Math.PI) / 180;
  const hazeId = `mc-haze-${ink.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <MarkBox size={size}>
      {haze && (
        <>
          <defs>
            <radialGradient id={hazeId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ink} stopOpacity="0.42" />
              <stop offset="28%" stopColor={ink} stopOpacity="0.16" />
              <stop offset="70%" stopColor={ink} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r="50" fill={`url(#${hazeId})`} />
        </>
      )}

      {/* 8 individual curved threads, each from outer endpoint toward (but
          not through) the center. Bow direction is the SAME rotational
          sense for all 8 → clockwise pinwheel. */}
      <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
        {bearings.map((b, i) => {
          const a = rad(b.deg);
          // Outer endpoint
          const ex = cx + Math.cos(a) * b.len;
          const ey = cy + Math.sin(a) * b.len;
          // Inner stop point (just outside center ring)
          const ix = cx + Math.cos(a) * innerStop;
          const iy = cy + Math.sin(a) * innerStop;
          // Perpendicular direction (rotated +90°). Using +90° for ALL
          // threads gives the same rotational bow → pinwheel.
          const px = -Math.sin(a);
          const py = Math.cos(a);
          const armLen = b.len - innerStop;
          const bow = armLen * bowFraction;
          // Two control points along the arm with the same perpendicular
          // offset — a classic C-curve, not S-curve.
          const c1x = ex + (ix - ex) * 0.33 + px * bow;
          const c1y = ey + (iy - ey) * 0.33 + py * bow;
          const c2x = ex + (ix - ex) * 0.67 + px * bow;
          const c2y = ey + (iy - ey) * 0.67 + py * bow;
          return (
            <path
              key={i}
              d={`M ${ex} ${ey} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ix} ${iy}`}
            />
          );
        })}
      </g>

      {/* Endpoint dots — uniform size at the outer end of each thread. */}
      <g fill={ink}>
        {bearings.map((b, i) => {
          const a = rad(b.deg);
          return (
            <circle
              key={i}
              cx={cx + Math.cos(a) * b.len}
              cy={cy + Math.sin(a) * b.len}
              r={endR}
            />
          );
        })}
      </g>

      {/* Mid-thread beads — sit ~30% from the OUTER end (closer to the endpoint).
          Place them on the curve: their perpendicular offset relative to the
          straight line is bow * 4t(1-t) at parameter t (t measured from
          endpoint, so t = beadFracFromEnd). */}
      <g fill={ink}>
        {bearings.map((b, i) => {
          const a = rad(b.deg);
          const t = beadFracFromEnd;
          const armLen = b.len - innerStop;
          // position along straight line from endpoint inward
          const r = b.len - armLen * t;
          const px = -Math.sin(a);
          const py = Math.cos(a);
          const bow = armLen * bowFraction;
          const bowAtT = bow * 4 * t * (1 - t);
          return (
            <circle
              key={i}
              cx={cx + Math.cos(a) * r + px * bowAtT}
              cy={cy + Math.sin(a) * r + py * bowAtT}
              r={beadR}
            />
          );
        })}
      </g>

      {/* Center small open ring */}
      <circle cx={cx} cy={cy} r="11" stroke={ink} strokeWidth={stroke * 0.7} fill="none" opacity="0.85" />

      {/* Long sighting ticks — vertical + horizontal — extending through
          and past the center ring, with a small gap at the very center. */}
      <g stroke={ink} strokeWidth={stroke * 0.9} strokeLinecap="round">
        <line x1={cx} y1={cy - 24} x2={cx} y2={cy - 3} />
        <line x1={cx} y1={cy + 3}  x2={cx} y2={cy + 24} />
        <line x1={cx - 24} y1={cy} x2={cx - 3} y2={cy} />
        <line x1={cx + 3}  y1={cy} x2={cx + 24} y2={cy} />
      </g>

      {/* Tiny outer cardinal ticks at the four edges. */}
      <g stroke={ink} strokeWidth={stroke * 0.7} strokeLinecap="round" opacity="0.55">
        <line x1={cx} y1={4}   x2={cx} y2={13}  />
        <line x1={cx} y1={187} x2={cx} y2={196} />
        <line x1={4}   y1={cy} x2={13}  y2={cy} />
        <line x1={187} y1={cy} x2={196} y2={cy} />
      </g>

      {/* Center node — tiny */}
      <circle cx={cx} cy={cy} r="1.8" fill={ink} />
    </MarkBox>
  );
};

// 2. SIMPLIFIED — favicon-grade. Threads + dots + center, no inner cross.
const MarkSimple = ({ ink, size, stroke = 3 }) => (
  <MarkBox size={size}>
    <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
      {THREADS}
    </g>
    <g fill={ink}>
      <circle cx="100" cy="22" r="6" />
      <circle cx="100" cy="178" r="6" />
      <circle cx="22" cy="100" r="6" />
      <circle cx="178" cy="100" r="6" />
      <circle cx="155" cy="45" r="4.5" />
      <circle cx="45" cy="155" r="4.5" />
      <circle cx="45" cy="45" r="4.5" />
      <circle cx="155" cy="155" r="4.5" />
    </g>
    <circle cx="100" cy="100" r="6" fill={ink} />
  </MarkBox>
);

// 3. DENSE WEAVE — same threads, but with a fuller inner crosshatch (more
// "fabric"). For surfaces that need more presence.
const MarkDense = ({ ink, size, stroke = 1.8 }) => (
  <MarkBox size={size}>
    <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
      {THREADS}
    </g>
    <g stroke={ink} strokeWidth={stroke * 0.7} strokeLinecap="round" fill="none" opacity="0.7">
      <path d="M 60 60 L 140 140" />
      <path d="M 140 60 L 60 140" />
      <path d="M 100 60 L 100 140" />
      <path d="M 60 100 L 140 100" />
      <path d="M 78 78 L 122 122" />
      <path d="M 122 78 L 78 122" />
    </g>
    {ENDPOINT_DOTS(ink)}
    <circle cx="100" cy="100" r="4" fill={ink} />
    <circle cx="100" cy="100" r="11" stroke={ink} strokeWidth="0.7" fill="none" opacity="0.45" />
  </MarkBox>
);

// 4. THREADS-ONLY — no inner cross, no haze. Most elegant + scalable.
const MarkThreadsOnly = ({ ink, size, stroke = 2 }) => (
  <MarkBox size={size}>
    <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
      {THREADS}
    </g>
    {ENDPOINT_DOTS(ink)}
    <circle cx="100" cy="100" r="3.5" fill={ink} />
  </MarkBox>
);

// 5. COMPASS — explicit cardinal labels suggested by tick marks at every
// degree of the rose. Cartographic register.
const MarkCompass = ({ ink, size, stroke = 1.8 }) => {
  const ticks = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const long = i % 4 === 0;
    const r1 = long ? 84 : 88;
    const r2 = 92;
    ticks.push(
      <line
        key={i}
        x1={100 + Math.cos(a) * r1}
        y1={100 + Math.sin(a) * r1}
        x2={100 + Math.cos(a) * r2}
        y2={100 + Math.sin(a) * r2}
        stroke={ink}
        strokeWidth={long ? 0.9 : 0.5}
        opacity={long ? 0.6 : 0.35}
      />
    );
  }
  return (
    <MarkBox size={size}>
      <g>{ticks}</g>
      <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
        {THREADS}
      </g>
      <g stroke={ink} strokeWidth={stroke * 0.7} strokeLinecap="round" fill="none" opacity="0.6">
        {INNER_CROSS}
      </g>
      {ENDPOINT_DOTS(ink)}
      <circle cx="100" cy="100" r="3.5" fill={ink} />
    </MarkBox>
  );
};

// 6. CONTOUR — threads + a faint topographic ring set, hinting at the
// "map" half of the name.
const MarkContour = ({ ink, size, stroke = 1.8 }) => (
  <MarkBox size={size}>
    <g stroke={ink} strokeWidth="0.5" fill="none" opacity="0.28">
      <circle cx="100" cy="100" r="78" />
      <circle cx="100" cy="100" r="58" />
      <circle cx="100" cy="100" r="38" />
      <circle cx="100" cy="100" r="20" />
    </g>
    <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
      {THREADS}
    </g>
    <g stroke={ink} strokeWidth={stroke * 0.7} strokeLinecap="round" fill="none" opacity="0.7">
      {INNER_CROSS}
    </g>
    {ENDPOINT_DOTS(ink)}
    <circle cx="100" cy="100" r="3.5" fill={ink} />
  </MarkBox>
);

// 7. RING — the canonical mark held inside a thin outer ring. A "lens"
// or "stamp" treatment.
const MarkRing = ({ ink, size, stroke = 2 }) => (
  <MarkBox size={size}>
    <circle cx="100" cy="100" r="94" stroke={ink} strokeWidth="0.8" fill="none" opacity="0.7" />
    <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
      {THREADS}
    </g>
    <g stroke={ink} strokeWidth={stroke * 0.7} strokeLinecap="round" fill="none" opacity="0.7">
      {INNER_CROSS}
    </g>
    {ENDPOINT_DOTS(ink)}
    <circle cx="100" cy="100" r="3.5" fill={ink} />
  </MarkBox>
);

// 8. STRAIGHT — strict, geometric variant: replace curved threads with
// straight diameters. More "mapped grid", less "woven cloth".
const MarkStraight = ({ ink, size, stroke = 2 }) => (
  <MarkBox size={size}>
    <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
      <line x1="100" y1="22" x2="100" y2="178" />
      <line x1="22" y1="100" x2="178" y2="100" />
      <line x1="155" y1="45" x2="45" y2="155" />
      <line x1="45" y1="45" x2="155" y2="155" />
    </g>
    {ENDPOINT_DOTS(ink)}
    <circle cx="100" cy="100" r="3.5" fill={ink} />
  </MarkBox>
);

// 9. WOVEN — emphasizes interlace: at each crossing, one thread breaks for
// the other to pass over (visible warp/weft).
const MarkInterlace = ({ ink, size, stroke = 2.2 }) => {
  // We achieve "over/under" using mask cuts at each crossing point.
  const crossings = [
    { x: 100, y: 100 },
    { x: 70, y: 70 }, { x: 130, y: 130 },
    { x: 130, y: 70 }, { x: 70, y: 130 },
  ];
  return (
    <MarkBox size={size}>
      <defs>
        <mask id="interlace-mask">
          <rect width="200" height="200" fill="white" />
          {crossings.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="4.5" fill="black" />
          ))}
        </mask>
      </defs>
      {/* Bottom layer: NE-SW + N-S threads */}
      <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
        <path d="M 100 22 C 108 60, 108 140, 100 178" />
        <path d="M 155 45 C 130 78, 70 122, 45 155" />
      </g>
      {/* Top layer (with cuts): E-W + NW-SE */}
      <g
        stroke={ink}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        mask="url(#interlace-mask)"
      >
        <path d="M 22 100 C 60 108, 140 108, 178 100" />
        <path d="M 45 45 C 70 78, 130 122, 155 155" />
      </g>
      {ENDPOINT_DOTS(ink)}
      <circle cx="100" cy="100" r="3.5" fill={ink} />
    </MarkBox>
  );
};

window.WovenMarks = {
  canonical:   { name: "Canonical",     blurb: "production · brand guide §05",   Comp: MarkCanonical },
  simple:      { name: "Simplified",    blurb: "favicon-grade · 16–64px",         Comp: MarkSimple },
  threadsOnly: { name: "Threads-only",  blurb: "no inner cross · most scalable",  Comp: MarkThreadsOnly },
  dense:       { name: "Dense weave",   blurb: "fuller fabric · more presence",   Comp: MarkDense },
  compass:     { name: "Compass rose",  blurb: "16-tick bearings · cartographic", Comp: MarkCompass },
  contour:     { name: "Contour",       blurb: "topographic rings",               Comp: MarkContour },
  ring:        { name: "Ringed stamp",  blurb: "held in an outer lens",           Comp: MarkRing },
  interlace:   { name: "Over–under",    blurb: "explicit warp/weft crossings",    Comp: MarkInterlace },
  straight:    { name: "Straight",      blurb: "geometric · no curve",            Comp: MarkStraight },
};
