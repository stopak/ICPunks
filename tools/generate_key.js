import crypto from 'crypto';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import fs from 'fs';

const entropy = crypto.randomBytes(32);
const key = Ed25519KeyIdentity.generate(entropy);

fs.writeFileSync('key.json', JSON.stringify(key.toJSON()));