---
title: "Can Algorithm Diversity in Stream Cipher Implementation Thwart (Natural and) Malicious Faults?"
collection: publications
permalink: /publication/2016-tetc-stream
excerpt: 'This paper proposes a general countermeasure methodology to protect stream ciphers from fault injection attacks. It exploits the diversity in the algorithm of stream ciphers.' 
date: 2016-09-01
venue: 'IEEE Transactions on Emerging Topics in Computing (TETC)'
citation: 'X. Guo, C. Jin, C. Zhang, A. Papadimitriou, D. Hély, and R. Karri. (2016).&quot;
Can Algorithm Diversity in Stream Cipher Implementation Thwart (Natural and) Malicious Faults?
&quot; <i>
IEEE Transactions on Emerging Topics in Computing (TETC)
</i>. '
---

<b>Abstract:</b> Hardware implementations of stream and other ciphers are vulnerable to natural faults. Moreover, attackers can launch fault attacks on these implementations. Concurrent error detection is used as a countermeasure against natural and malicious faults. We propose an algorithm diversity (AD) to detect natural and malicious faults in stream ciphers. We compare AD with hardware, time, and information redundancies. Hardware redundancy has 100% hardware overhead, but is not secure against fault attacks. Time redundancy has lower hardware overhead, but is vulnerable to faults that are injected in both the computation and recomputation. Information redundancy techniques, such as parity, cannot detect an even number of faulty bits. Information redundancy techniques, such as robust code, have higher fault miss rate (FMR) with higher hardware overhead. If robust code is congured to have lower FMR than AD in certain attacker model, the hardware overhead is excessively high. AD provides higher security compared to existing techniques. It enables a cost-effective tradeoff between security, performance overhead, and hardware overhead.

[Download paper here](http://ieeexplore.ieee.org/document/7110553)