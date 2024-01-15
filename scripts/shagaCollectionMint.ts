import {
    Transaction,
    SystemProgram,
    TransactionInstruction,
    Keypair,
    Connection,
    PublicKey,
} from "@solana/web3.js";
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getMinimumBalanceForRentExemptMint,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
} from "@solana/spl-token";
import {
    DataV2,
    createCreateMasterEditionInstruction,
    createCreateMasterEditionV3Instruction,
    createCreateMetadataAccountV3Instruction,
    createSetAndVerifyCollectionInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import {
    bundlrStorage,
    keypairIdentity,
    Metaplex,
    UploadMetadataInput,
    toMetaplexFile,
    findMetadataPda,
    findMasterEditionV2Pda,
} from "@metaplex-foundation/js";
import { Wallet } from "@project-serum/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
import { getShdwAccountByName } from "utils/shdwUtils";
import { SHDW_DRIVE_ENDPOINT } from "pages/api/auth/mint";
import {
    loadImage,
} from '@napi-rs/canvas';
import dotenv from 'dotenv';
dotenv.config()
// console.log(typeof process.env.SHAGA_AUTHORITY)
const KeypairBuffer = Buffer.from([151,213,125,98,172,13,118,150,107,222,7,140,209,252,209,89,225,61,197,234,12,99,89,178,22,225,86,148,177,182,191,117,154,17,36,29,233,248,155,143,106,8,49,157,208,114,36,78,115,254,121,21,148,188,108,161,233,142,84,140,188,189,57,167]);
const METADATA_UPLOADER = Keypair.fromSecretKey(KeypairBuffer);

export const ON_CHAIN_METADATA = {
    name: "Shaga Pass Collection",
    symbol: "Shaga Pass",
    uri: `https://shdw-drive.genesysgo.net/7i9EKXxo33JEo2d5JzEmofaZiP1HYbbftis5UifBEowG/collection_metadata.json`,
    external_url: "https://shaga.xyz",
    sellerFeeBasisPoints: 0,
    creators: [
        {
            address: METADATA_UPLOADER.publicKey,
            verified: true,
            share: 100,
        },
    ],
    collection: null,
    uses: null,
} as DataV2;

export const ON_CHAIN_METADATA_COLLECTION = (domain: string) => {
    return {
    name: domain,
    symbol: "Shaga Pass",
    uri: `https://shdw-drive.genesysgo.net/7i9EKXxo33JEo2d5JzEmofaZiP1HYbbftis5UifBEowG/${domain}.json`,
    external_url: "https://shaga.xyz",
    sellerFeeBasisPoints: 5,
    creators: [
        {
            address: METADATA_UPLOADER.publicKey,
            verified: true,
            share: 100,
        },
    ],
    collection: null,
    uses: null,
    } as DataV2;
}

const DEVNET_CONNECTION = new Connection("https://gwenneth-fpqx5g-fast-devnet.helius-rpc.com/");
const CONNECTION = new Connection(process.env.NEXT_PUBLIC_HELIUS_API);


export async function createShagaCollectionInstruction(
    connection: Connection,
    payer: Keypair,
    mintKeypair: Keypair,
    destinationWallet: PublicKey,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey,
    collectionMint?: PublicKey,
) {
    const requiredBalance = await getMinimumBalanceForRentExemptMint(
        connection,
    );

    const metadataAddress = findMetadataPda(mintKeypair.publicKey)


    const tokenATA = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        destinationWallet,
    );
    let mintEdition = findMasterEditionV2Pda(collectionMint)
    const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
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
            TOKEN_PROGRAM_ID,
        ),
        createAssociatedTokenAccountInstruction(
            payer.publicKey, //Payer
            tokenATA, // owner associated token account
            destinationWallet, // token owner
            mintKeypair.publicKey, // mint account
        ),
        createMintToInstruction(
            mintKeypair.publicKey, // mint account
            tokenATA, // destination associated token account
            mintAuthority, // authority
            1, //number of tokens
        ),
        createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataAddress,
                mint: mintKeypair.publicKey,
                mintAuthority: mintAuthority,
                payer: payer.publicKey,
                updateAuthority: mintAuthority,
            },
            {
                createMetadataAccountArgsV3: {
                    data: ON_CHAIN_METADATA,
                    isMutable: true,
                    collectionDetails:  {
                        __kind: "V1",
                        size: 0
                    }
                },
            },
        ),
        createCreateMasterEditionV3Instruction(
            {
                edition: mintEdition,
                metadata: metadataAddress,
                mint: mintKeypair.publicKey,
                mintAuthority: mintAuthority,
                payer: payer.publicKey,
                updateAuthority: mintAuthority,
            },
            {
                createMasterEditionArgs: {
                    maxSupply: 0
                },
            },
        ),
    );

    return createNewTokenTransaction;
}

