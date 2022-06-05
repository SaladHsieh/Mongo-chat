require('esbuild')
  .build({
    entryPoints: ['src/server.ts'],
    // bundle: true,
    minify: true,
    // tsconfig: 'tsconfig.json',
    outfile: 'server.js',
    outdir: './app/lib/',
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
