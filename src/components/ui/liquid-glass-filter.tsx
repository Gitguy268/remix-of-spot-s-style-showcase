/**
 * LiquidGlassFilter
 *
 * Mounts a single hidden <svg> containing reusable SVG filters used by all
 * liquid-glass primitives (LiquidGlassCard, LiquidGlassButton, GlassEffect).
 *
 * Inspired by https://kube.io/blog/liquid-glass-css-svg/ — combines a
 * fractal-noise displacement map (refraction) with a soft Gaussian blur
 * and a specular-style luminance highlight (rim shine).
 *
 * Browsers without SVG `backdrop-filter` support (Safari/Firefox) will
 * gracefully ignore the url() reference and fall back to backdrop-blur.
 */
const LiquidGlassFilter = () => {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* Main glass filter — refraction + slight blur */}
        <filter id="lg-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />
          <feGaussianBlur in="refracted" stdDeviation="0.4" />
        </filter>

        {/* Tighter variant for small elements (buttons) */}
        <filter id="lg-glass-sm" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.02"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />
          <feGaussianBlur in="refracted" stdDeviation="0.3" />
        </filter>

        {/* Specular rim highlight — used as foreground filter on edge layer */}
        <filter id="lg-specular" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="4"
            specularConstant="1.2"
            specularExponent="22"
            lightingColor="hsl(183, 80%, 90%)"
            result="spec"
          >
            <feDistantLight azimuth="135" elevation="55" />
          </feSpecularLighting>
          <feComposite
            in="spec"
            in2="SourceAlpha"
            operator="in"
            result="specMasked"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default LiquidGlassFilter;
