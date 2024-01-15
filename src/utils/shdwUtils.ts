import {
    ShadowEditResponse,
    ShadowFile,
    ShadowUploadResponse,
    ShdwDrive,
} from '@shadow-drive/sdk'
import { PublicKey } from '@solana/web3.js'
import delay from 'delay'

// upload file in shadow with retry
export async function editFileExtra(
    drive: ShdwDrive,
    key: PublicKey,
    url: string,
    data: File | ShadowFile
): Promise<ShadowEditResponse> {
    try {
        return await drive.editFile(key, url, data)
    } catch (e) {
        console.log(e)
        await delay(1500)
        return await drive.editFile(key, url, data)
    }
}

// upload file to shadow with retry
export async function uploadFileExtra(
    drive: ShdwDrive,
    key: PublicKey,
    data: File | ShadowFile
): Promise<ShadowUploadResponse> {
    try {
        return await drive.uploadFile(key, data)
    } catch (e) {
        console.log(e)
        await delay(1500)
        return await drive.uploadFile(key, data)
    }
}

export async function getShdwAccountByName(drive: ShdwDrive, name: string) {
    const storageAccounts = await drive.getStorageAccounts()

    const filteredAccounts = storageAccounts.filter(
        (storageAccount) => storageAccount.account.identifier == name
    )

    if (filteredAccounts.length == 1) {
        return storageAccounts.filter(
            (storageAccount) => storageAccount.account.identifier == name
        )[0].publicKey
    } else {
        return false
    }
}
