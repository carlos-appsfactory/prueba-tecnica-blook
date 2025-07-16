#!/bin/bash
set -e

ACTION=$1

CONF_DIR="./proxy/certbot/conf"
WWW_DIR="./proxy/certbot/www"
NGINX_CONTAINER="prueba-tecnica-blook-proxy"

DOMAINS=(
    "carlosmartinez.bloock.xyz"
    "web.carlosmartinez.bloock.xyz"
    "api.carlosmartinez.bloock.xyz"
)

if [[ "$ACTION" != "obtain" && "$ACTION" != "renew" ]]; then
    echo "Non valid action. Use 'obtain' or 'renew'."
    echo "    $0 obtain   # to obtain new certificate"
    echo "    $0 renew    # to renew existing certificate"
    exit 1
fi

RESTART_NGINX=false

if [ "$ACTION" == "obtain" ]; then
    for DOMAIN in "${DOMAINS[@]}"; do
    
        if [[ -d "$CONF_DIR/live/$DOMAIN" ]]; then
            echo "Removing existing certificate for $DOMAIN..."
            rm -rf "$CONF_DIR/live/$DOMAIN"
            rm -rf "$CONF_DIR/archive/$DOMAIN"
            rm -rf "$CONF_DIR/renewal/$DOMAIN.conf"
        fi

        docker run --rm \
            -v "$CONF_DIR:/etc/letsencrypt" \
            -v "$WWW_DIR:/var/www/certbot" \
            certbot/certbot certonly \
            --webroot -w /var/www/certbot \
            -d "$DOMAIN" \
            --email carlos@appsfactory.com \
            --non-interactive \
            --agree-tos
        
        RESTART_NGINX=true
    done
fi

if [ "$ACTION" == "renew" ]; then
    OUTPUT=$(docker run --rm \
        -v "$CONF_DIR:/etc/letsencrypt" \
        -v "$WWW_DIR:/var/www/certbot" \
        certbot/certbot renew)
        
    if echo "$OUTPUT" | grep -q "Congratulations"; then
        RESTART_NGINX=true
    fi
fi

if [ "$RESTART_NGINX" = true ]; then
    docker restart "$NGINX_CONTAINER"
fi
