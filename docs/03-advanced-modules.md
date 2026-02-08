# Advanced Modules

Common tools for specialized admin features like mapping, analytics, and layout events.

---

## 1. `MapAPI`
Integration with MapQuest for geocoding.

```javascript
import { MapAPI } from '@hashtagcms/admin-sdk';

const map = new MapAPI('YOUR_MAPQUEST_KEY');
map.init(); // Loads JS/CSS resources into DOM

const res = await map.getLatLong('1600 Pennsylvania Ave, Washington DC');
const parsed = map.parseResults(res);
console.log(parsed[0].latLng);
```

---

## 2. `Dashboard`
Helper for processing analytics data for Chart.js.

```javascript
import { Dashboard } from '@hashtagcms/admin-sdk';

const analyticsData = {
    categories: [{ link_rewrite: 'blog', read_count: 50 }],
    pages: [{ link_rewrite: 'about', read_count: 20 }]
};

Dashboard.init(analyticsData, {
    topCategoriesId: 'myBarChart',
    topContentsId: 'myContentChart'
});
```

---

## 3. `LeftMenu`
Manages the layout state of the Admin sidebar and emits events.

```javascript
import { LeftMenu } from '@hashtagcms/admin-sdk';

// Initialize with an optional event emitter
LeftMenu.init(eventBus);

// Toggle visibility
LeftMenu.toggleShow();

// Check state
console.log(LeftMenu.isVisible());
```
