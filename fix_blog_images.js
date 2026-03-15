const fs = require('fs');
const path = require('path');

const publicDir = 'c:/Users/pc/Desktop/herbesV2/frontend/public/images';
const blogsDir = path.join(publicDir, 'blogs');

if (!fs.existsSync(blogsDir)) {
    fs.mkdirSync(blogsDir, { recursive: true });
}

const filesToCopy = [
    { src: 'natural_herbs.jpg', dest: 'natural_herbs.jpg' },
    { src: 'coriander.jpeg', dest: 'coriander.jpeg' },
    { src: 'slider/slide1.jpg', dest: 'slide1.jpg' },
    { src: 'slider/slide2.jpg', dest: 'slide2.jpg' },
];

filesToCopy.forEach(file => {
    const srcPath = path.join(publicDir, file.src);
    const destPath = path.join(blogsDir, file.dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file.src} to blogs/${file.dest}`);
    } else {
        console.log(`Source not found: ${srcPath}`);
    }
});

// Fix the Arabic filename if it exists
const allFiles = fs.readdirSync(publicDir);
const arabicFile = allFiles.find(f => f.includes('هل الكركم'));
if (arabicFile) {
    const srcPath = path.join(publicDir, arabicFile);
    const destPath = path.join(blogsDir, 'turmeric_article.jpeg');
    fs.copyFileSync(srcPath, destPath);
    console.log(`Fixed and copied Arabic file to blogs/turmeric_article.jpeg`);
}
