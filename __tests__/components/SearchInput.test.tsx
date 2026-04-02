/**
 * __tests__/components/SearchInput.test.tsx
 *
 * Unit tests for the SearchInput component's debounce and URL-sync behaviour.
 *
 * Key testing decisions:
 *
 *   Fake timers (vi.useFakeTimers):
 *     The debounce is implemented with setTimeout(300). Fake timers let us
 *     advance time synchronously with vi.advanceTimersByTime(300) so we can
 *     assert on router.replace without actually waiting 300 ms per test.
 *
 *   fireEvent.change instead of userEvent.type:
 *     @testing-library/user-event v14 uses async internals (Promises + real
 *     timers) that conflict with vi.useFakeTimers(), causing 5-second timeouts.
 *     fireEvent.change fires the change event synchronously, which is sufficient
 *     for testing the value update and debounce timer.
 *
 *   next/navigation mock:
 *     useSearchParams, useRouter, and usePathname are stubbed to return
 *     controlled values. mockReplace captures calls to router.replace so
 *     we can assert on the URL it was called with.
 *
 *   act() around timer advancement:
 *     Advancing fake timers triggers the setTimeout callback which calls
 *     setState (via router.replace → re-render). Wrapping in act() flushes
 *     those React state updates synchronously so assertions see the final state.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SearchInput } from "@/components/molecules/SearchInput";

/** Captures all calls to router.replace for assertion */
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (_key: string) => null,
    toString: () => "",
  }),
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/",
}));

/** Helper — fires a change event on the input without the userEvent async overhead */
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
