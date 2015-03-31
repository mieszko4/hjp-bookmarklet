#!/bin/sh
if ps -ef | grep -v grep | grep hjp-bookmarklet.server.js ; then
	exit 0
else
	/usr/local/bin/node /var/www/hjp-bookmarklet/hjp-bookmarklet.server.js >> /var/www/hjp-bookmarklet/output.log &
	exit 0
fi
