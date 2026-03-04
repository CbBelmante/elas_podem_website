#!/bin/bash

if [ -z "$1" ]; then
  echo "Uso: bash scripts/killPort.sh <porta>"
  exit 1
fi

PIDS=$(lsof -ti:"$1" 2>/dev/null)

if [ -z "$PIDS" ]; then
  echo "Nenhum processo na porta $1"
else
  echo "$PIDS" | xargs kill -9
  echo "Porta $1 liberada"
fi
