# Utilities

A collection of pure utility functions for data parsing, string manipulation, and browser interactions.

---

## 📋 Data Parsing

### `SafeJsonParse`
Safely parses props that might be JSON strings or already objects.
```javascript
import { SafeJsonParse } from '@hashtagcms/admin-sdk';
const items = SafeJsonParse(this.sitesProp, []);
```

### `SafeErrorData`
Extracters error messages from Axios responses safely.
```javascript
import { SafeErrorData } from '@hashtagcms/admin-sdk';
fetcher.get('/url').catch(err => {
    const data = SafeErrorData(err);
    alert(data.message);
});
```

---

## 🔗 URL & Clipboard

### `QueryBuilder`
Access URL query parameters.
```javascript
import { QueryBuilder } from '@hashtagcms/admin-sdk';
const id = QueryBuilder.get('id');
const allParams = QueryBuilder.all();
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
