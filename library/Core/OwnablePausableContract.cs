using System;
using Neo;
using Neo.SmartContract.Framework;

using Lockii.Core.Stores;

namespace Lockii.Core
{

	/// <summary>
	/// A contract class to be used as a starting point to create other contracts.
	/// It implements Ownable and Pausable traits.
	/// </summary>
	public abstract class OwnablePausableContract : OwnableContract
	{
		/// <summary>
		/// Emitted when paused is changed
		/// </summary>
		public static event Action<bool> OnPausedChanged;

		/// <summary>
		/// Get the paused state of the contract.
		/// </summary>
		/// <returns>A bool indicating if the contract is paused or not.</returns>
		protected static bool Paused() => PausedStore.Get();

		/// <summary>
		/// Update contract paused state
		/// </summary>
		/// <param name="paused">The new paused value to be set.</param>
		public static void SafeUpdatePaused(bool paused)
		{
			ValidateOwner();
			UpdatePaused(paused);
		}

		/// <summary>
		/// Update contract paused state without access control.
		/// </summary>
		/// <remarks>
		/// Internal function without access restriction.
		/// </remarks>
		/// <param name="paused">The new paused value to be set.</param>
		protected static void UpdatePaused(bool paused)
		{
			PausedStore.Put(paused);
			OnPausedChanged(paused);
		}

		/// <summary>
		/// Validate that the contract is not paused, otherwise it throws an exception.
		/// </summary>
		protected static void ValidateNotPaused()
		{
			ExecutionEngine.Assert(!Paused(), "Contract is paused");
		}

	}
}