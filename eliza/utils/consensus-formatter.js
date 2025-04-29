/**
 * Consensus message formatter for HederaConsensusKeeper
 * Provides functions to structure and format proposal and voting messages
 */

/**
 * Creates a formatted proposal message
 * @param {string} title - The title of the proposal
 * @param {string} description - Detailed description of the proposal
 * @param {Array<string>} options - Available voting options
 * @param {string} deadline - Deadline for voting (ISO date string)
 * @param {string} author - Account ID of the proposal creator
 * @returns {string} - JSON string representation of the proposal
 */
function formatProposal(title, description, options, deadline, author) {
  const proposal = {
    type: 'PROPOSAL',
    id: generateUniqueId(),
    title,
    description,
    options,
    deadline,
    author,
    timestamp: new Date().toISOString(),
    status: 'ACTIVE'
  };
  
  return JSON.stringify(proposal);
}

/**
 * Creates a formatted vote message
 * @param {string} proposalId - The ID of the proposal being voted on
 * @param {string} choice - The selected option from the proposal
 * @param {string} voter - Account ID of the voter
 * @param {string} comment - Optional comment explaining the vote
 * @returns {string} - JSON string representation of the vote
 */
function formatVote(proposalId, choice, voter, comment = '') {
  const vote = {
    type: 'VOTE',
    proposalId,
    choice,
    voter,
    comment,
    timestamp: new Date().toISOString()
  };
  
  return JSON.stringify(vote);
}

/**
 * Creates a formatted proposal results message
 * @param {string} proposalId - The ID of the proposal
 * @param {Object} results - Object containing vote counts for each option
 * @param {string} finalDecision - The winning option or final outcome
 * @returns {string} - JSON string representation of the proposal results
 */
function formatResults(proposalId, results, finalDecision) {
  const proposalResults = {
    type: 'RESULTS',
    proposalId,
    results,
    finalDecision,
    timestamp: new Date().toISOString(),
    status: 'COMPLETED'
  };
  
  return JSON.stringify(proposalResults);
}

/**
 * Creates a comment message for a proposal
 * @param {string} proposalId - The ID of the proposal
 * @param {string} comment - The comment text
 * @param {string} author - Account ID of the commenter
 * @returns {string} - JSON string representation of the comment
 */
function formatComment(proposalId, comment, author) {
  const commentObj = {
    type: 'COMMENT',
    proposalId,
    comment,
    author,
    timestamp: new Date().toISOString()
  };
  
  return JSON.stringify(commentObj);
}

/**
 * Generates a unique ID for proposals
 * @returns {string} - A unique ID
 */
function generateUniqueId() {
  return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  formatProposal,
  formatVote,
  formatResults,
  formatComment,
  generateUniqueId
}; 