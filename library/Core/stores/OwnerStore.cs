using Neo;
using Neo.SmartContract.Framework.Services;

namespace Lockii.Core.Stores
{

	/// <summary>
	/// Provides access methods to owner storage.
	/// </summary>
	public static class OwnerStore
	{
		private static readonly string MAP_KEY = "_owner";
		public static UInt160 Get()
		{
			var owner = Storage.Get(Storage.CurrentContext, MAP_KEY);
			return owner != null ? ((UInt160)owner) : null;
		}
		public static void Put(UInt160 value) => Storage.Put(Storage.CurrentContext, MAP_KEY, value);
	}

}