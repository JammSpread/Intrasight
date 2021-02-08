#!/bin/bash
extensions=(
    "*.ts"
    "*.json"
    "*.md"
    "*.yaml"
    "*.yml"
)
$(node_modules/.bin/prettier --write --loglevel=warn $(
  git ls-files "${extensions[@]}" | grep -v 'helm-chart'
))
