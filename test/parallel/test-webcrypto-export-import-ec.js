'use strict';

const common = require('../common');
const fixtures = require('../common/fixtures');

if (!common.hasCrypto)
  common.skip('missing crypto');

const assert = require('assert');
const crypto = require('crypto');
const { subtle } = crypto.webcrypto;

const curves = ['P-256', 'P-384', 'P-521'];

const keyData = {
  'P-521': {
    jwsAlg: 'ES512',
    spki: Buffer.from(
      '30819b301006072a8648ce3d020106052b8104002303818600040156f479f8df' +
      '1e20a7ffc04ce420c3e154ae251996bee42f034b84d41b743f34e45f311b813a' +
      '9cdec8cda59bbbbd31d460b3292521e7c1b722e5667c03db2fae753f01501736' +
      'cfe247394320d8e4afc2fd39b5a9331061b81e2241282b9e17891822b5b79e05' +
      '2f4597b59643fd39379c51bd5125c4f48bc3f025ce3cd36953286ccb38fb',
      'hex'),
    pkcs8: Buffer.from(
      '3081ee020100301006072a8648ce3d020106052b810400230481d63081d3020' +
      '101044200f408758368ba930f30f76ae054fe5cd2ce7fda2c9f76a6d436cf75' +
      'd66c440bfe6331c7c172a12478193c8251487bc91263fa50217f85ff636f59c' +
      'd546e3ab483b4a1818903818600040156f479f8df1e20a7ffc04ce420c3e154' +
      'ae251996bee42f034b84d41b743f34e45f311b813a9cdec8cda59bbbbd31d46' +
      '0b3292521e7c1b722e5667c03db2fae753f01501736cfe247394320d8e4afc2' +
      'fd39b5a9331061b81e2241282b9e17891822b5b79e052f4597b59643fd39379' +
      'c51bd5125c4f48bc3f025ce3cd36953286ccb38fb', 'hex'),
    jwk: {
      kty: 'EC',
      crv: 'P-521',
      x: 'AVb0efjfHiCn_8BM5CDD4VSuJRmWvuQvA0uE1Bt0PzTkXzEbgTqc3sjN' +
          'pZu7vTHUYLMpJSHnwbci5WZ8A9svrnU_',
      y: 'AVAXNs_iRzlDINjkr8L9ObWpMxBhuB4iQSgrnheJGCK1t54FL0W' +
          'XtZZD_Tk3nFG9USXE9IvD8CXOPNNpUyhsyzj7',
      d: 'APQIdYNoupMPMPdq4FT-XNLOf9osn3am1DbPddZsRAv-YzHHw' +
          'XKhJHgZPIJRSHvJEmP6UCF_hf9jb1nNVG46tIO0'
    }
  },
  'P-384': {
    jwsAlg: 'ES384',
    spki: Buffer.from(
      '3076301006072a8648ce3d020106052b8104002203620004219c14d66617b36e' +
      'c6d8856b385b73a74d344fd8ae75ef046435dda54e3b44bd5fbdebd1d08dd69e' +
      '2d7dc1dc218cb435bd28138cc778337a842f6bd61b240e74249f24667c2a5810' +
      'a76bfc28e0335f88a6501dec01976da85afb00869cb6ace8', 'hex'),
    pkcs8: Buffer.from(
      '3081b6020100301006072a8648ce3d020106052b8104002204819e30819b0201' +
      '0104304537b5990784d3c2d22e96a8f92fa1aa492ee873e576a41582e144183c' +
      '9888d10e6b9eb4ced4b2cc4012e4ac5ea84073a16403620004219c14d66617b3' +
      '6ec6d8856b385b73a74d344fd8ae75ef046435dda54e3b44bd5fbdebd1d08dd6' +
      '9e2d7dc1dc218cb435bd28138cc778337a842f6bd61b240e74249f24667c2a58' +
      '10a76bfc28e0335f88a6501dec01976da85afb00869cb6ace8', 'hex'),
    jwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'IZwU1mYXs27G2IVrOFtzp000T9iude8EZDXdpU47RL1fvevR0I3Wni19wdwhjLQ1',
      y: 'vSgTjMd4M3qEL2vWGyQOdCSfJGZ8KlgQp2v8KOAzX4imUB3sAZdtqFr7AIactqzo',
      d: 'RTe1mQeE08LSLpao-S-hqkku6HPldqQVguFEGDyYiNEOa560ztSyzEAS5KxeqEBz'
    }
  },
  'P-256': {
    jwsAlg: 'ES256',
    spki: Buffer.from(
      '3059301306072a8648ce3d020106082a8648ce3d03010703420004d6e8328a95' +
      'fe29afcdc30977b9251efbb219022807f6b14bb34695b6b4bdb93ee6684548a4' +
      'ad13c49d00433c45315e8274f3540f58f5d79ef7a1b184f4c21d17', 'hex'),
    pkcs8: Buffer.from(
      '308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02' +
      '010104202bc2eda265e46866efa8f8f99da993175b6c85c246e15dceaed7e307' +
      '0f13fbf8a14403420004d6e8328a95fe29afcdc30977b9251efbb219022807f6' +
      'b14bb34695b6b4bdb93ee6684548a4ad13c49d00433c45315e8274f3540f58f5' +
      'd79ef7a1b184f4c21d17', 'hex'),
    jwk: {
      kty: 'EC',
      crv: 'P-256',
      x: '1ugyipX-Ka_Nwwl3uSUe-7IZAigH9rFLs0aVtrS9uT4',
      y: '5mhFSKStE8SdAEM8RTFegnTzVA9Y9dee96GxhPTCHRc',
      d: 'K8LtomXkaGbvqPj5namTF1tshcJG4V3OrtfjBw8T-_g'
    }
  },
};

