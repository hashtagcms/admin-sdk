# Utilities

A collection of pure utility functions for data parsing, string manipulation, and browser interactions.

---

## 📋 Data Parsing

### `parseProp`
Safely parses props that might be JSON strings or already objects.
```javascript
import { parseProp } from '@hashtagcms/admin-sdk';
const items = parseProp(this.sitesProp, []);
```

### `safeErrorData`
Extracts error messages from Axios responses safely.
```javascript
import { safeErrorData } from '@hashtagcms/admin-sdk';
fetcher.get('/url').catch(err => {
    const data = safeErrorData(err);
    alert(data.message);
});
```

---

## 🔗 URL & Clipboard

### `queryBuilder`
Access URL query parameters.
```javascript
import { queryBuilder } from '@hashtagcms/admin-sdk';
const id = queryBuilder.get('id');
const allParams = queryBuilder.all();
```

### Clipboard
```javascript
import { CopyToClipboard, PasteFromClipboard } from '@hashtagcms/admin-sdk';

CopyToClipboard('Text to copy');
const text = await PasteFromClipboard();
```

---

## ✍️ String Formatting

### `Humanize`
```javascript
import { Humanize } from '@hashtagcms/admin-sdk';
Humanize('user_first_name'); // 'User first name'
```

### `TitleCase`
```javascript
import { TitleCase } from '@hashtagcms/admin-sdk';
TitleCase('my.setting_key'); // 'My setting key'
```

### `CleanForUrl`
```javascript
import { CleanForUrl } from '@hashtagcms/admin-sdk';
CleanForUrl('About Us'); // 'About-Us'
```
