import * as dotenv from 'dotenv';
dotenv.config();

export const environment = {
    NETWORK_NAME: process.env.NETWORK_NAME !== undefined ? process.env.NETWORK_NAME : 'NetworkName',
    RPC: process.env.RPC || 'https://rpc.example.com',
    CHAIN_ID: parseInt(process.env.CHAIN_ID || '1', 10), 
    SYMBOL: process.env.SYMBOL || 'ETH',
    PRIVATE_KEY: process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : 'PrivateKey',
    PRIVATE_KEY_CREATE_NETWORK: process.env.PRIVATE_KEY_CREATE_NETWORK !== undefined ? process.env.PRIVATE_KEY_CREATE_NETWORK : 'PrivateKeyCreateNetwork',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000/',
    WALLET_ADDRESS: process.env.WALLET_ADDRESS !== undefined ? process.env.WALLET_ADDRESS : '0x000000000000'
}
