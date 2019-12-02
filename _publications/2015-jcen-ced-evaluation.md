---
title: "Security Analysis of Concurrent Error Detection against Differential Fault Analysis"
collection: publications
permalink: /publication/2015-jcen-ced-evaluation
excerpt: 'This paper evaluates various concurrent error detection schemes by two proposed metrics: fault entropy and fault differential entropy.' 
date: 15-05-01
venue: 'Journal of Cryptographic Engineering (JCEN)'
citation: 'Z. Yang, C. Jin, Y. Tian, J. Lai, J. Zhou. (2020).&quot;
Security Analysis of Concurrent Error Detection against Differential Fault Analysis
&quot; <i>
Journal of Cryptographic Engineering (JCEN)
</i>. '
---

<b>Abstract:</b> Differential fault analysis (DFA) poses a significant threat to advanced encryption standard (AES). Only a single faulty ciphertext is required to extract the secret key. Concurrent error detection (CED) is widely used to protect AES against DFA. Traditionally, these CEDs are evaluated
with uniformly distributed faults, the resulting fault coverage indicates the security of CEDs against DFA. However, DFA-exploitable faults, which are a small subspace of the entire fault space, are not uniformly distributed. Therefore, fault coverage does not accurately measure the security of the
CEDs against DFA. We provide a systematic study of DFA of AES and show that an attacker can inject biased faults to improve the success rate of the attacks. We propose fault entropy (FE) and fault differential entropy (FDE) to evaluate CEDs. We show that most CEDs with high fault coverage are not secure when evaluated with FE and FDE. This work challenges the traditional use of fault coverage for uniformly distributed faults as a metric for evaluating the security of CEDs against DFA.

[Download paper here](http://link.springer.com/article/10.1007/s13389-014-0092-8)