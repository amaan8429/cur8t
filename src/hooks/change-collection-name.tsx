import React from "react";

// Dispatch a collection name changed event
export const dispatchCollectionNameChangedEvent = (
  collectionId: string,
  newName: string
) => {
  const event = new CustomEvent("collectionNameChanged", {
    detail: { id: collectionId, name: newName },
  });
  window.dispatchEvent(event);
};

// Hook to listen for collection name changes
export const useCollectionNameChangeEvent = (
  callback: (event: CustomEvent<{ id: string; name: string }>) => void
) => {
  React.useEffect(() => {
    const handler = (event: Event) => {
      callback(event as CustomEvent<{ id: string; name: string }>);
    };

    window.addEventListener("collectionNameChanged", handler);

    return () => {
      window.removeEventListener("collectionNameChanged", handler);
    };
  }, [callback]);
};
