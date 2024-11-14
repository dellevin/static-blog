import fs from 'fs';
import path from 'path';
import { formatDateNoTime } from './utils.js'

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

// 读取并生成文件列表
function generateMarkdownList(dirPath) {
    const markdownList = [];

    function traverseDirectory(currentPath, tags = []) {
        const files = fs.readdirSync(currentPath);

        for (const file of files) {
            const fullPath = path.join(currentPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // 递归遍历子文件夹，保留层级信息
                traverseDirectory(fullPath, [...tags, { name: file, link: '#' }]);
            } else if (path.extname(file) === '.md') {
                // 解析 .md 文件
                const content = fs.readFileSync(fullPath, 'utf-8');
                const title = file.replace('.md', '');
                const words = content.split(/\s+/).length;
                const text = Math.ceil(words / 200) + '分钟'; // 每分钟阅读200字
                // const dateFormat = new Date(stat.birthtime).toISOString().split('T')[0];
                const dateFormat = formatDateNoTime(new Date(stat.birthtime));   // 创建时间
                const changeTime = formatDateNoTime(new Date(stat.mtime)); // 获取修改时间

                markdownList.push({
                    link: path.relative(dirPath, fullPath).replace(/\\/g, '/'),
                    title,
                    abstract: content, // 摘要取前100字符
                    // content,
                    dateFormat,
                    changeTime,
                    tags,
                    stats: {
                        words,
                        text,
                    },
                });
            }
        }
    }

    traverseDirectory(dirPath);
    // 根据日期排序：最新的在前
    // markdownList.sort((a, b) => new Date(b.dateFormat) - new Date(a.dateFormat));
    markdownList.sort((a, b) => {
        const dateA = new Date(a.dateFormat);
        const dateB = new Date(b.dateFormat);
        if (dateA.getTime() === dateB.getTime()) {
            // 如果创建时间相同，按修改时间排序
            return new Date(b.changeTime) - new Date(a.changeTime);
        }
        return dateB - dateA;
    });
    return markdownList;
}

function archiveMarkdownList(dirPath){

}


// 写入文件里面postInfo.json
export function markdownCountPlugin() {
    return {
        name: 'markdown-count-plugin',
        buildStart() {
            const noteDir = path.resolve(__dirname, '../../public/note');
            const markdownCount = countMarkdownFiles(noteDir);
            const markdownList = generateMarkdownList(noteDir);
            const outputPath = path.resolve(__dirname, 'postInfo.json');

            fs.writeFileSync(outputPath, JSON.stringify({ markdownCount,markdownList }, null, 2));
        },
    };
}
