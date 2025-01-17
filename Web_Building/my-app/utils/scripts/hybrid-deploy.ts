import { HybridDeployment } from '../deploy/hybrid-orchestrator';

async function deploy() {
  const deployment = new HybridDeployment();
  
  try {
    await deployment.deploy();
    console.log('Hybrid deployment completed successfully');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();