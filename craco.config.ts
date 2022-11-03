import webpack from 'webpack'
import { CracoConfig } from '@craco/craco'

const config: CracoConfig = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          buffer: require.resolve("buffer/")
        }
      }
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
        })
      ]
    }
  }
}

export default config
