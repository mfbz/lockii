using System;
using System.ComponentModel;
using System.Numerics;

using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

using Lockii.SmartLockNft.Models;
using Lockii.SmartLockNft.Stores;
using Lockii.Core;

namespace Lockii.SmartLockNft
{

	/// <summary>
	/// SmartLock NFTs contract.
	/// </summary>
	[DisplayName("Lockii.SmartLockNftContract")]
	[ManifestExtra("Version", "1.0.0")]
	[SupportedStandards("NEP-11")]
	[ContractPermission("*", "*")]
	public class SmartLockNftContract : OwnablePausableContract
	{
		// The maximum amount of tokens ever creatable
		private static readonly BigInteger MAX_TOKEN_COUNT = 10_000;

		/// <summary>
		/// Emitted when a token is transferred.
		/// </summary>
		[DisplayName("Transfer")]
		public static event Action<UInt160, UInt160, BigInteger, ByteString> OnTransfer;

		/// <summary>
		/// Emitted when a new token is minted.
		/// </summary>
		public static event Action<UInt160, ByteString> OnMinted;

		/// <summary>
		/// Emitted when locked state of a token changes
		/// </summary>
		public static event Action<UInt160, ByteString, bool> OnLockedChanged;

		/// <summary>
		/// Called when NEP11 tokens are transferred to the contract.
		/// </summary>
		/// <param name="from">The address from which the transfer is happening.</param>
		/// <param name="amount">The amount transferred.</param>
		/// <param name="tokenId">The id of the token transferred.</param>
		/// <param name="data">The array of data to be passed as arguments [action: BigInteger] always first.</param>
		public static void OnNEP11Payment(UInt160 from, BigInteger amount, ByteString tokenId, object[] data)
		{
			ExecutionEngine.Abort();
		}

		/// <summary>
		/// Called when NEP17 tokens are transferred to the contract.
		/// </summary>
		/// <param name="from">The address from which the transfer is happening.</param>
		/// <param name="amount">The amount transferred.</param>
		/// <param name="data">The array of data to be passed as arguments [action: BigInteger] always first.</param>
		public static void OnNEP17Payment(UInt160 from, BigInteger amount, object[] data)
		{
			ExecutionEngine.Assert(PaymentTokenToPriceStore.Get(Runtime.CallingScriptHash) > 0, "Unsupported payment token");
			ExecutionEngine.Assert(amount >= PaymentTokenToPriceStore.Get(Runtime.CallingScriptHash), "Insufficient amount");

			// TODO: more from address checks?
			Mint(from);
		}

		/// <summary>
		/// Returns a short string representing symbol of the token managed in this contract.
		/// </summary>
		/// <remarks>
		/// NEP11 Standard
		/// </remarks>
		public static string Symbol() => "SMARTLOCK";

		/// <summary>
		/// Returns the number of decimals used by the token. 0 to implement the "Non-divisible NFT methods".
		/// </summary>
		/// <remarks>
		/// NEP11 Standard
		/// </remarks>
		public static ulong Decimals() => 0;

		/// <summary>
		/// Returns the total token supply deployed in the system.
		/// </summary>
		/// <remarks>
		/// NEP11 Standard
		/// </remarks>
		public static BigInteger TotalSupply() => TokenCountStore.Get();

		/// <summary>
		/// Returns the token balance of the address.
		/// </summary>
		/// <param name="address">The address scripthash from which get the balance.</param>
		/// <remarks>
		/// NEP11 Standard
		/// </remarks>
		public static BigInteger BalanceOf(UInt160 address)
		{
			ValidateAddress(address);
			return AddressToTokenCountStore.Get(address);
		}

		/// <summary>
		/// Returns an iterator that contains all of the token ids owned by the specified address.
		/// </summary>
		/// <param name="address">The address scripthash from which get the data.</param>
		/// <remarks>
		/// NEP11 Standard
		/// </remarks>
		public static Iterator TokensOf(UInt160 address)
		{
			ValidateAddress(address);
			return AddressIdToExistStore.Find(address, FindOptions.RemovePrefix | FindOptions.KeysOnly);
		}

		/// <summary>
		/// Transfers the token with id tokenId to address to.
		/// </summary>
		/// <param name="to">The address scripthash to which transfer the token.</param>
		/// <param name="tokenId">The id of the token to transfer.</param>
		/// <param name="data">The data to be transferred along with the token.</param>
		/// <remarks>
		/// NEP11 Standard
		/// </remarks>
		public static bool Transfer(UInt160 to, ByteString tokenId, object data)
		{
			ValidateAddress(to);

			Token token = TokenIdToTokenStore.Get(tokenId);
			ExecutionEngine.Assert(token != null, "Invalid token id");

			UInt160 from = token.Owner;
			if (!Runtime.CheckWitness(from)) return false;
			if (from != to)
			{
				// Update token data
				token.Owner = to;
				// Save token updated token data
				TokenIdToTokenStore.Put(token.Id, token);

				// Save address id data
				AddressToTokenCountStore.Reduce(from, 1);
				AddressIdToExistStore.Remove(from, token.Id);
				AddressToTokenCountStore.Increase(to, 1);
				AddressIdToExistStore.Create(to, token.Id);
			}

			PostTransfer(from, to, tokenId, data);
			return true;
		}

		/// <summary>
		/// Returns the owner of the specified token.
		/// </summary>
		/// <param name="tokenId">The id of the token.</param>
		/// <remarks>
		/// NEP11 Standard
		/// </remarks>
		public static UInt160 OwnerOf(ByteString tokenId)
		{
			Token token = TokenIdToTokenStore.Get(tokenId);
			ExecutionEngine.Assert(token != null, "Invalid token id");

			return token.Owner;
		}

