# 云服务器 Caddy 配置与发布简易指南

由于你的云服务器已经运行了 **Caddy**（且同时在跑 `sub2api`），本次接入博客 **0 新增软件安装，0 额外内存开销**！

---

## 第一步：在云服务器上创建静态文件目录

登录你的云服务器终端，运行以下两条命令创建存放网页的文件夹并授权：

```bash
# 1. 创建博客静态文件目录
sudo mkdir -p /var/www/blog

# 2. 将目录权限赋予当前登录的用户（假设当前用户是 ubuntu 或 root）
sudo chown -R $USER:$USER /var/www/blog
```

---

## 第二步：在现有 Caddyfile 中追加博客站点配置

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
> - `try_files` 保证了所有前端路由和页面正常访问。
> - `encode zstd gzip` 开启了极致压缩，传输速度更快，流量消耗极少。
> - Caddy 会**全自动向 Let's Encrypt 申请免费的 HTTPS SSL 证书**，无需手动干预。

保存后，重新加载 Caddy 即可生效（**不会影响正在运行的 sub2api**）：

```bash
sudo systemctl reload caddy
# 或者
caddy reload
```

---

## 第三步：在 GitHub 仓库添加自动部署秘钥 (Secrets)

当你在 GitHub 创建好仓库并把代码 `git push` 上去后：

进入该仓库页面 -> **Settings** -> **Secrets and variables** -> **Actions** -> 点击 **New repository secret**：

| Secret 名称 | 填入的内容示例 | 说明 |
| :--- | :--- | :--- |
| `SERVER_HOST` | `123.45.67.89` | 你的云服务器公网 IP 或域名 |
| `SERVER_USER` | `root` (或 `ubuntu`) | 你的服务器 SSH 登录用户名 |
| `SERVER_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | 能够免密登录你服务器的 SSH 私钥 |
| `SERVER_PORT` | `22` | SSH 端口（如果是默认 22 可不填） |

配置完成后，今后每当你写好新文章并 `git push` 时，GitHub Actions 就会自动打包并秒级同步到你的云服务器！
