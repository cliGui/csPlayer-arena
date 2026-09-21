#!/usr/bin/env bash

npm cache clean --force
npm install
env $(cat .env.develop) npm run watch
