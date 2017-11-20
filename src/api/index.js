import {
	description,
	version
} from '../../package.json';
import {
	Router
} from 'express';
import facets from './facets';
import path from 'path';
import compareVersion from 'compare-versions';
import * as sander from 'sander';
import fs from 'fs';

function getLastVersion() {
	let files = sander.readdirSync(process.cwd() + '/releases');
	let max = '';
	files = files.filter(f => f.indexOf('-mac.zip') !== -1).map(f => f.replace('slti-', '').replace('-mac.zip', ''));
	files.forEach(f => {
		if (!max) max = f;
		if (compareVersion(f, max) === 1) {
			max = f;
		}
	});
	return max;
}

export default ({
	config,
	db
}) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({
		config,
		db
	}));

	api.get('/download', (req, res) => {
		let lastVersion = getLastVersion();
		var file = path.join(process.cwd(), "releases/slti-" + lastVersion + '-mac.zip');
		res.download(file);
	});

	api.get('/update/:version', (req, res) => {
		let lastVersion = getLastVersion();
		var IP = process.env.IP || "http://localhost:8081"

		if (compareVersion(req.params.version, lastVersion) !== -1) {
			return res.status(404).send();
		}

		var fd = fs.openSync(path.join(process.cwd(), '/releases/slti-' + lastVersion + '-mac.zip'), 'r')
		let stat = sander.fstatSync(fd);


		let rta = {
			"url": IP + "/api/download",
			"name": lastVersion,
			"notes": "",
			"pub_date": stat.mtime
		};

		res.json(rta);
	});

	return api;
}