// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingvalidationappIDL from '../target/idl/votingvalidationapp.json'
import type { Votingvalidationapp } from '../target/types/votingvalidationapp'

// Re-export the generated IDL and type
export { Votingvalidationapp, VotingvalidationappIDL }

// The programId is imported from the program IDL.
export const VOTINGVALIDATIONAPP_PROGRAM_ID = new PublicKey(VotingvalidationappIDL.address)

// This is a helper function to get the Votingvalidationapp Anchor program.
export function getVotingvalidationappProgram(provider: AnchorProvider) {
  return new Program(VotingvalidationappIDL as Votingvalidationapp, provider)
}

// This is a helper function to get the program ID for the Votingvalidationapp program depending on the cluster.
export function getVotingvalidationappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingvalidationapp program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return VOTINGVALIDATIONAPP_PROGRAM_ID
  }
}
