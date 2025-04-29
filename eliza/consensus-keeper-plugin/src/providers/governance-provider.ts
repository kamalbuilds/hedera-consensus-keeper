import { Provider, State } from '@elizaos/core';
import { HederaProvider } from '@elizaos/plugin-hedera';

/**
 * GovernanceProvider enriches the agent's state with information about
 * governance topics and proposals
 */
export class GovernanceProvider extends Provider {
  private hederaProvider: HederaProvider | null = null;
  private governanceTopics: string[] = [];
  private activeProposals: Map<string, any> = new Map();

  constructor() {
    super('governanceProvider');
  }

  /**
   * Initialize the provider
   */
  async init(): Promise<void> {
    // This will be called when the provider is initialized
  }

  /**
   * Set Hedera provider reference
   */
  setHederaProvider(provider: HederaProvider): void {
    this.hederaProvider = provider;
  }

  /**
   * Add a governance topic to track
   */
  addGovernanceTopic(topicId: string): void {
    if (!this.governanceTopics.includes(topicId)) {
      this.governanceTopics.push(topicId);
    }
  }

  /**
   * Remove a governance topic
   */
  removeGovernanceTopic(topicId: string): void {
    this.governanceTopics = this.governanceTopics.filter(id => id !== topicId);
  }

  /**
   * Add or update an active proposal
   */
  updateProposal(proposalId: string, proposal: any): void {
    this.activeProposals.set(proposalId, proposal);
  }

  /**
   * Remove a proposal (mark as completed)
   */
  completeProposal(proposalId: string): void {
    this.activeProposals.delete(proposalId);
  }

  /**
   * Get a list of active proposals
   */
  getActiveProposals(): any[] {
    return Array.from(this.activeProposals.values());
  }

  /**
   * Enrich the state with governance information
   */
  async get(state: State): Promise<State> {
    if (!state.data) {
      state.data = {};
    }

    // Add governance info to state
    state.data.governance = {
      topics: this.governanceTopics,
      activeProposals: this.getActiveProposals(),
      proposalCount: this.activeProposals.size,
    };

    return state;
  }
}

export default GovernanceProvider; 