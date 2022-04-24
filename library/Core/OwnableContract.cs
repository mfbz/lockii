using System;
using Neo;

using Lockii.Core.Stores;

namespace Lockii.Core
{

	/// <summary>
	/// A contract class to be used as a starting point to create other contracts.
	/// It implements ownable trait.
	/// </summary>
	public abstract class OwnableContract : DefaultContract
	{
		/// <summary>
		/// Emitted when the owner is changed.
		/// The first value refers to the previousOwner address, the second to the newOwner.
		/// </summary>
		public static event Action<UInt160, UInt160> OnOwnershipTransferred;

		/// <summary>
		/// Get the owner of the contract.
		/// </summary>
		/// <returns>A UInt160 value representing the script hash of contract owner.</returns>
		protected static UInt160 Owner() => OwnerStore.Get();

		/// <summary>
		/// Transfer the ownership of the contract to the new owner.
		/// </summary>
		/// <param name="newOwner">The script hash of the new owner of the contract.</param>
		public static void SafeTransferOwnership(UInt160 newOwner)
		{
			ValidateOwner();
			TransferOwnership(newOwner);
		}

		/// <summary>
		/// Transfer the ownership of the contract to the new owner.
		/// </summary>
		/// <remarks>
		/// Internal function without access restriction.
		/// </remarks>
		/// <param name="newOwner">The script hash of the new owner of the contract.</param>
		protected static void TransferOwnership(UInt160 newOwner)
		{
			UInt160 oldOwner = Owner();

			OwnerStore.Put(newOwner);
			OnOwnershipTransferred(oldOwner, newOwner);
		}

		/// <summary>
		/// Validate that the script hash calling the contract is the owner of the contract, otherwise it throws an exception.
		/// </summary>
		protected static void ValidateOwner()
		{
			ValidateCaller(Owner());
		}

	}
}