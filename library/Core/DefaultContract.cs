using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

using Lockii.Core.Stores;

namespace Lockii.Core
{

	/// <summary>
	/// Contains basic contract utilities methods to be used in others.
	/// </summary>
	public abstract class DefaultContract : SmartContract
	{
		/// <summary>
		/// Access the current transaction from the script container.
		/// </summary>
		protected static Transaction Tx => (Transaction)Runtime.ScriptContainer;

		/// <summary>
		/// Get if contract has been deployed.
		/// </summary>
		/// <returns>A boolean representing if deployed.</returns>
		protected static bool Deployed() => DeployedStore.Get();

		/// <summary>
		/// Set that the contract has been deployed.
		/// </summary>
		protected static void SetDeployed() => DeployedStore.Put(true);

		/// <summary>
		/// Validate that the contract hasn't been deployed yet.
		/// </summary>
		protected static void ValidateNotDeployed()
		{
			ExecutionEngine.Assert(!Deployed(), "Contract already deployed");
		}

		/// <summary>
		/// Validate that the script hash calling the contract is equal to the parameter, otherwise it throws an exception.
		/// </summary>
		/// <param name="address">The address scripthash to be validated.</param>
		protected static void ValidateCaller(UInt160 address)
		{
			ExecutionEngine.Assert(Runtime.CheckWitness(address), "No authorization");
		}

		/// <summary>
		/// Validate an address.
		/// </summary>
		/// <param name="address">The address scripthash to be validated.</param>
		protected static void ValidateAddress(UInt160 address)
		{
			ExecutionEngine.Assert(address != null && address.IsValid, "Invalid address");
		}

		/// <summary>
		/// Validate that an address is a contract.
		/// </summary>
		/// <param name="address">The address scripthash to be validated.</param>
		protected static void ValidateContract(UInt160 address)
		{
			ExecutionEngine.Assert(ContractManagement.GetContract(address) != null, "Invalid contract address");
		}

	}
}