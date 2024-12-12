
# Image Hash Spoofer

This project, **Image Hash Spoofer**, provides a Node.js-based script (`spoof.js`) that modifies an image file to achieve a desired hash value. By appending custom data to the image, the script generates a new file whose hash starts with a specified prefix, such as "24". This technique leverages cryptographic hashing algorithms to manipulate file contents without affecting their core functionality or readability.

---

## **Features**

- **Hash Modification**: Alters the content of an image file to produce a cryptographic hash starting with a given prefix.
- **Customizable Algorithm**: Supports a wide range of hashing algorithms (default: `sha512`).
- **Image Preservation**: Uses the `sharp` library to process images without changing their visual integrity.
- **Validation**: Verifies and outputs both the original and modified file hashes for comparison.
- **Progress Reporting**: Displays progress updates during the hash manipulation process.

---

## **How It Works**

The script takes an input image and a target hash prefix, then iteratively appends data blocks to the image buffer until a hash starting with the desired prefix is achieved. The modified image is then saved to a specified output path.

---

## **Prerequisites**

1. **Node.js Installed**: Ensure you have Node.js installed on your machine. Download it from [Node.js Official Website](https://nodejs.org/).
2. **Dependencies**: Install the required Node.js packages:
   - `sharp`: For image processing.
   - `crypto`: For computing cryptographic hashes (comes with Node.js).

Install the dependencies by running the following command:
```bash
npm install sharp
```

---

## **Usage**

### **1. Clone the Repository**

```bash
git clone https://github.com/NdelilioBenjie/Image-Hash-Spoofer.git
cd image-hash-spoofer
```

### **2. Script Syntax**

```bash
node spoof.js <target_prefix> <input_image> <output_image>
```

- `<target_prefix>`: The desired prefix for the hash (e.g., `24` for a hash starting with "24").
- `<input_image>`: Path to the original image file (e.g., `input.jpg`).
- `<output_image>`: Path to save the modified image file (e.g., `output.jpg`).

### **3. Example Command**

Suppose you have an image file named `input.jpg` and want to modify it so that its hash starts with "24". You can run:

```bash
node spoof.js 24 input.jpg output.jpg
```

---

## **Step-by-Step Guide**

1. **Prepare Your Environment**:
   - Install Node.js.
   - Clone the repository.
   - Install the `sharp` library using `npm install sharp`.

2. **Run the Script**:
   Use the command syntax to specify the target hash prefix, input image path, and output image path.

3. **View the Output**:
   - The script will display:
     - The original image hash.
     - Progress updates during hash manipulation.
     - The modified image hash.
   - The modified file will be saved to the specified output path.

4. **Validation**:
   The script checks if the modified hash starts with the target prefix and compares the original and modified hashes to confirm changes.

---

## **Script Output**

- **Example Output**:
   ```bash
   Original Image Hash: abcd1234efgh5678...
   Starting hash modification for target prefix: 24
   Checked 1000000/281474976710656 combinations...
   Match found! Appended block: 1a2b3c4d5e6f
   Success! Modified file saved to "output.jpg" with hash: 24bc56defg...
   Modified Image Hash: 24bc56defg...
   Success! The modified image hash starts with 24.
   The image has been successfully modified.
   ```

---

## **Additional Notes**

- The script uses brute force to find a match, which can take significant time for long prefixes. For practical usage, keep prefixes short (e.g., 2-4 characters).
- Ensure adequate storage and processing power when running the script, as it iterates over millions of combinations.

---

## **Dependencies**

The project relies on:
- **`sharp`**: For reading and writing images.
- **`crypto`**: Built-in Node.js module for cryptographic operations.
- **`fs`**: File system module to handle file reading and writing.

Install dependencies using:

```bash
npm install sharp
```

---

## **Contributing**

Contributions are welcome! If you have ideas for optimization or additional features, feel free to fork the repository and submit a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
