import { IAgentRuntime } from '@elizaos/core';

/**
 * Extract data needed for creating a proposal
 * @param runtime Agent runtime
 * @param text User message
 * @returns Extracted data for proposal creation
 */
export async function extractCreateProposalData(
  runtime: IAgentRuntime,
  text: string
): Promise<{
  title: string;
  description: string;
  options: string[];
  deadline: string;
  topicId: string;
} | null> {
  try {
    // Use the language model to extract the required data
    const prompt = `
      Extract the following data for creating a proposal from this message:
      "${text}"
      
      Required fields:
      - title: The title of the proposal
      - description: A description of the proposal
      - options: The available voting options (comma-separated list)
      - deadline: When voting ends (e.g., date, time period)
      - topicId: The Hedera Consensus Service topic ID
      
      Respond with ONLY a JSON object with these fields.
      If any field is missing, make your best guess for title, description, and options.
      For deadline, default to "7 days from now" if not specified.
      If topicId is not specified, return null for the entire object.
    `;
    
    const result = await runtime.useModel({
      prompt,
      temperature: 0.1,
      maxTokens: 500
    });
    
    try {
      // Try to parse the JSON response
      const parsedData = JSON.parse(result.text.trim());
      
      // Validate that we have the required data
      if (!parsedData.topicId) {
        return null;
      }
      
      // Convert options to array if it's a string
      if (typeof parsedData.options === 'string') {
        parsedData.options = parsedData.options.split(',').map((option: string) => option.trim());
      }
      
      return {
        title: parsedData.title || 'Untitled Proposal',
        description: parsedData.description || 'No description provided',
        options: parsedData.options || ['Approve', 'Reject'],
        deadline: parsedData.deadline || '7 days from now',
        topicId: parsedData.topicId
      };
    } catch (error) {
      console.error('Failed to parse extracted data:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in extractCreateProposalData:', error);
    return null;
  }
}

/**
 * Extract data needed for voting on a proposal
 * @param runtime Agent runtime
 * @param text User message
 * @returns Extracted data for voting
 */
export async function extractVoteData(
  runtime: IAgentRuntime,
  text: string
): Promise<{
  proposalId: string;
  choice: string;
  comment?: string;
  topicId: string;
} | null> {
  try {
    // Use the language model to extract the required data
    const prompt = `
      Extract the following data for voting on a proposal from this message:
      "${text}"
      
      Required fields:
      - proposalId: The ID of the proposal being voted on
      - choice: The selected option/choice for the vote
      - comment: Any comment explaining the vote (optional)
      - topicId: The Hedera Consensus Service topic ID
      
      Respond with ONLY a JSON object with these fields.
      If proposalId or topicId is not specified, return null.
    `;
    
    const result = await runtime.useModel({
      prompt,
      temperature: 0.1,
      maxTokens: 500
    });
    
    try {
      // Try to parse the JSON response
      const parsedData = JSON.parse(result.text.trim());
      
      // Validate that we have the required data
      if (!parsedData.proposalId || !parsedData.choice || !parsedData.topicId) {
        return null;
      }
      
      return {
        proposalId: parsedData.proposalId,
        choice: parsedData.choice,
        comment: parsedData.comment || '',
        topicId: parsedData.topicId
      };
    } catch (error) {
      console.error('Failed to parse extracted vote data:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in extractVoteData:', error);
    return null;
  }
} 