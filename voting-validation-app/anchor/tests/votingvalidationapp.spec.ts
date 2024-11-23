import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Votingvalidationapp} from '../target/types/votingvalidationapp'

describe('votingvalidationapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votingvalidationapp as Program<Votingvalidationapp>

  const votingvalidationappKeypair = Keypair.generate()

  it('Initialize Votingvalidationapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        votingvalidationapp: votingvalidationappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votingvalidationappKeypair])
      .rpc()

    const currentCount = await program.account.votingvalidationapp.fetch(votingvalidationappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votingvalidationapp', async () => {
    await program.methods.increment().accounts({ votingvalidationapp: votingvalidationappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingvalidationapp.fetch(votingvalidationappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votingvalidationapp Again', async () => {
    await program.methods.increment().accounts({ votingvalidationapp: votingvalidationappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingvalidationapp.fetch(votingvalidationappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votingvalidationapp', async () => {
    await program.methods.decrement().accounts({ votingvalidationapp: votingvalidationappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingvalidationapp.fetch(votingvalidationappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votingvalidationapp value', async () => {
    await program.methods.set(42).accounts({ votingvalidationapp: votingvalidationappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingvalidationapp.fetch(votingvalidationappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votingvalidationapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votingvalidationapp: votingvalidationappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votingvalidationapp.fetchNullable(votingvalidationappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
