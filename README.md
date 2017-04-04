angular search [![Build Status](https://travis-ci.org/terranodo/angular-search.svg?branch=master)](https://travis-ci.org/terranodo/angular-search) [![Test Coverage](https://codeclimate.com/github/terranodo/angular-search/badges/coverage.svg)](https://codeclimate.com/github/terranodo/angular-search/coverage)
====

[AngularJS](https://angularjs.org/) + [OpenLayers 3](http://openlayers.org/) interface to query a [Apache Solr](http://lucene.apache.org/solr/) instance based on this [API](http://54.158.101.33:8080/bopws/swagger/#/default).
The Solr instance can be filtered by time, by a search term and by space.

[angular search](http://terranodo.io/angular-search)

Installation
---
Be sure to have at least node version 4 installed.

Install dependencies with

`npm install`

Local environment:
- `npm run server`
- http://localhost:3001/search
it uses the `404.html`

_Used libraries_:
* AngularJS 1.6.3
* OpenLayers 3 (v3.16.0)
* Bootstrap v3.3.4
