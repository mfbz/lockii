using System.Numerics;
using Neo.SmartContract.Framework.Services;

namespace Lockii.SmartLockNft.Stores
{

	/// <summary>
	/// Provides access methods to access token count storage.
	/// </summary>
	public static class TokenCountStore
	{
		private static readonly string MAP_KEY = "TokenCount";
		public static BigInteger Get()
		{
			var value = Storage.Get(Storage.CurrentContext, MAP_KEY);
			return value != null ? (BigInteger)value : 0;
		}
		public static BigInteger GetNext() => Get() + 1;
		public static void Put(BigInteger value) => Storage.Put(Storage.CurrentContext, MAP_KEY, value);
		public static void Increase(BigInteger valueToAdd) => Put(Get() + valueToAdd);
		public static void Reduce(BigInteger valueToRemove) => Put(Get() - valueToRemove);
	}

}