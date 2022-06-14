let ExprToken = function(str,index){
    this.str = str;
    this.index = index;
};

export function buildExprTokenTree(expr, ctxDataset, fnDataset) {
    if(expr && 'string'===typeof(expr)){
        let tokens = expr2Token(expr);
        console.log('tokens')
        console.log(tokens)
        // let items = _buildExprTokenTree(tokens, 0, ctxDataset, fnDataset);
        let items = translateFromToken(tokens, ctxDataset, fnDataset);
        console.log(items)
        return items;
    }
}

function expr2Token(expr){
    // console.log('表达式：'+expr)
    let tokens = [], ctx = {startIndx:0};
    buildToken(expr, tokens, ctx);
    return tokens;
}

let singleOperator = ["+","-","*","/","%"," ","\n","\t","(",")",",","[","]","{","}",":",";"];
function buildToken(expr, tokens, ctx){
    for(var i = ctx.startIndx, l = expr.length; i<l; i++){
        let char = expr[i];
        if("/"===char&&"*"===expr[i+1]){
            //注释部分,不支持嵌套
            let idx = i+1;
            if(ctx.startIndx<i){
                tokens.push(new ExprToken(expr.substring(ctx.startIndx, i),ctx.startIndx));
            }
            while(idx<l-1){
                if('*'===expr[idx] && '/'===expr[idx+1]){//TODO 需要增加分析转义的
                    idx = idx+2;
                    ctx.startIndx = idx;
                    break;
                }
                idx++;
            }
            i = idx-1;//因为for中i会执行++
        }else if(singleOperator.indexOf(char)>-1 || 160===char.charCodeAt(0)){//TODO 还要处理所有的不可见字符
            if(ctx.startIndx<i){
                tokens.push(new ExprToken(expr.substring(ctx.startIndx, i),ctx.startIndx));
            }
            tokens.push(new ExprToken(char,i));
            ctx.startIndx = i+1;
        }else if(['>','<','!','='].indexOf(char)>-1){
            if(expr[i+1]==='='){
                if(ctx.startIndx<i){
                    tokens.push(new ExprToken(expr.substring(ctx.startIndx, i),ctx.startIndx));
                }
                tokens.push(new ExprToken(char+expr[i+1],i));
                i++;
            }else{
                if(ctx.startIndx<i){
                    tokens.push(new ExprToken(expr.substring(ctx.startIndx, i),ctx.startIndx));
                }
                tokens.push(new ExprToken(char,i));
            }
            ctx.startIndx = i+1;
        }else if(("|"===char&&"|"===expr[i+1]) || ('&'===char&&"&"===expr[i+1])){
            if(ctx.startIndx<i){
                tokens.push(new ExprToken(expr.substring(ctx.startIndx, i),ctx.startIndx));
            }
            tokens.push(new ExprToken(char+expr[i+1],i));
            i++;
            ctx.startIndx = i+1;
        }else if("'"===char || '"'===char){
            let idx = i+1;
            if(ctx.startIndx<i){
                tokens.push(new ExprToken(expr.substring(ctx.startIndx, i),ctx.startIndx));
            }
            while(idx<l){
                if(char===expr[idx]){//TODO 需要增加分析转义的
                    tokens.push(new ExprToken(expr.substring(i, idx+1),i));
                    ctx.startIndx = idx+1;
                    break;
                }
                idx++;
            }
            i = idx;
        }
    }
    if(ctx.startIndx<i){
        tokens.push(new ExprToken(expr.substring(ctx.startIndx, i),ctx.startIndx));
    }
}

