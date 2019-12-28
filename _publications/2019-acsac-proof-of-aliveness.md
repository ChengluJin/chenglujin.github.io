---
title: "Proof of Aliveness"
collection: publications
permalink: /publication/2019-acsac-proof-of-aliveness
excerpt: 'We introduce a new cryptographic notion called Proof of Aliveness. It allows a resource-constrained device to prove its aliveness to a remote verifier securely over an open network.' 
date: 2019-12-01
venue: 'Annual Computer Security Applications Conference (ACSAC)'
citation: 'C. Jin, Z. Yang, M. van Dijk, and J. Zhou. (2019). &quot;Proof of Aliveness&quot; <i>Annual Computer Security Applications Conference (ACSAC)</i>.'
---

<b>Abstract:</b> In 2017, malware Triton was discovered in a petrol plant in Saudi Arabia, and it shut down the safety instrumented systems in the affected industrial control system without being noticed by the operators. If the malware was not discovered by a security company on time, it could leave the system running without any safety measures, and eventually lead to an explosion. To detect such attacks, one can track the running status of the devices in the field to know that they are still “alive”. However, in practice, there yet does not exist an efficient and cryptographically secure mechanism/ protocol
that can prove the aliveness of a device to control centers over an open network. 

This paper aims to tackle this practical problem by introducing a new cryptographic notion called Proof of Aliveness (PoA). We propose to use a one-way function (OWF) chain structure to build an efficient proof of aliveness, such that the prover sends every node on the OWF chain in a reverse order periodically, and it can be verified by a verifier with the possession of the tail (last node) of the OWF chain. However, the practicality of this construction is limited by the finite number of nodes on an OWF chain. We enhance our first PoA construction by linking multiple OWF chains together using a pseudo-random generator chain. By integrating one-time signature schemes into the structure, we can achieve autoreplenishment of aliveness-proofs, which implies that this PoA can be used forever without an interruption for reinitialization.

To make our proposals more practical, we analyzed the security of the above PoA proposals in the standard model. Besides that, we also specifically defined a security model for the concept of PoA. Our PoA constructions are implemented and evaluated on Raspberry Pis for a demonstration of its performance.

[Download paper here](https://dl.acm.org/citation.cfm?id=3359827)

---

Bibtex:

```
@inproceedings{jin2019proof,
  title={Proof of aliveness},
  author={Jin, Chenglu and Yang, Zheng and van Dijk, Marten and Zhou, Jianying},
  booktitle={Proceedings of the 35th Annual Computer Security Applications Conference},
  pages={1--16},
  year={2019},
  organization={ACM}
}
```