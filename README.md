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

StockAnalyzer is an application which focuses on performing calculations and statics on historic stock market prices.

## Key concepts
StockAnalyzer enables users to leverage pre-defined algorithms to calculate useful stock market calculations, such as yearly winners or loosers, or to simplify pattern detection or trends.

### Architecture
StockAnalyzer is built on Quandl, a finicial data service provider, using the [Wiki Prices API (WIKIP)](https://www.quandl.com/databases/WIKIP/documentation/about) and uses a stardard datatable structures for [DataTables](https://docs.quandl.com/docs/tables-1) & [TimeSeries](https://docs.quandl.com/docs/time-series) data.

Most requests serve as proxies to Quandl at request time followed by a statistic calculation. I am not aware of any api limits or request restrictions. Should this change, or for enhanced performance, it will may be nessessary to implement a caching layer or similar for external Quandl requests.

Currently this API uses the WIKIP price API, which offers stock prices, dividends and splits for 3000 US publicly-traded companies.

### logging
All logging is through [Winston](https://github.com/winstonjs/winston) which easily extentable to log to multiple outlets such as Elastic Search or Stack Driver, etc.


## Getting started


#### [Sign up for Quandl to get an API key.](https://docs.quandl.com/docs/getting-started#section-getting-an-api-key)

#### Clone StockAnalyzer
```
git clone git@github.com:minks/stockanalyzer.git
cd source_dir_to_stock_analizer
```

#### Install dependencies
```
npm install
```

#### Run Tests

##### Unit Tests
```
npm run unit-tests
```

##### Integration Tests
```
QUANDL_AUTH_TOKEN=<api-key> \
npm run integration-tests
```

#### Code Coverage
##### Unit Coverage
```
npm run unit-coverage
```

##### Total Coverage
```
QUANDL_AUTH_TOKEN=<api-key> \
npm run coverage
```

#### Starts node server interactively (without docker)
```
PORT=3600 \
QUANDL_API_ENDPOINT=https://www.quandl.com/api \
QUANDL_AUTH_TOKEN=<api-key> \
QUANDL_API_VERSION=v3 \
npm start
```

#### Verify the service works as expected
```
curl http://localhost:3600
curl http://localhost:3600/health
```

## Docker

### Build
```
 cd /path/to/project/root
 docker build . -t stock_analyzer
```
### Run
```
 docker run -p 3600:3600 stock_analyzer
```


## Production
StockAnalyzer is a Docker image that runs a node.js web service. The service connects to the Quandl this should have approprite external network access.


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

**DataTable**: A generic datatable provided by Quandl

**DataSet**: A generic time series dataset provided by Quandl

### Operation

StockAnalyzer is an always-on web service.