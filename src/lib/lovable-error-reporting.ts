export function reportLovableError(error: Error, context?: Record<string, unknown>) {
  // Log error for debugging
  console.error("Error reported:", error, context);
  
  // In production, this would send to error tracking service
  if (typeof window !== "undefined" && (window as any).__LOVABLE_ERROR_TRACKING__) {
    (window as any).__LOVABLE_ERROR_TRACKING__(error, context);
  }
}