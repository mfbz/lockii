using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;

namespace Lockii.SmartLockNft.Models
{

	/// <summary>
	/// The token with its data.
	/// </summary>
	public class Token
	{
		// The unique identifier of the token
		public ByteString Id;
		// The owner of the token
		public UInt160 Owner;
		// The locked state of the token
		public bool Locked;
	}

}