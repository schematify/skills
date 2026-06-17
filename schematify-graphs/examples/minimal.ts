// Minimal static graph: nodes + links, published once.
// Run safely with:  schematify run minimal.ts
// Publish for real:  schematify run minimal.ts --live

async function main() {
  const doc = graph("a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
    .label("My Platform")
    .description("A small service graph")
    .children([
      node("web").label("Web App").type("microservices/service").links(["api"]),
      node("api").label("API Gateway").type("microservices/load-balancer").links(["db"]),
      node("db").label("Database").type("microservices/database"),
    ]);

  await doc.publish();
}

main();
