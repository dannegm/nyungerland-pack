#!/usr/bin/env bash

DEFAULT_DOTENV_PATH=./.env
GET_DEFAULT_DOTENV_PATH=${DOTENV_PATH:-$DEFAULT_DOTENV_PATH}

DOT_ENV_DEFAULTS_CONTENT=$(cat "${GET_DEFAULT_DOTENV_PATH}.defaults")
DOT_ENV_CONTENT=$(cat $GET_DEFAULT_DOTENV_PATH)

PARSED_ENV_DEFAULTS=$(sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g" <<< "$DOT_ENV_DEFAULTS_CONTENT")
PARSED_ENV=$(sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/=\1/g" <<< "$DOT_ENV_CONTENT")

DOT_ENV_COMPOSED_VARS="${PARSED_ENV_DEFAULTS}
${PARSED_ENV}"

export $DOT_ENV_COMPOSED_VARS
