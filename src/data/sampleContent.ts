export interface ContentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export const sampleGuides: ContentItem[] = [
  {
    id: 'monad-guide',
    title: "Building on Monad: Complete Developer Guide",
    description: "Everything you need to know to start building decentralized applications on the Monad blockchain.",
    date: "Jan 15, 2025",
    readTime: "12 min read",
    category: "Development",
    content: `# Building on Monad: Complete Developer Guide

Welcome to the comprehensive guide for developing on the Monad blockchain. This guide will walk you through everything you need to know to build powerful decentralized applications.

## What is Monad?

Monad is a high-performance, EVM-compatible blockchain that brings unprecedented speed and efficiency to decentralized applications. With its innovative architecture, Monad can process thousands of transactions per second while maintaining full Ethereum compatibility.

## Getting Started

### Prerequisites
- Basic knowledge of Solidity
- Node.js installed on your machine
- MetaMask or similar Web3 wallet

### Setting Up Your Development Environment

First, let's set up your development environment for Monad:

\`\`\`bash
npm install -g @monad/cli
monad init my-dapp
cd my-dapp
npm install
\`\`\`

### Your First Smart Contract

Here's a simple smart contract to get you started:

\`\`\`solidity
pragma solidity ^0.8.0;

contract MonadExample {
    string public message;
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function updateMessage(string memory _newMessage) public {
        message = _newMessage;
    }
}
\`\`\`

## Advanced Features

Monad offers several advanced features that set it apart from other blockchains:

1. **Parallel Processing**: Execute transactions in parallel for maximum throughput
2. **State Compression**: Efficient storage mechanisms to reduce costs
3. **Developer Tools**: Comprehensive tooling for debugging and optimization

## Best Practices

- Always test on testnet first
- Use gas optimization techniques
- Implement proper error handling
- Follow security best practices

## Conclusion

Building on Monad opens up new possibilities for high-performance dApps. Start experimenting with these concepts and join the growing Monad developer community.

Happy building! 🚀`
  }
];