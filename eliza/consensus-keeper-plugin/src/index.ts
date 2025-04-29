import { Plugin } from '@elizaos/core';
import GovernanceProvider from './providers/governance-provider';
import createProposalAction from './actions/create-proposal';
import voteAction from './actions/vote';
import viewProposalsAction from './actions/view-proposals';

/**
 * ConsensusKeeperPlugin provides functionality for decentralized governance
 * using Hedera Consensus Service (HCS)
 */
const ConsensusKeeperPlugin: Plugin = {
  name: 'consensus-keeper',
  description: 'A plugin for decentralized governance using Hedera Consensus Service',
  
  init: async (config, runtime) => {
    console.log('Initializing consensus-keeper plugin');
    
    // Try to get the Hedera provider and set it in our governance provider
    try {
      const governanceProvider = runtime.getProvider('governanceProvider');
      const hederaProvider = runtime.getProvider('hederaProvider');
      
      if (governanceProvider && hederaProvider) {
        (governanceProvider as any).setHederaProvider(hederaProvider);
      }
    } catch (err) {
      console.error('Error setting up governance provider:', err);
    }
  },
  
  // Register providers
  providers: [
    new GovernanceProvider()
  ],
  
  // Register actions
  actions: [
    createProposalAction,
    voteAction,
    viewProposalsAction
  ]
};

export default ConsensusKeeperPlugin; 