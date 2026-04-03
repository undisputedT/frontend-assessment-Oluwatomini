// __tests__/components/SearchInput.test.tsx
// Tests for the SearchInput component.
// Main things to check: the debounce works, the URL gets updated correctly,
// and clearing the input removes the search param.
//
// We use fake timers (vi.useFakeTimers) so we can skip the 300ms wait.
// We use fireEvent.change instead of userEvent.type because userEvent v14
// has async internals that don't work well with fake timers.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SearchInput } from "@/components/molecules/SearchInput";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (_key: string) => null,
    toString: () => "",
  }),
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/",
}));

function typeIntoInput(input: HTMLElement, value: string) {
  fireEvent.change(input, { target: { value } });
}

describe("SearchInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReplace.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders an input with an accessible label", () => {
    render(<SearchInput />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByLabelText(/search pokémon/i)).toBeInTheDocument();
  });

  it("updates the displayed value when the user types", () => {
    render(<SearchInput />);
    const input = screen.getByRole("searchbox");
    typeIntoInput(input, "pika");
    expect(input).toHaveValue("pika");
  });

  it("does NOT call router.replace immediately after typing", () => {
    render(<SearchInput />);
    typeIntoInput(screen.getByRole("searchbox"), "pika");
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("calls router.replace after 300ms debounce with the search param", () => {
    render(<SearchInput />);
    typeIntoInput(screen.getByRole("searchbox"), "pika");
    act(() => vi.advanceTimersByTime(300));
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("search=pika"),
      { scroll: false }
    );
  });

  it("calls router.replace with scroll:false option", () => {
    render(<SearchInput />);
    typeIntoInput(screen.getByRole("searchbox"), "char");
    act(() => vi.advanceTimersByTime(300));
    const [, options] = mockReplace.mock.calls[0];
    expect(options).toEqual({ scroll: false });
  });

  it("removes the search param when input is cleared", () => {
    render(<SearchInput />);
    const input = screen.getByRole("searchbox");
    typeIntoInput(input, "pika");
    act(() => vi.advanceTimersByTime(300));
    mockReplace.mockClear();

    typeIntoInput(input, "");
    act(() => vi.advanceTimersByTime(300));
    const [url] = mockReplace.mock.calls[0];
    expect(url).not.toContain("search=");
  });

  it("removes the page param when a new search is initiated", () => {
    render(<SearchInput />);
    typeIntoInput(screen.getByRole("searchbox"), "pika");
    act(() => vi.advanceTimersByTime(300));
    const [url] = mockReplace.mock.calls[0];
    expect(url).not.toContain("page=");
  });
});
