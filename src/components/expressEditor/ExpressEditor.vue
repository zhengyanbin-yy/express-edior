<template>
    <div>
        <div class="expression-wrap">
            <el-row class="expression-top-wrap">
                <el-col :span="8" class="expression-tree-wrap left-expression-tree-wrap">
                    <el-input size="mini" placeholder="搜索" v-model="filterCtxData"></el-input>
                    <div class="tree-wrap">
                        <el-tree :data="ctxData" @node-click="constNodeClick" default-expand-all :filter-node-method="filterNode" highlight-current ref="constTree"></el-tree>
                    </div>
                    <!--<el-button type="text" @click="addItem('sysName')">系统名称</el-button>
                    <br>
                    <el-button type="text"
                               @click="insertContent({text:`<span class='child' id='express-temp-dom' style='color:red;font-size: 24px;'>html</span>`})">
                        插入html
                    </el-button>
                    <br>
                    <el-button type="text" @click="insertContent({text:`测试文本`})">插入html</el-button>-->
                </el-col>
                <el-col :span="16" class="expression-tree-wrap">
                    <el-input size="mini" placeholder="搜索" v-model="filterFnData"></el-input>
                    <div class="tree-wrap">
                        <el-tree :data="fnData" @node-click="fnNodeClick" default-expand-all :filter-node-method="filterNode" highlight-current ref="functionTree"></el-tree>
                    </div>
                </el-col>
            </el-row>
            <div class="expression-operate-warp">
                <el-button-group>
                    <el-tooltip v-for="(operator,index) of operators" :key="index" class="item" effect="dark"
                                :content="operator.tip||operator.label||operator.name" placement="top-start">
                        <el-button type="info" size="small" @click="operatorAdd(operator)">{{operator.label||operator.name}}</el-button>
                        <!--                    <div class="operator-item" @click="operatorAdd(operator)">{{operator.label||operator.name}}</div>-->
                    </el-tooltip>
                    <el-button type="warning" size="small" @click="clearExpress">清除</el-button>
                </el-button-group>
                <!--<el-tooltip v-for="(operator,index) of operators" :key="index" class="item" effect="dark"
                            :content="operator.tip||operator.label||operator.name" placement="top-start">
                    <div class="operator-item" @click="operatorAdd(operator)">{{operator.label||operator.name}}</div>
                </el-tooltip>-->
            </div>
            <!--<div contenteditable='true' spellcheck='false' ref="edit" class="expression-edit" @click="editorClick" @blur="filterByDataType()"-->
            <div contenteditable='true' spellcheck='false' ref="edit" class="expression-edit" @click="editorClick"
                 @keydown="directionKeyDown" @keypress="directionKeyPress"></div>
        </div>
        <el-button @click="addItem('userInfo.name')" style="margin-top: 10px;">添加</el-button>
        <el-button @click="getValue" style="margin-top: 10px;">翻译</el-button>
        <br>
        {{expressRes}}
    </div>
</template>

