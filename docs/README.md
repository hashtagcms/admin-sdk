# Admin SDK Documentation

## Overview
The `@hashtagcms/admin-sdk` provides the core business logic, API helpers, and configuration management for the HashtagCMS Admin Panel. It is designed to be UI-agnostic, allowing it to be used in various JavaScript environments (Admin UI Kit, Node.js scripts, etc.).

## Installation
```bash
npm install @hashtagcms/admin-sdk
```

## Core Modules

### 1. `AdminConfig`
Handles the configuration passed from the Laravel backend to the frontend.
```javascript
import { AdminConfig } from '@hashtagcms/admin-sdk';
const config = new AdminConfig();
console.log(config.get('base_path'));
```

### 2. `Fetcher`
A wrapper around Axios for making API requests.
```javascript
import { Fetcher } from '@hashtagcms/admin-sdk';
const api = new Fetcher();
api.get('/api/users').then(response => ...);
```

### 3. `Storage`
A simple wrapper for key-value storage (compatible with `secure-ls` logic).
```javascript
import { Storage } from '@hashtagcms/admin-sdk';
const store = new Storage();
store.store('user_id', 123);
```

### 4. Utilities
Various helper functions.
```javascript
import { queryBuilder, CopyToClipboard, IsJson } from '@hashtagcms/admin-sdk';

// Get URL param
const id = queryBuilder.get('id');

// Copy text
CopyToClipboard('Hello World');
```
