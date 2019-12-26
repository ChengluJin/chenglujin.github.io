---
title: "NREPO: Normal Basis Recomputing with Permuted Operands"
collection: publications
permalink: /publication/2014-host-nrepo
excerpt: '>This paper introduces a concurrent error detection mechanism (NREPO) for compact (8-bit datapath) implementations of AES against fault injections.  It achieves 25 to 50 times lower fault miss rate comparing with parity-based and robust code-based detection, while it incurs 34.9% hardware overhead.'
date: 2014-05-01
venue: 'IEEE International Symposium on Hardware-Oriented Security and Trust (HOST)'
citation: 'X. Guo, D. Mukhopadhyay, C. Jin, and R. Karri. (2014). &quot;NREPO: Normal Basis Recomputing with Permuted Operands&quot; <i>IEEE International Symposium on Hardware-Oriented Security and Trust (HOST)</i>. '
---

<b>Abstract:</b> Hardware implementations of cryptographic algorithms are vulnerable to natural and malicious faults. Concurrent Error Detection (CED) can be used to detect these faults. We present NREPO, a CED which does not require redundant computational resources in the design. Therefore, one can integrate it when computational resources are scarce or when the redundant resources are difficult to harness for CED. We integrate NREPO in a low-cost Advanced Encryption Standard (AES) implementation with 8-bit datapath. We show that NREPO has 25 and 50 times lower fault miss rate than robust code and parity, respectively. The area, throughput, and power are compared with other CEDs on 45nm ASIC. The hardware overhead of NREPO is 34.9%. The throughput and power are 271.6Mbps and 1579.3μW, respectively. One can also implement NREPO in other cryptographic algorithms.

[Download paper here](https://ieeexplore.ieee.org/document/6855581)

[Download bibtex here]()
