// vitest.setup.ts
// Runs once before every test file.
//
// jest-dom adds extra matchers like toBeInTheDocument() and toHaveValue()
// so we can write cleaner assertions on rendered elements.
//
// next/image needs the Sharp image processing library which isn't available
// in tests — we swap it for a plain <img> so components render without crashing.

import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement("img", props),
}));
