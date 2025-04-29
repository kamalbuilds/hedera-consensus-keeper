import { Action } from '@elizaos/core';

interface ProposalInfo {
  id: string;
  title: string;
  description: string;
  options: string[];
  deadline: string;
  author: string;
  timestamp: string;
  status: string;
}

const viewProposalsAction: Action = {
  name: 'VIEW_PROPOSALS',
  description: 'View all active proposals on a specified HCS topic',
  examples: [
    'Show me all active proposals on topic 0.0.12345',
    'List the proposals currently running on topic 0.0.54321',
    'What proposals can I vote on in topic 0.0.98765?'
  ],
  execute: async ({ runtime, text }) => {
    try {
      // Extract topic ID from the message
      let topicId = '';
      
      // Use regex to extract topic ID (format: 0.0.XXXXX)
      const topicRegex = /\b0\.0\.\d+\b/g;
      const matches = text.match(topicRegex);
      
      if (matches && matches.length > 0) {
        topicId = matches[0];
      }
      
      if (!topicId) {
        // If no topic ID in the text, try asking the model
        const prompt = `
          Extract the Hedera Consensus Service topic ID from this message:
          "${text}"
          
          Respond with ONLY the topic ID in the format 0.0.XXXXX.
          If no topic ID is specified, respond with "NONE".
        `;
        
        const result = await runtime.useModel({
          prompt,
          temperature: 0.1,
          maxTokens: 10
        });
        
        const extractedId = result.text.trim();
        if (extractedId !== 'NONE' && /^0\.0\.\d+$/.test(extractedId)) {
          topicId = extractedId;
        }
      }
      
      if (!topicId) {
        return {
          name: 'VIEW_PROPOSALS',
          isHidden: false,
          isSuccess: false,
          value: "Unable to identify the topic ID. Please specify a topic ID in the format '0.0.XXXXX'."
        };
      }
      
      // Check if Hedera service is available
      const hederaService = runtime.getService('hedera');
      if (!hederaService) {
        return {
          name: 'VIEW_PROPOSALS',
          isHidden: false,
          isSuccess: false,
          value: "Hedera service is not available."
        };
      }
      
      // Get topic messages (all messages for now, we'll filter later)
      const messagesResult = await hederaService.getTopicMessages({
        topicId
      });
      
      if (!messagesResult || !messagesResult.messages || messagesResult.messages.length === 0) {
        return {
          name: 'VIEW_PROPOSALS',
          isHidden: false,
          isSuccess: true,
          value: `No messages found on topic ${topicId}.`
        };
      }
      
      // Extract proposals from the messages
      const proposals: ProposalInfo[] = [];
      const votesByProposal: Record<string, {choice: string, voter: string}[]> = {};
      
      for (const message of messagesResult.messages) {
        try {
          const parsedMessage = JSON.parse(message.body);
          
          if (parsedMessage.type === 'PROPOSAL' && parsedMessage.status === 'ACTIVE') {
            proposals.push({
              id: parsedMessage.id,
              title: parsedMessage.title,
              description: parsedMessage.description,
              options: parsedMessage.options,
              deadline: parsedMessage.deadline,
              author: parsedMessage.author,
              timestamp: parsedMessage.timestamp,
              status: parsedMessage.status
            });
          } else if (parsedMessage.type === 'VOTE') {
            const { proposalId, choice, voter } = parsedMessage;
            if (!votesByProposal[proposalId]) {
              votesByProposal[proposalId] = [];
            }
            votesByProposal[proposalId].push({ choice, voter });
          }
        } catch (error) {
          // Skip non-JSON messages
          continue;
        }
      }
      
      if (proposals.length === 0) {
        return {
          name: 'VIEW_PROPOSALS',
          isHidden: false,
          isSuccess: true,
          value: `No active proposals found on topic ${topicId}.`
        };
      }
      
      // Format the response
      let response = `Active proposals on topic ${topicId}:\n\n`;
      
      proposals.forEach((proposal, index) => {
        response += `PROPOSAL ${index + 1}: ${proposal.title}\n`;
        response += `ID: ${proposal.id}\n`;
        response += `Description: ${proposal.description}\n`;
        response += `Options: ${proposal.options.join(', ')}\n`;
        response += `Deadline: ${proposal.deadline}\n`;
        response += `Created by: ${proposal.author}\n`;
        response += `Created at: ${new Date(proposal.timestamp).toLocaleString()}\n`;
        
        // Add vote counts if there are any
        const votes = votesByProposal[proposal.id] || [];
        if (votes.length > 0) {
          const voteCounts: Record<string, number> = {};
          votes.forEach(vote => {
            voteCounts[vote.choice] = (voteCounts[vote.choice] || 0) + 1;
          });
          
          response += 'Current votes:\n';
          Object.entries(voteCounts).forEach(([option, count]) => {
            response += `  - ${option}: ${count}\n`;
          });
        } else {
          response += 'No votes yet\n';
        }
        
        response += '\n';
      });
      
      return {
        name: 'VIEW_PROPOSALS',
        isHidden: false,
        isSuccess: true,
        value: response
      };
    } catch (error) {
      console.error('Error viewing proposals:', error);
      return {
        name: 'VIEW_PROPOSALS',
        isHidden: false,
        isSuccess: false,
        value: `Failed to view proposals: ${error.message || 'Unknown error'}`
      };
    }
  }
};

export default viewProposalsAction; 