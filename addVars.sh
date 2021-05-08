#/bin/bash

while read v; do
    heroku config:set ${v}
done <.env