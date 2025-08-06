export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (
  text: string | null | undefined,
  maxLength: number
): string => {
  // Handle null, undefined, or empty strings
  if (!text || typeof text !== 'string') return '';

  // Trim whitespace first
  const trimmedText = text.trim();
  if (!trimmedText) return '';

  // If text is already short enough, return as is
  if (trimmedText.length <= maxLength) return trimmedText;

  // Find the last space before the max length to avoid cutting words
  const lastSpaceIndex = trimmedText.lastIndexOf(' ', maxLength - 3);

  // If we can't find a space, or it's too close to the beginning, just cut at maxLength
  if (lastSpaceIndex < maxLength * 0.6) {
    return trimmedText.substring(0, maxLength - 3).trim() + '...';
  }

  // Cut at the last space to preserve word boundaries
  return trimmedText.substring(0, lastSpaceIndex).trim() + '...';
};

export const handleCollectionClick = (collectionId: string) => {
  window.open(`/collection/${collectionId}`, '_blank', 'noopener,noreferrer');
};

export const handleProfileClick = (
  e: React.MouseEvent,
  authorUsername: string | null
) => {
  e.stopPropagation();
  if (authorUsername) {
    window.open(`/profile/${authorUsername}`, '_blank', 'noopener,noreferrer');
  }
};

// Helper function to safely get author initial
export const getAuthorInitial = (author: string | null | undefined): string => {
  if (!author || typeof author !== 'string') return '?';
  const trimmed = author.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
};

// Helper function to format link count
export const formatLinkCount = (count: number): string => {
  if (count === 1) return '1 link';
  return `${count} links`;
};
