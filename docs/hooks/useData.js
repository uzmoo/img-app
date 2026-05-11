// composables/useData.js
/**
 * 数据清洗
 * @returns 
 * @usage const { transfer } = useData()
 */

const useData = () => {
    // 1. 定义所有类型的字段映射表
    const fieldMaps = {
        // 照片标注列表
        photo: {
            id: 'file_md5',
            src(item) {
                // let base = "http://localhost:3000"
                // let base = "http://192.168.31.113:3000";
                // let base = "http://192.168.31.113:3000";
                // let base = "https://gitee.com/uzmo/img-lib/blob/master/";
                let base = "https://raw.githubusercontent.com/uzmoo/img-lib/refs/heads/main";
                return `${base}${item.rel_path}`
            },
            // suffix: 'file_ext',
            title(item) {
                // 这里可以写任意复杂的逻辑
                const n = item.new_name || '';
                const s = item.file_ext || '';
                return `${n}${s}`;
            },
            score(item) {
                return Object.values(item.img_scores).reduce((d, s) => d + s, 0)
            },
            scores: "img_scores",
            tags: "img_tags",
            desc: "img_desc",
        },
        source: {
            md5: 'file_md5',
            path: 'json_url',
            dir: 'img_dir',
            count: 'count',
            active: "active",
            sourcePath: (item) => {
                let idx = item.source_path.lastIndexOf('\\');
                return item.source_path.substring(idx).replace("\\", '')
            }
        }
    }

    /**
     * 数据清洗函数
     * @param {string} type - 数据类型，如 'photo', 'user'
     * @param {object|array} payload - 后端返回的原始数据（支持对象或数组）
     */
    const transfer = (type, payload) => {
        const map = fieldMaps[type];

        // 如果没有定义映射表，直接返回原数据（兜底）
        if (!map) return payload;

        // 处理数组情况（例如列表接口）
        if (Array.isArray(payload)) {
            return payload.map(item => transformItem(item, map));
        }

        // 处理对象情况（例如详情接口）
        return transformItem(payload, map);
    }

    // 内部辅助函数：处理单个对象的转换
    const transformItem = (item, map) => {
        const result = {};
        for (const [frontKey, config] of Object.entries(map)) {

            // 判断配置是函数还是字符串
            if (typeof config === 'function') {
                // ✅ 如果是函数，执行它（传入原始 item 以便访问所有字段）
                result[frontKey] = config(item);
            } else {
                // ✅ 如果是字符串，执行基础映射
                const backKey = config;
                result[frontKey] = item[backKey] ?? item[frontKey] ?? '';
            }
        }
        return result;
    }

    return { transfer }
}

export const transfer = useData().transfer
