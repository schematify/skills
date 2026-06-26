# Node Types, Status Badges, and Render Styles

Use `.type("pack/id")` to choose node visuals. Prefer these real pack ids over generic `base/default`.

## Base node types

- `base/default` — generic fallback when no better type fits.
- `base/collection` — grouping/container node.
- `base/configuration` — config/settings/env/secrets-ish node.

## Actor node types

- `actors/user` — single end user/person.
- `actors/admin` — administrator/operator.
- `actors/actor` — generic external/internal actor.
- `actors/guest` — unauthenticated/guest user.
- `actors/external-user` — external user/customer/partner.
- `actors/users` — user group/audience.
- `actors/service-account` — bot, machine user, or service principal.

## Compute node types

- `compute/server` — physical/virtual server or host.
- `compute/cpu` — CPU/processor resource.
- `compute/memory` — RAM/memory resource.
- `compute/storage` — disk/block/object storage resource.
- `compute/container` — generic container.
- `compute/instance` — VM/cloud instance.
- `compute/cluster` — compute/Kubernetes/server cluster.
- `compute/function` — serverless function/job.
- `compute/docker` — Docker runtime/containerization.
- `compute/kubernetes` — Kubernetes cluster/workload.
- `compute/terraform` — Terraform/IaC configuration.
- `compute/nginx` — NGINX web server/proxy.

## Network node types

- `network/firewall` — firewall/security boundary.
- `network/router` — router/network route point.
- `network/dns` — DNS service/record set.
- `network/cdn` — CDN/edge cache.
- `network/vpn` — VPN tunnel/gateway.
- `network/internet` — public internet/external network.
- `network/nat-gateway` — NAT gateway/egress.
- `network/proxy` — proxy/reverse proxy.

## Filesystem node types

- `filesystem/directory` — folder/package/module container.
- `filesystem/file` — generic file.
- `filesystem/source-code` — source code file.
- `filesystem/document` — docs/markdown/text/spec files.
- `filesystem/archive` — zip/tar/package artifact.
- `filesystem/executable` — scripts/binaries/commands.
- `filesystem/image` — image asset.
- `filesystem/audio` — audio asset.
- `filesystem/video` — video asset.

## Microservices node types

- `microservices/service` — app, service, worker, backend, frontend app.
- `microservices/subsystem` — bounded context, package group, platform area.
- `microservices/endpoint` — API route, HTTP/RPC endpoint.
- `microservices/load-balancer` — gateway, ingress, load balancer.
- `microservices/message-queue` — generic queue/broker.
- `microservices/kafka` — Kafka cluster/broker.
- `microservices/topic` — Kafka/event topic.
- `microservices/cache` — cache layer/service.

## Database node types

- `databases/default` — generic database/storage.
- `databases/postgres` — PostgreSQL.
- `databases/mysql` — MySQL.
- `databases/mongodb` — MongoDB/document store.
- `databases/redis` — Redis/cache store.
- `databases/prometheus` — Prometheus/metrics store.
- `databases/table` — database table/collection when modeling schema internals.
- `databases/view` — database view.
- `databases/stored_procedure` — stored procedure/function.

## Country flag node types

Use `country-flags/<iso-code>` for flag icons. The pack contains two-letter country/territory codes from the current public pack, plus `country-flags/gb-sct` for Scotland. Examples:

- `country-flags/us` — United States.
- `country-flags/gb` — United Kingdom.
- `country-flags/gb-sct` — Scotland.
- `country-flags/de` — Germany.
- `country-flags/fr` — France.
- `country-flags/jp` — Japan.

## Empty packs

These packs currently exist but define no node types: `aws`, `schematify`.

## Status badges

Status badge ids are separate from node type ids. Use them in `.status({ type: ... })`, commonly via a channel value.

- `base/default` — default/unknown status badge.
- `base/critical` — critical, bubbles up, fixed, bouncing badge.
- `base/alert` — alert, bubbles up, fixed, bouncing badge.
- `base/warning` — warning, bubbles up, fixed badge.
- `base/info` — informational fixed badge.
- `base/maintenance` — maintenance fixed pulsing badge.
- `base/healthy` — healthy/OK badge.
- `base/unknown` — unknown badge.

## Render styles

Set with `.render({ style: "..." })` only when the node should render differently from the default icon node.

- `default` — normal graph node/icon; use for most nodes.
- `property` — property/detail node; good for scalar facts attached to a parent.
- `report` — report/card-style node for summarized attributes/status.
- `chart`, `pie-chart`, `line-chart`, `bar-chart` — chart-like nodes; provide needed values in `render.params`.

Valid styles come from `apps/shared/src/schema/node.ts`. Pack ids above come from `apps/client/public/packs/*/index.yaml`.
