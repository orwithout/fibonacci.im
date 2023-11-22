# Fibonacci.im（AI多轮对话应用助理的前端）项目说明


设计文档 (正在准备)



## 一、演示
**DEMO** v0.0.1: http://fibonacci.im (正在准备)


## 二、安装

1. 克隆项目
    项目源代码可以直接下载然后解压：https://github.com/orwithout/fibonacci.im/archive/refs/heads/main.zip  
    如果想要使用git 克隆，需要先安装git软件（下载: https://git-scm.com/downloads ），然后打开电脑系统的命令终端，运行：（它会把源代码下载到当前命令终端的工作目录）
    ```bash
    git clone https://www.github.com/orwithout/fibonacci.im.git
    ```



2. 安装nodejs  
   windows 系统 下载最新版自行安装: [Node.js 官方下载页面](https://nodejs.org/en/download)  
   Linux 系统 执行：
   ```bash
   # 使用nvm 安装node
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

   source ~/.bashrc

   nvm install node
   ```

3. 打开命令行终端，导航到解压或克隆下来的 `fibonacci.im` 目录：
    ```bash
    cd fibonacci.im
    ```
4. 安装依赖：
    ```bash
    npm install
    ```
5. 运行前端：
    ```bash
    npm run dev --port 8005
    ```
6. 打开浏览器访问：http://localhost:8005/  
   （正在准备,目前是个空白页面）

7. 发布（静态部署，不依赖nodejs）  
   在项目根目录中执行：
    ```bash
    npm run build
    ```
    然后将项目根目录中的 static/ 目录做静态部署

### 附：
- [Nginx配置](https://github.com/orwithout/fibonacci.im/blob/main/doc/README.nginx.md)
- [SvelteKit 官方文档](https://kit.svelte.dev/docs/creating-a-project)
- [git克隆github项目方法的更多说明](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)






