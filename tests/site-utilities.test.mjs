import test from 'node:test'
import assert from 'node:assert/strict'
import { getSupportedVideoEmbedUrl } from '../src/lib/video.ts'
import { getBatchDateStatus, isValidBatchStartDate } from '../src/lib/batch-dates.ts'
import { createPageSeo } from '../src/lib/seo.ts'
import { evaluate } from '../src/lib/eligibility.ts'
test('video hosts reject lookalikes and credentials',()=>{
  for(const url of ['javascript:alert(1)','http://youtube.com/watch?v=dQw4w9WgXcQ','https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ','https://user:pass@youtube.com/watch?v=dQw4w9WgXcQ']) assert.equal(getSupportedVideoEmbedUrl(url),'')
  assert.ok(getSupportedVideoEmbedUrl('https://youtu.be/dQw4w9WgXcQ').startsWith('https://www.youtube-nocookie.com/embed/'))
  assert.ok(getSupportedVideoEmbedUrl('https://vimeo.com/12345678/abc123').includes('h=abc123'))
})
test('batch dates obey IST and reject impossible dates',()=>{
  assert.equal(isValidBatchStartDate('2026-02-30'),false)
  assert.equal(isValidBatchStartDate('2028-02-29'),true)
  assert.equal(getBatchDateStatus('2026-11-16',new Date('2026-11-16T19:00:00Z')),'expired')
  assert.equal(getBatchDateStatus('2026-11-17',new Date('2026-11-16T19:00:00Z')),'upcoming')
})
test('SEO canonical URLs and descriptions are normalized',()=>{
  const seo=createPageSeo({title:'Test',description:'Example   '.repeat(60),path:'/countries/canada/'})
  assert.equal(seo.links[0].href,'https://www.britisheducationandimmigration.com/countries/canada')
  assert.ok(seo.meta.find(m=>m.name==='description').content.length<=160)
})
test('eligibility scores respect required factors',()=>{
  const rules={factors:[{id:'language',label:'Language',goals:['study'],options:[{value:'yes',points:10},{value:'no',points:0}]}],bands:[{min:0,label:'Test'}],countries:[{name:'Test',minScore:{study:50},minFactor:{language:10}}]}
  assert.equal(evaluate(rules,'study',{language:'yes'}).score,100)
  assert.equal(evaluate(rules,'study',{language:'no'}).countries[0].matchesChecklist,false)
})
