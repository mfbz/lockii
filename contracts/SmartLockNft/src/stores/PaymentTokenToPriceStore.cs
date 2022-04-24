using System.Numerics;

using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services;

namespace Lockii.SmartLockNft.Stores
{

	/// <summary>
	/// Provides access methods to access PaymentTokenToPrice storage.
	/// </summary>
	public static class PaymentTokenToPriceStore
	{
		private static readonly string MAP_KEY = "PaymentTokenToPrice";
		private static StorageMap PaymentTokenToPriceMap => new StorageMap(Storage.CurrentContext, MAP_KEY);
		public static BigInteger Get(UInt160 address)
		{
			var value = PaymentTokenToPriceMap[address];
			return value != null ? (BigInteger)value : 0;
		}
		public static Map<UInt160, BigInteger> GetMap()
		{
			Map<UInt160, BigInteger> map = new();
			Iterator iterator = PaymentTokenToPriceMap.Find(FindOptions.RemovePrefix);
			while (iterator.Next())
			{
				var content = (object[])iterator.Value;
				map[(UInt160)content[0]] = (BigInteger)content[1];
			}
			return map;
		}
		public static void Put(UInt160 address, BigInteger value) => PaymentTokenToPriceMap.Put(address, value);
		public static void Remove(UInt160 address) => PaymentTokenToPriceMap.Delete(address);
		public static Iterator Find(FindOptions options = FindOptions.None) => PaymentTokenToPriceMap.Find(options);
		public static Iterator Find(UInt160 address, FindOptions options = FindOptions.None) => PaymentTokenToPriceMap.Find(MAP_KEY + address, options);
	}

}