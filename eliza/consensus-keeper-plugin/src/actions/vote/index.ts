import { Action } from '@elizaos/core';
import { extractVoteData } from '../../templates';

const voteAction: Action = {
  name: 'CAST_VOTE',
  description: 'Cast a vote on an existing governance proposal',
  examples: [
    'Vote "Yes" on proposal prop_1234567890_abc123def',
    'Cast my vote for "Fund Project B" on the Community Treasury Allocation proposal',
    'I want to vote "Reject" on proposal prop_9876543210_xyz987wvu with the comment "Needs more development"'
  ],
  execute: async ({ runtime, text }) => {
    try {
      // Extract vote data from the message
      const data = await extractVoteData(runtime, text);
      
      if (!data) {
        return {
          name: 'CAST_VOTE',
          isHidden: false,
          isSuccess: false,
          value: "Unable to extract voting data from the request. Please make sure to include the proposal ID, your choice, and the topic ID."
        };
      }
      
      const { proposalId, choice, comment, topicId } = data;
      
      // Check if Hedera service is available
      const hederaService = runtime.getService('hedera');
      if (!hederaService) {
        return {
          name: 'CAST_VOTE',
          isHidden: false,
          isSuccess: false,
          value: "Hedera service is not available."
        };
      }
      
      // Get the user's account ID
      const accountId = runtime.state.get('hedera.accountId') || 'unknown';
      
      // Format the vote as JSON
      const voteMsg = {
        type: 'VOTE',
        proposalId,
        choice,
        voter: accountId,
        comment: comment || '',
        timestamp: new Date().toISOString()
      };
      
      // Submit the vote to the topic
      const result = await hederaService.submitTopicMessage({
        topicId,
        message: JSON.stringify(voteMsg)
      });
      
      return {
        name: 'CAST_VOTE',
        isHidden: false,
        isSuccess: true,
        value: `Successfully cast vote "${choice}" for proposal ${proposalId}.\n\nTransaction link: ${result.transactionLink || 'unavailable'}`
      };
    } catch (error) {
      console.error('Error casting vote:', error);
      return {
        name: 'CAST_VOTE',
        isHidden: false,
        isSuccess: false,
        value: `Failed to cast vote: ${error.message || 'Unknown error'}`
      };
    }
  }
};

export default voteAction; 