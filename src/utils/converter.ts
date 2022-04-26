import { sc, u, wallet } from '@cityofzion/neon-js';
import { ArgumentType } from '@rentfuse-labs/neo-wallet-adapter-base';

export function toDecodedValue(
	type: 'bytestring' | 'string' | 'biginteger' | 'number' | 'address' | 'boolean' | 'hash160',
	value: any,
) {
	let decodedValue = value;
	switch (type) {
		case 'bytestring':
			decodedValue = value;
			break;
		case 'string':
			decodedValue = value?.length ? u.hexstring2str(u.base642hex(value)) : '';
			break;
		case 'biginteger':
			if (value.length) {
				decodedValue = isNaN(+value)
					? u.BigInteger.fromHex(u.reverseHex(u.base642hex(value)))
					: u.BigInteger.fromNumber(value);
			} else {
				decodedValue = u.BigInteger.fromNumber(0);
			}
			break;
		case 'number':
			if (value.length) {
				decodedValue = isNaN(+value) ? u.HexString.fromHex(u.reverseHex(u.base642hex(value))).toNumber() : +value;
			} else {
				decodedValue = 0;
			}
			break;
		case 'address':
			decodedValue = wallet.getAddressFromScriptHash(u.reverseHex(u.base642hex(value)));
			break;
		case 'boolean':
			if (typeof value === 'string') {
				decodedValue = isNaN(+value)
					? u.HexString.fromHex(u.reverseHex(u.base642hex(value))).toNumber() === 1
					: value === '1';
			} else {
				decodedValue = value;
			}
			break;
		case 'hash160':
			decodedValue = u.reverseHex(u.base642hex(value));
			break;
	}
	return decodedValue;
}

export function toInvocationArgument(type: ArgumentType, value: any) {
	const arg = { type, value };

	switch (type) {
		case 'Any':
			arg.value = null;
			break;
		case 'Boolean':
			// Does basic checks to convert value into a boolean. Value field will be a boolean.
			let _value = value;
			if (typeof _value === 'string') {
				_value = _value === 'true' || _value === '1';
			}
			arg.value = sc.ContractParam.boolean(_value).toJson().value;
			break;
		case 'Integer':
			// A value that can be parsed to a BigInteger. Numbers or numeric strings are accepted.
			arg.value = sc.ContractParam.integer(value).toJson().value;
			break;
		case 'ByteArray':
			// A string or HexString.
			arg.value = sc.ContractParam.byteArray(value).toJson().value;
			break;
		case 'String':
			// UTF8 string.
			arg.value = sc.ContractParam.string(value).toJson().value;
			break;
		case 'Hash160':
			// A 40 character (20 bytes) hexstring. Automatically converts an address to scripthash if provided.
			arg.value = sc.ContractParam.hash160(value).toJson().value;
			break;
		case 'Hash256':
			// A 64 character (32 bytes) hexstring.
			arg.value = sc.ContractParam.hash256(value).toJson().value;
			break;
		case 'PublicKey':
			// A public key (both encoding formats accepted)
			arg.value = sc.ContractParam.publicKey(value).toJson().value;
			break;
		case 'Signature':
			// TODO: NOT SUPPORTED
			break;
		case 'Array':
			// Pass an array as JSON [{type: 'String': value: 'blabla'}]
			arg.value = sc.ContractParam.fromJson(value).toJson().value;
			break;
		case 'Map':
			// TODO: NOT SUPPORTED
			break;
		case 'InteropInterface':
			// TODO: NOT SUPPORTED
			break;
		case 'Void':
			// Value field will be set to null.
			arg.value = null;
			break;
	}
	return arg;
}
