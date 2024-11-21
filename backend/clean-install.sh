#!/bin/bash
rm -rf node_modules && \
rm -rf dist && \
rm -rf package-lock.json && \
rm -rf yarn.lock && \
yarn install && yarn run build && yarn run gen:prisma