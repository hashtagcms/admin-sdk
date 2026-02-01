import { AdminConfig } from '../src/admin-config';

describe('AdminConfig Class', () => {
    let originalWindowLaravel;

    beforeAll(() => {
        originalWindowLaravel = window.Laravel;
        window.Laravel = {
            adminConfig: {
                base_path: 'https://example.com/admin',
                app_url: 'https://example.com',
                theme_assets: 'assets/theme',
                media_path: 'https://cdn.example.com',
                custom_setting: 'foobar'
            }
        };
    });

    afterAll(() => {
        window.Laravel = originalWindowLaravel;
    });

    it('retrieves config values from window.Laravel', () => {
        const config = new AdminConfig();
        expect(config.get('custom_setting')).toBe('foobar');
    });

    it('returns default value if key missing', () => {
        const config = new AdminConfig();
        expect(config.get('missing_key', 'default')).toBe('default');
    });

    it('constructs admin_path correctly', () => {
        const config = new AdminConfig();
        
        // No params
        expect(config.admin_path('dashboard')).toBe('https://example.com/admin/dashboard');

        // With params
        expect(config.admin_path('users', { page: 1, sort: 'desc' }))
            .toBe('https://example.com/admin/users?page=1&sort=desc');
    });

    it('constructs admin_asset paths correctly', () => {
        const config = new AdminConfig();
        expect(config.admin_asset('css/app.css'))
            .toBe('https://example.com/assets/theme/css/app.css');
    });

    it('constructs media paths correctly', () => {
        const config = new AdminConfig();
        expect(config.get_media('images/logo.png'))
            .toBe('https://cdn.example.com/images/logo.png');
    });
});
