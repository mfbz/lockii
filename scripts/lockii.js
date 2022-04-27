const { Gpio } = require('pigpio');
const dotenv = require('dotenv');
const Neon = require('@cityofzion/neon-js');

// Read .env file to assign it to process.env variables
dotenv.config();

// ---------------------------------------------------------------------------------------------------------------------
// PARAMETERS
// ---------------------------------------------------------------------------------------------------------------------

// Neo params (Testnet)
const NEO_SEED_RPC_URL = 'https://testnet1.neo.coz.io:443';
const NEO_NETWORK_MAGIC = 877933390;
const NEO_LOCKII_CONTRACT_HASH = '0xc1b99a1a4332212b7ae1b52f154996b1dadd2331';

// The token id of this lock to be used to retrieve the nft state
const NEO_LOCKII_TOKEN_ID = process.env.TOKEN_ID;

// These parameters are in microseconds.
// The servo pulse determines the degree at which the indicator is positioned.
// Need to play with these settings to get it to work properly with your door lock
const PULSE_LOCKED = 2200;
const PULSE_UNLOCKED = 1000;

// The raspberry pin at which the servo is attached
const PIN_SERVO = 14;
// The pins of the 3 led
const PIN_LED_LOCKED = 22;
const PIN_LED_UNLOCKED = 17;
const PIN_LED_UNKNOWN = 27;

// The delay of the main loop ms
const DELAY_MAIN_LOOP = 3000;

// ---------------------------------------------------------------------------------------------------------------------
// MAIN LOOP
// ---------------------------------------------------------------------------------------------------------------------

// Main loop does an rpc call to the Neo blockchain to retrieve the state of the current token and open/close the lock.
// The state can be changed only by the owner of the token that is the only one that can alter its state
(async () => {
	// The servo motor to be controlled
	const motor = new Gpio(PIN_SERVO, { mode: Gpio.OUTPUT });
	// The status leds
	const leds = {
		locked: new Gpio(PIN_LED_LOCKED, { mode: Gpio.OUTPUT }),
		unlocked: new Gpio(PIN_LED_UNLOCKED, { mode: Gpio.OUTPUT }),
		unknown: new Gpio(PIN_LED_UNKNOWN, { mode: Gpio.OUTPUT }),
	};

	// The current state of the lock
	let locked = false;
	// Here i continously check for the state of the lock that can be changed only by the owner of the nft
	while (true) {
		// Get onchain the status of the lock
		const _locked = await readContractState(NEO_LOCKII_TOKEN_ID);

		// Do changes on the lock only if data has changed
		if (_locked !== locked) {
			// Handle outputs
			handleLock(motor, _locked);
			handleLeds(leds, _locked);

			// Save state to avoid doing same actions again the iteration later
			locked = _locked;
		}

		// Sleep for next cycle
		await sleep(DELAY_MAIN_LOOP);
	}
})();

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------

async function readContractState(tokenId) {
	try {
		const contract = new Neon.experimental.SmartContract(Neon.u.HexString.fromHex(NEO_LOCKII_CONTRACT_HASH), {
			networkMagic: NEO_NETWORK_MAGIC,
			rpcAddress: NEO_SEED_RPC_URL,
		});
		const result = await contract.testInvoke('getLocked', [Neon.sc.ContractParam.integer(tokenId)]);
		return Boolean(result.stack[0].value);
	} catch (error) {
		console.error(error);
		return null;
	}
}

function handleLock(motor, locked) {
	if (locked === null) return;

	if (locked) {
		motor.servoWrite(PULSE_LOCKED);
	} else {
		motor.servoWrite(PULSE_UNLOCKED);
	}
}

function handleLeds(leds, locked) {
	if (locked !== null) {
		if (locked) {
			leds.locked.digitalWrite(1);
			leds.unlocked.digitalWrite(0);
			leds.unknown.digitalWrite(0);
		} else {
			leds.locked.digitalWrite(0);
			leds.unlocked.digitalWrite(1);
			leds.unknown.digitalWrite(0);
		}
	} else {
		leds.locked.digitalWrite(0);
		leds.unlocked.digitalWrite(0);
		leds.unknown.digitalWrite(1);
	}
}

async function sleep(delay) {
	await new Promise((resolve) => setTimeout(resolve, delay));
}
