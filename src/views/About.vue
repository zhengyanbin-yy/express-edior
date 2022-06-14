<script src="../../../wx download/WXWork/1688857588289766/Cache/File/2022-05/expressionEditor.js"></script>
<template>
    <div>
        <el-card>
            <el-row v-show="false">
                <el-col :span="16">
                    <div class="btn-box">
                        <div>
                            <el-button type="primary" v-for="item in btnList" :key="item" style="margin-right: 10px" @click="setDataList(item, 0)">
                                {{ item }}
                            </el-button>
                        </div>
                        <div>
                            <el-button @click="onExport" style="margin-right: 10px"> 导出表达式 </el-button>
                            <el-button style="margin-right: 10px"> 清空 </el-button>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16" style="padding: 10px">
                    <div ref="editor" class="box" contenteditable="true" @blur="onblur" @click="onclick" @focus="onfocus" @input="oninput"></div>
                </el-col>
                <el-col :span="8">
                    <el-button v-for="item in textList" :key="item" style="margin-right: 10px; margin-top: 10px" @click="setDataList(item, 1)">{{ item }}</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
    const btnList = ['+', '-', '*', '/', '(', ')', 'DEL']
    const textList = ['电量1', '电量2', '电量3']
    const correspondingTable = {
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        '(': '(',
        ')': ')',
        '.': '.',
        电量1: '#elect1#',
        电量2: '#elect2#',
        电量3: '#elect3#',
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
    }
    export default {
        data() {
            return {
                btnList,
                textList,
                correspondingTable,
                // 真实数据位置
                realDomKeys: [],
                // 储存对应的字符串值
                dataList: [],
                // 光标位置
                focusOffset: 0,
                // 定义最后光标对象
                lastEditRange: null,
            }
        },
        mounted() {},
        methods: {
            setDataList(val, type) {
                // 记录数据存储位置(指的是数据所在数组位置的下标值)
                let cursorJS
                // 记录光标存在位置(指的是当前光标前的数据个数)
                let cursorDom = this.focusOffset

                // 判断光标所处位置,如果在中文体内,则放到中文右括号侧,其余情况确认光标的真实指向
                // 光标是否位于最末尾
                if (cursorDom < this.realDomKeys.length && cursorDom > 0) {
                    // 判断光标是否在中文体内,如果在就让光标落到此中文最右边(右括号侧
                    if (this.realDomKeys[cursorDom] instanceof Object) {
                        //  在中文体内
                        // 记录光标应该在的位置和对应此刻数据存储位置
                        if (cursorDom == this.realDomKeys[cursorDom].start) {
                            // console.log('@@光标在中文体旁边')
                        } else {
                            cursorDom = this.realDomKeys[cursorDom].start + this.realDomKeys[cursorDom].n
                            // console.log('@@光标在中文体内')
                        }
                        cursorJS = this.getCursorJS(cursorDom) - 1 //取的是当前指向数据的下标值
                    } else {
                        //  不在中文体内
                        cursorJS = this.getCursorJS(cursorDom) - 1
                        // console.log('@@光标在在中文体外,且在数组内,真实数据位置为', cursorJS)
                    }
                } else if (cursorDom == this.realDomKeys.length) {
                    // 位于最末尾
                    cursorJS = this.dataList.length - 1
                } else if (cursorDom == 0) {
                    // 位于最前端
                    cursorJS = -1
                }

                // 增减datalist数据
                if (val instanceof Object) {
                    // this.dataList.push(val.name)
                } else if (val == 'DEL') {
                    // 删除数据
                    let str
                    if (cursorJS != -1) {
                        //如果在最前端刪除無效,即cursorJS=-1和0
                        str = this.dataList[cursorJS]
                        this.dataList.splice(cursorJS, 1)
                        this.setRealDomKeys()
                        if (/.*[\u4e00-\u9fa5]+.*$/.test(str) || str.length > 1) {
                            // cursorDom = cursorDom - str.length - 2
                            cursorDom--
                        } else {
                            cursorDom--
                        }
                    }
                } else {
                    //添加数据
                    this.dataList.splice(cursorJS == -1 ? 0 : cursorJS + 1, 0, val)
                    this.setRealDomKeys()
                    if (type) {
                        // cursorDom += val.length + 2
                        cursorDom++
                    } else {
                        cursorDom++
                    }
                }
                this.focusOffset = cursorDom
                this.keepLastIndex(this.$refs.editor)
            },
            // 重新计算dataList的对应realDomKeys
            setRealDomKeys() {
                this.realDomKeys = []
                this.dataList.forEach((item, index) => {
                    //判断是否为设备名
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(item) || item.length > 1) {
                        //凡是包含中文,以及字符串长度大于1的都默认为设备名
                        let len = item.length + 2
                        let i = 0
                        let reaLen = this.realDomKeys.length
                        while (i < len) {
                            this.realDomKeys.push({
                                index: index, //对应数据数组的下标值
                                start: reaLen, //此数据在realDomKeys起始下标
                                n: len, //共占有多少数据格
                            })
                            i++
                        }
                    } else {
                        this.realDomKeys.push(index)
                    }
                })
            },
            // 获取当光标不在中文体内时,对应的数据位置
            getCursorJS(cursorDom) {
                let count = 0
                let i = 0
                while (i < cursorDom) {
                    if (this.realDomKeys[i] instanceof Object) {
                        count++
                        i += this.realDomKeys[i].n
                    } else {
                        count++
                        i++
                    }
                }
                return count
            },
            // 检查输入是否是数组或者+-/*.0-9
            oninput(e) {
                var text
                if (!e.data) {
                    this.setDataList('DEL', 0)
                    this.keepLastIndex(this.$refs.editor)
                } else {
                    text = e.data
                    this.setDataList(text, 0)
                }
            },
            keepLastIndex(obj) {
                if (window.getSelection) {
                    obj.focus()
                    // 获取选定对象
                    var selection = getSelection()
                    if (this.lastEditRange) {
                        // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
                        selection.removeAllRanges()
                        selection.addRange(this.lastEditRange)
                    }
                    obj.innerHTML = this.getHtml()
                    debugger
                    selection.collapse(selection.anchorNode.childNodes[0], 1)
                    // selection.collapse(selection.anchorNode.childNodes[0], this.focusOffset)
                }
            },
            // 将存储数据转化成html
            getHtml() {
                let str = ''
                this.dataList.forEach((item) => {
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(item) || item.length > 1) {
                        // str += `(${item})`
                        str += `<input class="word-group" value="${item}">`
                    } else {
                        str += item
                    }
                })
                return str
            },
            // 點擊editor時獲取光標位置
            onclick(e) {
                let selection = window.getSelection()
                debugger
                this.lastEditRange = selection.getRangeAt(0)
                this.focusOffset = selection.focusOffset
            },
            // 将存储数据转化成後端字符串形式
            onExport() {
                let str = ''
                this.dataList.forEach((item) => {
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(item) || item.length > 1) {
                        str += this.correspondingTable[item]
                    } else {
                        str += item
                    }
                })
                console.log(str,JSON.stringify(this.dataList))
            },
            onblur() {
                console.log('onblur')
            },
            onfocus() {
                // console.log('onfocus', window.getSelection(), document.getElementById('editor'))
            },
        },
    }
</script>
<style>
    .word-group{
        color: #409eff;
        background: #ecf5ff;
        margin: 10px 0 0 10px;
        display: inline-block;
        border: 0;
        width: 50px;
    }
    .word-group:hover{
        border: 0 !important;
    }
    .word-group:active{
        border: 0 !important;
    }
    .word-group:link{
        border: 0 !important;
    }
    .word-group:visited{
        border: 0 !important;
    }
    .box {
        border-radius: 5px;
        border: 2px solid #000;
        height: 300px;
        padding: 5px;
    }
    .btn-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .text {
        font-weight: 600;
        color: aquamarine;
    }
</style>


