// upgradeDB('myStore', 'create', 'MyFileSystem')
//     .then(result => console.log(result))
//     .catch(error => console.error(error));

// getObjectStores('MyFileSystem').then(objectStores => {
//         console.log('Object stores:', objectStores);
//     }).catch(error => {
//         console.error(error);
//     });

// addOrUpdateItem('myStore', 'filePath', 'content', 'MyFileSystem')
//     .then(result => console.log(result))
//     .catch(error => console.error(error));

// getAllFiles('MyFileSystem', 'myStore')
//     .then(files => console.log('Files:', files))
//     .catch(error => console.error(error));

// getFile('MyFileSystem', 'myStore', 'filePath')
//     .then(file => console.log('File:', file))
//     .catch(error => console.error(error));

// deleteFile('MyFileSystem', 'myStore', 'filePath')
//     .then(result => console.log(result))
//     .catch(error => console.error(error));





export function upgradeDB(storeName, operation, dbName = 'MyFileSystem') {
    return new Promise((resolve, reject) => {
        // 首先打开数据库以获取当前版本号
        const openRequest = indexedDB.open(dbName);

        openRequest.onsuccess = function(event) {
            const db = event.target.result;
            const currentVersion = db.version;
            db.close();

            // 打开一个更高版本号的数据库
            const upgradeRequest = indexedDB.open(dbName, currentVersion + 1);

            upgradeRequest.onupgradeneeded = function(event) {
                const db = event.target.result;
                if (operation === 'create' && !db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'filePath' });
                } else if (operation === 'delete' && db.objectStoreNames.contains(storeName)) {
                    db.deleteObjectStore(storeName);
                }
            };

            upgradeRequest.onsuccess = function() {
                resolve('Database upgrade successful.');
            };

            upgradeRequest.onerror = function(event) {
                reject('Database error: ' + event.target.errorCode);
            };
        };

        openRequest.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}


export function createIndex(storeName, indexName, keyPath, options = {}, dbName = 'MyFileSystem') {
    // 设置默认值
    options.unique = options.unique ?? false;
    options.multiEntry = options.multiEntry ?? false;

    return new Promise((resolve, reject) => {
        // 首先打开数据库以获取当前版本号
        const versionRequest = indexedDB.open(dbName);

        versionRequest.onsuccess = function(event) {
            const db = event.target.result;
            const currentVersion = db.version;
            db.close();

            // 打开一个更高版本号的数据库
            const upgradeRequest = indexedDB.open(dbName, currentVersion + 1);

            upgradeRequest.onupgradeneeded = function(event) {
                const db = event.target.result;
                if (db.objectStoreNames.contains(storeName)) {
                    const store = event.target.transaction.objectStore(storeName);
                    // 使用提供的选项创建索引
                    store.createIndex(indexName, keyPath, options);
                }
            };

            upgradeRequest.onsuccess = function() {
                resolve('Index created successfully.');
            };

            upgradeRequest.onerror = function(event) {
                reject('Database error: ' + event.target.errorCode);
            };
        };

        versionRequest.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}



export function getObjectStores(dbName = 'MyFileSystem') {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const objectStoreNames = Array.from(db.objectStoreNames);
            db.close();
            resolve(objectStoreNames);
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}



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




export function isEmptyObjectStore(storeName, dbName = 'MyFileSystem') {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const countRequest = store.count();

            countRequest.onsuccess = function() {
                resolve(countRequest.result === 0);
            };

            countRequest.onerror = function(event) {
                reject('Error counting items: ' + event.target.errorCode);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}




// export function deleteObjectStoreIfEmpty(storeName, dbName = 'MyFileSystem') {
//     isEmptyObjectStore(dbName, storeName).then(isEmpty => {
//         if (isEmpty) {
//             const versionRequest = indexedDB.open(dbName);
//             versionRequest.onsuccess = function(event) {
//                 const db = event.target.result;
//                 const currentVersion = db.version;
//                 db.close();

//                 const upgradeRequest = indexedDB.open(dbName, currentVersion + 1);
//                 upgradeRequest.onupgradeneeded = function(event) {
//                     const db = event.target.result;
//                     db.deleteObjectStore(storeName);
//                 };
//             };
//         }
//     }).catch(err => console.error(err));
// }




export function deleteObjectStore(dbName, storeName) {
    const versionRequest = indexedDB.open(dbName);
    versionRequest.onsuccess = function(event) {
        const db = event.target.result;
        const currentVersion = db.version;
        db.close();

        const upgradeRequest = indexedDB.open(dbName, currentVersion + 1);
        upgradeRequest.onupgradeneeded = function(event) {
            const db = event.target.result;
            db.deleteObjectStore(storeName);
        };
    };
}



export function deleteObjectStoreIfEmpty(storeName, dbName = 'MyFileSystem', recycleBinStoreName = 'RecycleBin') {
    isEmptyObjectStore(dbName, storeName).then(isEmpty => {
        if (!isEmpty) {
            // 如果对象存储不为空，先移动所有数据到回收站
            moveAllToRecycleBin(storeName, dbName, recycleBinStoreName).then(() => {
                // 数据移动完成后，删除对象存储
                deleteObjectStore(dbName, storeName);
            }).catch(err => console.error('Error moving data to recycle bin:', err));
        } else {
            // 如果对象存储为空，直接删除
            deleteObjectStore(dbName, storeName);
        }
    }).catch(err => console.error('Error checking if object store is empty:', err));
}





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




export function archiveObjectStore(storeName, dbName = 'MyFileSystem') {
    const archiveName = `${storeName}_${new Date().getTime()}`;
    const request = indexedDB.open(dbName);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const version = db.version;
        db.close();

        const upgradeRequest = indexedDB.open(dbName, version + 1);

        upgradeRequest.onupgradeneeded = function(event) {
            const db = event.target.result;

            // 创建新的对象存储用于存档
            const newStore = db.createObjectStore(archiveName, { /* 定义键路径或自动生成键 */ });

            // 从旧的对象存储复制数据到新的对象存储
            const oldStore = event.target.transaction.objectStore(storeName);
            oldStore.openCursor().onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    newStore.add(cursor.value);
                    cursor.continue();
                }
            };

            // 删除旧的对象存储
            db.deleteObjectStore(storeName);
        };
    };

    request.onerror = function(event) {
        console.error('Error opening database:', event.target.errorCode);
    };
}
