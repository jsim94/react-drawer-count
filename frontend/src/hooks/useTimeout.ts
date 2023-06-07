import { useCallback, useEffect, useRef, useState } from "react";

/** Runs a callback after a certain delay whenever the trigger value is changed. Resets timer if trigger changes before the timer expires.
 *
 * @param {*} trigger value to watch that triggers this effect
 * @param {*} callback callback to run if timeout expires
 * @param {*} delay timeout length
 */

export default function useTimeout(
  trigger: any,
  callback: () => void,
  delay: number = 400
) {
  const [toCancel, setCancel] = useState(false);

  // stores if callback should run
  const shouldRun = useRef(false);

  // stores timeout ID
  let timeoutId = useRef<number | null>(null);

  const runCallback = () => {
    callback();
    timeoutId.current = null;
  };

  useEffect(() => {
    // does not run on first render
    if (!shouldRun.current) {
      shouldRun.current = true;
      return;
    }

    if (toCancel) {
      shouldRun.current = false;
      setCancel(false);
      return;
    }

    // promise that resolves when timeout expires and proceeds to execute callback
    new Promise<void>((res) => {
      timeoutId.current = window.setTimeout(() => {
        res();
      }, delay);
    }).then(runCallback);

    // clears timeout if trigger value changes within the timeout lifespan
    return () => {
      if (!timeoutId.current) return;
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    };
  }, [trigger, toCancel]);

  // call to manually cancel a timeout. Provide finalRun = true to immediantly execute the callback
  const cancelTimeout = useCallback((finalRun: boolean = false) => {
    clearTimeout(timeoutId.current!);
    if (finalRun && timeoutId.current !== null) callback();
    setCancel(true);
  }, []);

  return { cancelTimeout };
}
