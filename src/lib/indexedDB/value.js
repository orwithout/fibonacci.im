export function addOrUpdateItem(storeName, filePath, content, dbName = 'MyFileSystem') {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const putRequest = store.put({ path: filePath, content });

            putRequest.onsuccess = function() {
                resolve('Item added/updated successfully.');
            };

            transaction.onerror = function(event) {
                reject('Transaction error: ' + event.target.error);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}



export function getAllFiles(storeName, dbName = 'MyFileSystem') {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const cursorRequest = store.openCursor();
            const files = [];

            cursorRequest.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    // 将文件路径添加到数组
                    files.push(cursor.value); // 或 cursor.key，取决于您想获取的信息
                    cursor.continue();
                } else {
                    // 当遍历完所有条目时
                    resolve(files);
                }
            };

            cursorRequest.onerror = function(event) {
                reject('Error reading files: ' + event.target.errorCode);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}





export function getFile(storeName, filePath, dbName = 'MyFileSystem') {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const getRequest = store.get(filePath);

            getRequest.onsuccess = function() {
                resolve(getRequest.result);
            };

            getRequest.onerror = function(event) {
                reject('Error fetching file: ' + event.target.errorCode);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}



export function deleteFile(storeName, filePath, dbName = 'MyFileSystem') {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const deleteRequest = store.delete(filePath);

            deleteRequest.onsuccess = function() {
                resolve('File deleted successfully');
            };

            deleteRequest.onerror = function(event) {
                reject('Error deleting file: ' + event.target.errorCode);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}
