// Minimal graph script: structure, one channel, one live-value send.
// Run in default/capture mode first. Use --live only when you intend to publish.

async function main() {
  const doc = graph("a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
    .label("My Platform")
    .children([
      node("api")
        .label("API")
        .type("microservices/service")
        .channels([channel("status").label("Status").default("base/healthy")])
        .status({ type: from.channel("status") })
        .links(["db"]),
      node("db").label("Database").type("microservices/database"),
    ]);

  await doc.publish();

  const pub = channelPublisher(doc.id);
  pub.set("api", { status: "base/healthy" });
  await pub.send();
}

main();
