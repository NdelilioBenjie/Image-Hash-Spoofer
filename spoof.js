const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');

/**
 * Computes the hash of a buffer using a specified algorithm.
 * @param {Buffer} buffer - The file buffer.
 * @param {string} algorithm - Hashing algorithm (e.g., 'sha512').
 * @returns {string} - The computed hash.
 */
function computeHash(buffer, algorithm = 'sha512') {
    return crypto.createHash(algorithm).update(buffer).digest('hex');
}

/**
 * Appends a custom data block to the image for hash manipulation.
 * @param {Buffer} buffer - The image buffer.
 * @param {Buffer} block - Data to append to the image.
 * @returns {Buffer} - The modified image buffer.
 */
function appendCustomBlock(buffer, block) {
    return Buffer.concat([buffer, block]);
}

/**
 * Modifies an image to produce a hash starting with a given prefix.
 * @param {string} inputPath - Path to the input image.
 * @param {string} outputPath - Path to save the modified image.
 * @param {string} targetPrefix - Desired hash prefix (e.g., "24").
 * @param {string} algorithm - Hashing algorithm (default: 'sha512').
 * @returns {Promise<string|null>} - The hash of the modified file or null if no match is found.
 */
async function modifyImageForHash(inputPath, outputPath, targetPrefix, algorithm = 'sha512') {
    try {
        // Read and re-encode the image to ensure format integrity
        const imageBuffer = await sharp(inputPath).toBuffer();

        // Clone the original buffer for modification
        let modifiedBuffer = Buffer.from(imageBuffer);

        console.log(`Starting hash modification for target prefix: ${targetPrefix}`);

        // Extend the block size to increase the search space
        const blockSize = 6; // Adjust as needed for longer prefixes
        const block = Buffer.alloc(blockSize); // Create a block of `blockSize` bytes

        // Iterate over all possible combinations of the block
        const maxIterations = Math.pow(256, blockSize); // Total combinations
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            // Set the block values based on the iteration count
            for (let i = 0; i < blockSize; i++) {
                block[i] = (iteration >> (8 * i)) & 0xff; // Extract byte from iteration
            }

            // Append the block and compute the hash
            const candidateBuffer = appendCustomBlock(modifiedBuffer, block);
            const tempHash = computeHash(candidateBuffer, algorithm);

            // Check if the hash starts with the target prefix
            if (tempHash.startsWith(targetPrefix)) {
                // Save the modified buffer to the output file
                await fs.promises.writeFile(outputPath, candidateBuffer);
                console.log(`Match found! Appended block: ${block.toString('hex')}`);
                return tempHash;
            }

            // Periodic progress updates
            if (iteration % 1000000 === 0) {
                console.log(`Checked ${iteration}/${maxIterations} combinations...`);
            }
        }

        console.log('No matching hash found with the given prefix.');
        return null;
    } catch (error) {
        console.error('Error during hash modification:', error);
        return null;
    }
}

/**
 * Computes the hash of a file.
 * @param {string} filePath - Path to the image file.
 * @param {string} algorithm - Hashing algorithm (default: 'sha512').
 * @returns {string} - The computed hash.
 */
function computeFileHash(filePath, algorithm = 'sha512') {
    const buffer = fs.readFileSync(filePath); // Read file into buffer
    return crypto.createHash(algorithm).update(buffer).digest('hex');
}

// Main Function
(async () => {
    if (process.argv.length !== 5) {
        console.log('Usage: node spoof.js <target_prefix> <input_image> <output_image>');
        process.exit(1);
    }

    const targetPrefix = process.argv[2].replace(/^0x/, '').toLowerCase();
    const inputPath = process.argv[3];
    const outputPath = process.argv[4];

    // Check if the input file exists
    if (!fs.existsSync(inputPath)) {
        console.error(`Input file "${inputPath}" does not exist.`);
        process.exit(1);
    }

    // Compute the hash of the original image
    const originalHash = computeFileHash(inputPath);
    console.log('Original Image Hash:', originalHash);

    // Attempt to modify the image and produce the desired hash
    const modifiedHash = await modifyImageForHash(inputPath, outputPath, targetPrefix);
    if (modifiedHash) {
        console.log(`Success! Modified file saved to "${outputPath}" with hash: ${modifiedHash}`);

        // Verify that the modified image has a different hash and starts with the target prefix
        const modifiedImageHash = computeFileHash(outputPath);
        console.log('Modified Image Hash:', modifiedImageHash);

        // Check if the hash starts with the target prefix
        if (modifiedImageHash.startsWith(targetPrefix)) {
            console.log(`Success! The modified image hash starts with ${targetPrefix}.`);
        } else {
            console.log(`No match! The modified image hash doesn't start with ${targetPrefix}.`);
        }

        // Compare the original and modified hashes
        if (originalHash !== modifiedImageHash) {
            console.log('The image has been successfully modified.');
        } else {
            console.log('The image is the same as the original.');
        }
    } else {
        console.log('Failed to produce a matching hash.');
    }
})();
