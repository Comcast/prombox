[![License](https://img.shields.io/github/license/Comcast/prombox)](/LICENSE) [![CI Pipeline Workflow](https://github.com/Comcast/prombox/workflows/CI%20Pipeline/badge.svg?branch=main)](https://github.com/Comcast/prombox/actions?query=workflow%3A%22CI+Pipeline%22+branch%3A%22main%22)

# Prombox
Sandbox environment for editing and testing prometheus configuration on the fly.

## Motivation

[Prometheus](https://prometheus.io) users often have trouble configuring new targets or creating alerts and recording rules because getting the YAML syntax exactly right can be a struggle. When running Prometheus locally this isn't as big of a challenge because you have direct access to the config file and can make changes quickly. Once Prometheus is deployed into a production environment, however, this becomes challenging because you don't have the ability to re-create the same combination of configuration and environment.

This is especially challenging when you're taking advantage of some service discovery methods provided by Prometheus, like AWS EC2 discovery. You may be able to discover your instance hosts via the AWS EC2 API, but accessing the endpoint your application exposes metrics on may not work due to firewall rules. Prometheus needs to live within your AWS VPC or private network in order for the metric scraping to occur successfully.

For these reasons, we built "Prombox", a lightweight UI that allows users to build the Prometheus config file and alerts/recording rules. This could be deployed within your environment (AWS VPC, etc) along with an instance of Prometheus that mimics your production instance. This would create a "sandbox" that allows you to "play" with new rules and configuration options to see how they would work.

![](docs/images/prombox.png)

## Build and Run Docker image

### Build Prombox

```
make build
```

### Build Docker Image
```
docker build -t prombox -f build/Dockerfile .
```

### Run docker-compose

```
docker-compose up
```

### Access UI

The Prombox UI is accessible at `http://localhost:3000`

The Prometheus UI is accessible at `https://localhost:9090`

## Run and Test Locally

### Set Environment Variables

#### Required
```bash
export PROMETHEUS_ADDRESS=http://localhost:9090
export PROMETHEUS_FRAME_ADDRESS=http://localhost:9090
export PROMETHEUS_CONFIG=$(pwd)/prometheus/prometheus.yml
```
#### Optional
```bash
export PORT=3000 (default: 3000)
export CORS_ALLOW_ORIGIN=http://localhost:8080 (default: empty)
```

### Run

1. Run Prometheus at :9090 (using configuration in `/prometheus/prometheus.yml`)
    ```
    docker run \
        -p 9090:9090 \
        --mount type=bind,source="$(pwd)"/prometheus/prometheus.yml,target=/etc/prometheus/prometheus.yml \
        prom/prometheus \
        --web.enable-lifecycle \
        --config.file=/etc/prometheus/prometheus.yml \
        --storage.tsdb.path=/prometheus \
        --web.console.libraries=/etc/prometheus/console_libraries \
        --web.console.templates=/etc/prometheus/consoles
    ```

2. Run API at :3000
    ```
    export PROMETHEUS_ADDRESS=http://localhost:9090
    export PROMETHEUS_FRAME_ADDRESS=http://localhost:9090
    export PROMETHEUS_CONFIG=$(pwd)/prometheus/prometheus.yml
    export CORS_ALLOW_ORIGIN=http://localhost:8080
    make run-api-dev
    ```

3. Run ui with hot-reloading at :8080
    ```
    make run-ui-dev
    ```

## Lint
Linting go (go fmt + go vet + golint) and vue (npm lint) source code
```
make lint
```

## Test

### Unit Tests
Run unit tests for ui
```
make test-ui
```

Run unit tests for go
```
make test-api
```

Run unit tests for both ui and go
```
make test
```
