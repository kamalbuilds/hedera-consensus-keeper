import { Action, IAgentRuntime } from '@elizaos/core';
import { extractCreateProposalData } from '../../templates';

interface CreateProposalParams {
  title: string;
  description: string;
  options: string[];
  deadline: string;
  topicId: string;
}

const createProposalAction: Action = {
  name: 'CREATE_PROPOSAL',
  description: 'Create a new governance proposal on a specified HCS topic',
  examples: [
    'Create a proposal titled "Community Treasury Allocation" with options "Fund Project A", "Fund Project B", "Save for later" on topic 0.0.12345',
    'Start a new governance proposal called "Protocol Upgrade" with description "Should we upgrade to v2.0?" and options "Yes", "No", "Delay" on topic 0.0.54321',
    'Create a proposal with title "Add New Feature" with options "Approve", "Reject" and deadline of next Friday on topic 0.0.98765'
  ],
  execute: async ({ runtime, text }) => {
    try {
      // Extract data from the message
      const data = await extractCreateProposalData(runtime, text);
      
      if (!data) {
        return {
          name: 'CREATE_PROPOSAL',
          isHidden: false,
          isSuccess: false,
          value: "Unable to extract proposal data from the request. Please make sure to include a title, description, options, and topic ID."
        };
      }
      
      const { title, description, options, deadline, topicId } = data;
      
      // Check if topic exists
      const hederaService = runtime.getService('hedera');
      if (!hederaService) {
        return {
          name: 'CREATE_PROPOSAL',
          isHidden: false,
          isSuccess: false,
          value: "Hedera service is not available."
        };
      }
      
      // Get the user's account ID
      const accountId = runtime.state.get('hedera.accountId') || 'unknown';
      
      // Format the proposal as JSON
      const proposalMsg = {
        type: 'PROPOSAL',
        id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        options,
        deadline,
        author: accountId,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE'
      };
      
      // Submit the proposal to the topic
      const result = await hederaService.submitTopicMessage({
        topicId,
        message: JSON.stringify(proposalMsg)
      });
      
      // Store the proposal in the governance provider if available
      try {
        const governanceProvider = runtime.getProvider('governanceProvider');
        if (governanceProvider) {
          governanceProvider.updateProposal(proposalMsg.id, proposalMsg);
          governanceProvider.addGovernanceTopic(topicId);
        }
      } catch (error) {
        console.error('Failed to update governance provider:', error);
      }
      
      return {
        name: 'CREATE_PROPOSAL',
        isHidden: false,
        isSuccess: true,
        value: `Successfully created proposal "${title}" with ID ${proposalMsg.id} on topic ${topicId}.\n\nTransaction link: ${result.transactionLink || 'unavailable'}`
      };
    } catch (error) {
      console.error('Error creating proposal:', error);
      return {
        name: 'CREATE_PROPOSAL',
        isHidden: false,
        isSuccess: false,
        value: `Failed to create proposal: ${error.message || 'Unknown error'}`
      };
    }
  }
};

export default createProposalAction; 