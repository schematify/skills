// Synthetic timeline example. Replace the UUID when creating a new graph.
async function main() {
  const doc = graph("f6c967d1-5240-4bdc-a6af-d28b2f3b3cae")
    .label("CPU timeline example")
    .children([
      node("api")
        .label("API")
        .channels([
          channel("cpu").default(40)
            .timelineEvent({ type: "ERROR", test: (v: number) => v > 90 })
            .timelineCondition({ type: "WARNING", test: (v: number) => v > 80 }),
        ]),
    ]);

  const pub = channelPublisher(doc.id).enableTimeline({ retentionMs: 60 * 60 * 1000 });
  await doc.publish();
  const samples = [40, 95, 96, 60];
  let index = 0;

  async function tick() {
    pub.set("api", { cpu: samples[index % samples.length] });
    await pub.send();
    index += 1;
    setTimeout(() => { void tick().catch(error => console.error(error)); }, 2000);
  }

  await tick();
}

void main();
