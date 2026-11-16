import ts from 'typescript'
import { execFileSync } from 'node:child_process'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const files=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean))].sort()
const generated=p=>p.startsWith('.output/')||p==='src/routeTree.gen.ts'
const rows=[],flags=[]
let blocks=0,errors=0
const csv=value=>'"'+String(value).replaceAll('"','""')+'"'
for(const path of files) {
  if(path.startsWith('docs/AUDIT-')) continue
  if(generated(path)) {rows.push([path,'generated artifact','build / smoke coverage',0,'','']);continue}
  const buffer=await readFile(path),hash=createHash('sha256').update(buffer).digest('hex')
  if(!/\.(?:tsx?|[mc]?js|json|css|ya?ml|md|txt|html)$/.test(path)) {rows.push([path,'asset / other','inventory',0,'',hash]);continue}
  const source=buffer.toString('utf8'),locations=[]
  if(/\.(?:tsx?|[mc]?js)$/.test(path)) {
    const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,path.endsWith('tsx')?ts.ScriptKind.TSX:path.endsWith('ts')?ts.ScriptKind.TS:ts.ScriptKind.JS)
    for(const issue of ast.parseDiagnostics) {errors++;flags.push([path,ast.getLineAndCharacterOfPosition(issue.start??0).line+1,'syntax error',ts.flattenDiagnosticMessageText(issue.messageText,' ')])}
    const visit=node=>{
      if(ts.isBlock(node)||ts.isSourceFile(node)) {const start=ast.getLineAndCharacterOfPosition(node.getStart(ast)).line+1,end=ast.getLineAndCharacterOfPosition(node.end).line+1;locations.push(start+'-'+end);blocks++}
      if(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)) {
        const tag=node.tagName.getText(ast),attributes=node.attributes.properties
        const has=name=>attributes.some(a=>ts.isJsxAttribute(a)&&a.name.getText(ast)===name)
        const line=ast.getLineAndCharacterOfPosition(node.pos).line+1
        if(tag==='img'&&!has('alt')) flags.push([path,line,'image alt','Manual accessibility review'])
        if(tag==='a'&&attributes.some(a=>ts.isJsxAttribute(a)&&a.name.getText(ast)==='target'&&a.initializer?.getText(ast)==='"_blank"')&&!has('rel')) flags.push([path,line,'external link rel','Review target=_blank relation'])
        if(has('dangerouslySetInnerHTML')) flags.push([path,line,'HTML injection boundary','Review trusted JSON-LD / sanitization context'])
      }
      ts.forEachChild(node,visit)
    }
    visit(ast)
    rows.push([path,'source','AST block scan; typecheck/build; manual review per delivery notes',locations.length,locations.join(';'),hash])
  } else {
    if(path.endsWith('.json')) try{JSON.parse(source)}catch{errors++;flags.push([path,1,'JSON syntax','Invalid JSON'])}
    rows.push([path,'configuration / documentation','inventory; applicable build/runtime checks',0,'',hash])
  }
}
await mkdir('docs',{recursive:true})
await writeFile('docs/AUDIT-INVENTORY.csv',[['Path','Category','Coverage','Blocks','Block line ranges','SHA256'],...rows].map(r=>r.map(csv).join(',')).join('\n')+'\n')
await writeFile('docs/AUDIT-STATIC-FLAGS.csv',[['Path','Line','Check','Interpretation'],...flags].map(r=>r.map(csv).join(',')).join('\n')+'\n')
console.log(JSON.stringify({files:rows.length,sourceBlocks:blocks,syntaxErrors:errors,manualTriageFlags:flags.length}))
if(errors) process.exitCode=1
