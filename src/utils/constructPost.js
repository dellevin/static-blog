import fs from 'fs';
import path from 'path';
// 统计md文件数量
function countMarkdownFiles(dirPath) {
    let count = 0;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            count += countMarkdownFiles(fullPath); // 递归
        } else if (path.extname(fullPath) === '.md') {
            count++;
        }
    }
    return count;
}
// 写入到统计文件里面postInfo.json
export function markdownCountPlugin() {
    return {
        name: 'markdown-count-plugin',
        buildStart() {
            const markdownCount = countMarkdownFiles(path.resolve(__dirname, '../../public/note'));
            const outputPath = path.resolve(__dirname, 'postInfo.json');
            fs.writeFileSync(outputPath, JSON.stringify({ markdownCount }, null, 2));
        },
    };
}
