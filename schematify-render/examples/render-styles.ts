async function main() {
  const doc = graph("8e6f17dc-8b95-4ef6-9b02-61c08e8e40d0")
    .label("Render styles")
    .children([
      node("default")
        .label("Default service")
        .type("microservices/service"),

      node("property")
        .label("Current latency")
        .type("microservices/service")
        .attributes({ latency_p99: "42 ms" })
        .render({
          style: "property",
          params: {
            header: from.value("P99 latency"),
            "display-value": from.attribute("latency_p99"),
          },
          scale: { x: 1.5, y: 1.2 },
        }),

      node("report")
        .label("Database definition")
        .type("databases/table")
        .attributes({
          account_key: "TEXT PRIMARY KEY",
          user_id: "TEXT NOT NULL",
          created_at: "TIMESTAMPTZ NOT NULL",
        })
        .render({
          style: "report",
          params: {
            attributeIds: ["account_key", "user_id", "created_at"],
          },
        }),

      node("pie")
        .label("Request methods")
        .attributes({
          methods: { GET: 450, POST: 230, PUT: 85, DELETE: 35 },
        })
        .render({
          style: "pie-chart",
          params: {
            header: "HTTP methods",
            data: from.attribute("methods"),
            legend: "right",
            padding: 0.1,
          },
          scale: { x: 2.5, y: 2 },
        }),

      node("bar")
        .label("Response codes")
        .attributes({
          responses: { "200": 1250, "301": 180, "400": 95, "404": 62, "500": 28 },
        })
        .render({
          style: "bar-chart",
          params: {
            header: "Response codes",
            data: from.attribute("responses"),
            yLabel: "Requests",
            barLabels: "value",
            sort: "desc",
            domainMin: 0,
          },
          scale: { x: 3.5, y: 2.5 },
        }),

      node("line")
        .label("Latency percentiles")
        .attributes({
          percentiles: [
            { label: "p50", data: { Mon: 18, Tue: 21, Wed: 19 } },
            { label: "p99", data: { Mon: 92, Tue: 118, Wed: 105 } },
          ],
        })
        .render({
          style: "line-chart",
          params: {
            header: "API latency",
            datasets: from.attribute("percentiles"),
            yLabel: "ms",
            domainMin: 0,
            showDots: true,
            lineWidth: 2,
            fill: false,
          },
          scale: { x: 3.5, y: 2.5 },
        }),
    ]);

  await doc.publish();
}

main();
