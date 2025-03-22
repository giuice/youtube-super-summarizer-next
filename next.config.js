/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    if (!dev && isServer) {
      config.output.webassemblyModuleFilename = "chunks/[id].wasm";
      config.plugins.push(new WasmChunksFixPlugin());
    }

    // if (!isServer) {
    //   config.resolve.fallback = {
    //     ...config.resolve.fallback,
    //     fs: false,
    //     net: false,
    //     tls: false,
    //     dns: false,
    //     child_process: false,
    //     path: false,
    //     os: false,
    //     crypto: false,
    //     pg: false,
    //     'pg-native': false,
    //     'pg-hstore': false,
    //   };
    // }

    return config;
  },
  
  reactStrictMode : false
}

class WasmChunksFixPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: "WasmChunksFixPlugin" },
        (assets) =>
          Object.entries(assets).forEach(([pathname, source]) => {
            if (!pathname.match(/\.wasm$/)) return;
            compilation.deleteAsset(pathname);

            const name = pathname.split("/")[1];
            const info = compilation.assetsInfo.get(pathname);
            compilation.emitAsset(name, source, info);
          })
      );
    });
  }
}

module.exports = nextConfig
