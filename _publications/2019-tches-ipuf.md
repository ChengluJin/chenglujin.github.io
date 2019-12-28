---
title: "The Interpose PUF: Secure PUF Design against State-of-the-art Machine Learning Attacks"
collection: publications
permalink: /publication/2019-tches-ipuf
excerpt: '>We present interpose-PUF (iPUF), which can be secure against all known machine learning-based attacks, including logistic regression, deep learning, CMA-ES, reliability-based attacks, etc.' 
date: 2019-09-01
venue: 'IACR Transactions on Cryptographic Hardware and Embedded Systems (TCHES)'
citation: 'P. H. Nguyen, D. P. Sahoo, C. Jin, K. Mahmood, U. Rührmair, and M. van Dijk. (2019).&quot;The Interpose PUF: Secure PUF Design against State-of-the-art Machine Learning Attacks&quot; <i>IACR Transactions on Cryptographic Hardware and Embedded Systems (TCHES)</i>.'
---

<b>Abstract:</b> The design of a silicon Strong Physical Unclonable Function (PUF) that is lightweight and stable, and which possesses a rigorous security argument, has been a fundamental problem in PUF research since its very beginnings in 2002. Various effective PUF modeling attacks, for example at CCS 2010 and CHES 2015, have shown that currently, no existing silicon PUF design can meet these requirements. In this paper, we introduce the novel Interpose PUF (iPUF) design, and rigorously prove its security against all known machine learning (ML) attacks, including any currently known reliability-based strategies that exploit the stability of single CRPs (we are the first to provide a detailed analysis of when the reliability based CMA-ES attack is successful and when it is not applicable). Furthermore, we provide simulations and confirm these in experiments with FPGA implementations of the iPUF, demonstrating
its practicality. Our new iPUF architecture so solves the currently open problem of constructing practical, silicon Strong PUFs that are secure against state-of-the-art ML attacks.

[Download paper here](https://tches.iacr.org/index.php/TCHES/article/view/8351)

---

Bibtex:

```
@article{nguyen2019interpose,
  title={The interpose puf: Secure puf design against state-of-the-art machine learning attacks},
  author={Nguyen, Phuong Ha and Sahoo, Durga Prasad and Jin, Chenglu and Mahmood, Kaleel and R{\"u}hrmair, Ulrich and van Dijk, Marten},
  journal={IACR Transactions on Cryptographic Hardware and Embedded Systems},
  pages={243--290},
  year={2019}
}
```