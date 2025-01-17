import { DeploymentConfig } from "../types/database";

export const deploymentConfig: DeploymentConfig = {
    static: {
      patterns: [
        'public/**/*',
        '.next/static/**/*',
        'out/**/*'
      ],
      excludePatterns: [
        '**/articles/**',
        '**/authors/**',
        '**/uploads/**'
      ]
    },
    dynamic: {
      patterns: [
        'articles/**/*',
        'authors/**/*',
        'uploads/**/*'
      ]
    }
  };