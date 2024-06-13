/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /node_modules[\\/]@?reactflow[\\/].*.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
            ],
          },
        },
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  