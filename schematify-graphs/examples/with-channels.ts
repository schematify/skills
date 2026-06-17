// Graph with channel definitions and a single set of live values.
// Channels are the slots; the publisher fills them.
// Run safely with:  schematify run with-channels.ts

async function main() {
  const doc = graph("d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a")
    .label("Dashboard")
    .staleAfter(30000)
    .children([
      node("server")
        .label("Server")
        .type("microservices/service")
        .channels([
          channel("status").label("Status").default("base/healthy"),
          channel("cpu").label("CPU").default("—"),
          channel("mem").label("Memory").default("—").staleAfter(5000),
        ])
        .status({ type: from.channel("status") })
        .render({
          style: "property",
          params: { header: from.channel("cpu"), "display-value": from.channel("mem") },
        }),
    ]);

  await doc.publish();

  const pub = channelPublisher(doc.id);
  pub.set("server", { status: "base/healthy", cpu: "45%", mem: "60%" });
  await pub.send();
}

main();
