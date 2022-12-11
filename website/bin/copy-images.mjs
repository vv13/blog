import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";

const fsPromises = fs.promises;
const targetDir = path.join(path.resolve(process.cwd()), "./public/images");
const postsDir = path.join(path.resolve(process.cwd()), "../md");
const allowedImageFileExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"];

export function getMarkdownList(targetPath, result) {
  const resultsDir = fs.readdirSync(targetPath);
  resultsDir.forEach((resultName) => {
    const resultPath = path.join(targetPath, resultName);
    const stats = fs.statSync(resultPath);
    if (stats.isDirectory()) {
      getMarkdownList(resultPath, result);
      return;
    }
    if (allowedImageFileExtensions.includes(path.extname(resultPath))) {
      const relaPath = resultPath.slice(postsDir.length, resultPath.length);
      const targetPath = path.join(targetDir, relaPath);
      fsExtra.mkdirpSync(path.dirname(targetPath));
      fs.copyFileSync(resultPath, path.join(targetDir, relaPath));
    }
  });
  return result;
}

await fsExtra.emptyDir(targetDir);
await getMarkdownList(postsDir);
