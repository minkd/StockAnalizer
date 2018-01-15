[![Coverage Status](https://coveralls.io/repos/github/minkd/StockAnalizer/badge.svg?branch=master)](https://coveralls.io/github/minkd/StockAnalizer?branch=master)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [StockAnalyzer - Calculate Stock Trading Statistics](#stockanalyzer---calculate-stock-trading-statistics)
  - [Key concepts](#key-concepts)
    - [Architecture](#architecture)
    - [logging](#logging)
  - [Getting started](#getting-started)
    - [Sign up for Quandl to get an API key.](#sign-up-for-quandl-to-get-an-api-key)
      - [Clone StockAnalyzer](#clone-stockanalyzer)
      - [Install dependencies](#install-dependencies)
      - [Run Tests](#run-tests)
        - [Unit Tests](#unit-tests)
        - [Integration Tests](#integration-tests)
        - [Code Coverage](#code-coverage)
      - [Starts node server interactively (without docker)](#starts-node-server-interactively-without-docker)
      - [Verify the service works as expected](#verify-the-service-works-as-expected)
  - [Production](#production)
    - [Configuration](#configuration)
    - [External dependencies](#external-dependencies)
    - [Operation](#operation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# StockAnalyzer - Calculate Stock Trading Statistics

StockAnalyzer is an application that focuses on performing calculations and statistics on historic stock market prices. In many ways this app acts as a pass through from the Quandl API, as such, the Quandle API is in the critical path, and must be up and operational for this app to operate correctly.

## Key concepts
StockAnalyzer enables users to leverage pre-defined algorithms to calculate useful stock market calculations, to simplify pattern detection or trends. The datasets are transformed into a consistent JSON pattern which is optimized for clients like Tableau or data dashboard consumption.

### Architecture
StockAnalyzer is built on Quandl, a financial data service provider, using the [Wiki Prices API (WIKIP)](https://www.quandl.com/databases/WIKIP/documentation/about) and uses a standard `data-tables` for [DataTables](https://docs.quandl.com/docs/tables-1) & [TimeSeries](https://docs.quandl.com/docs/time-series) data. This app can be easily extended to support any Quandl APIs which follow this same pattern.

Most requests in this API serve as proxies to Quandl at request time followed by a statistic calculation. I am not aware of any api limits or request restrictions. Should this change, or for enhanced performance, it may be necessary to implement a caching layer or similar catching to storing external Quandl requests.

### logging
All logging is via [Winston](https://github.com/winstonjs/winston) which easily extendable to log to multiple outlets such as Elastic Search or Stack Driver, etc.

## Getting started

The first thing we will need is access to the Quandl API. To get access you can [sign up](https://docs.quandl.com/docs/getting-started#section-getting-an-api-key). Once you have your API key, you can start using this app.

##### Clone StockAnalyzer
```
git clone git@github.com:minks/stockanalyzer.git
cd source_dir_to_stock_analizer
```

##### Install dependencies
```
npm install
```

### Run Tests

##### Unit Tests
```
npm run unit-tests
```

##### Integration Tests
```
QUANDL_AUTH_TOKEN=<api-key> \
npm run integration-tests
```

### Code Coverage
##### Unit Coverage
```
npm run unit-coverage
```

##### Total Coverage
```
QUANDL_AUTH_TOKEN=<api-key> \
npm run coverage
```



#### Start Server
##### With Node:
```
PORT=3600 \
QUANDL_API_ENDPOINT=https://www.quandl.com/api \
QUANDL_AUTH_TOKEN=<api-key> \
QUANDL_API_VERSION=v3 \
npm start
```
##### With Docker:
```
cd /path/to/project/root
docker build . -t stock_analyzer
docker run -e QUANDL_AUTH_TOKEN=<api-key> -p 3600:3600 stock_analyzer
```

#### Verify the service works as expected
```
curl http://localhost:3600
curl http://localhost:3600/health
```

## API Documentation
The API documentation is built as part of the docker image and can be accessed via `/docs` route. Alternatively docs can be generated via `npm gen-docs`

## Production
StockAnalyzer is a always on Docker image that runs as node.js web service. The service connects to the Quandl and should have appropriate external network access.


### Configuration
StockAnalyzer has the follow variables:

| Variable | Description | Required? | Default Value | Comments |
| --- | --- | :---: | --- | --- |
| PORT | Service Port |  | 3600 | The port to expose for this API. |
| QUANDL_API_ENDPOINT | Quandl Endpoint | | https://www.quandl.com/api | The Quandl API endpoint. |
| QUANDL_AUTH_TOKEN | Api Key | X | | Should be based on environment |
| QUANDL_API_VERSION | Quandl API version |  | v3 | The version of the Quandl API we will be using |



### External dependencies

**Quandl**: The external data provider.

**DataTable**: A generic dataTable provided by Quandl

**DataSet**: A generic time series dataset provided by Quandl

### Operation

StockAnalyzer is an always-on web service. This application can be monitored via `/health` route. For logging, winston has be instrumented for convenience. As such, transports can be added for logging to Kabana, Stack Driver, Elastic Search, etc.