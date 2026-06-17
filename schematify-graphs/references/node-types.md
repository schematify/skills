# Node Types and Render Styles

Use `.type("pack/id")` to choose node visuals. Prefer these real pack ids over generic `base/default`.

## Base

- `base/default` — generic fallback when no better type fits.
- `base/collection` — grouping/container node.
- `base/configuration` — config/settings/env/secrets-ish node.

## Filesystem

- `filesystem/directory` — folder/package/module container.
- `filesystem/file` — generic file.
- `filesystem/source-code` — source code file.
- `filesystem/document` — docs/markdown/text/spec files.
- `filesystem/archive` — zip/tar/package artifact.
- `filesystem/executable` — scripts/binaries/commands.
- `filesystem/image` — image asset.
- `filesystem/audio` — audio asset.
- `filesystem/video` — video asset.

## Microservices

- `microservices/service` — app, service, worker, backend, frontend app.
- `microservices/subsystem` — bounded context, package group, platform area.
- `microservices/endpoint` — API route, HTTP/RPC endpoint.
- `microservices/load-balancer` — gateway, proxy, ingress, load balancer.
- `microservices/message-queue` — queue/broker.
- `microservices/kafka` — Kafka cluster/broker.
- `microservices/topic` — Kafka/event topic.
- `microservices/cache` — cache layer/service.

## Databases

- `databases/default` — generic database/storage.
- `databases/postgres` — PostgreSQL.
- `databases/mysql` — MySQL.
- `databases/mongodb` — MongoDB/document store.
- `databases/redis` — Redis/cache store.
- `databases/prometheus` — Prometheus/metrics store.
- `databases/table` — database table/collection when modeling schema internals.
- `databases/view` — database view.
- `databases/stored_procedure` — stored procedure/function.

## Empty packs

These packs currently exist but define no nodes: `aws`, `schematify`.

## Render styles

Set with `.render({ style: "..." })` only when the node should render differently from the default icon node.

- `default` — normal graph node/icon; use for most nodes.
- `property` — property/detail node; good for scalar facts attached to a parent.
- `report` — report/card-style node for summarized attributes/status.
- `chart`, `pie-chart`, `line-chart`, `bar-chart` — chart-like nodes; provide needed values in `render.params`.

Valid styles come from `apps/shared/src/schema/node.ts`. Pack ids above come from `apps/client/public/packs/*/index.yaml`.