		/// <summary>
		/// Returns an iterator that contains all of the tokens minted by the contract.
		/// </summary>
		/// <remarks>
		/// NEP11 Standard (OPTIONAL)
		/// </remarks>
		public static Iterator Tokens()
		{
			return TokenIdToTokenStore.Find(FindOptions.RemovePrefix | FindOptions.KeysOnly);
		}

		/// <summary>
		/// A mint that can be done directly by the owner to the specified address.
		/// </summary>
		/// <param name="to">The address to which mint the token.</param>
		public static void OwnerMint(UInt160 to)
		{
			ValidateOwner();
			ValidateAddress(to);

			Mint(to);
		}

		/// <summary>
		/// Transfer a generic NEP17 amount from the contract to an address.
		/// </summary>
		/// <param name="contract">The script hash of nep17 contract to be transferred.</param>
		/// <param name="to">The address to which send the withdrawn amount.</param>
		/// <param name="amount">The amount to transfer.</param>
		public void WithdrawAmount(UInt160 contract, UInt160 to, BigInteger amount)
		{
			ValidateOwner();
			ValidateContract(contract);
			ValidateAddress(to);

			ExecutionEngine.Assert(amount > 0, "Invalid amount");
			ExecutionEngine.Assert((bool)Contract.Call(contract, "transfer", CallFlags.All, new object[] { Runtime.ExecutingScriptHash, to, amount, null }), "Error on transfer");
		}

		/// <summary>
		/// Set the locked state of the lock
		/// </summary>
		/// <param name="locked">The locked state of the token.</param>
		public static void SetLocked(ByteString tokenId, bool locked)
		{
			Token token = TokenIdToTokenStore.Get(tokenId);
			ExecutionEngine.Assert(token != null, "Invalid token id");

			token.Locked = locked;
			TokenIdToTokenStore.Put(tokenId, token);

			OnLockedChanged(token.Owner, token.Id, token.Locked);
		}

		/// <summary>
		/// Returns the locked state of the token
		/// </summary>
		/// <param name="tokenId">The id of the token.</param>
		public static bool GetLocked(ByteString tokenId)
		{
			Token token = TokenIdToTokenStore.Get(tokenId);
			ExecutionEngine.Assert(token != null, "Invalid token id");

			return token.Locked;
		}

		/// <summary>
		/// Returns a serialized NVM object containing contract settings.
		/// </summary>
		public static Map<string, object> Settings()
		{
			Map<string, object> map = new();
			map["paused"] = Paused();
			map["paymentTokenToPrice"] = PaymentTokenToPriceStore.GetMap();
			return map;
		}

		/// <summary>
		/// Update or add a new contract NEP17 scripthash with its price.
		/// </summary>
		/// <param name="paymentToken">The scripthash of the payment token.</param>
		/// <param name="price">The price of the token referred to contract.</param>
		public void UpdatePaymentTokenPrice(UInt160 paymentToken, BigInteger price)
		{
			ValidateOwner();
			ValidateContract(paymentToken);
			ExecutionEngine.Assert(price > 0, "Price must be greater than 0");

			PaymentTokenToPriceStore.Put(paymentToken, price);
		}

		/// <summary>
		/// Deploy the contract and initialize the storage.
		/// </summary>
		/// <param name="data">The data to be passed along with the deploy of the contract.</param>
		/// <param name="update">Wheter it's an update or not.</param>
		[DisplayName("_deploy")]
		public static void Deploy(object data, bool update)
		{
			if (update) return;
			ValidateNotDeployed();

			PaymentTokenToPriceStore.Put(GAS.Hash, 10 * (10 ^ GAS.Decimals));

			TransferOwnership((UInt160)Tx.Sender);
			UpdatePaused(true);
			SetDeployed();
		}

		/// <summary>
		/// Update the contract with a new nef file.
		/// </summary>
		/// <param name="nefFile">The nef file to be updated.</param>
		/// <param name="manifest">The manifest of the contract.</param>
		public static void Update(ByteString nefFile, string manifest)
		{
			ValidateOwner();
			ContractManagement.Update(nefFile, manifest, null);
		}

		/// <summary>
		/// Trigger the onTransfer event and call onNEP11Payment of to address.
		/// </summary>
		/// <param name="from">The address scripthash from which the call is made.</param>
		/// <param name="to">The address scripthash to which the amount wants to be send.</param>
		/// <param name="tokenId">The id of the token to be send.</param>
		/// <param name="data">The data transferred along with the transfer.</param>
		private static void PostTransfer(UInt160 from, UInt160 to, ByteString tokenId, object data)
		{
			// Trigger on transfer event
			OnTransfer(from, to, 1, tokenId);
			// Validate payable of to address, if contract call its onNEP11Payment method
			if (to != null && ContractManagement.GetContract(to) != null)
				Contract.Call(to, "onNEP11Payment", CallFlags.All, new object[] { from, 1, tokenId, data });
		}

		/// <summary>
		/// Mint a token to the specified address.
		/// </summary>
		/// <param name="to">The address to which mint the token to.</param>
		private static void Mint(UInt160 to)
		{
			ValidateNotPaused();
			ExecutionEngine.Assert(TokenCountStore.GetNext() <= MAX_TOKEN_COUNT, "All token minted");

			// Create the token to be saved
			Token token = new Token()
			{
				Id = (ByteString)TokenCountStore.GetNext(),
				Owner = to,
				Locked = false
			};

			// Save data into the storage
			TokenIdToTokenStore.Put(token.Id, token);
			AddressToTokenCountStore.Increase(token.Owner, 1);
			AddressIdToExistStore.Create(token.Owner, token.Id);
			TokenCountStore.Increase(1);

			// Post final events
			OnMinted(token.Owner, token.Id);
			PostTransfer(null, token.Owner, token.Id, null);
		}

	}
}