export function listenEvent<PayloadType>(
  eventName: string,
  callback: (detail: PayloadType) => void
): () => void {
  const listener = (event: CustomEvent<PayloadType>) => {
    callback(event.detail);
  };

  window.addEventListener(eventName, listener as EventListener);

  // Cleanup listener
  return () => {
    window.removeEventListener(eventName, listener as EventListener);
  };
}

export function dispatchEvent<PayloadType>(
  eventName: string,
  detail: PayloadType
): void {
  window.dispatchEvent(
    new CustomEvent(eventName, {
      detail,
    })
  );
}
