import { createTablesIfNotExists } from '../src/infra/db/create-db-payment'

async function main() {
  await createTablesIfNotExists()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
