<template>
    <div>
        <textarea ref="mycode" class="textarea" v-model="textarea"></textarea>
        <!--<el-button @click="setting()">设置</el-button>-->
        <el-row>
            <el-col :span="8">
                <el-link type="info" :underline="false">快捷取值</el-link>
                <br>
                <template  v-for="(item,index) of list1">
                    <el-button :key="index" type="text" @click="updateExpress(item)">{{item.label}}</el-button>
                    <br>
                </template>
            </el-col>
            <el-col :span="8">
                <el-link type="info" :underline="false">公式</el-link>
                <br>
                <template  v-for="(item,index) of list2">
                    <el-button :key="index" type="text" @click="updateExpress(item)">{{item.label}}</el-button>
                    <br>
                </template>
            </el-col>
            <el-col :span="8"></el-col>
        </el-row>
    </div>
</template>

<script>
    import {Tooltip,Dialog} from 'element-ui'
    import 'codemirror/mode/javascript/javascript'
    import 'codemirror/mode/sql/sql'
    import 'codemirror/addon/hint/show-hint'
    import 'codemirror/addon/hint/javascript-hint.js'

    import 'codemirror/addon/fold/foldcode.js'
    import 'codemirror/addon/fold/foldgutter.js'
    import 'codemirror/addon/edit/closebrackets.js'
    import 'codemirror/addon/edit/matchbrackets.js'
    //文本编辑器主题样式文件引入
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/tomorrow-night-bright.css'
    import 'codemirror/addon/hint/show-hint.css'
    import 'codemirror/theme/idea.css'
    import 'codemirror/theme/lesser-dark.css'

    // 代码段折叠功能
    import 'codemirror/addon/fold/foldcode'
    import 'codemirror/addon/fold/foldgutter'
    import 'codemirror/addon/fold/foldgutter.css'

    import 'codemirror/addon/fold/brace-fold'
    import 'codemirror/addon/fold/comment-fold'
    import 'codemirror/addon/fold/xml-fold.js';
    import 'codemirror/addon/fold/indent-fold.js';
    import 'codemirror/addon/fold/markdown-fold.js';

    import CodeMirror from 'codemirror'
    export default {
        data(){
            return{
                textarea:'',
                editorText:null,
                list1:[
                    {
                        label:'销售中心',
                        express:'@departmentId(org,fc7b8209-5f45-40ef-b251-93242600c5b2)',
                        type:'label',
                    },
                    {
                        label:'销售3部',
                        express:'@departmentId(org,8b2931c7-c88b-4367-87e1-26072ebcda5b)',
                        type:'label',
                    },
                    {
                        label:'渠道经理',
                        express:'@form(AWS_NODE_DR_ID_c1dc8de1-3ef1-4c21-9be1-07dec19a9fda_8b2931c7-c88b-4367-87e1-26072ebcda5b)',
                        type:'express',
                    }
                ],
                list2:[
                    {
                        label:'@date()',
                        express:'@date()',
                        type:'express'
                    },
                    {
                        label:'@time(datetime)',
                        express:'@time(datetime)',
                        type:'express'
                    },
                ]
            }
        },
        methods: {
            // 获取光标的位置
            getCursor(start="head"){
                return this.editorText.getCursor(start)
            },
            // 设置光标位置
            setCursor({line, ch}){
                this.editorText.setCursor({line,ch})
            },
            getValue(){
                return this.editorText.getValue()
            },
            setValue(content){
                this.editorText.setValue(content)
            },
            replaceRange(replacement,from,to){
                this.editorText.replaceRange(replacement,from,to)
            },
            markText(){

            },
            updateExpress(item){
                let cursorInfo = this.getCursor()

                let newText = item[item.type]
                let newTextLength = newText.length
                this.replaceRange(newText,cursorInfo)

                if (item.type==='label'){
                    let endCursorInfo = {...cursorInfo}
                    endCursorInfo.ch = endCursorInfo.ch+newTextLength
                    this.editorText.markText(cursorInfo,endCursorInfo,{
                        className:'cm-field cm-field-Company',
                        atomic:true,
                    })
                }else {
                    let firstKh = item.express.indexOf('(')
                    let firstCursorInfo = {...cursorInfo}
                    firstCursorInfo.ch += firstKh+1
                    this.editorText.markText(cursorInfo,firstCursorInfo,{
                        className:'cm-keyword',
                        atomic:false,
                    })

                    let lastBeginCursorInfo = {...cursorInfo}
                    lastBeginCursorInfo.ch += newTextLength-1
                    let lastEndCursorInfo = {...lastBeginCursorInfo}
                    lastEndCursorInfo.ch = lastBeginCursorInfo.ch+1
                    this.editorText.markText(lastBeginCursorInfo,lastEndCursorInfo,{
                        className:'cm-keyword',
                        atomic:false,
                    })
                }

                /*let el = document.createElement('span')
                el.innerText = item.label
                el.setAttribute('data-field',`formData.${item.express}`)
                el.setAttribute('class','cm-field cm-field-Company')
                this.editorText.setBookmark(this.getCursor(),{widget:el,insertLeft:true,shared:true,handleMouseEvents:true})*/
            },
            setting(){
                let data = {name:'test',label:'测试'}
                var el = document.createElement('span')
                el.innerText = data.label
                el.setAttribute('data-field',`formData.${data.name}`)
                el.setAttribute('class','cm-field cm-field-Company')

                // let text = this.editorText.setBookmark(this.getCursor(),{widget:el,insertLeft:true,shared:true,handleMouseEvents:true})

                this.editorText.markText({line:0,ch:0},{line:0,ch:3},{
                    className:'cm-field cm-field-Company',
                    atomic:true,
                })
                this.editorText.markText({line:0,ch:5},{line:0,ch:9},{
                    className:'cm-field cm-field-Company',
                    atomic:true,
                })

                // let text = this.editorText.addLineWidget(0,el,{above:true,handleMouseEvents:true})
                console.log(text)
                console.log(this.getCursor())
                // doc.getRange
            }
        },
        mounted() {
            this.editorText = CodeMirror.fromTextArea(this.$refs.mycode, {
                value:"function test(){console.log('test')}\n",
                lineNumbers:true,
                mode: {name: "javascript", json: true},
                smartIndent: true , //智能缩进
                indentUnit: 4, // 智能缩进单位为4个空格长度
                indentWithTabs:true,  // 使用制表符进行智能缩进
                lineWrapping:true,//
                // 在行槽中添加行号显示器、折叠器、语法检测器`
                gutters: ["CodeMirror-linenumbers","CodeMirror-foldgutter","CodeMirror-lint-markers"],
                foldGutter:true, // 启用行槽中的代码折叠
                autofocus:false,  //自动聚焦
                matchBrackets:true,// 匹配结束符号，比如"]、}"
                autoCloseBrackets: true , // 自动闭合符号
                styleActiveLine:true, // 显示选中行的样式
                // theme:"lesser-dark",// 主题
                lineSeparator: '\n',
                extraKeys:{
                    "F11": function(cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    },
                    "Esc": function(cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    }
                }
            });
        }
    }
</script>

<style>
    .cs-ide-field.cs-ide-field-name{
        color: #009999;
        background: #CCFFE6;
    }
    .cm-field {
        display: inline-block;
        color: #FFFFFF;
        font-size: 12px;
        font-family: "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
        border-radius: 2px;
        padding: 0 5px;
        margin: 1px;
    }
    .cm-field.cm-field-Company {
        color: #009999;
        background: #CCFFE6;
    }

    .cm-keyword{
        color: #CC66CC;
        font-weight: bold
    }

    .textarea{
        width: 100px;height: 50px;
    }
</style>
