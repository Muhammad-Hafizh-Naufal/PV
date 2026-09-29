import { useId } from "react";
import clsx from "clsx";

// Adapted from Aceternity UI's free Spotlight component.
// https://ui.aceternity.com/components/spotlight
// Changes: unique filter IDs, accessible decorative markup, scoped light-theme animation.
export function Spotlight({
  className,
  fill = "#315cff",
}: {
  className?: string;
  fill?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={clsx("aceternity-spotlight", className)}
      aria-hidden="true"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter={`url(#${id})`}>
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id={id}
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
}
