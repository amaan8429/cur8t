export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const handleCollectionClick = (collectionId: string) => {
  window.open(`/collection/${collectionId}`, "_blank", "noopener,noreferrer");
};

export const handleProfileClick = (
  e: React.MouseEvent,
  authorUsername: string | null
) => {
  e.stopPropagation();
  if (authorUsername) {
    window.open(`/profile/${authorUsername}`, "_blank", "noopener,noreferrer");
  }
};
