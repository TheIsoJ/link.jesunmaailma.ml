import fs from "fs/promises"

async function main() {
    await fs.rm("dist", { recursive: true, force: true })
    console.log("dist-kansio poistettu.")
}

main()