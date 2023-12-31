# UI Banking
[![build](https://github.com/schambeck/vue-banking/actions/workflows/node.js.yml/badge.svg)](https://github.com/schambeck/vue-banking/actions/workflows/node.js.yml)

## Description

Banking User Interface.

<img src="app.png" alt="UI Banking">

## Tech Stack

- VueJS, Composition API
- PrimeVue, PrimeFlex
- Keycloak: OAuth2, SSO

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

Open UI - http://localhost:5173

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Serve application

```sh
npm install -g serve
npm run start
```

Frontend: http://localhost:5173

### Build docker image

```sh
npm run docker-build
```

### Run docker container

```sh
npm run docker-run
```

Frontend: http://localhost:5173
