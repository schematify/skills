// Live graph: publishes channel updates on an interval.
// This script LOOPS and will not exit on its own — bound it when validating:
//   schematify run publish-loop.ts --max-publishes 3      (stop after 3 channel updates)
//   schematify run publish-loop.ts --max-duration 5s      (stop after 5s)
// The document is written to <out>.json; channel values stream to the adjacent
// <out>.channels.ndjson sidecar (and stdout). --max-publishes counts channel updates.
// Publish for real (runs until stopped):
//   schematify run publish-loop.ts --live --max-duration 1m
//
// This example generates values locally so it runs offline. In a real graph,
// replace the body of tick() with a `fetch(...)` to your metrics source — see
// the channels-publishing reference for the fetch pattern.

async function main() {
  const doc = graph("b3f1a2c4-d5e6-4f78-9a0b-1c2d3e4f5a6b")
    .label("Live Metrics")
    .children([
      node("server")
        .label("Server")
        .type("microservices/service")
        .channels([
          channel("cpu").label("CPU").default("—"),
          channel("mem").label("Memory").default("—"),
        ]),
    ]);

  await doc.publish();

  const pub = channelPublisher(doc.id);

  async function tick() {
    const cpu = Math.floor(Math.random() * 100);
    const mem = Math.floor(Math.random() * 100);
    pub.set("server", { cpu: `${cpu}%`, mem: `${mem}%` });
    await pub.send();
  }

  setInterval(tick, 5000);
  await tick();
}

main();
