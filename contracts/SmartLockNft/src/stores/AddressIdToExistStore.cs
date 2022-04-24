using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services;

namespace Lockii.SmartLockNft.Stores
{

	/// <summary>
	/// Provides access methods to access AddressIdToExist storage map.
	/// This type of map are mainly used for Iterator usage with find, so just create or remove it
	/// NB: AddressId is address + / + tokenId
	/// </summary>
	public static class AddressIdToExistStore
	{
		private static readonly string MAP_KEY = "AddressIdToExist";
		private static StorageMap AddressIdToExistMap => new StorageMap(Storage.CurrentContext, MAP_KEY);
		public static ByteString Key(UInt160 address, ByteString tokenId) => (ByteString)Helper.Concat((address + "/").ToByteArray(), tokenId);
		public static bool Get(UInt160 address, ByteString tokenId)
		{
			var value = AddressIdToExistMap[Key(address, tokenId)];
			return value != null ? (BigInteger)value == 1 : false;
		}
		public static void Create(UInt160 address, ByteString tokenId) => AddressIdToExistMap.Put(Key(address, tokenId), 1);
		public static void Remove(UInt160 address, ByteString tokenId) => AddressIdToExistMap.Delete(Key(address, tokenId));
		public static Iterator Find(FindOptions options = FindOptions.None) => AddressIdToExistMap.Find(options);
		public static Iterator Find(UInt160 address, FindOptions options = FindOptions.None) => AddressIdToExistMap.Find((address + "/").ToByteArray(), options);
	}

}