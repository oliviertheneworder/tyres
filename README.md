# Tyres JS Library

A JavaScript library for Tyremart/Tyreworx website functionality including modal management, tyre filtering, and interactive features.

## 🚀 Quick Start

### Development
```bash
npm install
npm run watch  # Development with hot reload
```

### Production Build
```bash
npm run build
```

## 📦 Deployment Strategy

### For JDeliver (Recommended)
Use the **`latest`** tag for consistent URLs:

```
https://github.com/oliviertheneworder/tyres/releases/latest/download/index.js
```

### For Version-Specific Releases
Use version tags for specific releases:

```
https://github.com/oliviertheneworder/tyres/releases/download/v1.1.4/index.js
```

## 🔄 Incremental Updates Workflow

1. **Make your changes** and commit them
2. **Create a new version tag**:
   ```bash
   npm version patch  # or minor/major
   git push origin main --tags
   ```
3. **GitHub Actions automatically**:
   - Builds the project
   - Creates a GitHub Release
   - Updates the `latest` tag
   - Makes files available for download

## 🏗️ Build Process

The build process:
- Bundles all source files into `dist/index.js`
- Generates source maps for debugging
- Includes version information in the output
- Minifies for production
- Removes unused code (tree shaking)

## 📁 Project Structure

```
src/
├── main.js          # Main entry point
├── gsap.js          # Modal and animation functionality
├── filter-tyres.js  # Tyre filtering logic
├── find-tyres.js    # Tyre search functionality
├── tyre-size.js     # Tyre size calculations
├── cookies.js       # Cookie consent management
├── otp.js           # OTP functionality
└── wized-api.js     # API integrations
```

## 🔧 Configuration

### JDeliver Setup
Configure JDeliver to use the `latest` tag URL for automatic updates:

```
https://github.com/oliviertheneworder/tyres/releases/latest/download/index.js
```

This ensures:
- ✅ URL never changes
- ✅ Automatic updates when new versions are released
- ✅ Easy rollback by changing the tag reference

## 📋 Version History

- **v1.1.4** - Modal nesting fix, improved z-index management
- **v1.1.3** - Previous version
- **v1.1.2** - Previous version
- **v1.1.1** - Previous version
- **v1.1.0** - Initial release

## 🤝 Contributing

1. Make changes in the `src/` directory
2. Test with `npm run watch`
3. Build with `npm run build`
4. Commit and tag a new version
5. Push to trigger automatic release

## 📄 License

ISC License
