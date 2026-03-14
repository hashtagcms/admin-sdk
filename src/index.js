import { AdminConfig } from './admin-config';
import { Fetcher } from './fetcher';
import Form, { Errors } from './form';
import MapAPI from './map';
import { Dashboard } from './dashboard';
import { LeftMenu } from './left-menu';
import { Storage, Store } from './storage';
import { QueryBuilder, Utils, CopyToClipboard, PasteFromClipboard, IsJson, Humanize, CleanForUrl, TitleCase, SafeJsonParse, SafeErrorData } from './utils';

// Export individual modules
export {
    AdminConfig,
    Fetcher,
    Form,
    Errors,
    MapAPI,
    Dashboard,
    LeftMenu,
    Storage,
    Store,
    QueryBuilder,
    Utils,
    CopyToClipboard,
    PasteFromClipboard,
    IsJson,
    Humanize,
    CleanForUrl,
    TitleCase,
    SafeJsonParse,
    SafeErrorData
};

const HashtagCmsAdmin = {
    AdminConfig,
    Fetcher,
    Form,
    Errors,
    MapAPI,
    Dashboard,
    LeftMenu,
    Storage,
    Store,
    QueryBuilder,
    Utils,
    CopyToClipboard,
    PasteFromClipboard,
    IsJson,
    Humanize,
    CleanForUrl,
    TitleCase,
    SafeJsonParse,
    SafeErrorData
};

// Global exposure for browser/UMD
if (typeof window !== 'undefined') {
    window.HashtagCmsAdmin = HashtagCmsAdmin;
}

export default HashtagCmsAdmin;
