// $lib/indexedDB/getAllData.js
export async function getAllData(dbName = 'MyFileSystem') {
    let db;
    let data = {};
  
    try {
      db = await openDatabase(dbName); // 假设你有一个函数来打开数据库
      const storeNames = db.objectStoreNames;
  
      for (let i = 0; i < storeNames.length; i++) {
        const storeName = storeNames[i];
        data[storeName] = await getAllFiles(storeName, dbName); // 使用之前的 getAllFiles 函数
      }
    } catch (error) {
      console.error('Error fetching data from IndexedDB:', error);
    } finally {
      if (db) db.close();
    }
  
    return data;
}

  


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


// 获取所有主键（对象存储）
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
