import { Utils, IsJson, CopyToClipboard, queryBuilder } from '../src/utils';

describe('Utils Class', () => {
    let mockForm;

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="test-form">
                <input type="text" name="username" value="johndoe">
                <input type="email" name="email" value="john@example.com">
                <input type="checkbox" name="subscribe" checked>
                <input type="checkbox" name="terms">
                <select name="role">
                    <option value="user" selected>User</option>
                    <option value="admin">Admin</option>
                </select>
                <select name="tags" multiple>
                    <option value="js" selected>JS</option>
                    <option value="php" selected>PHP</option>
                    <option value="python">Python</option>
                </select>
                <input type="submit" value="Submit">
                <input type="button" value="Cancel">
            </form>
        `;
        mockForm = document.getElementById('test-form');
    });

    it('serializeFormArray transforms form elements to array of objects', () => {
        const utils = new Utils();
        const result = utils.serializeFormArray(mockForm);

        expect(result).toEqual(expect.arrayContaining([
            { name: 'username', value: 'johndoe' },
            { name: 'email', value: 'john@example.com' },
            { name: 'subscribe', value: 'on' },
            { name: 'role', value: 'user' },
            { name: 'tags', value: 'js' },
            { name: 'tags', value: 'php' }
        ]));

        // Unchecked checkbox should not be included
        expect(result).not.toEqual(expect.arrayContaining([{ name: 'terms', value: 'on' }]));
    });

    it('serializeFormArray handles string ID input', () => {
        const utils = new Utils();
        const result = utils.serializeFormArray('test-form');
        expect(result.length).toBeGreaterThan(0);
    });

    it('serializeFormArray returns empty array for invalid input', () => {
        const utils = new Utils();
        expect(utils.serializeFormArray(null)).toEqual([]);
        expect(utils.serializeFormArray({})).toEqual([]);
    });
});

describe('IsJson Helper', () => {
    it('returns true for valid JSON string', () => {
        expect(IsJson('{"key": "value"}')).toBe(true);
        expect(IsJson('["item1", "item2"]')).toBe(true);
        expect(IsJson('true')).toBe(true);
        expect(IsJson('123')).toBe(true);
    });

    it('returns false for invalid JSON string', () => {
        expect(IsJson('{key: "value"}')).toBe(false);
        expect(IsJson('plain text')).toBe(false);
        expect(IsJson(undefined)).toBe(false);
    });
});

describe('queryBuilder Helper', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            value: {
                search: '?id=123&name=john&category=admin'
            },
            writable: true
        });
    });

    it('parses current window location query params', () => {
        const result = queryBuilder.all();
        expect(result).toEqual({
            id: '123',
            name: 'john',
            category: 'admin'
        });
    });

    it('gets specific parameter', () => {
        expect(queryBuilder.get('id')).toBe('123');
        expect(queryBuilder.get('name')).toBe('john');
    });

    it('handles custom query string input', () => {
        const customQuery = 'foo=bar&baz=qux';
        expect(queryBuilder.get('foo', customQuery)).toBe('bar');
        expect(queryBuilder.all(customQuery)).toEqual({
            foo: 'bar',
            baz: 'qux'
        });
    });
});
