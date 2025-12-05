#!/bin/bash
rm -rf node_modules && \
rm -rf dist && \
rm -rf package-lock.json && \
rm -rf yarn.lock && \
rm -rf bun.lock && \
bun install && bun run build && bun run gen:prisma