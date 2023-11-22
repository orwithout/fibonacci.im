

# Nginx 配置指南
请自行替配置文件中使用的域名 fibonacci.im 为你自己的域名，并设置A记录解析到你的主机服务器  
下面以配置 fibonacci.im 域名为例
## 安装 Nginx

### Ubuntu

```bash
sudo apt update
sudo apt install nginx
```

## 启动和停止 Nginx

启动 Nginx：

```bash
sudo systemctl start nginx
```

停止 Nginx：

```bash
sudo systemctl stop nginx
```


## 配置虚拟主机

在 `/etc/nginx/sites-available/` 目录下创建一个新的配置文件，例如 `fibonacci.im`：

```bash
sudo nano /etc/nginx/sites-available/fibonacci.im
```

然后将以下内容粘贴到该文件中：

```nginx
# 使用单页 SPA 配置
# （正在准备）

```

保存并退出编辑器。

接下来，创建一个软链接到 `/etc/nginx/sites-enabled/` 目录：

```bash
sudo ln -s /etc/nginx/sites-available/fibonacci.im /etc/nginx/sites-enabled/
```

测试 Nginx 配置以确保没有语法错误：

```bash
sudo nginx -t
```

如果测试成功，重新加载 Nginx 以应用新的配置：

```bash
sudo systemctl reload nginx
```

现在，您应该可以通过访问 `http://fibonacci.im` 来看到相应的内容。
（实际部署时，务必将 fibonacci.im 替换为你自己的域名）


