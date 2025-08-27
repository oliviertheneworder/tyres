const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2); // Capture command-line arguments
const isWatch = args.includes('--watch'); // Check if `--watch` is passed

// Read package.json for version info
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version;

async function build() {
    console.log(`🚀 Building Tyres JS v${version}...`);
    
    const context = await esbuild.context({
        entryPoints: ['./src/main.js'], // Main file importing all others
        bundle: true,
        outfile: './dist/index.js', // Output file
        minify: true, // Optional: Minify for production
        sourcemap: true, // Optional: Generate sourcemaps
        treeShaking: true, // Optional: Remove unused code
        define: {
            'process.env.VERSION': JSON.stringify(version),
            'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
        },
        banner: {
            js: `/* Tyres JS v${version} - Built on ${new Date().toISOString()} */\n`
        }
    });

    if (isWatch) {
        console.log("👀 Watching for changes...");
        await context.watch();
    } else {
        console.log("🔨 Building...");
        const result = await context.rebuild(); // Build once
        
        // Log build stats
        const outputSize = fs.statSync('./dist/index.js').size;
        const mapSize = fs.statSync('./dist/index.js.map').size;
        
        console.log("✅ Build succeeded!");
        console.log(`📦 Output: dist/index.js (${(outputSize / 1024).toFixed(2)} KB)`);
        console.log(`🗺️  Sourcemap: dist/index.js.map (${(mapSize / 1024).toFixed(2)} KB)`);
        console.log(`📊 Total size: ${((outputSize + mapSize) / 1024).toFixed(2)} KB`);
        
        await context.dispose();
    }
}

build().catch((error) => {
    console.error("❌ Build failed:", error);
    process.exit(1);
});