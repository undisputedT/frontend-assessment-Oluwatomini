/**
 * vitest.setup.ts
 *
 * Global test setup that runs once before each test file.
 *
 * jest-dom:
 *   Extends Vitest's expect with DOM-specific matchers such as
 *   toBeInTheDocument(), toHaveAttribute(), toHaveValue(), etc.
 *   These make assertions on rendered HTML far more readable than
 *   checking raw DOM properties manually.
 *
 * next/image mock:
 *   next/image relies on Next.js's server-side image optimisation pipeline
 *   (Sharp) which is not available in a jsdom test environment. Replacing it
 *   with a plain <img> element allows components that use FallbackImage or
 *   direct next/image calls to render without error in tests. The mock
 *   passes all props through so tests can still assert on src, alt, etc.
 */

import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock next/image globally so tests run in jsdom without Sharp
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement("img", props),
}));
