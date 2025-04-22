import fs from 'fs'
import path from 'path'

export function fighterGallery(id: string): number {
    const dirPath = path.join(process.cwd(), 'public', 'images', 'fighters', 'gallery', id)

    try {
        const files = fs.readdirSync(dirPath)
        const webpFiles = files.filter((file) => file.endsWith('.webp'))

        return webpFiles.length
    } catch (error) {
        return 0
    }
}