import resolve from "@rollup/plugin-node-resolve";
import native from 'rollup-plugin-native';

export default [
    {
        input: 'src/main.js',
        output: [
            {
                file: 'dist/main.js',
                format: 'cjs'
            }
        ]
    },
    {
        input: 'src/renderer.js',
        output: [
            {
                dir: 'public',
                format: 'cjs'
            }
        ],
        inlineDynamicImports: false,
        plugins: [
            resolve({
                browser: false,
            }),
            native({
                platformName: "${dirname}/../build/Release/copy_to_webgpu_arraybuffer.node"
            })
        ]
    }
]