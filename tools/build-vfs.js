// tools/build-vfs.js
const fs = require("fs");
const path = require("path");

const fontsDir = path.join(__dirname, "..", "fonts");
const outFile = path.join(__dirname, "..", "vfs_fonts.js");

// غيّر الأسماء هنا لو ملفاتك مختلفة
const files = [
    "Inter-Regular.ttf",
    "Inter-Bold.ttf",
    "Inter-Black.ttf",
];

const vfs = {};
for (const file of files) {
    const fullPath = path.join(fontsDir, file);
    if (!fs.existsSync(fullPath)) {
        console.error("❌ File not found:", fullPath);
        process.exit(1);
    }
    const data = fs.readFileSync(fullPath).toString("base64");
    vfs[file] = data;
}

const content =
    `// Auto-generated VFS for pdfMake
(function(){
  if (typeof pdfMake === 'undefined') {
    throw new Error('pdfMake is not loaded yet. Load pdfmake.min.js before vfs_fonts.js');
  }
  pdfMake.vfs = Object.assign(pdfMake.vfs || {}, ${JSON.stringify(vfs, null, 2)});
})();`;

fs.writeFileSync(outFile, content, "utf8");
console.log("✅ Generated:", outFile);
