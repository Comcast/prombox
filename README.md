[![License](https://img.shields.io/github/license/Comcast/prombox)](/LICENSE)

# Prombox
Sandbox environment for editing and testing prometheus configuration on the fly.

## Build and Run Docker image

### Build Prombox

```
make build
```

### Build Docker Image
```
docker build -t prombox -f build/package/Dockerfile .
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
