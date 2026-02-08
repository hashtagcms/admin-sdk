# Core Modules

The core modules handle the foundational logic for configuration, networking, and data management.

---

## 1. `AdminConfig`
Handles configuration passed from the backend. It automatically looks for `window.HashtagCms.adminConfig`.

### Usage
```javascript
import { AdminConfig } from '@hashtagcms/admin-sdk';
const config = new AdminConfig();

// Get values
const basePath = config.get('base_path', '/admin');

// Build URLs
const usersUrl = config.admin_path('users/list'); // '/admin/users/list'
const profileUrl = config.admin_path('profile', { id: 5 }); // '/admin/profile?id=5'

// Build Asset URLs
const logo = config.admin_asset('img/logo.png');
```

---

## 2. `Fetcher`
A lightweight wrapper around Axios for standardizing API calls.

```javascript
import { Fetcher } from '@hashtagcms/admin-sdk';
const api = new Fetcher();

api.get('/api/data').then(res => console.log(res.data));
api.post('/api/save', { name: 'New Item' });
```

---

## 3. `Form` & `Errors`
Simplifies form data management and Laravel-style validation error handling.

### Usage
```javascript
import { Form } from '@hashtagcms/admin-sdk';

const myForm = new Form({
    name: 'John Doe',
    email: 'john@example.com'
});

// Update data
myForm.name = 'Jane Doe';

// Submit (returns Promise)
myForm.post('/api/user/update')
    .then(data => console.log('Saved!'))
    .catch(error => {
        if (myForm.errors.has('email')) {
            console.log(myForm.errors.get('email'));
        }
    });

// Reset form to original data
myForm.reset();
```

---

## 4. `Storage` & `Store`
A storage wrapper that works in memory and can optionally persist to `localStorage`.

```javascript
import { Storage, Store } from '@hashtagcms/admin-sdk';

// Default singleton (In-Memory)
Store.store('theme', 'dark');
const theme = Store.fetch('theme');

// Persistent Storage
const local = new Storage({ persistent: true, prefix: 'app_' });
local.store('user_token', 'xyz123');
```