const testVectors = [
  {
    name: 'ECDSA',
    privateUsages: ['sign'],
    publicUsages: ['verify']
  },
  {
    name: 'ECDH',
    privateUsages: ['deriveKey', 'deriveBits'],
    publicUsages: []
  },
];

async function testImportSpki({ name, publicUsages }, namedCurve, extractable) {
  const key = await subtle.importKey(
    'spki',
    keyData[namedCurve].spki,
    { name, namedCurve },
    extractable,
    publicUsages);
  assert.strictEqual(key.type, 'public');
  assert.strictEqual(key.extractable, extractable);
  assert.deepStrictEqual(key.usages, publicUsages);
  assert.deepStrictEqual(key.algorithm.name, name);
  assert.deepStrictEqual(key.algorithm.namedCurve, namedCurve);

  if (extractable) {
    // Test the roundtrip
    const spki = await subtle.exportKey('spki', key);
    assert.strictEqual(
      Buffer.from(spki).toString('hex'),
      keyData[namedCurve].spki.toString('hex'));
  } else {
    await assert.rejects(
      subtle.exportKey('spki', key), {
        message: /key is not extractable/
      });
  }

  // Bad usage
  await assert.rejects(
    subtle.importKey(
      'spki',
      keyData[namedCurve].spki,
      { name, namedCurve },
      extractable,
      ['wrapKey']),
    { message: /Unsupported key usage/ });
}

async function testImportPkcs8(
  { name, privateUsages },
  namedCurve,
  extractable) {
  const key = await subtle.importKey(
    'pkcs8',
    keyData[namedCurve].pkcs8,
    { name, namedCurve },
    extractable,
    privateUsages);
  assert.strictEqual(key.type, 'private');
  assert.strictEqual(key.extractable, extractable);
  assert.deepStrictEqual(key.usages, privateUsages);
  assert.deepStrictEqual(key.algorithm.name, name);
  assert.deepStrictEqual(key.algorithm.namedCurve, namedCurve);

  if (extractable) {
    // Test the roundtrip
    const pkcs8 = await subtle.exportKey('pkcs8', key);
    assert.strictEqual(
      Buffer.from(pkcs8).toString('hex'),
      keyData[namedCurve].pkcs8.toString('hex'));
  } else {
    await assert.rejects(
      subtle.exportKey('pkcs8', key), {
        message: /key is not extractable/
      });
  }
}

