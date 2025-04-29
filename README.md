# Hedera Consensus Keeper: Decentralized Governance with Eliza

This documentation explains how to use the HederaConsensusKeeper agent to facilitate decentralized governance processes using Hedera Consensus Service (HCS).

## Overview

HederaConsensusKeeper is an AI agent that helps users manage and participate in governance processes on the Hedera network. It leverages HCS to create immutable records of proposals, votes, and decisions, providing transparency and auditability for collaborative decision-making.

## Key Components

1. **Hedera ElizaOS Plugin**: Provides core Hedera network capabilities
2. **Consensus Keeper Plugin**: Adds specialized governance functionality 
3. **HederaConsensusKeeper Character**: The AI agent that interacts with users


## Demo Video

## Prerequisites

Before using HederaConsensusKeeper, you need:

1. A Hedera account (testnet or mainnet)
2. API key for a supported language model (Anthropic, OpenAI, etc.)
3. Eliza installed and configured

## Setup

1. Configure your `.env` file with Hedera credentials:

```
HEDERA_PRIVATE_KEY=your_private_key
HEDERA_ACCOUNT_ID=your_account_id
HEDERA_NETWORK_TYPE=testnet
ANTHROPIC_KEY=your_anthropic_key
```

2. Start Eliza with the HederaConsensusKeeper character:

```bash
pnpm start --character=characters/consensus-keeper.character.json
```

3. Open the Eliza web interface and chat with HederaConsensusKeeper.

## Governance Workflow

### 1. Create a Governance Topic

First, create a topic on HCS that will serve as your governance channel:

```
Create a topic with memo "DAO Treasury Decisions" and submit key
```

This will create a new HCS topic and provide you with the topic ID needed for the next steps.

### 2. Submit a Proposal

Once you have a topic, you can submit a governance proposal:

```
Create a proposal titled "Fund Development Team" with description "Should we allocate 1000 HBAR to the development team for next quarter?" and options "Yes", "No", "Discuss Further" on topic 0.0.12345
```

Make sure to replace the topic ID (0.0.12345) with your actual topic ID.

### 3. Vote on a Proposal

After proposals are created, participants can vote on them:

```
Vote "Yes" on proposal prop_1234567890_abc123def on topic 0.0.12345 with comment "This is essential for our roadmap"
```

Remember to use the correct proposal ID and topic ID.

### 4. View Proposals and Results

To check the status of governance proposals:

```
Show me all active proposals on topic 0.0.12345
```

This will display all active proposals along with their current voting results.

## Example Use Cases

### Community Fund Allocation

1. Create a governance topic for fund allocation
2. Submit proposals for different funding requests
3. Community members vote on proposals
4. Execute transactions based on voting results

### Protocol Parameter Changes

1. Create a governance topic for protocol parameters
2. Submit proposals for parameter changes
3. Stakeholders vote on the proposals
4. Implement changes based on voting results

### DAO Membership Decisions

1. Create a governance topic for membership decisions
2. Submit proposals for new member applications
3. Existing members vote on applications
4. Grant membership based on voting results

## Benefits

- **Transparency**: All governance activities are recorded on the Hedera ledger
- **Immutability**: Proposals and votes cannot be altered once recorded
- **Accessibility**: Simple natural language interface for governance
- **Auditability**: All decisions can be verified and audited
- **Decentralization**: No central authority controls the process

## Troubleshooting

### Common Issues

1. **Topic ID not found**: Ensure you're using the correct topic ID
2. **Proposal creation fails**: Check that your topic ID exists and you have permission to submit to it
3. **Vote not recorded**: Verify that the proposal ID is correct and the proposal is still active

### Getting Help

For more assistance, you can ask the HederaConsensusKeeper agent for help:

```
How do I create a new proposal?
```

or

```
What information do I need to cast a vote?
```

## Advanced Features

### Setting Deadlines

You can set specific deadlines for proposals:

```
Create a proposal titled "Network Upgrade" with description "Should we upgrade to v2.0?" and options "Yes", "No", "Delay" with deadline "December 31, 2025" on topic 0.0.12345
```

### Proposal Analytics

You can view detailed analytics for a specific proposal:

```
Show me voting analytics for proposal prop_1234567890_abc123def on topic 0.0.12345
```

## Conclusion

HederaConsensusKeeper simplifies the process of decentralized governance by providing a natural language interface to Hedera Consensus Service. By recording proposals and votes on the Hedera ledger, it ensures transparency and trust in collaborative decision-making processes. 