"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const bash = (0, child_process_1.spawn)('bash', []);
bash.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});
bash.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});
bash.stdin.write('cd /Users/jianzhi.wang/Desktop/square_studio/npm_library/Glitter/src/app-project/ios\n');
bash.stdin.write('fastlane init\n');
//# sourceMappingURL=test-fastlane.js.map