export const mintNewTokensInstructions = async (
    mintPublicKey: PublicKey,
    destinationWallet: PublicKey,
    mintAuthority: PublicKey,
    collectionAuthority: PublicKey
) => {
    const tokenATA = await getAssociatedTokenAddress(
        mintPublicKey,
        destinationWallet,
    );
    const getTokenAta = await DEVNET_CONNECTION.getAccountInfo(tokenATA);
    const instructions: TransactionInstruction[] = [];

    if (!getTokenAta) {
        instructions.push(
            createAssociatedTokenAccountInstruction(
                mintAuthority, // payer
                tokenATA, // owner associated token account
                destinationWallet, // token owner
                mintPublicKey, // mint account
            ),
        );
    }
    instructions.push(
        createMintToInstruction(
            mintPublicKey, // mint
            tokenATA, // destination ata
            mintAuthority, // mint authority
            1,
        ),
    );

    return instructions;
};

async function uploadCollectionData() {

    const WALLET = new Wallet(METADATA_UPLOADER);

    const drive = await new ShdwDrive(
        CONNECTION,
        WALLET,
    ).init();

    let SHDW_ACCOUNT;
    try{
        SHDW_ACCOUNT = await getShdwAccountByName(
            drive,
            `Shaga Pass Test`,
        );
    } catch{}

    if (!SHDW_ACCOUNT) {
        console.log("create shadow account");
        const shadowResponse = await drive.createStorageAccount(
            `Shaga Pass Test`,
            "100MB",
        );
        if (shadowResponse && shadowResponse.shdw_bucket) {
            SHDW_ACCOUNT = new PublicKey(
                shadowResponse.shdw_bucket,
            );
        }
    }
    console.log("SHDW_ACCOUNT", SHDW_ACCOUNT.toString())

    const collectionJson = {
        name: ON_CHAIN_METADATA.name,
        symbol: ON_CHAIN_METADATA.symbol,
        image: `${SHDW_DRIVE_ENDPOINT}/${SHDW_ACCOUNT}/collection_logo.jpg`,
        external_url: "https://shaga.xyz",
        properties: {
            files: [
                {
                    uri: `${SHDW_DRIVE_ENDPOINT}/${SHDW_ACCOUNT}/collection_logo.jpg`,
                    type: "image/jpg",
                },
            ],
            category: "image",
        },
        description: `Shaga Test Collection`,
        seller_fee_basis_points: 500,
    };
    const imageLoaded = await loadImage("src/assets/images/shaga-logo-image.png");
    
    const files = [
        {
            name: `collection_metadata.json`,
            file: Buffer.from(JSON.stringify(collectionJson)),
        },
        {
            name: `collection_logo.jpg`,
            file: imageLoaded.src
        },
    ];
    // console.log(files)
    if (!SHDW_ACCOUNT) return; 

    const shdwResponse = await drive.uploadMultipleFiles(
        SHDW_ACCOUNT,
        files,
        3,
    );
    console.log(shdwResponse)
}

async function createShagaCollectionNFT() {
    const collectionAuthority = METADATA_UPLOADER;
    let collectionKeypair = Keypair.generate();

    console.log(
        `shaga devnet collection address: `,
        collectionKeypair.publicKey.toString(),
    );

    const newMintTransaction = await createShagaCollectionInstruction(
        DEVNET_CONNECTION, 
        collectionAuthority,
        collectionKeypair,
        collectionAuthority.publicKey,
        collectionAuthority.publicKey,
        collectionAuthority.publicKey,
        collectionKeypair.publicKey
    )

    const txn_id = await DEVNET_CONNECTION.sendTransaction(
        newMintTransaction,
        [collectionAuthority, collectionKeypair],
    );
    console.log(
        `transaction: https://solana.fm/tx/${txn_id}"?cluster=devnet"}`,
    );

}

async function main() {
    await createShagaCollectionNFT()
    process.exit()
}

main()