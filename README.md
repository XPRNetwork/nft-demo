
# Monsters NFT Demo

This demo shows the basic functionality of NFTs on the Proton chain. Through the use of the [Proton Web SDK](https://www.npmjs.com/package/@proton/web-sdk), this demo allows for purchasing and 
selling of `monsters` NFT.

This is built off of atomicassets NFT framework.

- [API Documentation for atomicassets](https://test.proton.api.atomicassets.io/atomicassets/docs/swagger/)
- [API Documentation for atomicmarket](https://test.proton.api.atomicassets.io/atomicmarket/docs/swagger/)

The demo uses FOOBAR as a currency to buy and sell the monster NFTs. To get some FOOBAR tokens, 
use the [FOOBAR Faucet](https://foobar.protonchain.com).

## To build and run locally

### Docker

Run a docker container:

```
docker build nft-demo .

docker images

docker run -p 3000:3000 -i -d [image id]
```

### npm

```
git clone https://github.com/ProtonProtocol/nft-demo.git

npm install

npm run dev
```

## Environment

Create a copy of `.env.template` and name it `.env.local`:

For mainnet:
```
NFT_ENDPOINT='https://proton.api.atomicassets.io'
NEXT_PUBLIC_CHAIN_ID='384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0'
NEXT_PUBLIC_CHAIN_ENDPOINT='https://proton.greymass.com'
```

For testnet:
```
NFT_ENDPOINT='https://test.proton.api.atomicassets.io'
NEXT_PUBLIC_CHAIN_ID='71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd'
NEXT_PUBLIC_CHAIN_ENDPOINT='https://testnet.protonchain.com'
```

## Marketplace

The marketplace page consists of templates of a specific `collection_name`.

### Custom flags

- The `Template` object is extended with the following custom properties: `lowestPrice` and `highestPrice`.
  - `lowestPrice` (string) is determined by checking the Sales API for assets listed for sale and finding the lowest price of the assets of that particular template.
  - `highestPrice` (string) is determined by checking the Sales API and finding the highest price of the assets of that particular template.

## My NFTs

The `My NFTs` page consists of the current user's assets. Each user is only allowed to view their own collection page in this demo.

### Custom flags

- The `Asset` object is extended with the following custom properties: `isForSale` and `salePrice`.
  - `isForSale` (boolean) is determined by checking the Sales API for currently listed sales using the `asset_id` and `seller` (current user's `chainAccount`)
  - `salePrice` (string) is determined by checking the Sales API and combining an asset's `listing_price` and `listing_symbol`
