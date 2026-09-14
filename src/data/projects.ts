export interface Project {
	title: string;
	description: string;
	tags: string[];
	link?: string;
	github?: string;
	badge?: string;
	featured?: boolean;
}

export const projects: Project[] = [
	{
		title: 'Sub2API 聚合与订阅转换服务',
		description: '自建私有云端聚合代理网关与订阅转换服务，运行在轻量级 Linux 云主机上，提供稳定高效的流量转发与 API 协议转换。',
		tags: ['Go', 'Docker', 'Caddy', 'Linux'],
		badge: '云端运行中',
		featured: true,
	},
	{
		title: 'Personal Astro Portfolio & Blog',
		description: '基于 Astro 现代化极速引擎打造的个人独立博客与项目作品集，采用 GitHub Actions 自动化 CI/CD，无缝集成 Caddy 静态托管，0 额外内存消耗。',
		tags: ['Astro', 'TypeScript', 'GitHub Actions', 'Caddy'],
		link: '/',
		github: 'https://github.com',
		badge: '本项目',
		featured: true,
	},
	{
		title: '7x24h 自动化运维与监控助理',
		description: '集成定时巡检、服务保活与消息通知机器人，实时监测服务器负载、Docker 容器健康状态与 SSL 证书有效期。',
		tags: ['Python', 'Shell', 'Cron', 'Webhook'],
		badge: '自动化',
		featured: false,
	},
	{
		title: '轻量级个人效率工具箱',
		description: '一套针对日常高频需求打造的私有脚本与 Web 工具集合，包含批量格式化、安全密钥生成与离线数据处理。',
		tags: ['Vue / React', 'Tailwind CSS', 'Node.js'],
		featured: false,
	}
];
