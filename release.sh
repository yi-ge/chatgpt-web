#!/usr/bin/env bash

if [ 0"$REACT_APP_API_DOMAIN" = "0" ]; then
  read -p "Enter your Domain:" domain
else
  domain=$REACT_APP_API_DOMAIN
fi

yarn build

rsync -avr build/* root@$domain:/home/ubuntu/site/ai