// 将token翻译成要显示的文本
function translateFromToken(tokens,ctxDataset={},fnDataset={}) {
    let ret = [],record
    if (tokens){
        for (let i=0,l=tokens.length;i<l;i++){
            let t = tokens[i];
            let str = t.str;
            debugger
            record = ctxDataset[str]
            if (record?.nodeType==='constant'){// 常量
                ret.push({str, label: record.label || str, type:  "constant"});
            }else if(str.includes('.')){//解析对象  如果字符串里面含有点  “.” ，则认为是对象的调用
                let label = translateObjStr(str,ctxDataset)
                ret.push({str,label,type:'object'})
            }else if(fnDataset[str]){
                record = fnDataset[str]
                let fnToken = {str,type:'function',label:record.label||str,params:[]};
                // 获取方法的参数列表
                let paramTokens = _getFnParamsToken(tokens, i+1);
                let tempTokens = translateFromToken(paramTokens.tokens, ctxDataset, fnDataset);

                /*bin add*/
                tokens.splice(i+1,paramTokens.idx)
                l = l-paramTokens.idx
                /*bin end*/

                if(Array.isArray(tempTokens)){
                    let j = 0,ts=[],f1=0,f2=0,f3=0;
                    for(let k=0; k<tempTokens.length; k++){
                        let t = tempTokens[k];
                        //增加(),[],{}处理，两者都认为是整体
                        if('('===t.str) f1++;
                        else if(')'===t.str) f1--;
                        else if('['===t.str) f2++;
                        else if(']'===t.str) f2--;
                        else if('{'===t.str) f3++;
                        else if('}'===t.str) f3--;
                        if(f1!==0 || f2!==0 || f3!==0 || (f1===0 && f2===0 && f3===0 && ','!==t.str)){
                            ts.push(t);
                        }else if(f1===0 && f2===0 && f3===0){
                            fnToken.params.push({tokens:ts,type:'fnparam',dataType:record.params[j].dataType});
                            j++;
                            ts=[];
                        }
                    }
                    if(ts.length>0){
                        fnToken.params.push({tokens:ts,type:'fnparam',dataType:record.params[j].dataType});
                    }
                    if(record.params && fnToken.params.length<record.params.length){
                        //增加没有定义的参数
                        for(let j=fnToken.params.length; j<record.params.length; j++){
                            fnToken.params.push({tokens:[{type:'string1',str:record.params[j].name}],type:'fnparam',dataType:record.params[j].dataType});
                        }
                    }
                }
                ret.push(fnToken);
            }else {//都不满足，原样返回
                ret.push({str,type:'string'});
            }
        }
    }
    return ret
}

// 解析对象字符串
function translateObjStr(str,ctxDataset,label=''){
    let objKeys = str.split('.')
    let currentKey = objKeys[0]
    let objInfo = ctxDataset[currentKey]
    if (label) label+='.'
    if (objInfo?.label){
        label = label+objInfo.label
    }else {
        label = label+currentKey
    }
    if (objKeys[2]){//当前key 对应的值也是对象
        let newStr = ''
        objKeys.forEach((str,index)=>{
            if (index){
                if (newStr)newStr+='.'
                newStr = newStr+str
            }
        })
        label = translateObjStr(newStr,ctxDataset,label)
    }else{
        if (objInfo){
            let propInfo = objInfo['property']
            if (propInfo&&propInfo[objKeys[1]]){
                label = label+'.'+propInfo[objKeys[1]]['label']||objKeys[1]
            }else {
                label = label + '.'+objKeys[1]
            }
        }else {
            label = label + '.'+objKeys[1]
        }
    }
    return label
}

//获取函数的整个参数部分,字符token列表
function _getFnParamsToken(tokens,idx){
    var l=tokens.length,lcount=0,ret=[];
    if('('===tokens[idx].str){
        while(idx<l){
            if('('===tokens[idx].str){
                if(lcount>0) ret.push(tokens[idx]);
                lcount++;
            }else if(')'===tokens[idx].str){
                lcount--;
                if(lcount===0) break;
                else ret.push(tokens[idx]);
            }else ret.push(tokens[idx]);
            idx++;
        }
    }
    return {tokens:ret,idx:idx};
};

