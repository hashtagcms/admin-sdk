# Getting Started

The `@hashtagcms/admin-sdk` provides the core business logic, API helpers, and configuration management for the HashtagCms Admin Panel. It is designed to be UI-agnostic, allowing it to be used in various JavaScript environments (Admin UI Kit, Node.js scripts, etc.).

---

## 📦 Installation

```bash
npm install @hashtagcms/admin-sdk
```

---

## 🚀 Basic Usage

The SDK supports multiple module formats for different environments.

### Modern (ESM / Bundlers)
```javascript
import HashtagCmsAdmin, { Fetcher, Storage } from '@hashtagcms/admin-sdk';

// 1. Configure
HashtagCmsAdmin.AdminConfig.set('api_url', 'https://api.example.com');

// 2. Fetch data
const api = new Fetcher();
api.get('/data').then(res => ...);
```

### Node.js (CommonJS)
```javascript
const HashtagCmsAdmin = require('@hashtagcms/admin-sdk');
const api = new HashtagCmsAdmin.Fetcher();
```

### Browser (UMD / Direct Script)
Include the script from your `node_modules` or a CDN:
```html
<script src="path/to/admin-sdk/dist/index.umd.js"></script>
<script>
    // Automatically exposed as window.HashtagCmsAdmin
    const config = HashtagCmsAdmin.AdminConfig;
    const api = new HashtagCmsAdmin.Fetcher();
</script>
```

---

## 📑 Next Steps

- Explore the [Core Modules](./02-core-modules.md) (AdminConfig, Fetcher, etc.)
- Use [Advanced Modules](./03-advanced-modules.md) for Maps and Analytics.
- Check [Utility functions](./04-utilities.md) for common tasks.
