#!/bin/sh
if ps -ef | grep -v grep | grep hjp-bookmarklet.server.js ; then
	exit 0
else
	/usr/local/bin/node /home/milosz/projects/hjp-bookmarklet/hjp-bookmarklet.server.js >> /home/milosz/projects/hjp-bookmarklet/output.log &
	exit 0
fi
