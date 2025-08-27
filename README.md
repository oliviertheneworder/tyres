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
Use JSDelivr CDN for the best performance and reliability:

```
https://cdn.jsdelivr.net/gh/oliviertheneworder/tyres@latest/dist/index.js
```

### For Version-Specific Releases
Use specific version tags:

```
https://cdn.jsdelivr.net/gh/oliviertheneworder/tyres@v1.1.6/dist/index.js
```

### For Minified Version
JSDelivr automatically provides minified versions:

```
https://cdn.jsdelivr.net/gh/oliviertheneworder/tyres@latest/dist/index.min.js
```

## 🔄 Incremental Updates Workflow

1. **Make your changes** and commit them
2. **Create a new version tag**:
   ```bash
   npm version patch  # or minor/major
   git push origin main --tags
   ```
3. **JSDelivr automatically**:
   - Caches the new version
   - Makes it available via CDN
   - Updates the `latest` tag reference

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
Configure JDeliver to use the JSDelivr CDN URL:

```
https://cdn.jsdelivr.net/gh/oliviertheneworder/tyres@latest/dist/index.js
```

This ensures:
- ✅ URL never changes
- ✅ Automatic updates when new versions are released
- ✅ Global CDN for faster loading
- ✅ Automatic minification available
- ✅ Better caching and reliability

### JSDelivr Benefits
- **Global CDN** - Faster loading worldwide
- **Automatic minification** - Add `.min` to any JS/CSS file
- **Version ranges** - Use `@3.6` instead of `@3.6.4`
- **Latest version** - Use `@latest` for automatic updates
- **Reliable caching** - Better than GitHub Releases

## 📋 Version History

- **v1.1.6** - Modal nesting fix, improved z-index management
- **v1.1.5** - Previous version
- **v1.1.4** - Previous version
- **v1.1.3** - Previous version
- **v1.1.2** - Previous version
- **v1.1.1** - Previous version
- **v1.1.0** - Initial release

## 🤝 Contributing

1. Make changes in the `src/` directory
2. Test with `npm run watch`
3. Build with `npm run build`
4. Commit and tag a new version
5. Push to trigger automatic CDN update

## 📄 License

ISC License
