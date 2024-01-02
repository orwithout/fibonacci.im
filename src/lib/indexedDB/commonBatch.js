export function addMultipleItems(dbName, storeName, items) {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(dbName);

        openRequest.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            for (let item of items) {
                store.add(item);
            }

            transaction.oncomplete = function() {
                resolve('All items added successfully.');
            };

            transaction.onerror = function(event) {
                reject('Transaction failed: ' + event.target.errorCode);
            };
        };

        openRequest.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}
