import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js'

export function createTransaction(
    payerKey: PublicKey,
    instructions: TransactionInstruction[],
    blockhash: string
): VersionedTransaction {
    const messageV0 = new TransactionMessage({
        payerKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message()

    return new VersionedTransaction(messageV0)
}

export function createLegacyTransaction(
    payerKey: PublicKey,
    instructions: TransactionInstruction[],
    blockhash: string,
    lastValidBlockHeight: number
) {
    return new Transaction({
        feePayer: payerKey,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
    }).add(...instructions)
}
