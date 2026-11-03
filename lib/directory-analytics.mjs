// Record bounded selection metadata, never the user's search text or inputs.
export function trackDirectoryAction(
  name,
  properties,
  target = globalThis.window,
) {
  if (!target?.gtag) return;
  const allowedEvents = new Set([
    'video_api_search',
    'video_api_filter',
    'video_example_workflow_filter',
  ]);
  if (!allowedEvents.has(name)) return;
  const allowed = ['data_category', 'workflow', 'result_count', 'query_length'];
  const selected = Object.fromEntries(
    Object.entries(properties).filter(([key]) => allowed.includes(key)),
  );
  target.gtag('event', name, {
    ...selected,
    source_page: target.location.pathname,
    transport_type: 'beacon',
  });
}
