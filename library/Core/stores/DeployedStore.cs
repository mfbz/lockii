using System.Numerics;
using Neo.SmartContract.Framework.Services;

namespace Lockii.Core.Stores
{

	/// <summary>
	/// Provides access methods to deployed storage.
	/// </summary>
	public static class DeployedStore
	{
		private static readonly string MAP_KEY = "_deployed";
		public static bool Get() => (BigInteger)(Storage.Get(Storage.CurrentContext, MAP_KEY)) == 1;
		public static void Put(bool value) => Storage.Put(Storage.CurrentContext, MAP_KEY, value ? 1 : 0);
	}

}