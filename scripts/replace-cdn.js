/**
 * CDN服务商切换，会存在修改CDN前缀场景
 * 如下：七牛云切换至aliyun
 */

const fs = require("fs")
const path = require("path")
const { exec } = require("child_process");
const { cwd } = require("process");

const oldCdnURLPrefix = 'http://cdn-blog.usword.cn';
const newCdnURLPrefix = 'https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com'

// 待替换的目标文件夹?
const replaceDirs = [
  'README.md',
  'docs/index.md',
  'docs/article',
  'docs/frontend',
  'docs/fullstack',
  'docs/me',
  'docs/super-nav',
  'docs/.vitepress/theme',
  'docs/.vitepress/head.js',
  'docs/.vitepress/config.js',
]

async function handleReplaceURL(currentPath) {
  const filePath = path.resolve(__dirname, currentPath);
  if (!filePath || /\.DS_Store/i.test(filePath)) return;
  const stat = await fs.statSync(filePath);
  if (stat.isFile()) {
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    if (!fileContent) return;
    fileContent = fileContent.replace(new RegExp(`${oldCdnURLPrefix}`, 'ig'), newCdnURLPrefix);
    try {
      await fs.writeFileSync(filePath, fileContent);
      console.log('CDN修改成功==========>', filePath)
    } catch (err) {
      console.log('CDN写入错误==========>', filePath, err)
    }
  } else {
    const childDirs = await fs.readdirSync(filePath);
    if (!childDirs?.length) return;
    childDirs.forEach(async childPath => await handleReplaceURL(currentPath + '/' + childPath))
  }
}

async function bootstrap() {
  replaceDirs?.forEach(async p => {
    await handleReplaceURL(cwd() + '/' + p);
  })
}

bootstrap();
