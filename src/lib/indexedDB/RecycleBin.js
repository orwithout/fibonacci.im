export function moveAllToRecycleBin(storeName, dbName = 'MyFileSystem', recycleBinStoreName = 'RecycleBin') {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            
            // 开启一个事务，涵盖指定存储和回收站存储
            const transaction = db.transaction([storeName, recycleBinStoreName], 'readwrite');
            
            // 获取原始存储和回收站存储的引用
            const store = transaction.objectStore(storeName);
            const recycleBinStore = transaction.objectStore(recycleBinStoreName);
            
            // 打开游标以遍历所有数据
            const cursorRequest = store.openCursor();

            cursorRequest.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    const key = cursor.key;
                    const value = cursor.value;

                    // 将数据移动到回收站
                    recycleBinStore.add({ key: key, data: value }).onsuccess = function() {
                        // 移动成功后，删除原始数据
                        store.delete(key);
                    };

                    cursor.continue();
                } else {
                    // 没有更多数据，表示操作完成
                    resolve('All data moved to recycle bin successfully');
                }
            };

            cursorRequest.onerror = function(event) {
                reject('Error moving data to recycle bin: ' + event.target.errorCode);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}




export function moveToRecycleBinAndDelete(storeName, filePath, dbName = 'MyFileSystem', recycleBinStoreName = 'RecycleBin') {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;

            // 开始一个事务，涉及到原始存储和回收站存储
            const transaction = db.transaction([storeName, recycleBinStoreName], 'readwrite');

            // 访问原始存储和回收站存储
            const store = transaction.objectStore(storeName);
            const recycleBinStore = transaction.objectStore(recycleBinStoreName);

            // 首先尝试获取文件数据
            const getRequest = store.get(filePath);

            getRequest.onsuccess = function() {
                const fileData = getRequest.result;
                if (fileData) {
                    // 使用自增ID作为新key将文件数据移动到回收站
                    const recycleRequest = recycleBinStore.add({ key: filePath, data: fileData });

                    recycleRequest.onsuccess = function() {
                        // 成功移动到回收站后，删除原始数据
                        const deleteRequest = store.delete(filePath);

                        deleteRequest.onsuccess = function() {
                            resolve('File moved to recycle bin and deleted successfully');
                        };

                        deleteRequest.onerror = function(event) {
                            reject('Error deleting file: ' + event.target.errorCode);
                        };
                    };

                    recycleRequest.onerror = function(event) {
                        reject('Error moving file to recycle bin: ' + event.target.errorCode);
                    };
                } else {
                    reject('File not found');
                }
            };

            getRequest.onerror = function(event) {
                reject('Error retrieving file: ' + event.target.errorCode);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}
