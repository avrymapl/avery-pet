"use client";

// Owns the worker that records traces. Edits are debounced, each request is
// numbered, and stale responses are dropped, so the trace the ide holds
// always matches the newest source, input, and settings.

import { useEffect, useRef, useState } from "react";
import type { Settings } from "./machine";
import { buildTrace, type Trace } from "./trace";
import type { RunRequest, RunResponse } from "./bf.worker";

const DEBOUNCE_MS = 200;

export interface TraceState {
  trace: Trace | null;
  compileError: { message: string; offset: number } | null;
  /** True while a newer run than the one shown is still being recorded. */
  working: boolean;
}

const encoder = new TextEncoder();

export function useBrainfuckTrace(
  source: string,
  input: string,
  settings: Settings,
): TraceState {
  const [state, setState] = useState<TraceState>({
    trace: null,
    compileError: null,
    working: true,
  });
  const workerRef = useRef<Worker | null>(null);
  const idRef = useRef(0);
  const pendingRef = useRef<RunRequest | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("./bf.worker.ts", import.meta.url));
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<RunResponse>) => {
      const response = event.data;
      const request = pendingRef.current;
      if (!request || response.id !== idRef.current || response.id !== request.id) return;
      pendingRef.current = null;
      if (response.kind === "compile-error") {
        setState({
          trace: null,
          compileError: { message: response.message, offset: response.offset },
          working: false,
        });
      } else {
        setState({
          trace: buildTrace(
            response.payload,
            request.source,
            encoder.encode(request.input),
            request.settings,
          ),
          compileError: null,
          working: false,
        });
      }
    };
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setState((current) => (current.working ? current : { ...current, working: true }));
      const request: RunRequest = { id: ++idRef.current, source, input, settings };
      pendingRef.current = request;
      workerRef.current?.postMessage(request);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [source, input, settings]);

  return state;
}
