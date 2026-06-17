# Custom / Arbitrary Data — Reconnaissance and Identification

For graphs built from data that isn't a codebase — a CSV, a JSON export, an API response, an org chart, a process flow, a domain model the user describes in words. The output is a **plan** (nodes + links) you author with the schematify-graphs builder.

There is no fixed scan procedure here; the user's description defines the entities and relationships. Your job is to map their world onto nodes, hierarchy, and links.

## Step 1: Pin down the model

Before building anything, make sure you can answer:

- **What is a node?** The repeating "thing" — a person, service, table, step, account, region. One node per instance.
- **What is the hierarchy?** What contains what? (team → person, region → datacenter → host). Containment becomes nesting via `.children([...])`.
- **What is a link?** The relationship between nodes — reports-to, depends-on, flows-to, calls. Each becomes a link from the source node to the target's path.
- **Is there live data?** Any value that changes over time (status, count, load) is a **channel**, not a static attribute — see the schematify-graphs channels reference.

If the description is too vague to answer these, ask the user before proceeding.

## Step 2: Source the data

- **Structured file/API** (CSV, JSON, response): read or fetch it, then map records to nodes. Note the field that gives each node its **id** (must be unique among siblings) and the fields that become **label**, **type**, **attributes**, and **links**.
- **Described verbally:** capture the user's entities and relationships directly; ask for the list if they haven't given it.

Delegate bulk reading to a subagent where possible, and summarise rather than pasting raw data into working memory.

## Step 3: Build the plan

- **ID:** stable, unique among siblings (use a natural key from the data).
- **Label:** human-readable display name.
- **Type:** choose a texture-pack id that fits the domain; fall back to a generic type when unsure.
- **Attributes:** static metadata to display on the node.
- **Links:** source → target paths.
- **Channels:** for any value meant to update live.

### Example plan (team org chart)

```
- eng (group)          label "Engineering"
  - alice (person)     attributes { role: "Lead" }
  - bob (person)
- design (group)       label "Design"
  - carol (person)
links:
  bob → eng/alice      (reports-to)
  carol → eng/alice    (reports-to)
```

**Return to the schematify-generate skill (Step 3) to author the plan with schematify-graphs.** If any values are live, wire them as channels per the schematify-graphs channels reference.
