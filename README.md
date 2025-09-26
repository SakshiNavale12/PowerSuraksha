# IoT Motor Data Simulator

This project simulates IoT data from 100 motors and processes it using a Kafka pipeline.

## Prerequisites

- Docker
- Docker Compose
- Node.js
- npm

## Setup and Running

1.  **Start Kafka and Zookeeper:**
    ```bash
    docker compose down
    docker compose pull
    docker compose up -d
    ```

2.  **Verify containers are running:**
    ```bash
    docker ps
    ```

3.  **Create the Kafka topic:**
    ```bash
    docker exec -it kafka bash
    kafka-topics --create --topic iot-data --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
    kafka-topics --list --bootstrap-server localhost:9092
    exit
    ```

4.  **Install dependencies:**
    ```bash
    npm install kafkajs
    ```

5.  **Run the producer and consumer:**
    In one terminal, run the producer:
    ```bash
    node producer.js
    ```
    In another terminal, run the consumer:
    ```bash
    node consumer.js
    ```
