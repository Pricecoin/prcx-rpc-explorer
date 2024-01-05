"use strict";

const os = require('os');
const path = require('path');
const url = require('url');
const fs = require("fs");

const debug = require("debug");
const debugLog = debug("prcxexp:config");

const prcxUri = process.env.PRCXEXP_PRICECOINXD_URI ? url.parse(process.env.PRCXEXP_PRICECOINXD_URI, true) : { query: { } };
const prcxAuth = prcxUri.auth ? prcxUri.auth.split(':') : [];




function loadFreshRpcCredentials() {
	let username = prcxAuth[0] || process.env.PRCXEXP_PRICECOINXD_USER;
	let password = prcxAuth[1] || process.env.PRCXEXP_PRICECOINXD_PASS;

	let authCookieFilepath = prcxUri.query.cookie || process.env.PRCXEXP_PRICECOINXD_COOKIE || path.join(os.homedir(), '.pricecoinx', '.cookie');

	let authType = "usernamePassword";

	if (!username && !password && fs.existsSync(authCookieFilepath)) {
		authType = "cookie";
	}

	if (authType == "cookie") {
		debugLog(`Loading RPC cookie file: ${authCookieFilepath}`);
		
		[ username, password ] = fs.readFileSync(authCookieFilepath).toString().trim().split(':', 2);
		
		if (!password) {
			throw new Error(`Cookie file ${authCookieFilepath} in unexpected format`);
		}
	}

	return {
		host: prcxUri.hostname || process.env.PRCXEXP_PRICECOINXD_HOST || "127.0.0.1",
		port: prcxUri.port || process.env.PRCXEXP_PRICECOINXD_PORT || 8332,

		authType: authType,

		username: username,
		password: password,
		
		authCookieFilepath: authCookieFilepath,
		
		timeout: parseInt(prcxUri.query.timeout || process.env.PRCXEXP_PRICECOINXD_RPC_TIMEOUT || 5000),
	};
}

module.exports = {
	loadFreshRpcCredentials: loadFreshRpcCredentials,

	rpc: loadFreshRpcCredentials(),

	// optional: enter your api access key from ipstack.com below
	// to include a map of the estimated locations of your node's
	// peers
	// format: "ID_FROM_IPSTACK"
	ipStackComApiAccessKey: process.env.PRCXEXP_IPSTACK_APIKEY,

	// optional: enter your api access key from mapbox.com below
	// to enable the tiles for map of the estimated locations of
	// your node's peers
	// format: "APIKEY_FROM_MAPBOX"
	mapBoxComApiAccessKey: process.env.PRCXEXP_MAPBOX_APIKEY,

	// optional: GA tracking code
	// format: "UA-..."
	googleAnalyticsTrackingId: process.env.PRCXEXP_GANALYTICS_TRACKING,

	// optional: sentry.io error-tracking url
	// format: "SENTRY_IO_URL"
	sentryUrl: process.env.PRCXEXP_SENTRY_URL,
};
