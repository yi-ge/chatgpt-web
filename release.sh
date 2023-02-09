#!/usr/bin/env bash

if [ 0"$FRONT_END_SERVER_IP" = "0" ]; then
  read -p "Enter your Domain:" domain
else
  domain=$FRONT_END_SERVER_IP
fi

if [ 0"$FRONT_END_SERVER_PATH" = "0" ]; then
  read -p "Enter your Front-end path:" domain
else
  frontEndPath=$FRONT_END_SERVER_PATH
fi

# yarn build

rsync -avr build/* root@$domain:$frontEndPath
