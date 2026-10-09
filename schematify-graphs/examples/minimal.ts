// Minimal static graph script.
// Replace the UUID before creating a new graph.
// Validate with `schematify dry-run`; publish with `schematify run` only when intended.

async function main() {
  const doc = graph("a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
    .label("My platform")
    .description("An API that persists application data in a database.")
    .children([
      node("api")
        .label("API")
        .type("microservices/service")
        .attributes({
          description: "Handles requests and persists application data.",
        })
        .links([{ to: "data/db", label: "persists app data" }]),
      node("data")
        .label("Data")
        .type("base/collection")
        .children([
          node("db")
            .label("Database")
            .type("databases/default")
            .attributes({
              description: "Stores application data.",
            }),
        ]),
    ]);

  await doc.publish();
}

main();
