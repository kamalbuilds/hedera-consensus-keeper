# Consensus Keeper Plugin for Eliza

A plugin that enables decentralized governance using Hedera Consensus Service (HCS). This plugin allows users to create and participate in governance processes through proposal creation and voting, with all activities recorded on the Hedera network.

## Features

- **Create governance topics** on Hedera Consensus Service
- **Submit proposals** with title, description, options, and deadlines
- **Cast votes** on proposals with comments
- **View active proposals** and current voting results
- **Track governance activities** with immutable audit trail

## Setup

1. Install the plugin:

```bash
pnpm add @elizaos/plugin-consensus-keeper
```

2. Add the plugin to your Eliza character configuration:

```json
{
  "name": "YourAgent",
  "plugins": ["@elizaos/plugin-hedera", "@elizaos/plugin-consensus-keeper"],
  "settings": {
    // Optional settings
    "hedera": {
      "topicCreationMemo": "Custom Topic Memo"
    }
  }
}
```

## Requirements

- Requires `@elizaos/plugin-hedera` to be installed and configured
- Hedera account credentials (private key and account ID) must be set up

## Available Actions

### CREATE_PROPOSAL

Creates a new proposal on a specified HCS topic.

**Required Parameters:**
- `title`: Title of the proposal
- `description`: Detailed description
- `options`: Available voting options
- `deadline`: Deadline for voting
- `topicId`: HCS topic ID

**Example:**
```
Create a proposal titled "Community Treasury Allocation" with options "Fund Project A", "Fund Project B", "Save for later" on topic 0.0.12345
```

### CAST_VOTE

Casts a vote on an existing proposal.

**Required Parameters:**
- `proposalId`: ID of the proposal being voted on
- `choice`: Selected option from the proposal
- `topicId`: HCS topic ID
- `comment`: Optional comment explaining the vote

**Example:**
```
Vote "Yes" on proposal prop_1234567890_abc123def on topic 0.0.12345
```

### VIEW_PROPOSALS

Shows all active proposals on a specified topic.

**Required Parameters:**
- `topicId`: HCS topic ID

**Example:**
```
Show me all active proposals on topic 0.0.12345
```

## Governance Provider

The plugin includes a governance provider that enriches the agent's state with information about governance topics and proposals, allowing for more contextual responses.

## Usage Example

1. Create a governance topic:
```
Create a topic with memo "Community Governance" and submit key
```

2. Create a proposal:
```
Create a proposal titled "Fund Development" with description "Should we allocate 500 HBAR to development?" and options "Yes", "No", "Reduce Amount" on topic 0.0.54321
```

3. Vote on a proposal:
```
Vote "Yes" on proposal prop_1234567890_abc123def on topic 0.0.54321
```

4. View proposals:
```
Show me all active proposals on topic 0.0.54321
```

## License

MIT 