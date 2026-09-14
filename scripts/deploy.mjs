import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

// 1. 读取本地 .env 配置
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
	console.error('❌ 未找到 .env 配置文件！请先复制 .env.example 为 .env 并填入你的服务器信息。');
	process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith('#')) continue;
	const [key, ...values] = trimmed.split('=');
	if (key) {
		envVars[key.trim()] = values.join('=').trim();
	}
}

const host = envVars.SERVER_HOST;
const user = envVars.SERVER_USER || 'root';
const port = envVars.SERVER_PORT || '22';
const targetPath = envVars.SERVER_PATH || '/var/www/blog';

if (!host || host === 'your-server-ip' || host === '你的云服务器公网IP') {
	console.error('\n⚠️ 请先打开项目根目录下的 .env 文件，修改以下配置：');
	console.error('SERVER_HOST=你的云服务器公网IP');
	console.error('SERVER_USER=root (或你的登录用户名)');
	console.error('SERVER_PORT=22');
	console.error('SERVER_PATH=/var/www/blog\n');
	process.exit(1);
}

console.log(`\n🚀 准备将 dist/ 网页同步到云服务器 [${user}@${host}:${port}${targetPath}]...`);
console.log(`💡 说明：这是从你的电脑直接通过 SSH 安全连接服务器传输，不会经过 GitHub，GitHub 上没有任何你的服务器凭据！\n`);

// 2. 执行 scp 传输 (Windows 和 Linux 通用)
const scpArgs = [
	'-P', port,
	'-r',
	'dist/.',
	`${user}@${host}:${targetPath}`
];

const child = spawn('scp', scpArgs, {
	stdio: 'inherit',
	shell: true
});

child.on('close', (code) => {
	if (code === 0) {
		console.log('\n🎉 部署大功告成！最新文章和页面已成功同步到云服务器 Caddy 目录。');
	} else {
		console.error(`\n❌ 部署过程退出，退出代码: ${code}。如果提示输入密码，请在终端中直接输入。`);
	}
});
