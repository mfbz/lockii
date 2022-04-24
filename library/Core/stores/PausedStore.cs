using System.Numerics;
using Neo.SmartContract.Framework.Services;

namespace Lockii.Core.Stores
{

	/// <summary>
	/// Provides access methods to paused storage.
	/// </summary>
	public static class PausedStore
	{
		private static readonly string MAP_KEY = "_paused";
		public static bool Get() => (BigInteger)(Storage.Get(Storage.CurrentContext, MAP_KEY)) == 1;
		public static void Put(bool value) => Storage.Put(Storage.CurrentContext, MAP_KEY, value ? 1 : 0);
	}

}