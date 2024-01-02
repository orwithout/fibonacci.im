import { writable } from 'svelte/store';



export const urlSet = writable({});
export const inputJson = writable({});
export const infoSet = writable({});
export const infoBase = writable({});
export const components = writable({});



// import { writable } from 'svelte/store';

// const dataStore = writable([]);

// async function fetchData() {
//   const response = await fetch('https://api.example.com/data');
//   const data = await response.json();
//   dataStore.set(data);
// }

// fetchData(); // 初始加载数据

// <script>
//   import { dataStore } from './store.js';
// </script>

// {#each $dataStore as item}
//   <p>{item.name}</p>
// {/each}





// import { writable } from 'svelte/store';

// // 假设这是你的 store
// export const infoBase = writable({});

// // 添加数据
// export function addInfoBase(key, value) {
//     infoBase.update(currentState => {
//         currentState[key] = value;
//         return currentState;
//     });
// }

// // 删除数据
// export function removeInfoBase(key) {
//     infoBase.update(currentState => {
//         delete currentState[key];
//         return currentState;
//     });
// }

// // 获取数据（通常不需要特别的函数，因为可以直接订阅 store）
// export function getInfoBase(key) {
//     let value;
//     infoBase.subscribe(currentState => {
//         value = currentState[key];
//     })();
//     return value;
// }

// // 更新数据
// export function updateInfoBase(key, value) {
//     infoBase.update(currentState => {
//         currentState[key] = value;
//         return currentState;
//     });
// }
