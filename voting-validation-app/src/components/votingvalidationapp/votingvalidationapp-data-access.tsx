'use client'

import {getVotingvalidationappProgram, getVotingvalidationappProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useVotingvalidationappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingvalidationappProgramId(cluster.network as Cluster), [cluster])
  const program = getVotingvalidationappProgram(provider)

  const accounts = useQuery({
    queryKey: ['votingvalidationapp', 'all', { cluster }],
    queryFn: () => program.account.votingvalidationapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['votingvalidationapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ votingvalidationapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingvalidationappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingvalidationappProgram()

  const accountQuery = useQuery({
    queryKey: ['votingvalidationapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.votingvalidationapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['votingvalidationapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ votingvalidationapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['votingvalidationapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ votingvalidationapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['votingvalidationapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ votingvalidationapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['votingvalidationapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ votingvalidationapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
