# How a Blockchain Works — interactive walkthrough

An interactive single-page site for **Blockchains: An Introduction** (Lectures 1–4).
It follows one **Bitcoin** transaction from key generation to a confirmed block.
Small **⟠ Ethereum differs** callouts appear only where the lectures draw that contrast.

## Run it locally

The site is plain static files, but it uses ES modules and `fetch`, so it must be
**served over HTTP** — do not open `index.html` from `file://`.

```sh
python3 -m http.server 8000 -d docs
# then open http://localhost:8000/
```

Any static file server works (`npx serve docs`, VS Code Live Server, etc.).

## Self-tests

Open `http://localhost:8000/tests.html`. It checks the hashing test vectors,
Base58Check + EIP-55 addresses, secp256k1 sign/verify and low-s/high-s malleability,
Merkle proofs (including the odd-row rule), and the proof-of-work search. All rows
should be green.

## Build status — complete

All 11 walkthrough steps are built. Every step shows a **cast bar**
(Alice / Bob / Miner M / Honest nodes / Node E — click a badge for that party's role, powers,
and view of the chain), a **before → after on-chain status** panel, and an **⟠ Ethereum differs**
note.

| Step | What it does |
|---|---|
| 1 Hash function | live SHA-256 / SHA-256d / HASH160 / Keccak; avalanche (bit-diff count); property cards |
| 2 Keys & addresses | keypair → pubkey → HASH160 → Base58Check pipeline; ⟠ EIP-55 Ethereum address; BIP32/39 note |
| 3 Build a transaction | edit pay/fee, live `fee = Σin − Σout`, the three per-input checks |
| 4 Script | a real stack-machine interpreter: P2PKH / hash-lock / 2-of-3 multisig / CLTV, step-through trace |
| 5 Sign | sighash → ECDSA sign → verify; tamper turns it red; low-s → high-s malleability + SegWit |
| 6 Merkle tree | animated tree over the block's txids; click a tx for its proof (SPV); odd-row / CVE-2012-2459 |
| 7 Assemble the block | the 6 header fields, prev-hash + Merkle root wired from the chain and Step 6 |
| 8 Mine it | difficulty slider; nonce search in a **Web Worker**; hashes/sec; expected vs actual; applies the block to the shared ledger |
| 9 Chain & tamper | edit a buried transaction → Merkle root → hash → next block's back-pointer cascade red; re-mine cost |
| 10 Forks & longest chain | β / k sliders; animated honest-vs-private-chain race; Monte-Carlo vs the `(β/1−β)^k` bound |
| 11 Ethereum | account-vs-UTXO toggle; a gas meter (out-of-gas → revert); animated reentrancy attack + the fix; the DAO |

`js/lib/` holds the engine — `tx.js`, `merkle.js`, `script.js`, `chain.js`, `pow.js` — using
real SHA-256 / RIPEMD-160 / Keccak-256 / ECDSA. Byte-level serialization is teaching-simplified
and labelled as such in each file. `js/workers/miner.js` is the ES-module mining worker.

## Project layout

```
docs/
  index.html            page shell: header, view tabs, step rail, footer
  css/styles.css         design tokens (light/dark), components
  js/
    main.js              bootstrap + hash router (#/spine/N)
    state.js             the shared scenario object + pub/sub
    ui.js                DOM helpers
    actors.js            the named cast (roles, powers, colours)
    components.js         castBar() + ledgerBeforeAfter(), shared by every step
    steps/01..11-*.js    one module per walkthrough step
    lib/
      hash.js             SHA-256 / RIPEMD-160 / Keccak-256 wrappers, hex helpers
      base58check.js       Base58 + Base58Check (written here, not vendored)
      bitcoin.js           P2PKH address, Ethereum address (EIP-55)
      crypto.js            secp256k1 sign / verify / malleate
      tx.js                transaction model, sighash, txid vs legacy txid
      merkle.js            Merkle tree + proof (dup-last-odd rule)
      script.js            small Bitcoin Script interpreter
      chain.js             block-header model + seeded chain
      pow.js               toy PoW target, mineSync fallback
      noble-hashes/        vendored @noble/hashes (MIT) — ESM, no build step
      noble-secp256k1/     vendored @noble/secp256k1 (MIT)
  workers/miner.js       ES-module proof-of-work worker
  data/
    hash-rate.json         real Bitcoin network hash rate (from lecture3/figs)
    utxo-count.json         Bitcoin UTXO-set size over time (from lecture2/figs)
    sample-chain.json       a serialized chain (from Practicals/Lab_1)
  tests.html               framework-free self-tests
```

## Deploying to GitHub Pages (later)

Nothing here needs a build step or a server. When a deploy target is chosen:
**Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/docs`**.
The `.nojekyll` file is already in place so the assets are served as-is.

## Vendored libraries

`js/lib/noble-hashes/` and `js/lib/noble-secp256k1/` are unmodified ESM builds of
[@noble/hashes](https://github.com/paulmillr/noble-hashes) 1.5.0 and
[@noble/secp256k1](https://github.com/paulmillr/noble-secp256k1) 2.1.0 (both MIT;
license files included). The only change is one line in `noble-hashes/utils.js`
rewriting a bare import specifier (`@noble/hashes/crypto`) to a relative path so it
loads without an import map.
