using System.Numerics;

using Neo;
using Neo.SmartContract.Framework.Services;

namespace Lockii.SmartLockNft.Stores
{

	/// <summary>
	/// Provides access methods to access address token count storage.
	/// </summary>
	public static class AddressToTokenCountStore
	{
		private static readonly string MAP_KEY = "AddressToTokenCount";
		private static StorageMap AddressToTokenCountMap => new StorageMap(Storage.CurrentContext, MAP_KEY);
		public static BigInteger Get(UInt160 address)
		{
			var value = AddressToTokenCountMap[address];
			return value != null ? (BigInteger)value : 0;
		}
		public static void Put(UInt160 address, BigInteger value) => AddressToTokenCountMap.Put(address, value);
		public static void Increase(UInt160 address, BigInteger valueToAdd) => Put(address, Get(address) + valueToAdd);
		public static void Reduce(UInt160 address, BigInteger valueToRemove)
		{
			var currentValue = Get(address);
			if (currentValue == valueToRemove)
				Remove(address);
			else
				Put(address, currentValue - valueToRemove);
		}
		private static void Remove(UInt160 address) => AddressToTokenCountMap.Delete(address);
	}

}