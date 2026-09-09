// The named cast of the walkthrough. Colours match the CSS --who-* tokens and
// are reused for arrows, block authorship and fork branches in later steps.

export const ACTORS = {
  alice: {
    badge: 'A',
    name: 'Alice',
    role: 'payer',
    kind: 'user',
    color: 'var(--who-payer)',
    can: 'Holds a private key. Chooses which of her unspent outputs to spend, builds a transaction that pays Bob, signs it, and broadcasts it to the network.',
    sees: 'Her wallet tracks the outputs her keys can spend, and watches new blocks for her transaction to gain confirmations.',
  },
  bob: {
    badge: 'B',
    name: 'Bob',
    role: 'payee',
    kind: 'user',
    color: 'var(--who-payee)',
    can: 'Publishes an address. Waits for a transaction that pays it — and, before handing over goods, waits for it to be buried under enough blocks.',
    sees: 'Runs or trusts a node that scans each new block for outputs locked to his address.',
  },
  minerM: {
    badge: 'M',
    name: 'Miner M',
    role: 'block producer this round',
    kind: 'node',
    color: 'var(--who-miner)',
    can: 'Collects transactions from its mempool, orders them, builds a candidate block, and spends energy searching for a valid proof of work. If it finds one first, it broadcasts the block and collects the block reward plus the fees.',
    sees: 'Its own mempool and its current chain tip; it always tries to extend the heaviest valid chain it knows.',
  },
  honest: {
    badge: 'N',
    name: 'Honest nodes',
    role: 'validate & relay — did not win the PoW race',
    kind: 'node',
    color: 'var(--who-node)',
    can: 'Independently check every transaction and every block against the rules, gossip the valid ones onward, and keep their own copy of the UTXO set and the chain. They lost this round’s race but still enforce the rules: a block only counts once they accept it, and they always follow the heaviest valid chain.',
    sees: 'Their own validated copy of the chain. They reject anything that breaks a rule, no matter who sent it.',
  },
  evil: {
    badge: 'E',
    name: 'Node E',
    role: 'equivocator / double-spender',
    kind: 'node',
    color: 'var(--who-evil)',
    can: 'Shows different things to different peers: e.g. sends “pay Bob” to Bob’s side of the network and a conflicting “pay myself” (same input) to the miners — or mines a block in secret to undo a payment later. Its reach is limited by its share β of the total hash power.',
    sees: 'Everything the honest nodes see, plus its own hidden transactions or private chain.',
  },
};

export const ACTOR_ORDER = ['alice', 'bob', 'minerM', 'honest', 'evil'];
