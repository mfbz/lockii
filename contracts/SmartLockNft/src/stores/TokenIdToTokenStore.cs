using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

using Lockii.SmartLockNft.Models;

namespace Lockii.SmartLockNft.Stores
{

	/// <summary>
	/// Provides access methods to access token id to token storage map.
	/// </summary>
	public static class TokenIdToTokenStore
	{
		private static readonly string MAP_KEY = "TokenIdToToken";
		private static StorageMap TokenIdToTokenMap => new StorageMap(Storage.CurrentContext, MAP_KEY);
		public static Token Get(ByteString tokenId)
		{
			// Get the serialized token associated to the id
			var serializedToken = TokenIdToTokenMap[tokenId];
			// If not null the id is valid, so deserialize it as token and return it
			if (serializedToken != null) return (Token)StdLib.Deserialize(serializedToken);
			// If nothing found return null
			return null;
		}
		public static void Put(ByteString tokenId, Token token) => TokenIdToTokenMap.Put(tokenId, StdLib.Serialize(token));
		public static Iterator Find(FindOptions options = FindOptions.None) => TokenIdToTokenMap.Find(options);
	}

}