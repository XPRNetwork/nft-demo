
# Monster NFTs

- [API Documentation](https://test.proton.api.atomicassets.io/atomicassets/docs/swagger/)

## Marketplace

The marketplace page consists of templates of a specific `collection_name`. These templates are fetched with the `getTemplatesByCollection` and `parseTemplatesForLowestPrice` functions in `services/templates.ts`.

### Custom flags

- The `parseTemplatesForLowestPrice` function extends the `Template` object by adding the following custom property: `lowestPrice`.
  - `lowestPrice` (string) is determined by checking the Sales API for assets listed for sale and using an asset's `listing_price` and `listing_symbol`

## Collection

The collection page consists of a current user's assets. Each user is only allowed to view their own collection page. These assets are fetched with the `getUserAssets` and `findMySaleItems` functions in `services/assets.ts`.

### Custom flags

- The `findMySaleItems` function extends the `Asset` object by adding the following custom properties: `isForSale` and `salePrice`.
  - `isForSale` (boolean) is determined by checking the Sales API for listed sales with the same `asset_id` and `seller` (current user's `chainAccount`)
  - `salePrice` (string) is determined by checking the Sales API and listing an asset's `listing_price` and `listing_symbol`
