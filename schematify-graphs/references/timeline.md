# Timeline recording

Use this reference when the user requests history, historical snapshots, or timeline
events/conditions. Recording is optional, including for live graphs.

Timeline is experimental. Viewers must enable **Enable experimental features** in
client **Settings** (off by default, saved per browser). The graph must also declare
timeline metadata. A hidden Timeline button with the setting off is expected, not a
recording failure. Disabling the setting exits any review and releases its hold, but
recording continues. Do not add a CLI experimental flag; `.enableTimeline(...)` is
already the script's explicit opt-in.

## Authoring order

1. Define the graph's channels and any timeline rules.
2. Create `channelPublisher(doc.id).enableTimeline({ retentionMs })`.
3. `await doc.publish()`.
4. Publish values with the usual `.set(path, values)` and awaited `.send()` calls.

The runner automatically includes `timeline: { retentionMs }` in the graph document.
The UI offers Timeline only on scriptable graphs with that metadata. No second author
flag is needed. Subscriptions start after publication succeeds. Enabling after publish
also works: the first nonempty send republishes the document with metadata before
recording values. Prefer enabling before publish to avoid that extra publication.

Older runners attempted subscription before a new graph existed and could return 403;
use the updated runner for the ordering above. Subsequent `doc.publish()` calls retain
the metadata. Removing the opt-in from the script clears it on the next run's publish.
Ordinary copies clear the capability too. Republish structure only when it changes.

```typescript
channel("cpu")
  .timelineEvent({ type: "ERROR", test: (v: number) => v > 90 })
  .timelineCondition({ type: "WARNING", test: (v: number) => v > 80 });

const pub = channelPublisher(doc.id).enableTimeline({ retentionMs: 60 * 60 * 1000 });
await doc.publish();
pub.set("api", { cpu: 95 });
await pub.send();
```

Rules belong to the channel builder attached to a node, not the publisher. The runner
automatically associates observations with that node path and channel. `test` is the
function field; do not use `trigger`. `enableTimeline` belongs to the publisher, not
the graph, and takes an options object, not a bare duration.

## Semantics

| API | Behaviour |
| --- | --- |
| `.enableTimeline({ retentionMs })` | Record this publisher's sent values locally. Retention must be positive, at most one day (86,400,000 ms). Retention cannot change on the same active publisher. |
| `.timelineEvent({ type, test })` | One point on the first true observation. Repeated true values do not create repeated events; a false observation rearms it. |
| `.timelineCondition({ type, test })` | Open on true, stay open on repeated true, resolve on false. Missing observations do not mean false. |

- `type` is a string; `INFO`, `WARNING`, and `ERROR` are useful conventional values,
  not a fixed enum. No caller-supplied rule IDs or resolution callback are needed.
- `test(value)` must return a boolean synchronously. Use small, pure predicates;
  do not fetch, publish, or return a Promise inside a test.
- Tests run on the values included in `.send()`. Defaults, `.set()` alone, and
  unrelated channel updates do not evaluate the rule. Multiple buffered updates to
  one channel collapse to its final sent value.
- Events are observations, not timers. To mark distinct occurrences with the same
  predicate, send a false observation between them; do not assume repeated true
  values produce one event each.
- Failed tests are reported and leave the observation unknown. They do not prevent
  recording the value. Runner downtime does not count as a resolved condition.
- `.staleAfter(...)` is a display hint; it does not resolve conditions or erase values.
- Graph republishing and runner restarts interrupt condition continuity. Preserve
  stable graph/node/channel IDs, and avoid unnecessary graph republishes.
- Rule functions remain in the script; pulling the published JSON cannot recover them.

## Running and reviewing

See [../examples/timeline.ts](../examples/timeline.ts) for a runnable synthetic demo.
Use a new UUID for a new user graph; keep it stable for later runs.

```bash
schematify dry-run timeline.ts --max-duration 10s
schematify run timeline.ts --max-duration 30m
```

Dry-run checks the script without server writes or timeline storage. It does not
validate recorded history, rule transitions, or the browser round trip.

The CLI creates SQLite storage at runtime under `~/.schematify/history`, separated
by server and organization. Keep one runner per graph and keep it running during
review. The runner handles action subscriptions and replies using normal graph write
permission; the script does not implement those protocols or require admin credentials.

Entering Timeline captures a fixed range and event/condition overview. Selecting a
time recalls both graph structure and channel values. Active reviews hold that graph's
history against deletion; recording and other viewers' live updates continue. Renewals
keep the hold alive; exit or expiry releases it. A hold can temporarily retain more
than the configured duration. Return to Live restores current data.

History bookmarks are not supported. Data published outside this recording publisher
is not automatically added to its local history. This is runner-local observation
history, not server archival storage or a cross-machine runner coordination service.
