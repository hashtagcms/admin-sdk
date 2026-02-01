import { Storage } from '../src/storage';

describe('Storage Class', () => {
    let storage;

    beforeEach(() => {
        storage = new Storage();
    });

    it('stores and retrieves values', () => {
        storage.store('key1', 'value1');
        expect(storage.fetch('key1')).toBe('value1');
    });

    it('handles object values', () => {
        const data = { id: 1, name: 'Test' };
        storage.store('user', data);
        expect(storage.fetch('user')).toEqual(data);
    });

    it('clears stored values', () => {
        storage.store('temp', 123);
        storage.clear('temp');
        expect(storage.fetch('temp')).toBeUndefined();
    });

    it('manages counters', () => {
        expect(storage.nextCounter()).toBe(1);
        expect(storage.nextCounter()).toBe(2);
        expect(storage.nextCounter()).toBe(3);
    });
});
