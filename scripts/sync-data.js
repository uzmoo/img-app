// scripts/sync-data.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 解决 ES 模块中 __dirname 不可用的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= 1. 配置区域 =================

// 定义所有需要同步的数据源
const SYNC_CONFIG = [
    {
        name: '照片主数据',
        url: 'http://localhost:8000/data/result_list.json',
        filename: 'data.json' // 保存到本地后重命名，方便代码引用
    },
    {
        name: '场景列表',
        url: 'http://localhost:8000/data/scenes.json',
        filename: 'scenes.json'
    },
    {
        name: '分类列表',
        url: 'http://localhost:8000/data/categories.json',
        filename: 'categories.json'
    }
];

// 目标目录：VitePress 的 public 目录
const TARGET_DIR = path.resolve(__dirname, '../docs/public');

// ===============================================

/**
 * 通用下载方法：负责从 URL 下载文件并保存
 */
async function downloadFile(sourceUrl, targetFilename) {
    try {
        const response = await fetch(sourceUrl);

        if (!response.ok) {
            throw new Error(`请求失败: ${response.status}`);
        }

        const data = await response.text();
        const targetPath = path.join(TARGET_DIR, targetFilename);

        fs.writeFileSync(targetPath, data, 'utf8');
        return { success: true, path: targetPath, size: (data.length / 1024).toFixed(2) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * 主执行函数：遍历配置列表，统一调用下载方法
 */
async function runSync() {
    console.log(`\n🚀 开始同步项目 B 数据...`);
    console.log(`   目标目录: ${TARGET_DIR}\n`);

    // 确保目标目录存在
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    // 遍历配置，并行或串行执行下载
    for (const config of SYNC_CONFIG) {
        console.log(`⏳ 正在同步: ${config.name}...`);

        const result = await downloadFile(config.url, config.filename);

        if (result.success) {
            console.log(`✅ ${config.name} 成功 -> ${result.path} (${result.size} KB)`);
        } else {
            console.error(`❌ ${config.name} 失败: ${result.error}`);
        }
    }

    console.log(`\n🎉 所有任务处理完毕！`);
    console.log(`💡 提示: 请刷新浏览器查看最新数据。`);
}

// 执行
runSync().catch(err => {
    console.error('💥 脚本执行出错:', err);
    process.exit(1);
});