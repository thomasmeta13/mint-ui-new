import {
    Transaction,
    SystemProgram,
    TransactionInstruction,
    Keypair,
    Connection,
    PublicKey,
} from '@solana/web3.js'
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getMinimumBalanceForRentExemptMint,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
} from '@solana/spl-token'
import {
    DataV2,
    createCreateMasterEditionV3Instruction,
    createCreateMetadataAccountV3Instruction,
    createSetAndVerifyCollectionInstruction,
    createSetAndVerifySizedCollectionItemInstruction,
} from '@metaplex-foundation/mpl-token-metadata'
import {
    findMetadataPda,
    findMasterEditionV2Pda,
} from '@metaplex-foundation/js'

export const ON_CHAIN_METADATA_COLLECTION = (
    domain: string,
    shagaAuthority: PublicKey
) => {
    return {
        name: domain,
        symbol: 'Shaga Pass',
        uri: `https://shdw-drive.genesysgo.net/7i9EKXxo33JEo2d5JzEmofaZiP1HYbbftis5UifBEowG/${domain}3.json`,
        external_url: 'https://shaga.xyz',
        sellerFeeBasisPoints: 5,
        creators: [
            {
                address: shagaAuthority,
                verified: true,
                share: 100,
            },
        ],
        collection: null,
        uses: null,
    } as DataV2
}

export async function createNewMintInstructions(
    connection: Connection,
    payer: PublicKey,
    mintKeypair: Keypair,
    destinationWallet: PublicKey,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey,
    domain?: string,
    collectionAuthority?: PublicKey,
    collectionMint?: PublicKey
) {
    const requiredBalance = await getMinimumBalanceForRentExemptMint(connection)

    const metadataAddress = findMetadataPda(mintKeypair.publicKey)

    const collectionMetadata = findMetadataPda(collectionMint)

    const tokenATA = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        destinationWallet
    )
    const collectionMintEdition = findMasterEditionV2Pda(collectionMint)
    const mintEdition = findMasterEditionV2Pda(mintKeypair.publicKey)
    // console.log(ON_CHAIN_METADATA_COLLECTION(
    //     domain,
    //     collectionAuthority
    // ))
    const createNewTokenInstruction = [
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: requiredBalance,
            programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
            mintKeypair.publicKey, // mint account Address
            0, // number of decimals of the new mint
            mintAuthority, // mint account Authority
            freezeAuthority, // freeze Authority usually mint authority
            TOKEN_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
            payer, //Payer
            tokenATA, // owner associated token account
            destinationWallet, // token owner
            mintKeypair.publicKey // mint account
        ),
        createMintToInstruction(
            mintKeypair.publicKey, // mint account
            tokenATA, // destination associated token account
            mintAuthority, // authority
            1 //number of tokens
        ),
        createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataAddress,
                mint: mintKeypair.publicKey,
                mintAuthority: payer,
                payer: payer,
                updateAuthority: collectionAuthority,
            },
            {
                createMetadataAccountArgsV3: {
                    data: ON_CHAIN_METADATA_COLLECTION(
                        domain,
                        collectionAuthority
                    ),
                    isMutable: true,
                    collectionDetails: undefined,
                },
            }
        ),
        createCreateMasterEditionV3Instruction(
            {
                edition: mintEdition,
                metadata: metadataAddress,
                mint: mintKeypair.publicKey,
                mintAuthority: mintAuthority,
                payer: payer,
                updateAuthority: collectionAuthority,
            },
            {
                createMasterEditionArgs: {
                    maxSupply: 0,
                },
            }
        ),
    ]
    createNewTokenInstruction.push(
        createSetAndVerifySizedCollectionItemInstruction({
            payer: payer,
            metadata: metadataAddress,
            collectionAuthority: collectionAuthority,
            updateAuthority: collectionAuthority,
            collectionMint: collectionMint!,
            collection: collectionMetadata!,
            collectionMasterEditionAccount: collectionMintEdition!,
        })
    )

    return createNewTokenInstruction
}
