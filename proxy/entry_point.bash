#!/bin/bash
set -e

DOMAINS=(
  "carlosmartinez.bloock.xyz"
  "web.carlosmartinez.bloock.xyz"
  "api.carlosmartinez.bloock.xyz"
)

LIVE_DIR="/etc/letsencrypt/live/"
ACME_DIR="/var/www/certbot/.well-known/acme-challenge/"

mkdir -p "$LIVE_DIR"
mkdir -p "$ACME_DIR"

for DOMAIN in "${DOMAINS[@]}"; do
  DOMAIN_LIVE_DIR="$LIVE_DIR$DOMAIN"
  if [ ! -f "$DOMAIN_LIVE_DIR/fullchain.pem" ] || [ ! -f "$DOMAIN_LIVE_DIR/privkey.pem" ]; then
    mkdir -p "$DOMAIN_LIVE_DIR"
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
      -keyout "$DOMAIN_LIVE_DIR/privkey.pem" \
      -out "$DOMAIN_LIVE_DIR/fullchain.pem" \
      -subj "/CN=$DOMAIN"
    echo "Dummy cert created for $DOMAIN"
  fi
done

nginx -g "daemon off;"
