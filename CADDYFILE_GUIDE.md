# 云服务器 Caddy 配置与发布简易指南 (零 GitHub 凭证方案)

采用**本地直连部署**模式：
- **GitHub 0 凭证**：你的 GitHub 公开仓库中**不需要配置任何服务器 IP、用户名或私钥**！安全风险完全为零。
- **服务器 0 额外内存开销**：所有繁重的编译都在你本地电脑完成，服务器不需要安装 Node.js，只负责由已有 Caddy 托管生成的轻量静态 HTML 文件，与 `sub2api` 和平共存。

---

## 第一步：在云服务器上创建静态文件目录

登录你的云服务器终端，运行以下两条命令创建存放网页的文件夹并授权：

```bash
# 1. 创建博客静态文件目录
sudo mkdir -p /var/www/blog

# 2. 将目录所有权赋予当前登录的用户（假设当前登录用户是 root 或 ubuntu）
sudo chown -R $USER:$USER /var/www/blog
```

---

## 第二步：在现有 Caddyfile 中追加博客配置

打开云服务器上的 Caddy 配置文件（通常位于 `/etc/caddy/Caddyfile`）：

```bash
sudo nano /etc/caddy/Caddyfile
# 或者使用 vim
sudo vim /etc/caddy/Caddyfile
```

在原有 `sub2api` 配置的**下方**，追加以下 6 行内容（将 `blog.yourdomain.com` 替换为你准备分配给博客的域名）：

```caddy
# 个人独立博客与作品集站点
blog.yourdomain.com {
    root * /var/www/blog
    file_server
    encode zstd gzip
    try_files {path} {path}/ /index.html
}
```

> [!TIP]
> - `try_files` 保证了所有前端页面正常访问。
> - `encode zstd gzip` 开启了极致压缩，极度节省服务器带宽。
> - Caddy 会**全自动向 Let's Encrypt 申请免费的 HTTPS SSL 证书**，无需任何人工干预。

保存后，重载 Caddy 即可生效（**不会断开或影响正在运行的 sub2api**）：

```bash
sudo systemctl reload caddy
# 或者
caddy reload
```

---

## 第三步：本地配置与一键极速发布

你所有的服务器信息**仅保存在你自己的电脑本地**（已加入 `.gitignore`，绝不会上传到 GitHub）：

1. 打开项目根目录下的 `.env` 文件，填入你的云服务器 IP 与用户名：
   ```env
   SERVER_HOST=你的云服务器公网IP
   SERVER_USER=root
   SERVER_PORT=22
   SERVER_PATH=/var/www/blog
   ```

2. 之后，每当你写了新文章或修改了代码，在终端运行：
   ```bash
   npm run deploy
   ```
   **程序会自动在本地极速编译，并直接通过安全 SSH 传输到云服务器的 Caddy 目录**。秒级生效，安全、可控、极速！
