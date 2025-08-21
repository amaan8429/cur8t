// Feature flags for controlling subscription limit bypasses
export const FEATURE_FLAGS = {
  // Bypass subscription limits for tools and agents
  BYPASS_SUBSCRIPTION_LIMITS_FOR_TOOLS: true,

  // Specific tool bypasses
  BYPASS_COLLECTION_LIMITS_FOR_BOOKMARK_IMPORTER: true,
  BYPASS_COLLECTION_LIMITS_FOR_ARTICLE_EXTRACTOR: true,
  BYPASS_LINK_LIMITS_FOR_TOOLS: true,
} as const;

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}

// Helper function to check if subscription limits should be bypassed for tools
export function shouldBypassSubscriptionLimitsForTools(): boolean {
  return isFeatureEnabled('BYPASS_SUBSCRIPTION_LIMITS_FOR_TOOLS');
}
