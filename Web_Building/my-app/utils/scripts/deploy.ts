import { StorageManager } from '../storage/manager';
import { storageConfig } from '../storage/config';
import { DeploymentOrchestrator } from '../deploy/orchestrator';

async function deploy() {
  const storage = new StorageManager(storageConfig);
  const orchestrator = new DeploymentOrchestrator(storage);

  try {
    await orchestrator.deploy();
    console.log('Deployment completed successfully');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();