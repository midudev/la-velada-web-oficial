import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '../public')
const BLUR_DATA_FILE = path.join(__dirname, '../src/blur-placeholders.json')

const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

async function generateBlurPlaceholder(imagePath) {
    try {
        const imageBuffer = await sharp(imagePath)
            .resize(10) // tiny size
            .webp({ quality: 20 }) // convert to webp with low quality
            .toBuffer()

        // Convert to base64
        return `data:image/webp;base64,${imageBuffer.toString('base64')}`
    } catch (error) {
        console.error(`Error processing ${imagePath}:`, error)
        return null
    }
}

async function* walkDirectory(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true })
    for (const file of files) {
        const res = path.resolve(dir, file.name)
        if (file.isDirectory()) {
            yield* walkDirectory(res)
        } else {
            yield res
        }
    }
}

async function generatePlaceholders() {
    const blurData = {}
    let count = 0

    try {
        for await (const filePath of walkDirectory(PUBLIC_DIR)) {
            const ext = path.extname(filePath).toLowerCase()
            if (VALID_EXTENSIONS.includes(ext)) {
                const relativePath = path.relative(PUBLIC_DIR, filePath)
                console.log(`Processing: ${relativePath}`)

                const placeholder = await generateBlurPlaceholder(filePath)
                if (placeholder) {
                    blurData[`/${relativePath}`] = placeholder
                    count++
                }
            }
        }

        // Save the blur data
        await fs.writeFile(
            BLUR_DATA_FILE,
            JSON.stringify(blurData, null, 2)
        )

        console.log(`✅ Generated blur placeholders for ${count} images`)
        console.log(`📝 Data saved to ${path.relative(process.cwd(), BLUR_DATA_FILE)}`)
    } catch (error) {
        console.error('Error generating placeholders:', error)
        process.exit(1)
    }
}

generatePlaceholders() 