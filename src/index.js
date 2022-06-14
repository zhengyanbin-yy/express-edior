import ExpressEditor from './components/expressEditor/index'
const components = [ExpressEditor]


const install = function(Vue,opts) {
    // 判断是否安装
    if (install.installed) return
    // 遍历注册全局组件
    components.forEach(component => {
        Vue.component(component.name, component);
    });
}
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
let cps = {}
components.forEach(cp=>{
    cps[cp.name] = cp
})
export default {
    install,
    ...cps
}
