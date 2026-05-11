const fs = require('fs');
const path = require('path');

// --- 配置区域 ---
const PHOTOS_JSON_PATH = './docs/public/data.json';
const SCENES_JSON_PATH = './docs/public/scenes.json';
const CATEGORIES_JSON_PATH = './docs/public/categories.json';
const OUTPUT_FILE_PATH = './docs/.vitepress/sidebar.config.js';

const PHOTOS_PER_PAGE = 10;
// ----------------

// --- 通用目录配置 ---
const PHOTOS_DIR = './docs/photos';
const PHOTOS_SUB_DIR = './docs/photos/page';

const SCENES_DIR = './docs/scenes';
const SCENES_SUB_DIR = './docs/scenes/list';

const CATEGORIES_DIR = './docs/categories';
const CATEGORIES_SUB_DIR = './docs/categories/list';

// --- 1. 清理与准备目录 ---
function prepareDirectories(mainDir, subDir) {
    if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir, { recursive: true });

    if (fs.existsSync(subDir)) {
        const files = fs.readdirSync(subDir);
        files.forEach(file => fs.unlinkSync(path.join(subDir, file)));
        console.log(`🧹 已清空 ${subDir} 目录`);
    } else {
        fs.mkdirSync(subDir, { recursive: true });
    }
}

// --- 2. 生成照片页面 ---
function generatePhotoPages(totalPages) {
    prepareDirectories(PHOTOS_DIR, PHOTOS_SUB_DIR);

    for (let i = 1; i <= totalPages; i++) {
        let filePath, importPath;
        if (i === 1) {
            filePath = path.resolve(PHOTOS_DIR, 'index.md');
            importPath = './PhotoPage.vue';
        } else {
            filePath = path.resolve(PHOTOS_SUB_DIR, `page.${i}.md`);
            importPath = '../PhotoPage.vue';
        }

        const content = `---
title: 照片列表 - 第${i}页
layout: page
---

<script setup>
import PhotoPage from '${importPath}'
</script>

<PhotoPage :current="${i}" />
`;
        fs.writeFileSync(filePath, content);
    }
}

// --- 3. 生成场景页面 (调整：index 也生成 ID 文件) ---
function generateScenesPages() {
    let scenes = [];
    try {
        const rawData = fs.readFileSync(path.resolve(SCENES_JSON_PATH), 'utf8');
        scenes = JSON.parse(rawData);
    } catch (e) { console.error('❌ 读取 scenes.json 失败:', e); return; }

    prepareDirectories(SCENES_DIR, SCENES_SUB_DIR);

    scenes.forEach((scene, index) => {
        let filePath, importPath;

        // 核心修改：即使是 index=0，也生成对应的 ID 文件
        if (index === 0) {
            // 1. 生成 index.md
            filePath = path.resolve(SCENES_DIR, 'index.md');
            importPath = './ScenePage.vue';

            const content = `---
title: ${scene.name}
layout: page
---

<script setup>
import ScenePage from '${importPath}'
</script>

<ScenePage :current-id="${scene.id}" />
`;
            fs.writeFileSync(filePath, content);

            // 2. 额外生成 scene.{id}.md (例如 scene.0.md)
            const extraFileName = `scene.${scene.id}.md`;
            const extraFilePath = path.resolve(SCENES_SUB_DIR, extraFileName);
            // 内容完全一样，只是 import 路径变了
            const extraContent = `---
title: ${scene.name}
layout: page
---

<script setup>
import ScenePage from '../ScenePage.vue'
</script>

<ScenePage :current-id="${scene.id}" />
`;
            fs.writeFileSync(extraFilePath, extraContent);

        } else {
            // 非 0 的情况保持原样
            const fileName = `scene.${scene.id}.md`;
            filePath = path.resolve(SCENES_SUB_DIR, fileName);
            importPath = '../ScenePage.vue';

            const content = `---
title: ${scene.name}
layout: page
---

<script setup>
import ScenePage from '${importPath}'
</script>

<ScenePage :current-id="${scene.id}" />
`;
            fs.writeFileSync(filePath, content);
        }
    });
    console.log(`✅ 已生成 ${scenes.length} 个场景页面 (含 Index 副本)`);
}

