import React from "react";

interface Collection {
  id: string;
  name: string;
  userId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  visiblity: string;
}

// Dispatch a collection added event
export const dispatchCollectionAddedEvent = (collection: Collection) => {
  const event = new CustomEvent("collectionAdded", {
    detail: collection,
  });
  window.dispatchEvent(event);
};

// Dispatch a collection updated event
export const dispatchCollectionUpdatedEvent = (
  collectionId: string,
  updates: Partial<Collection>
) => {
  const event = new CustomEvent("collectionUpdated", {
    detail: { id: collectionId, ...updates },
  });
  window.dispatchEvent(event);
};

// Generic hook to listen to collection events
export const useCollectionEvent = (
  eventName: "collectionAdded" | "collectionUpdated",
  callback: (event: CustomEvent) => void
) => {
  React.useEffect(() => {
    const handler = (event: Event) => {
      callback(event as CustomEvent);
    };

    window.addEventListener(eventName, handler);

    return () => {
      window.removeEventListener(eventName, handler);
    };
  }, [eventName, callback]);
};
