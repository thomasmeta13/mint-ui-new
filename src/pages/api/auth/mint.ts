import { Wallet } from '@project-serum/anchor'
import { ShadowEditResponse, ShadowFile, ShdwDrive } from '@shadow-drive/sdk'
import {
    ComputeBudgetProgram,
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
} from '@solana/web3.js'
import bs58 from 'bs58'
import formidable from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'
import { createNewMintInstructions } from 'utils/shagaMintTransaction'
import { Writable } from 'stream'
import { sign } from 'tweetnacl'
import { createLegacyTransaction } from 'utils/createTransaction'
import { getShdwAccountByName } from 'utils/shdwUtils'
import { PassportPrices } from 'data/Register'

export const config = {
    api: {
        bodyParser: false,
    },
}

export const SHDW_STORAGE_ENDPOINT = 'https://shadow-storage.genesysgo.net'
export const SHDW_DRIVE_ENDPOINT = 'https://shdw-drive.genesysgo.net'

const fileConsumer = (chunks: any, file: any) => {
    const writable = new Writable({
        write: (chunk, _enc, next) => {
            if (!chunks[file.newFilename]) {
                chunks[file.newFilename] = []
            }
            chunks[file.newFilename].push(chunk)
            next()
        },
    })

    return writable
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const fileType = 'application/octet-stream'

        const chunks: any = {}
        const form = formidable({
            multiples: true,
            maxFileSize: 10 * 1024 * 1024, // 10 MB
            uploadDir: undefined,
            filename: (_name, _ext, part) => {
                const filename = `${part.name || 'unknown'}`
                console.log(filename)
                return filename
            },
            fileWriteStreamHandler: (file: any) => fileConsumer(chunks, file),
        })
        let fields
        let model
        try {
            ;[fields, model] = await form.parse(req)
            const { publicKey, title, domain, tier } = fields
            if (publicKey) {
                if (
                    // @ts-ignore
                    fileType != model.file[0].mimetype
                ) {
                    res.status(500).end(`incorrect mimetype`)
                    return
                }
                // access image buffers
                // console.log(chunks)
                // console.log(chunks["file"][0]);
                // @ts-ignore
                // console.log(model)

                // must be in mainnet
                const CONNECTION = new Connection(
                    process.env.NEXT_PUBLIC_HELIUS_API
                )
                const DEVNET_CONNECTION = new Connection(
                    'https://gwenneth-fpqx5g-fast-devnet.helius-rpc.com/'
                )

                const chosenTier = PassportPrices.find((passportTier) => {
                    passportTier.title === tier
                })
                const passportPrice = chosenTier && chosenTier.priceLamports

                // fail if tier is not found.
                if (!passportPrice) {
                    res.status(500).end(`tier not found`)
                    return
                }

                const userBalance = await DEVNET_CONNECTION.getBalance(
                    new PublicKey(publicKey.solanaAddress)
                )
                console.log(userBalance)

                // fail if user balance is not enuff
                if (passportPrice > userBalance) {
                    res.status(500).end(`user balance not enough`)
                    return
                }

                // get collection auth and shdw privkey
                const KeypairBuffer = Buffer.from([
                    151, 213, 125, 98, 172, 13, 118, 150, 107, 222, 7, 140, 209,
                    252, 209, 89, 225, 61, 197, 234, 12, 99, 89, 178, 22, 225,
                    86, 148, 177, 182, 191, 117, 154, 17, 36, 29, 233, 248, 155,
                    143, 106, 8, 49, 157, 208, 114, 36, 78, 115, 254, 121, 21,
                    148, 188, 108, 161, 233, 142, 84, 140, 188, 189, 57, 167,
                ])
                const METADATA_UPLOADER = Keypair.fromSecretKey(KeypairBuffer)

                const WALLET = new Wallet(METADATA_UPLOADER)

                const drive = await new ShdwDrive(CONNECTION, WALLET).init()

                let SHDW_ACCOUNT = await getShdwAccountByName(
                    drive,
                    `Shaga Pass Test`
                )

                if (!SHDW_ACCOUNT) {
                    res.status(500).end(`could not find a Shadow account`)
                    return
                }

                const metadataJson = {
                    name: domain[0],
                    description: title[0],
                    symbol: 'Shaga Pass',
                    seller_fee_basis_points: 0,
                    image: `${SHDW_DRIVE_ENDPOINT}/${SHDW_ACCOUNT}/${domain[0]}.glb`,
                    animation_url: `${SHDW_DRIVE_ENDPOINT}/${SHDW_ACCOUNT}/${domain[0]}.glb`,
                    external_url: `https://shaga-mint.vercel.com/${domain[0]}`,
                    properties: {
                        files: [
                            {
                                url: `${SHDW_DRIVE_ENDPOINT}/${SHDW_ACCOUNT}/${domain[0]}.glb`,
                                type: 'vr/glb',
                            },
                        ],
                        category: 'vr',
                        creators: [
                            {
                                address: METADATA_UPLOADER.publicKey,
                                share: 100,
                            },
                        ],
                    },
                    collection: {
                        name: 'Shaga Pass 3D NFT',
                        family: '3D NFT',
                    },
                    attributes: [],
                }

                const mergedBuffer = Buffer.concat(chunks['file'])
                const files = [
                    {
                        // @ts-ignore
                        name: `${domain}.glb`,
                        file: mergedBuffer,
                    },
                    {
                        // @ts-ignore
                        name: `${domain}.json`,
                        file: Buffer.from(JSON.stringify(metadataJson)),
                    },
                ]

                // console.log(files)
                // we will handle the errors one by one rather the mint failing.
                try {
                    const shdwResponse = await drive.uploadMultipleFiles(
                        SHDW_ACCOUNT,
                        files,
                        3
                    )
                } catch {}
                let mintKeypair = Keypair.generate()
                const shagaCollection = new PublicKey(
                    'DkwcZbYaaf8ujp3segYFNUJgptCT4pAP6L7GzQK47Qfh'
                )
                const userPubKey = new PublicKey(publicKey[0])
                const createMintInstruction = await createNewMintInstructions(
                    DEVNET_CONNECTION,
                    userPubKey,
                    mintKeypair,
                    userPubKey,
                    userPubKey,
                    userPubKey,
                    domain[0],
                    METADATA_UPLOADER.publicKey,
                    shagaCollection
                )
                const solanaTransferTreasury = SystemProgram.transfer({
                    fromPubkey: userPubKey,
                    // TODO: change this later.
                    toPubkey: METADATA_UPLOADER.publicKey,
                    lamports: passportPrice,
                })
                const latestBlockHash =
                    await DEVNET_CONNECTION.getLatestBlockhash('confirmed')

                const computeBudgetProgramIx =
                    ComputeBudgetProgram.setComputeUnitLimit({
                        units: 500000,
                    })
                const mintTransaction = createLegacyTransaction(
                    userPubKey,
                    [
                        computeBudgetProgramIx,
                        solanaTransferTreasury,
                        ...createMintInstruction,
                    ],
                    latestBlockHash.blockhash,
                    latestBlockHash.lastValidBlockHeight
                )
                mintTransaction.partialSign(METADATA_UPLOADER)
                mintTransaction.partialSign(mintKeypair)

                const serializedTxn = mintTransaction.serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                })
                const base64EncodedTxn =
                    Buffer.from(serializedTxn).toString('base64')
                res.status(200).json({
                    status: 'success',
                    error: null,
                    msg: null,
                    uri: `${SHDW_DRIVE_ENDPOINT}/${SHDW_ACCOUNT}/${domain[0]}.json`,
                    mintAddress: mintKeypair.publicKey,
                    transaction: base64EncodedTxn,
                    ...latestBlockHash,
                })
            }
        } catch (err: any) {
            console.error(err)
            res.writeHead(err.httpCode || 400, {
                'Content-Type': 'text/plain',
            })
            res.end(String(err))
            return
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

//upload file in shadow with retry
async function editFileExtra(
    drive: ShdwDrive,
    key: PublicKey,
    url: string,
    data: File | ShadowFile
): Promise<ShadowEditResponse> {
    try {
        return await drive.editFile(key, url, data)
    } catch (e) {
        console.log(e)
        // await delay(1500)
        return await drive.editFile(key, url, data)
    }
}
