const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);

let changedFilesCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace specific hardcoded values with variables
    content = content.replace(/bg-\[#0A0A0A\]/g, 'bg-background');
    content = content.replace(/bg-\[#111\]/g, 'bg-card');
    
    // Replace text-white except those that are meant to be strictly white 
    // Actually, text-white should usually map to text-foreground globally for the switch to work,
    // but buttons/primary accents often use text-black on primary, so text-white on other things usually mappings to foreground
    // Let's replace text-white with text-foreground, and text-white/XX with text-foreground/XX
    content = content.replace(/text-white(?!\/)/g, 'text-foreground');
    content = content.replace(/text-white\/([0-9]+)/g, 'text-foreground/$1');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFilesCount++;
        console.log('Updated:', file);
    }
});

console.log(`Updated ${changedFilesCount} files.`);
