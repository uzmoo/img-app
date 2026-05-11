// composables/useCategories.js

import { transfer } from './useData.js'

import { fetchData } from '../api/index.js'

// 持久化场景和分类
const useCategories = () => {
    // 同步标识
    let active = {
        scenes: false,
        categories: false,
        requesting: false,  // 是否请求中
    }
    // 当前场景集合
    let scenesList = []
    // 当前分类集合
    let categoriesList = []



    /**
     * 通过id 查找对应的场景/分类
     * @param {scene | category} type 
     * @param {string} id
     * @returns 
     **/
    const findById = (type, id) => {
        let item = null, idx = -1;
        if (type == 'scene') {
            idx = scenesList.findIndex(e => e.id == id)
            if (idx !== -1) item = scenesList[idx]
        }
        if (type == 'category') {
            idx = scenesList.findIndex(e => e.id == id)
            if (idx !== -1) item = scenesList[idx]
        }
        return [item, idx];
    }

    /**
     * 持久化数据
     */
    const fetchScenesList = async () => {
        if (active.requesting) return
        if (!active.requesting) active.requesting = true
        let sceneData = await fetchData('scenes.json')
        // 持久化
        scenesList = transfer('category', sceneData);
        active.scenes = true
        // 
        console.log("数据同步成功")
    }
    const fetchCategoriesList = async () => {
        let categoryData = await fetchData('categories.json')
        // 持久化
        categoriesList = transfer('category', categoryData);
        active.categories = true
        // 
        console.log("数据同步成功")
    }


    /*
    const { getScenesList, getCategoriesList } = useCategories()
    */
    const getScenesList = async () => {
        if (!active.scenes) await fetchScenesList()
        return scenesList;
    }

    const getCategoriesList = async () => {
        if (!active.categories) await fetchCategoriesList()
        return categoriesList
    }

    // 跳转到详情
    const toDetailPage = (data) => {
        // type: 1-scenes 2-categories
        return `/scenesDetail?type=${data.type}&id=${data.id}`
    }

    return {
        fetchScenesList,
        fetchCategoriesList,
        getScenesList,
        getCategoriesList,
        findById,
        toDetailPage
    }
}

const cateGoriesInit = useCategories()

export const getScenesList = cateGoriesInit.getScenesList
export const getCategoriesList = cateGoriesInit.getCategoriesList