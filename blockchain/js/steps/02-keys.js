import { el, clear, stepHead, ethCallout } from '../ui.js';
import { castBar, ledgerBeforeAfter } from '../components.js';
import { bytesToHex } from '../lib/hash.js';
import { p2pkhStages, ethAddress } from '../lib/bitcoin.js';
import { scenario, SAMPLE_SK_HEX, makeKeypair, setKeypair, useSampleKeypair, onChange } from '../state.js';

export default {
  id: 'keys', num: 2, lecture: 'L1 · L2',
  title: 'Keys & addresses',
  lede: 'A wallet is really just a key manager. One random private key gives you a public key; hashing that public key, then encoding the result with a checksum, gives you an address others can pay.',

  mount(container) {
    if (!scenario.keypair) useSampleKeypair();

    const root = el('div');
    container.append(
      stepHead(this.num, this.lecture, this.title),
      el('p', { class: 'step-lede' }, this.lede),
      root,
    );

    const unsub = onChange(render);
    render();
    return unsub;

    function render() {
      clear(root);
      const kp = scenario.keypair;
      const stages = p2pkhStages(kp.pk);

      root.append(
        castBar(['alice'], { caption: 'Alice is creating her identity. Bob (the payee) does the same and gives Alice his address. Nodes and miners are not involved — key generation is offline and free.' }),

        el('div', { class: 'controls' },
          el('button', { class: 'btn btn--primary btn--sm', onclick: () => setKeypair(makeKeypair()) }, 'Generate a random keypair'),
          el('button', { class: 'btn btn--sm', onclick: () => useSampleKeypair() }, 'Use the sample key'),
          el('span', { class: 'chip chip--neutral' }, kp.skHex === SAMPLE_SK_HEX ? 'sample key' : 'random key'),
        ),

        el('div', { class: 'panel' },
          el('div', { class: 'panel__title' }, 'From secret to address' ),
          el('div', { class: 'pipe' },
            pstage('Private key', '32 random bytes — keep secret', kp.skHex),
            op('secp256k1: multiply the base point'),
            pstage('Public key (compressed)', '33 bytes — share freely', bytesToHex(kp.pk)),
            op('SHA-256'),
            pstage('SHA-256(pubkey)', '32 bytes', bytesToHex(stages.sha)),
            op('RIPEMD-160'),
            pstage('Public-key hash (PKH)', '20 bytes — "who you are" on-chain', bytesToHex(stages.pkh)),
            op('Base58Check( 0x00 ‖ PKH ‖ checksum )', true),
            pstage('Address', 'give this to whoever pays you', kp.address, true),
          ),
        ),

        el('p', { class: 'stub', style: 'margin-top:10px' },
          'The first three arrows are ', el('strong', { text: 'one-way' }),
          ' — elliptic-curve multiplication and hashing are easy forwards, infeasible backwards. The last arrow is different: ',
          el('strong', { text: 'Base58Check is a reversible encoding' }),
          ', not a hash. Anyone can Base58-decode your address to recover exactly ',
          el('code', { text: '0x00 ‖ PKH ‖ checksum' }),
          '; the 4-byte checksum only catches typos. So your address already reveals your public-key ',
          el('em', { text: 'hash' }),
          ' to the world — what stays hidden until you first spend is the public ',
          el('em', { text: 'key' }), ' itself (the pubkey → PKH step).'),

        ethCallout(
          ' Same private key and same secp256k1 curve. But the address is the ',
          el('strong', { text: 'last 20 bytes of Keccak-256(public key)' }),
          ', written in hex with EIP-55 mixed-case as a checksum — no RIPEMD-160, no Base58, no version byte:',
          el('div', { class: 'hex', style: 'margin-top:6px' },
            el('span', { class: 'hex--label' }, 'Ethereum address for this key'),
            ethAddress(kp.pkFull)),
        ),

        ledgerBeforeAfter({
          before: 'Chain at height 5. It contains no reference to Alice or her keys.',
          after: 'Alice holds a keypair and an address others can pay. Still nothing on chain: an address is just an encoded hash of a public key — making one is free, offline, and invisible to the network until a transaction actually uses it.',
          note: 'This is why you can generate a fresh address per payment at no cost (Lecture 2, §8).',
        }),

        disclosure(),
      );
    }

    function disclosure() {
      return el('details', { class: 'disclose' },
        el('summary', {}, 'One seed, many keys — BIP39 / BIP32 (why you only back up 12–24 words)'),
        el('div', { class: 'disclose__body' },
          el('p', {},
            'Real wallets do not store a pile of unrelated secrets. They start from a single random seed, ',
            'shown to you as a 12–24 word phrase (BIP39). From that seed a whole tree of child keys is derived ',
            'deterministically (BIP32), so one phrase backs up every address you will ever use.'),
          el('p', { class: 'stub' },
            'Addresses derived this way look completely unrelated on-chain — until two of them are spent together ',
            'in one transaction, which is the main handle chain-analysis uses (Lecture 2, §8; Lecture 7).'),
        ));
    }
  },
};

function pstage(title, sub, value, isAddr) {
  return el('div', { class: 'pipe__stage' },
    el('h4', {}, title),
    el('div', { class: 'pipe__val', style: isAddr ? 'font-weight:700' : '' }, value),
    el('div', { class: 'stub', style: 'font-size:11px;margin-top:4px' }, sub));
}
function op(text, reversible) {
  return el('div', { class: 'pipe__op' + (reversible ? ' pipe__op--rev' : '') }, text);
}
