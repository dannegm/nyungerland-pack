#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';

import meow from 'meow';
import admin from 'firebase-admin';

import axios from 'axios';
import qs from 'qs';

import { config } from 'dotenv-defaults';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const decode64 = encoded64 => Buffer.from(encoded64, 'base64').toString();

const firebaseConfig = {
    credential: admin.credential.cert(JSON.parse(decode64(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

admin.initializeApp(firebaseConfig);

const bucket = admin.storage().bucket();

const uploadFile = async (folder, file) => {
    const filePath = path.join(__dirname, '../../build', `./${file}`);

    const options = {
        destination: `${folder}/${file}`,
    };

    console.log(`[${file}] uploading...`);

    try {
        await bucket.upload(filePath, options);
        console.log(`[${file}] upload complete`);

        const [resourceUrl] = await bucket.file(options.destination).getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60 * 24 * 30 * 12,
        });

        return {
            file,
            resourceUrl,
        };
    } catch (error) {
        console.log(`[${file}] unexpected error`);
        console.log(error);
        return error;
    }
};

const updateWebHook = async ({ resourceUrl }) => {
    try {
        console.log('Publicando en el servidor...');
        const data = qs.stringify({
            url: resourceUrl,
        });

        const client = axios.create({
            baseURL: process.env.NGL_API_HOST,
            headers: {
                'api-key': process.env.NGL_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        await client.post('/pack', data);

        console.log('Se ha actualizado el texture pack en el servidor correctamente.');
    } catch (e) {
        console.error(e);
    }
};

const startUpload = async () => {
    const { resourceUrl } = await uploadFile('packs', 'nyungerland-1.19.2.zip');
    console.log('URL del Recurso:');
    console.log('');
    console.log(resourceUrl);
    console.log('');

    return updateWebHook({ resourceUrl });
};

const instructions = `
Usage
  $ yarn upload
`;

const options = {
    importMeta: import.meta,
    flags: {
        root: {
            type: 'string',
            alias: 'r',
            default: './',
        },
        dest: {
            type: 'string',
            alias: 'd',
            default: './',
        },
        override: {
            type: 'boolean',
            alias: 'o',
            default: false,
        },
    },
};

const cli = meow(instructions, options);
startUpload(cli);