async function testImportJwk(
  { name, publicUsages, privateUsages },
  namedCurve,
  extractable) {

  const jwk = keyData[namedCurve].jwk;

  const [
    publicKey,
    privateKey,
  ] = await Promise.all([
    subtle.importKey(
      'jwk',
      {
        kty: jwk.kty,
        crv: jwk.crv,
        x: jwk.x,
        y: jwk.y,
      },
      { name, namedCurve },
      extractable, publicUsages),
    subtle.importKey(
      'jwk',
      jwk,
      { name, namedCurve },
      extractable,
      privateUsages),
    subtle.importKey(
      'jwk',
      {
        alg: name === 'ECDSA' ? keyData[namedCurve].jwsAlg : 'ECDH-ES',
        kty: jwk.kty,
        crv: jwk.crv,
        x: jwk.x,
        y: jwk.y,
      },
      { name, namedCurve },
      extractable, publicUsages),
    subtle.importKey(
      'jwk',
      {
        ...jwk,
        alg: name === 'ECDSA' ? keyData[namedCurve].jwsAlg : 'ECDH-ES',
      },
      { name, namedCurve },
      extractable,
      privateUsages),
  ]);

  assert.strictEqual(publicKey.type, 'public');
  assert.strictEqual(privateKey.type, 'private');
  assert.strictEqual(publicKey.extractable, extractable);
  assert.strictEqual(privateKey.extractable, extractable);
  assert.deepStrictEqual(publicKey.usages, publicUsages);
  assert.deepStrictEqual(privateKey.usages, privateUsages);
  assert.strictEqual(publicKey.algorithm.name, name);
  assert.strictEqual(privateKey.algorithm.name, name);
  assert.strictEqual(publicKey.algorithm.namedCurve, namedCurve);
  assert.strictEqual(privateKey.algorithm.namedCurve, namedCurve);

  if (extractable) {
    // Test the round trip
    const [
      pubJwk,
      pvtJwk,
    ] = await Promise.all([
      subtle.exportKey('jwk', publicKey),
      subtle.exportKey('jwk', privateKey),
    ]);

    assert.deepStrictEqual(pubJwk.key_ops, publicUsages);
    assert.strictEqual(pubJwk.ext, true);
    assert.strictEqual(pubJwk.kty, 'EC');
    assert.strictEqual(pubJwk.x, jwk.x);
    assert.strictEqual(pubJwk.y, jwk.y);
    assert.strictEqual(pubJwk.crv, jwk.crv);

    assert.deepStrictEqual(pvtJwk.key_ops, privateUsages);
    assert.strictEqual(pvtJwk.ext, true);
    assert.strictEqual(pvtJwk.kty, 'EC');
    assert.strictEqual(pvtJwk.x, jwk.x);
    assert.strictEqual(pvtJwk.y, jwk.y);
    assert.strictEqual(pvtJwk.crv, jwk.crv);
    assert.strictEqual(pvtJwk.d, jwk.d);
  } else {
    await assert.rejects(
      subtle.exportKey('jwk', publicKey), {
        message: /key is not extractable/
      });
    await assert.rejects(
      subtle.exportKey('jwk', privateKey), {
        message: /key is not extractable/
      });
  }
}

(async function() {
  const tests = [];
  testVectors.forEach((vector) => {
    curves.forEach((namedCurve) => {
      [true, false].forEach((extractable) => {
        tests.push(testImportSpki(vector, namedCurve, extractable));
        tests.push(testImportPkcs8(vector, namedCurve, extractable));
        tests.push(testImportJwk(vector, namedCurve, extractable));
      });
    });
  });

  await Promise.all(tests);
})().then(common.mustCall());

{
  const rsaPublic = crypto.createPublicKey(
    fixtures.readKey('rsa_public_2048.pem'));
  const rsaPrivate = crypto.createPrivateKey(
    fixtures.readKey('rsa_private_2048.pem'));

  for (const [name, [publicUsage, privateUsage]] of Object.entries({
    'ECDSA': ['verify', 'sign'],
    'ECDH': ['deriveBits', 'deriveBits'],
  })) {
    assert.rejects(subtle.importKey(
      'spki',
      rsaPublic.export({ format: 'der', type: 'spki' }),
      { name, hash: 'SHA-256', namedCurve: 'P-256' },
      true, [publicUsage]), { message: /Invalid key type/ });
    assert.rejects(subtle.importKey(
      'pkcs8',
      rsaPrivate.export({ format: 'der', type: 'pkcs8' }),
      { name, hash: 'SHA-256', namedCurve: 'P-256' },
      true, [privateUsage]), { message: /Invalid key type/ });
  }
}
