import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 生成按字母分组的侧边栏配置
 * 用于优化包含 8000+ 单词的导航体验
 * 
 * 注意：文件名中的点已被替换为连字符（如 a-m-.mdx），
 * 但显示名称从 frontmatter 的 title 字段读取（如 "a.m."）
 */

const wordsDir = path.resolve(__dirname, './src/content/docs/words');

/**
 * 读取所有单词文件并按首字母分组
 */
function generateSidebarConfig(verbose = false) {
  if (!fs.existsSync(wordsDir)) {
    if (verbose) console.error(`错误：找不到目录 ${wordsDir}`);
    return [];
  }

  // 读取所有 .mdx 文件
  const files = fs.readdirSync(wordsDir)
    .filter(file => file.endsWith('.mdx'))
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

  if (verbose) console.log(`找到 ${files.length} 个单词文件`);

  // 按首字母分组
  const groupedWords = {};
  
  for (const file of files) {
    const fileName = file.replace('.mdx', '');
    const filePath = path.join(wordsDir, file);
    
    // 读取文件的 frontmatter 以获取 title
    let displayName = fileName; // 默认使用文件名
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      if (data.title) {
        displayName = data.title;
      }
    } catch (error) {
      if (verbose) console.warn(`警告：无法读取文件 ${file} 的 frontmatter，使用文件名作为显示名称`);
    }
    
    // 获取第一个字符并转为大写（基于显示名称而非文件名）
    const firstChar = displayName.charAt(0).toUpperCase();
    
    // 只处理 A-Z 的字母
    if (/^[A-Z]$/.test(firstChar)) {
      if (!groupedWords[firstChar]) {
        groupedWords[firstChar] = [];
      }
      groupedWords[firstChar].push({ fileName, displayName });
    } else {
      // 非字母开头的放到特殊分组
      if (!groupedWords['#']) {
        groupedWords['#'] = [];
      }
      groupedWords['#'].push({ fileName, displayName });
    }
  }

  // 生成侧边栏配置
  const sidebarConfig = [];
  
  // 按字母顺序生成配置
  const letters = Object.keys(groupedWords).sort();
  
  for (const letter of letters) {
    const words = groupedWords[letter];
    const label = letter === '#' ? '符号/数字' : letter;
    
    sidebarConfig.push({
      label: `${label} (${words.length})`,
      collapsed: true,
      items: words.map(word => ({
        label: word.displayName,        // 使用 frontmatter 中的 title 作为显示名称
        link: `/words/${word.fileName}/` // 使用文件名生成 URL
      }))
    });
  }

  if (verbose) {
    console.log(`生成了 ${sidebarConfig.length} 个字母分组`);
    
    // 打印每个分组的统计信息
    sidebarConfig.forEach(group => {
      console.log(`  ${group.label}: ${group.items.length} 个单词`);
    });
  }

  return sidebarConfig;
}

// 生成配置并导出
// 当作为模块导入时，不输出日志；当直接运行时，输出详细日志
const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
const sidebarConfig = generateSidebarConfig(isDirectRun);

export default sidebarConfig;

