# Node types and status badges

`.type("pack/id")` selects a node's visual texture. It does not add behavior or validate the node's meaning. Prefer a documented type that matches the concept, then use `base/default` as the fallback.

## Base

- `base/default`: Generic fallback.
- `base/collection`: Group or container.
- `base/configuration`: Configuration, settings, environment, or secrets.

## Actors

- `actors/user`: One end user.
- `actors/admin`: Administrator or operator.
- `actors/actor`: Generic actor.
- `actors/guest`: Unauthenticated user.
- `actors/external-user`: Customer, partner, or other external user.
- `actors/users`: User group or audience.
- `actors/service-account`: Bot, machine user, or service principal.

## Compute

- `compute/server`: Physical or virtual host.
- `compute/cpu`: Processor resource.
- `compute/memory`: Memory resource.
- `compute/storage`: Disk, block, or object storage.
- `compute/container`: Generic container.
- `compute/instance`: Virtual machine or cloud instance.
- `compute/cluster`: Compute, Kubernetes, or server cluster.
- `compute/function`: Serverless function or job.
- `compute/docker`: Docker runtime or containerization.
- `compute/kubernetes`: Kubernetes cluster or workload.
- `compute/terraform`: Terraform configuration.
- `compute/nginx`: NGINX server or proxy.

## Network

- `network/firewall`: Firewall or security control.
- `network/router`: Router or route point.
- `network/dns`: DNS service or record set.
- `network/cdn`: CDN or edge cache.
- `network/vpn`: VPN tunnel or gateway.
- `network/internet`: Public internet.
- `network/nat-gateway`: NAT gateway or egress.
- `network/proxy`: Forward or reverse proxy.

## Filesystem

- `filesystem/directory`: Directory, package, or module container.
- `filesystem/file`: Generic file.
- `filesystem/source-code`: Source code file.
- `filesystem/document`: Documentation, text, or specification file.
- `filesystem/archive`: Package or archive file.
- `filesystem/executable`: Script, binary, or command.
- `filesystem/image`: Image asset.
- `filesystem/audio`: Audio asset.
- `filesystem/video`: Video asset.

## Microservices

- `microservices/service`: Application, service, worker, backend, or frontend.
- `microservices/subsystem`: Bounded context, package group, or platform area.
- `microservices/endpoint`: HTTP, RPC, or another API endpoint.
- `microservices/load-balancer`: Gateway, ingress, or load balancer.
- `microservices/message-queue`: Queue or message broker.
- `microservices/kafka`: Kafka cluster or broker.
- `microservices/topic`: Event or Kafka topic.
- `microservices/cache`: Cache service.

## Databases

- `databases/default`: Generic database or data store.
- `databases/postgres`: PostgreSQL.
- `databases/mysql`: MySQL.
- `databases/mongodb`: MongoDB or another document store.
- `databases/redis`: Redis.
- `databases/prometheus`: Prometheus.
- `databases/table`: Database table or collection.
- `databases/view`: Database view.
- `databases/stored_procedure`: Stored procedure or function.

## Country flags

Use `country-flags/<iso-code>` when geography is part of the graph. For example, `country-flags/us` represents the United States.

## Status badges

Status badge ids are separate from node type ids. Use them in `.status({ type: ... })`, often through `from.channel("status")`.

- `base/default`: Default status.
- `base/critical`: Critical failure.
- `base/alert`: Active alert.
- `base/warning`: Warning.
- `base/info`: Informational state.
- `base/maintenance`: Maintenance state.
- `base/healthy`: Healthy state.
- `base/unknown`: Unknown state.

Use **schematify-render** for property, report, and chart presentation.