// --- 4. 生成分类页面 (调整：复刻场景逻辑，index 也生成 ID 文件) ---
function generateCategoriesPages() {
    let categories = [];
    try {
        const rawData = fs.readFileSync(path.resolve(CATEGORIES_JSON_PATH), 'utf8');
        categories = JSON.parse(rawData);
    } catch (e) { console.error('❌ 读取 categories.json 失败:', e); return; }

    prepareDirectories(CATEGORIES_DIR, CATEGORIES_SUB_DIR);

    categories.forEach((cat, index) => {
        let filePath, importPath;

        if (index === 0) {
            // 1. 生成 index.md
            filePath = path.resolve(CATEGORIES_DIR, 'index.md');
            importPath = './CategoryPage.vue';

            const content = `---
title: ${cat.name}
layout: page
---

<script setup>
import CategoryPage from '${importPath}'
</script>

<CategoryPage :current-id="${cat.id}" />
`;
            fs.writeFileSync(filePath, content);

            // 2. 额外生成 category.{id}.md
            const extraFileName = `category.${cat.id}.md`;
            const extraFilePath = path.resolve(CATEGORIES_SUB_DIR, extraFileName);

            const extraContent = `---
title: ${cat.name}
layout: page
---

<script setup>
import CategoryPage from '../CategoryPage.vue'
</script>

<CategoryPage :current-id="${cat.id}" />
`;
            fs.writeFileSync(extraFilePath, extraContent);

        } else {
            // 非 0 的情况
            const fileName = `category.${cat.id}.md`;
            filePath = path.resolve(CATEGORIES_SUB_DIR, fileName);
            importPath = '../CategoryPage.vue';

            const content = `---
title: ${cat.name}
layout: page
---

<script setup>
import CategoryPage from '${importPath}'
</script>

<CategoryPage :current-id="${cat.id}" />
`;
            fs.writeFileSync(filePath, content);
        }
    });
    console.log(`✅ 已生成 ${categories.length} 个分类页面 (含 Index 副本)`);
}

// --- 5. 读取照片数据 ---
let photos = [];
try {
    const rawData = fs.readFileSync(path.resolve(PHOTOS_JSON_PATH), 'utf8');
    photos = JSON.parse(rawData);
} catch (e) { console.log('⚠️ 未找到 photos.json'); }
const photoTotalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE) || 1;

// --- 6. 执行生成 ---
generatePhotoPages(photoTotalPages);
generateScenesPages();
generateCategoriesPages();

// --- 7. 生成侧边栏配置 ---

// 照片侧边栏
const photoSidebar = [
    {
        text: '📷 照片列表',
        collapsed: false,
        items: Array.from({ length: photoTotalPages }, (_, i) => {
            const pageNum = i + 1;
            return {
                text: `第${pageNum}页`,
                link: pageNum === 1 ? `/photos/` : `/photos/page/page.${pageNum}`
            };
        })
    }
];

// 场景侧边栏 (链接逻辑保持不变，依然指向具体 ID)
let scenes = [];
try {
    const rawData = fs.readFileSync(path.resolve(SCENES_JSON_PATH), 'utf8');
    scenes = JSON.parse(rawData);
} catch (e) { console.error('❌ 读取 scenes.json 失败:', e); }

const scenesSidebar = [
    {
        text: '🏞️ 场景分类',
        collapsed: false,
        items: scenes.map((scene, index) => {
            // 这里依然指向具体的 ID 文件，因为 index.md 和 scene.0.md 内容一样
            const link = `/scenes/list/scene.${scene.id}`;
            return {
                text: scene.name,
                link: link,
                activeMatch: `/scenes/list/scene.${scene.id}`
            };
        })
    }
];

// 分类侧边栏
let categories = [];
try {
    const rawData = fs.readFileSync(path.resolve(CATEGORIES_JSON_PATH), 'utf8');
    categories = JSON.parse(rawData);
} catch (e) { console.error('❌ 读取 categories.json 失败:', e); }

const categoriesSidebar = [
    {
        text: '🏷️ 图片分类',
        collapsed: false,
        items: categories.map((cat, index) => {
            // 这里也指向具体的 ID 文件
            const link = `/categories/list/category.${cat.id}`;
            return {
                text: cat.name,
                link: link,
                activeMatch: `/categories/list/category.${cat.id}`
            };
        })
    }
];

// --- 8. 写入配置文件 ---
const fileContent = `
// 此文件由 generate-sidebar.js 自动生成
export const photoSidebar = ${JSON.stringify(photoSidebar, null, 2)};
export const scenesSidebar = ${JSON.stringify(scenesSidebar, null, 2)};
export const categoriesSidebar = ${JSON.stringify(categoriesSidebar, null, 2)};
`;

fs.writeFileSync(path.resolve(OUTPUT_FILE_PATH), fileContent);
console.log('✅ 侧边栏配置已更新');