<script>
    import {buildExprTokenTree} from './utils/exprToken'

    export default {
        name: "ExpressEditor",
        props: {
            config: Object,
            ctxData:{
                type:Array,
                default(){
                    return [
                        {
                            label: '常量',
                            value: 'const',
                            children: [
                                {label: '系统名称', value: 'sysName', nodeType: 'constant',dataType:'string'},
                                {label: '真', value: 'true', nodeType: 'constant',dataType: 'boolean'},
                                {label: '假', value: 'false', nodeType: 'constant',dataType: 'boolean'},
                            ]
                        },
                        {
                            label: '数据',
                            value:'object',
                            children: [
                                /*{
                                    label: '树',value:'tree',nodeType: 'object',dataType: 'object',
                                    children:[
                                        {label:'名称',value:'name',nodeType:'object',dataType:'object'}
                                    ]
                                },*/
                                /*{
                                    label: '用户信息',value:'userInfo',nodeType: 'object',dataType: 'object',
                                    children:[
                                        {
                                            label:'用户名',value:'name',nodeType:'object',dataType:'string',
                                            children:[
                                                {label:'测试',value:'test',nodeType:'object',dataType:'string'},
                                            ]
                                        },
                                        {label:'用户性别',value:'sex',nodeType:'object',dataType:'number'},
                                    ]
                                },*/
                                {"name":"id","label":"ID","dataType":"STRING","note":"","length":120,"precision":0,"defaultValue":"","notNull":true,"physicalFieldName":"T_ID","exist":true,"set":false,"value":"${formData.id}","nodeType":"object","isField":true},{"name":"qingjialeixing","label":"请假类型","dataType":"INT","note":"","length":0,"precision":0,"defaultValue":"1","notNull":true,"physicalFieldName":"F_qingjialeixing","exist":true,"set":false,"value":"$formData.qingjialeixing","nodeType":"object","isField":true},{"name":"qingjiakaishishijian","label":"请假开始时间","dataType":"DATETIME","note":"","length":0,"precision":0,"defaultValue":"","notNull":false,"physicalFieldName":"F_qingjiakaishishijian","exist":true,"set":false,"value":"${formData.qingjiakaishishijian}","nodeType":"object","isField":true},{"name":"qingjiajieshushijian","label":"请假结束时间","dataType":"DATETIME","note":"","length":0,"precision":0,"defaultValue":"","notNull":false,"physicalFieldName":"F_qingjiajieshushijian","exist":true,"set":false,"value":"${formData.qingjiajieshushijian}","nodeType":"object","isField":true},{"name":"qingjiarenID","label":"请假人ID","dataType":"STRING","note":"","length":120,"precision":0,"defaultValue":"","notNull":false,"physicalFieldName":"F_qingjiarenid","exist":true,"set":false,"value":"${formData.qingjiarenID}","nodeType":"object","isField":true},{"name":"qingjiaren","label":"请假人","dataType":"STRING","note":"","length":120,"precision":0,"defaultValue":"","notNull":false,"physicalFieldName":"F_qingjiaren","exist":true,"set":false,"value":"${formData.qingjiaren}","nodeType":"object","isField":true},{"name":"qingjiarenFCode","label":"请假人FCode","dataType":"STRING","note":"","length":120,"precision":0,"defaultValue":"","notNull":false,"physicalFieldName":"F_qingjiarenFCode","exist":true,"set":false,"value":"${formData.qingjiarenFCode}","nodeType":"object","isField":true},{"name":"qingjiashuoming","label":"请假说明","dataType":"STRING","note":"","length":300,"precision":0,"defaultValue":"","notNull":false,"physicalFieldName":"F_qingjiashuoming","exist":true,"set":false,"value":"${formData.qingjiashuoming}","nodeType":"object","isField":true}
                            ]
                        }
                    ]
                }
            }
        },
        data() {
            return {
                filterFnData:'',
                filterCtxData:'',
                $valueInput: null,
                lastSelectNode: null,
                lastRange: null,
                express: [],
                expressRes: '',
                defaultConfig: {
                    defaultOperators: {
                        JS: [
                            {name: "+", tip: "加", label: "+"},
                            {name: "-", tip: "减", label: "-"},
                            {name: "*", tip: "乘", label: "*"},
                            {name: "/", tip: "除", label: "/"},
                            {name: "%", tip: "求模", label: "%"},
                            {name: "||", tip: "或者", label: "||"},
                            {name: "&&", tip: "并且", label: "&&"},
                            {name: "!", tip: "非", label: "!"},
                            {name: ">", tip: "大于", label: ">"},
                            {name: ">=", tip: "大于等于", label: ">="},
                            {name: "<", tip: "小于", label: "<"},
                            {name: "<=", tip: "小于等于", label: "<="},
                            {name: "!=", tip: "不等于", label: "!="},
                            {name: "==", tip: "等于", label: "=="},
                            {name: "\"", tip: "双引号", label: "\""},
                            {name: "&nbsp;", tip: "空格", label: "空格"}
                        ],
                        SPRING: [
                            {name: "+", tip: "加", label: "+"},
                            {name: "-", tip: "减", label: "-"},
                            {name: "*", tip: "乘", label: "*"},
                            {name: "/", tip: "除", label: "/"},
                            {name: "%", tip: "求模", label: "%"},
                            {name: "||", tip: "或者", label: "||"},
                            {name: "&&", tip: "并且", label: "&&"},
                            {name: "!", tip: "非", label: "!"},
                            {name: ">", tip: "大于", label: ">"},
                            {name: ">=", tip: "大于等于", label: ">="},
                            {name: "<", tip: "小于", label: "<"},
                            {name: "<=", tip: "小于等于", label: "<="},
                            {name: "!=", tip: "不等于", label: "!="},
                            {name: "==", tip: "等于", label: "=="},
                            {name: "'", tip: "单引号", label: "'"},
                            {name: "&nbsp;", tip: "空格", label: "空格"}
                        ],
                        JAVA: [
                            {name: "+", tip: "加", label: "+"},
                            {name: "-", tip: "减", label: "-"},
                            {name: "*", tip: "乘", label: "*"},
                            {name: "/", tip: "除", label: "/"},
                            {name: "%", tip: "求模", label: "%"},
                            {name: "||", tip: "或者", label: "||"},
                            {name: "&&", tip: "并且", label: "&&"},
                            {name: "!", tip: "非", label: "!"},
                            {name: ">", tip: "大于", label: ">"},
                            {name: ">=", tip: "大于等于", label: ">="},
                            {name: "<", tip: "小于", label: "<"},
                            {name: "<=", tip: "小于等于", label: "<="},
                            {name: "!=", tip: "不等于", label: "!="},
                            {name: "==", tip: "等于", label: "=="},
                            {name: "\"", tip: "双引号", label: "\""},
                            {name: "&nbsp;", tip: "空格", label: "空格"}
                        ],
                        JS_A: [
                            {name: "+", tip: "加", label: "+"},
                            {name: "-", tip: "减", label: "-"},
                            {name: "*", tip: "乘", label: "*"},
                            {name: "/", tip: "除", label: "/"},
                            {name: "%", tip: "余数", label: "%"},
                            {name: "\"", tip: "双引号", label: "\""},
                            {name: "&nbsp;", tip: "空格", label: "空格"}
                        ]
                    },
                },
                fnData: [
                    {
                        label: '字符串函数',
                        value: 'str function',
                        children: [
                            {
                                label: '字符串转为大写', value: 'upCase', nodeType: 'function', dataType:'string',
                                params: [
                                    {
                                        name: 'str',
                                        dataType: 'string'
                                    }
                                ]
                            },
                            {
                                label: '字符串替换', value: 'strReplace', nodeType: 'function', dataType:'string',
                                params: [
                                    {name: 'str', dataType: 'string'},
                                    {name: 'searchVal', dataType: 'string'},
                                    {name: 'replaceVal', dataType: 'string'}
                                ]
                            },
                            {
                                label: '字符串转时间', value: 'str2Time', nodeType: 'function', dataType: 'Date',
                                params: [
                                    {name: 'str', dataType: 'string'},
                                    {name: 'format', dataType: 'Time'}
                                ]
                            }
                        ]
                    },
                    {
                        label: '日期时间相关常量',
                        value: 'time function',
                        children: [
                            {label: '日期格式1',value:'yyyy-mm-dd',nodeType:'constant',dataType: 'string'},
                            {label: '日期格式2',value:'yyyy-mm-dd',nodeType:'constant',dataType: 'Time'},
                            {label: '日期格式3',value:'yyyy-mm-dd',nodeType:'constant',dataType: 'DateTime'},
                        ]
                    }
                ],
                /*ctxDataset: {
                    'sysName': {//常量
                        'nodeType': 'constant',
                        'label': '系统名称'
                    },
                    'true': {//常量
                        'nodeType': 'constant',
                        'label': '真'
                    },
                    'false': {//常量
                        'nodeType': 'constant',
                        'label': '假'
                    },
                    'userInfo': {
                        'nodeType': 'obj',
                        'label': '用户信息',
                        'property': {
                            'name': {
                                'nodeType': 'property',
                                'label': '用户名',
                            }
                        }
                    }
                },*/
                /*fnDataset: {
                    'upCase': {
                        label: '字符串转为大写'
                    },
                    'strReplace': {
                        params: [
                            {name: 'str', dataType: 'string'},
                            {name: 'searchVal', dataType: 'string'},
                            {name: 'replaceVal', dataType: 'string'},
                        ]
                    },
                    'test': {
                        params: [],
                        label: '测试方法'
                    }
                },*/
                fnParamBHtml: '<span class="expr-fn-param-b">&nbsp;&nbsp;</span>',//开始字符串模板
                fnParamEHtml: '<span class="expr-fn-param-e">&nbsp;&nbsp;</span>',//结束字符串模板
            }
        },
        computed: {
            operators() {
                return this?.config?.operators || this.defaultConfig.defaultOperators['JS']
            },
            fnDataset(){
                let obj = {}
                this.fnData.forEach(item=>{
                    if (item?.children){
                        item.children.forEach(fn=>{
                            this.$set(obj,fn.value,{
                                label:fn.label,
                                params:fn.params
                            })
                        })
                    }
                })
                return obj
            },
            ctxDataset(){
                let obj = {
                    /*'userInfo': {
                        'nodeType': 'object',
                        'label': '用户信息',
                        'property': {
                            'name': {
                                'nodeType': 'property',
                                'label': '用户名',
                            }
                        }
                    }*/
                }
                this.ctxData.forEach(item=>{
                    if (item?.children){
                        item.children.forEach(fn=>{
                            if (fn.dataType==='object'){
                                let objInfo = this.transObjData2CtxData(fn)
                                this.$set(obj,objInfo.value,objInfo)
                            }else {
                                let newItem = {...fn}
                                delete newItem['value']
                                this.$set(obj,fn.value,newItem)
                            }
                        })
                    }
                })
                return obj
            },
        },
        methods: {
            transObjData2CtxData(objData){
                let obj = {
                    property:{}
                }
                for (const objDataKey in objData) {
                    if (objDataKey!=='children'){
                        obj[objDataKey] = objData[objDataKey]
                    }
                }
                if (objData?.children&&Array.isArray(objData.children)){
                    objData.children.forEach(item=>{
                        let newItem = JSON.parse(JSON.stringify(item))

                        let values = newItem.value.split('.')
                        newItem.value = values[values.length-1]

                        obj.property[newItem.value] = newItem
                    })
                }
                return obj
            },
            handlerCtxData(datas=this.ctxData,parentValue){
                datas.forEach(item=>{
                    if (item?.children){
                        item.children.forEach(item1=>{

                            if (item1.nodeType==='object'&&item1.children&&Array.isArray(item1.children)){
                                item1.children.forEach(item2=>{
                                    item2.value = `${item1.value}.${item2.value}`

                                    if (item2.children){
                                        this.handlerCtxData(item2.children,item2.value)
                                    }else {

                                    }
                                })
                            }
                        })
                    }else if (parentValue) {
                        item.value = `${parentValue}.${item.value}`
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                if (value instanceof Object){//不是通过搜索框匹配的
                    let {dataType} = value
                    if(dataType==='Any') return true;

                    let isDateTime = function(t){
                        let list = ['Time','Date','DateTime'];
                        return -1<list.indexOf(t);
                    };
                    let isNumber = function(t){
                        let list = ['Number','Integer','Long','Double','Float','Decimal'];
                        return -1<list.indexOf(t);
                    };
                    if (isDateTime(dataType)){
                        return isDateTime(data.dataType)
                    }
                    if (isNumber(dataType)){
                        return isNumber(data.dataType)
                    }
                    return data.dataType === dataType
                }
                return data.label.indexOf(value) !== -1;
            },
            isEmptyObject(obj) {
                return JSON.stringify(obj) === '{}'
            },
            /**删除光标位置的前节点或者后节点**/
            deleteExprNode: function (evt, after) {
                let range = this.getRange();
                if (range) {
                    let node = range.startContainer;//startOffset,endOffset
                    if (node.nodeType !== 3) {
                        let children = node.childNodes;
                        if (children.length > 0) {
                            let i = range.startOffset - (after ? 0 : 1);
                            if (i >= 0 && children[i].nodeType === 1) {
                                let $tempNode = children[i];
                                if (this.isExprItem($tempNode) && !this.isExprFnParam($tempNode)) {
                                    if (!this.isExprFnParamBegin($tempNode) && !this.isExprFnParamEnd($tempNode)) children[i].remove();
                                    evt.preventDefault()
                                    return false;
                                }
                            }
                        }
                    } else {
                        let pNode = node.parentNode;
                        if (pNode.nodeType === 1) {
                            if (this.isExprItem(pNode) && !this.isExprFnParam(pNode)) {
                                if (!this.isExprFnParamBegin(pNode) && !this.isExprFnParamEnd(pNode)) pNode.remove();
                                evt.preventDefault()
                                return false;
                            }
                        }
                        if (after) {
                            if (node.length === range.endOffset) {
                                //光标在字符最后
                                let nNode = node.nextSibling;
                                if (this.isExprItem(nNode) && !this.isExprFnParam(nNode)) {
                                    if (!this.isExprFnParamBegin(nNode) && !this.isExprFnParamEnd(nNode)) nNode.remove();
                                    evt.preventDefault()
                                    return false;
                                }
                            }
                        }
                    }
                }
                this.lastRange = this.getRange();
                this.reCursor(true);
            },
            // 光标选中某个节点
            selectNode(node) {
                if (node && node.childNodes.length > 0) {
                    let range = document.createRange();
                    let isFnParam = this.isExprFnParam(node);
                    range.setStart(node, isFnParam ? 1 : 0);
                    range.setEnd(node, isFnParam ? node.childNodes.length - 1 : node.childNodes.length);
                    let sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            },
            isExprItem(node) {
                return this.isExprFn(node) || this.isExprConst(node) || this.isExprFnParam(node) || this.isExprFnParamBegin(node) || this.isExprFnParamEnd(node) || this.isExprObject(node)
            },
            isExprFn(node) {
                let classes = node.getAttribute && node.getAttribute('class');
                classes = classes ? classes.split(' ') : []
                return classes.includes('expr-function')
            },
            isExprConst(node) {
                let classes = node.getAttribute && node.getAttribute('class');
                classes = classes ? classes.split(' ') : []
                return classes.includes('expr-constant')
            },
            isExprObject(node) {
                let classes = node.getAttribute && node.getAttribute('class');
                classes = classes ? classes.split(' ') : []
                return classes.includes('expr-object')
            },
            isExprFnParam(node) {
                let classes = node.getAttribute && node.getAttribute('class');
                classes = classes ? classes.split(' ') : []
                return classes.includes('expr-fnparam')
            },
            isExprFnParamBegin(node) {
                let classes = node.getAttribute && node.getAttribute('class');
                classes = classes ? classes.split(' ') : []
                return classes.includes('expr-fn-param-b')
            },
            isExprFnParamEnd(node) {
                let classes = node.getAttribute && node.getAttribute('class');
                classes = classes ? classes.split(' ') : []
                return classes.includes('expr-fn-param-e')
            },
            /**控制光标位置到表达式节点后**/
            reCursor(before, selectType = 'noSelect') {
                let self = this;
                let range = this.getRange();
                let dataType;
                if (range) {
                    let node = range.startContainer;//startOffset,endOffset
                    if (node.nodeType === 3) {//节点类型  Text
                        let pNode = node.parentNode;
                        if (pNode.nodeType === 1) {//父节点 节点类型为 Element
                            if (this.isExprItem(pNode)) {
                                if (!this.isExprFnParam(pNode) && !this.isExprFnParamBegin(pNode) && !this.isExprFnParamEnd(pNode)) this.cursorTo(pNode, before);
                                else {
                                    if (before && this.isExprFnParamBegin(pNode)) {
                                        this.cursorTo(pNode);
                                        self.lastSelectNode = null;
                                        self.lastRange = this.getRange();
                                        return;
                                    } else {
                                        if ((!before && this.isExprFnParamBegin(pNode)) || this.isExprFnParamEnd(pNode)) {
                                            pNode = pNode.parentNode;
                                            selectType = 'select';
                                        }
                                        //根据参数类型进行过滤
                                        dataType = this.closest(node,'expr-fnparam').getAttribute('dataType')
                                        this.filterByDataType({dataType});

                                        if ('select' === selectType || ('autoSelect' === selectType && self.lastSelectNode !== pNode)) {
                                            this.selectNode(pNode);
                                            self.lastSelectNode = pNode;
                                        } else self.lastSelectNode = null;
                                        self.lastRange = this.getRange();
                                        return;
                                    }
                                }
                                self.lastSelectNode = null;
                                self.lastRange = this.getRange();
                            }
                        }
                    } else if (node.nodeType === 1) {//如果点击的是函数的参数，那么直接选中参数
                        if (this.isExprFnParam(node)){
                            //根据参数类型进行过滤
                            /*dataType = $(node).attr('dataType');
                            self._filterByDataType(dataType);*/
                            this.selectNode(node);
                            self.lastSelectNode = node;
                            self.lastRange = this.getRange();
                        }
                        /*if (node.className==='expression-edit'){
                            this.$nextTick(()=>{
                                this.reCursor()
                            })
                        }*/
                        return;
                    }
                    this.filterByDataType();
                }
            },
            //兼容mac safari range会按一定规则变化，导致不能插入到正确位置
            processRange(range) {
                //判断range是否col，const，fn节点，如果是插入时重新产生range,插入到节点后
                if (range && range.collapsed && range.endContainer.nodeType === 3) {
                    let rangeNode = range.endContainer;
                    let $rangeNode = rangeNode;
                    let $parent = $rangeNode.parentNode;
                    if ($parent && (this.isExprObject($parent) || this.isExprConst($parent) || this.isExprFn($parent))) {
                        let b = range.endOffset > 0;
                        range = document.createRange();
                        range[b ? 'setStartAfter' : 'setStartBefore']($parent);
                        range.collapse(true);
                    }
                }
                return range;
            },
            // 编辑器聚焦
            editorClick() {
                this.reCursor(null, 'autoSelect');
                this.lastRange = this.getRange()
            },
            // 编辑器按键监听
            directionKeyDown(evt) {
                switch (evt.key) {
                    case 'Backspace':
                        // evt.preventDefault()
                        this.deleteExprNode(evt)
                        break;
                    case 'Delete':
                        // evt.preventDefault()
                        this.deleteExprNode(evt, true)
                        break;
                    case 'ArrowLeft':
                        // this.reCursor(true)
                        setTimeout(()=>{
                            this.reCursor(true)
                        },0)
                        break;
                    case 'ArrowUp':
                    case 'ArrowRight':
                    case 'ArrowDown':
                        // this.reCursor()
                        setTimeout(()=>{
                            this.reCursor()
                        },0)
                        break;
                }
                this.lastRange = this.getRange()
            },
            directionKeyPress(evt) {
                let range = this.getRange();
                if (range) {
                    //判断range是否col，const，fn节点，如果是插入时重新产生range,插入到节点后
                    range = this.processRange(range);
                    let node = range.startContainer;
                    if (node.nodeType !== 3) {//当光标位置不是text区域时创建text节点

                        let str = String.fromCharCode(evt.keyCode);
                        if (this.trim(str)) {
                            range.deleteContents();
                            node = document.createTextNode(str);
                            range.insertNode(node);
                            this.cursorTo(node);//光标移到新插入的节点后
                            this.lastRange = this.getRange();
                            evt.preventDefault()
                            return false;
                        }
                    }
                }
            },
            trim(str) {
                return (str || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
            },
            // 将html字符串转为dom
            htmlStrToDom(htmlStr) {
                if (!htmlStr) return false
                let doc = new DOMParser().parseFromString(htmlStr, 'text/html')
                if (doc.body.childNodes.length === 1 && doc.body.childNodes[0]['nodeType'] === 3) {//纯文本
                    return doc.body.childNodes[0]
                }
                let dom = doc.getElementById('express-temp-dom')
                dom.removeAttribute('id')
                return dom;
            },
            // 获取光标位置
            getRange() {
                if (window.getSelection) {
                    let sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        let ret = sel.getRangeAt(0);
                        return ret;
                    }
                }
            },
            checkRange(range) {
                if (!range) return false;
                return true
                /*let node = range.commonAncestorContainer;//返回目标节点的共有祖先节点
                return this.isExpressionChild(node);*/
            },
            isExpressionChild(node) {
                let $node = node;
                let nodeClasses = $node.getAttribute('class')
                let classes = nodeClasses ? nodeClasses.split(' ') : []
                if (classes.includes('expression-wrap')) return false
                if (classes.includes('expression-value')) return true;
                let $parent = $node.parentNode;
                if ($parent) return this.isExpressionChild($parent);
                else return false;
            },
            // 光标移动到最后
            cursorToEnd(node) {
                if (node)
                    this.cursorTo(node.lastChild);
            },
            // 移动光标
            cursorTo(node, before) {
                if (node) {
                    let range = document.createRange();
                    range[!before ? 'setStartAfter' : 'setStartBefore'](node);
                    range.collapse(true);
                    let sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            },
            /*
            * 根据树形的语法结构tokens生成最终可视化显示结构
            * */
            token2Html(token, htmlEscape) {
                let {type} = token

                let $this = this
                const childNodeAddType = (_token) => {
                    // let {type} = token;
                    /*if (type) {
                        let node = this.token2Html(_token,htmlEscape);
                        return node.prop("outerHTML") ? node.prop("outerHTML") : this.token2Html(_token,htmlEscape);
                    }*/
                    return $this.token2Html(_token, htmlEscape);
                }

                if (type === 'string') {
                    return token.str
                } else if (type === 'constant') {//常量
                    return `<span class="expr-constant" _value_="${token.str}">${token.label || token.str}</span>`
                } else if (type === 'object') {
                    return `<span class="expr-object" _value_="${token.str}">${token.label || token.str}</span>`
                } else if (type === 'function') {
                    token.str = token.str.replaceAll('"', '\"')
                    let list = []
                    list.push(`<span class="expr-function" _value_="${token.str}">${token.label || token.str}(`)
                    if (Array.isArray(token.params)) {
                        for (let i = 0, l = token.params.length; i < l; i++) {
                            if (i > 0) list.push(',');
                            // list.push(token.params[i]['tokens'][0]['str'])
                            list.push(childNodeAddType(token.params[i]));
                        }
                    }

                    list.push(')</span>');
                    return list.join('')
                } else if (type === 'fnparam') {
                    let text = '', tmps;
                    if (Array.isArray(token.tokens)) {
                        tmps = [];
                        let ts = token.tokens;
                        for (let i = 0; i < ts.length; i++) {
                            tmps.push(childNodeAddType(ts[i]));
                        }
                        text = tmps.join('');
                    }
                    text = text.replaceAll('"', '\"')
                    return `<span class="expr-fnparam" dataType="${token.dataType}">${this.fnParamBHtml}${text}${this.fnParamEHtml}</span>`
                }
                return token.str
            },
            /*
            *
            * */
            // 设计器回显
            setValue(val) {
                if (val && val.indexOf('js:') === 0) val = val.substring(3);//处理js:开头的表达式

                let tokens = buildExprTokenTree(val, this.ctxDataset, this.fnDataset)

                if (Array.isArray(tokens)) {
                    let showText = ''

                    tokens.forEach((item, index) => {
                        let text = this.token2Html(item)
                        if (item.type === 'string') {
                            this.insertContent(item.str)
                        } else {
                            this.insertContent({
                                type: item.type,
                                text
                            })
                        }
                        // showText += item.label||item.str
                    })

                    /*this.$valueInput.append(showText)*/
                }
            },
            // 将表达式设计器显示的内容转为代码
            getValueFromEle(node) {
                if (node) {
                    if (node.nodeType === 3) return node.nodeValue;//文本节点  直接返回
                    if (this.isExprFnParamBegin(node) || this.isExprFnParamEnd(node)) return "";
                    if (this.isExprConst(node)) {
                        return node.getAttribute('_value_') || "";
                    }
                    if (this.isExprObject(node)) {
                        return node.getAttribute('_value_') || "";
                    }

                    let list = [];
                    let isFn = this.isExprFn(node);
                    if (isFn) {
                        list.push(node.getAttribute('_value_') || "");
                        list.push('(');
                    }
                    let children = node.childNodes, j = 0;
                    for (let i = 0; i < children.length; i++) {
                        if (isFn && this.isExprFnParam(children[i])) {
                            if (j > 0) list.push(',')
                            list.push(this.getValueFromEle(children[i]));
                            j++;
                        } else if (!isFn)
                            list.push(this.getValueFromEle(children[i]));
                    }
                    if (isFn) list.push(')');

                    let ret = list.join("").trim();
                    if (ret) ret = ret.replace(/\xa0/g, ' ');//替换连空格
                    return ret || '';
                }
                return ''
            },
            getValue() {
                /*let dependencies = {};
                let imports = {};*/
                let expr = this.getValueFromEle(this.$valueInput);
                /*let ext = undefined;
                if(this.config.hasDependencie && !$.isEmptyObject(dependencies)){
                    let l = [], ext = ext || {};
                    ext['dependencies'] = l;
                    $.each(dependencies,function(n,v){
                        l.push(n);
                    });
                }else if(!$.isEmptyObject(imports)){
                    let l = [], ext = ext || {};
                    ext['imports'] = l;
                    $.each(imports,function(n,v){
                        l.push(v);
                    });
                }
                if(ext){
                    expr = expr + '/!*' + JSON.stringify(ext) + '*!/';
                }*/
                this.expressRes = expr
                return expr;
            },
            // 插入文本
            insertText(str, range) {
                let textNode
                if (!this.checkRange(range)) {//没有光标位置插入到最后
                    this.$valueInput.append(str);
                } else {
                    range.deleteContents();
                    //判断range是否col，const，fn节点，如果是插入时重新产生range,插入到节点后
                    range = this.processRange(range);
                    textNode = document.createTextNode(str);
                    range.insertNode(textNode);
                    this.cursorTo(textNode);//光标移到新插入的节点后
                }
                return textNode;
            },
            // 插入HTML
            insertHtml(htmlStr, range) {
                htmlStr = htmlStr.replace('class', 'id="express-temp-dom" class')
                let node = this.htmlStrToDom(htmlStr)
                if (!this.checkRange(range)) {//没有光标位置插入到最后
                    this.$valueInput.append(node ? node : htmlStr);
                } else {
                    range.deleteContents();
                    if (node.nodeType === 3) {//纯文本节点
                        node = document.createTextNode(htmlStr);
                    }
                    range.insertNode(node);
                }
                this.cursorTo(node);//光标移到新插入的节点后
                return node;
            },
            // 插入内容
            insertContent(value) {
                let isObject = value instanceof Object
                let htmlStr = isObject ? value.text : value

                let node = isObject ? this.insertHtml(htmlStr, this.lastRange) : this.insertText(htmlStr, this.lastRange)

                this.lastRange = this.getRange();
            },

            addItem(str) {
                this.setValue(str)
            },
            // 点击操作符
            operatorAdd(operate) {
                let value = operate.name;
                if ('"' !== value && '\xa0' !== value) this.insertContent(" " + value + " ");
                else this.insertContent(value);
            },
            // 点击右侧树节点
            fnNodeClick(data, node, com) {
                if (data.nodeType==='function'){
                    let parStr = ''
                    this.fnDataset[data.value]['params'].forEach((param,index)=>{
                        if (index)parStr+=','
                        parStr += param.name
                    })
                    this.addItem(`${data.value}(${parStr})`)
                }else if (data.nodeType==='constant'){
                    this.addItem(data.value)
                }
            },
            constNodeClick(data, node, com){
                this.addItem(data.value)
            },
            filterByDataType(dataType){
                this.$refs.functionTree.filter(dataType);
                this.$refs.constTree.filter(dataType);
            },
            closest(node,className){
                if (node.nodeType!==1){
                    node = node.parentNode
                    node = this.closest(node,className)
                }else {
                    let classes = node.getAttribute('class')||''
                    classes = classes.split(' ')
                    if (!classes.includes(className)){
                        node = node.parentNode
                        node = this.closest(node,className)
                    }else {
                        return node
                    }
                }
                return node
            },
            clearExpress(){
                this.$valueInput.innerHTML = ''
                // self.$valueInput.empty();
                this.filterByDataType();
                this.lastSelectNode = null;
                this.lastRange = null;
            }
        },
        mounted() {
            this.$valueInput = this.$refs.edit

            this.handlerCtxData()

            // this.setValue('sysName true userInfo.name userInfo.name.test.aaa upCase(test("aaa"),str,str1)')
            // this.setValue('sysName true userInfo.name userInfo.name.test.aaa')
            // this.setValue('upCase(test("aaa"),str,str1) aaa sysName')

            this.$nextTick(() => {
                this.$valueInput.focus();
                this.cursorToEnd(this.$valueInput)

                this.lastRange = this.getRange()
            })
        },
        watch: {
            filterFnData(val) {
                this.$refs.functionTree.filter(dataType);
            },
            filterCtxData(val){
                this.$refs.constTree.filter(val)
            }
        },
    }
</script>

<style>
    .expression-wrap{
        border: 1px solid rgb(204, 211, 219);
    }
    .expression-top-wrap{
        border-bottom: 1px solid rgb(204, 211, 219);
        height: 400px;
    }
    .left-expression-tree-wrap{
        border-right: 1px solid rgb(204, 211, 219);

    }
    .expression-tree-wrap{
        padding: 10px;
        height: 100%;
    }
    .tree-wrap{
        height: calc(100% - 30px);
        margin-top: 5px;
        border: 1px dotted rgb(204, 211, 219);
    }
    .expression-operate-warp{
        background-color: #EEEEEE;
    }
    .expression-operate-warp .el-button-group .el-button--info{
        background-color: #EDF4FF;
        color: #434955;
        border-left-color: #E0E4EF !important;
    }
    .expression-edit {
        height: 300px;
        border-top: 1px solid rgb(204, 211, 219);
        padding: 10px;
    }
    .expression-edit:focus-visible{
        outline:none;
    }

    /*.expr-constant{
        color: #009999;
        background: #CCFFE6;
        padding: 5px;
        margin-right: 5px;
    }*/
    .expr-function, .expr-object, .expr-constant {
        background-color: #DEF0D6;
        color: #424b4d;
        padding: 5px;
        margin-right: 5px;
    }

    .expr-fn-param-b, .expr-fn-param-e {
        background-color: #F3DDDF;
    }

    .expr-fn-param-b {
        border-right: 1px #817a7a dotted;
    }

    .expr-fn-param-e {
        border-left: 1px #817a7a dotted;
    }

    .expr-fnparam {
        border: 1px #817a7a dotted;
    }

    /*.object{
        background-color: #AA7731;
    }*/
    .operator-item {
        border: 1px solid #eee;
        display: inline-block;
        width: 30px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
    }
</style>
